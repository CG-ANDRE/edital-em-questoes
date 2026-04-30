-- Story 3.1 — Tabela questions + question_revisions (FR21 histórico append-only)

-- Enums
do $$ begin
  if not exists (select 1 from pg_type where typname = 'question_dificuldade_enum') then
    create type question_dificuldade_enum as enum ('facil', 'medio', 'dificil');
  end if;
  if not exists (select 1 from pg_type where typname = 'question_status_enum') then
    create type question_status_enum as enum ('draft', 'published', 'archived', 'pending_review');
  end if;
  if not exists (select 1 from pg_type where typname = 'question_source_type_enum') then
    create type question_source_type_enum as enum ('manual', 'ai');
  end if;
end $$;

-- =========================================================================
-- Tabela questions
-- =========================================================================
create table public.questions (
  id              uuid primary key default gen_random_uuid(),
  enunciado       text not null check (char_length(enunciado) between 10 and 5000),
  alternativas    jsonb not null check (
    jsonb_typeof(alternativas) = 'array'
    and jsonb_array_length(alternativas) between 2 and 6
  ),
  correct_answer  text not null check (correct_answer ~ '^[A-F]$'),
  justificativa   text not null check (char_length(justificativa) >= 10),
  materia         text not null,
  banca           text,
  cargo_alvo      text,
  dificuldade     question_dificuldade_enum not null default 'medio',
  status          question_status_enum not null default 'draft',
  source_type     question_source_type_enum not null default 'manual',
  image_url       text,
  search_vector   tsvector,
  created_by      uuid references auth.users(id) on delete set null,
  updated_by      uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.questions is
  'Banco de questões. Append-only via status (nunca DELETE). FR14, FR17, FR21.';

create index idx_questions_status         on public.questions (status);
create index idx_questions_materia        on public.questions (materia);
create index idx_questions_banca          on public.questions (banca);
create index idx_questions_dificuldade    on public.questions (dificuldade);
create index idx_questions_created_by     on public.questions (created_by);
create index idx_questions_search_vector  on public.questions using gin (search_vector);

-- =========================================================================
-- Trigger search_vector
-- =========================================================================
create or replace function public.update_questions_search_vector()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('portuguese', coalesce(new.enunciado, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(new.materia, '')),  'B') ||
    setweight(to_tsvector('portuguese', coalesce(new.banca, '') || ' ' || coalesce(new.cargo_alvo, '')), 'C');
  return new;
end;
$$;

create trigger trg_questions_search_vector
  before insert or update of enunciado, materia, banca, cargo_alvo
  on public.questions
  for each row execute function public.update_questions_search_vector();

-- updated_at (handle_updated_at criada na Story 1.2)
create trigger trg_questions_updated_at
  before update on public.questions
  for each row execute function public.handle_updated_at();

-- =========================================================================
-- Tabela question_revisions (FR21 — append-only)
-- =========================================================================
create table public.question_revisions (
  id            uuid primary key default gen_random_uuid(),
  question_id   uuid not null references public.questions(id) on delete cascade,
  revised_by    uuid references auth.users(id) on delete set null,
  revised_at    timestamptz not null default now(),
  before_data   jsonb,
  after_data    jsonb not null,
  change_reason text,
  change_type   text not null check (change_type in ('create','edit','archive','unarchive','publish'))
);

comment on table public.question_revisions is
  'Histórico imutável de alterações de questões (FR21). Append-only.';

create index idx_question_revisions_question_id on public.question_revisions (question_id);
create index idx_question_revisions_revised_at  on public.question_revisions (revised_at desc);

-- =========================================================================
-- Trigger audit_questions_revisions
-- =========================================================================
create or replace function public.audit_questions_revisions()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_change_type text;
begin
  if (tg_op = 'INSERT') then
    v_change_type := 'create';
    insert into public.question_revisions (
      question_id, revised_by, before_data, after_data, change_type
    ) values (
      new.id, new.created_by, null, to_jsonb(new), v_change_type
    );

    -- Audit log universal
    insert into public.audit_log (actor_user_id, action, entity_table, entity_id, after_data)
      values (new.created_by, 'INSERT', 'questions', new.id, to_jsonb(new));

    return new;
  elsif (tg_op = 'UPDATE') then
    if (old.status = 'draft' and new.status = 'published') then
      v_change_type := 'publish';
    elsif (new.status = 'archived' and old.status <> 'archived') then
      v_change_type := 'archive';
    elsif (old.status = 'archived' and new.status <> 'archived') then
      v_change_type := 'unarchive';
    else
      v_change_type := 'edit';
    end if;

    insert into public.question_revisions (
      question_id, revised_by, before_data, after_data, change_type
    ) values (
      new.id, new.updated_by, to_jsonb(old), to_jsonb(new), v_change_type
    );

    insert into public.audit_log (actor_user_id, action, entity_table, entity_id, before_data, after_data)
      values (new.updated_by, 'UPDATE', 'questions', new.id, to_jsonb(old), to_jsonb(new));

    return new;
  end if;
  return null;
end;
$$;

create trigger trg_audit_questions_revisions
  after insert or update on public.questions
  for each row execute function public.audit_questions_revisions();

-- =========================================================================
-- RLS
-- =========================================================================
alter table public.questions enable row level security;
alter table public.question_revisions enable row level security;

-- questions policies
create policy questions_select_curator_full on public.questions
  for select to authenticated using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('founder','curator')
  );

-- Usuário comum vê questões published.
-- TODO: Story 3.2 vincular questões a editais e restringir por user_editais.
create policy questions_select_public_published on public.questions
  for select to authenticated using (status = 'published');

create policy questions_insert_curator on public.questions
  for insert to authenticated with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('founder','curator')
    and created_by = auth.uid()
  );

create policy questions_update_curator on public.questions
  for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('founder','curator'))
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('founder','curator')
    and updated_by = auth.uid()
  );
-- Sem DELETE — questões nunca são deletadas (FR21)

-- question_revisions policies
create policy question_revisions_select_curator on public.question_revisions
  for select to authenticated using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('founder','curator')
  );

create policy question_revisions_insert_trigger on public.question_revisions
  for insert to authenticated with check (true);
-- Sem UPDATE/DELETE — append-only
