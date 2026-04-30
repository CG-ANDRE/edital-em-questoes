-- Story 3.2 (enxuta) — Relação question_editais (questão ↔ edital)
-- Destrava a Story 4 (cronograma adaptativo): cada questão pertence a 1+ editais
-- e usuários só veem questões dos editais que estão estudando.

create table public.question_editais (
  question_id   uuid not null references public.questions(id) on delete cascade,
  edital_id     uuid not null references public.editais(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (question_id, edital_id)
);

comment on table public.question_editais is
  'Relação many-to-many entre questões e editais. Permite filtrar questões pelo edital ativo do usuário.';

create index idx_question_editais_edital_id on public.question_editais (edital_id);
-- (índice em question_id já é coberto pela PK composta)

-- =========================================================================
-- RLS
-- =========================================================================
alter table public.question_editais enable row level security;

-- Usuário comum: lê apenas vínculos de editais que ele estuda
create policy question_editais_select_own_editais on public.question_editais
  for select to authenticated using (
    exists (
      select 1 from public.user_editais ue
      where ue.edital_id = question_editais.edital_id
        and ue.user_id = auth.uid()
    )
    or (auth.jwt() -> 'app_metadata' ->> 'role') in ('founder','curator','operations')
  );

-- Founder/Curator: insert/delete (gestão do vínculo via painel admin)
create policy question_editais_insert_curator on public.question_editais
  for insert to authenticated with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('founder','curator')
  );

create policy question_editais_delete_curator on public.question_editais
  for delete to authenticated using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('founder','curator')
  );

-- =========================================================================
-- Atualizar policy de questions: usuário comum só vê questões published
-- vinculadas a editais que ele estuda
-- =========================================================================
drop policy if exists questions_select_public_published on public.questions;

create policy questions_select_public_published on public.questions
  for select to authenticated using (
    status = 'published'
    and exists (
      select 1
      from public.question_editais qe
      join public.user_editais ue on ue.edital_id = qe.edital_id
      where qe.question_id = questions.id
        and ue.user_id = auth.uid()
    )
  );
