-- Story 3.5 — Tabela question_reports (FR16)

do $$ begin
  if not exists (select 1 from pg_type where typname = 'question_report_reason_enum') then
    create type question_report_reason_enum as enum (
      'gabarito_incorreto', 'enunciado_ambiguo', 'outro'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'question_report_status_enum') then
    create type question_report_status_enum as enum (
      'open', 'reviewing', 'resolved', 'dismissed'
    );
  end if;
end $$;

create table public.question_reports (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references public.questions(id) on delete cascade,
  user_id      uuid not null references public.users(id) on delete cascade,
  reason       question_report_reason_enum not null,
  comment      text,
  status       question_report_status_enum not null default 'open',
  resolved_by  uuid references public.users(id) on delete set null,
  resolved_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint question_reports_resolved_consistency_chk check (
    (status in ('resolved','dismissed') and resolved_at is not null and resolved_by is not null)
    or (status in ('open','reviewing') and resolved_at is null and resolved_by is null)
  ),
  constraint question_reports_comment_required_when_outro_chk check (
    reason <> 'outro'
    or (comment is not null and char_length(btrim(comment)) >= 10)
  )
);

create index idx_question_reports_question_id on public.question_reports (question_id);
create index idx_question_reports_user_id on public.question_reports (user_id);
create index idx_question_reports_status on public.question_reports (status);
create index idx_question_reports_status_created_at on public.question_reports (status, created_at desc);
create index idx_question_reports_question_status_open on public.question_reports (question_id) where status = 'open';

create trigger trg_question_reports_updated_at
  before update on public.question_reports
  for each row execute function public.handle_updated_at();

create trigger trg_audit_question_reports
  after insert or update on public.question_reports
  for each row execute function public.audit_table_changes();

-- Rate limit: 5 reports/dia/usuário (timezone São Paulo)
create or replace function public.enforce_question_report_rate_limit()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_count int;
begin
  select count(*) into v_count
    from public.question_reports
   where user_id = new.user_id
     and created_at >= date_trunc('day', now() at time zone 'America/Sao_Paulo');
  if v_count >= 5 then
    raise exception 'rate_limit_exceeded' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger trg_question_reports_rate_limit
  before insert on public.question_reports
  for each row execute function public.enforce_question_report_rate_limit();

-- RLS
alter table public.question_reports enable row level security;

create policy question_reports_select_own on public.question_reports
  for select to authenticated using (auth.uid() = user_id);

create policy question_reports_insert_own on public.question_reports
  for insert to authenticated with check (auth.uid() = user_id);

create policy question_reports_curator_full on public.question_reports
  for all to authenticated
  using (
    coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') in ('curator','founder')
  )
  with check (
    coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') in ('curator','founder')
  );
