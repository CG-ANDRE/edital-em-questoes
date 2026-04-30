-- Story 2.2 — Tabela user_editais (vínculo usuário ↔ edital)

create table public.user_editais (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  edital_id       uuid not null references public.editais(id) on delete restrict,
  is_active       boolean not null default true,
  data_inscricao  date null,
  data_prova      date null,
  registered_at   timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint user_editais_user_edital_unique unique (user_id, edital_id),
  constraint user_editais_dates_order check (
    data_prova is null
    or data_inscricao is null
    or data_prova >= data_inscricao
  )
);

create index idx_user_editais_user_id on public.user_editais (user_id);
create index idx_user_editais_user_active
  on public.user_editais (user_id, is_active)
  where is_active = true;

create trigger trg_user_editais_updated_at
  before update on public.user_editais
  for each row execute function public.handle_updated_at();

create trigger trg_audit_user_editais
  after insert or update or delete on public.user_editais
  for each row execute function public.audit_table_changes();

-- Single active edital por usuário (MVP). Story 2.5 revisará.
create or replace function public.enforce_single_active_edital()
returns trigger language plpgsql as $$
begin
  if new.is_active = true then
    update public.user_editais
       set is_active = false
     where user_id = new.user_id
       and id <> new.id
       and is_active = true;
  end if;
  return null;
end;
$$;

create trigger trg_enforce_single_active_edital
  after insert or update of is_active on public.user_editais
  for each row
  when (new.is_active = true)
  execute function public.enforce_single_active_edital();

-- RLS
alter table public.user_editais enable row level security;

create policy user_editais_select_own on public.user_editais
  for select using (auth.uid() = user_id);

create policy user_editais_insert_own on public.user_editais
  for insert with check (auth.uid() = user_id);

create policy user_editais_update_own on public.user_editais
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Sem DELETE: desativar = is_active=false
