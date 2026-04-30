-- Story 3.3 — Tabela user_answers (respostas dos usuários)

create table public.user_answers (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  question_id     uuid references public.questions(id) on delete set null,
  edital_id       uuid references public.editais(id) on delete set null,
  selected_answer text not null check (selected_answer in ('A','B','C','D','E','F')),
  is_correct      boolean not null,
  time_spent_ms   integer not null check (time_spent_ms >= 0),
  answered_at     timestamptz not null default now()
);

comment on table public.user_answers is
  'Respostas dos usuários a questões. Imutável (sem UPDATE/DELETE em RLS). LGPD: ON DELETE SET NULL preserva dado pessoal mesmo após arquivamento upstream.';

create index idx_user_answers_user_id on public.user_answers (user_id);
create index idx_user_answers_question_id on public.user_answers (question_id);
create index idx_user_answers_user_answered_at on public.user_answers (user_id, answered_at desc);

alter table public.user_answers enable row level security;

create policy user_answers_select_own on public.user_answers
  for select to authenticated using (auth.uid() = user_id);

create policy user_answers_insert_own on public.user_answers
  for insert to authenticated with check (auth.uid() = user_id);
-- Sem UPDATE/DELETE: resposta é imutável
