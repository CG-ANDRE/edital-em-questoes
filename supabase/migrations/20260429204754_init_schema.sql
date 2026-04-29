-- Story 1.2 — Schema inicial: users, user_consents, audit_log

-- =========================================================================
-- 1. Extensões necessárias
-- =========================================================================
create extension if not exists "pgcrypto";

-- =========================================================================
-- 2. Tabela users (extensão de auth.users)
-- =========================================================================
create table public.users (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null unique,
  full_name           text,
  target_concurso     text,
  study_goal          text,
  exam_date           date,
  registration_date   date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.users is
  'Perfil aplicacional. Espelha auth.users com colunas de produto (FR6).';

-- =========================================================================
-- 3. Tabela user_consents (LGPD — FR3, FR4, NFR10)
-- =========================================================================
create table public.user_consents (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  consent_type    text not null,
  granted_at      timestamptz,
  revoked_at      timestamptz,
  ip_address      inet,
  user_agent      text,
  policy_version  text,
  created_at      timestamptz not null default now(),
  constraint user_consents_grant_or_revoke_chk
    check (granted_at is not null or revoked_at is not null)
);

create index idx_user_consents_user_id on public.user_consents (user_id);

comment on table public.user_consents is
  'Append-only. Para revogar um consent, INSERT novo registro com revoked_at; nunca UPDATE.';

-- =========================================================================
-- 4. Tabela audit_log (NFR12 — retenção 12m)
-- =========================================================================
create table public.audit_log (
  id              uuid primary key default gen_random_uuid(),
  actor_user_id   uuid references public.users(id) on delete set null,
  action          text not null,
  entity_table    text not null,
  entity_id       uuid,
  before_data     jsonb,
  after_data      jsonb,
  metadata        jsonb,
  ip_address      inet,
  created_at      timestamptz not null default now()
);

create index idx_audit_log_actor_user_id on public.audit_log (actor_user_id);
create index idx_audit_log_entity        on public.audit_log (entity_table, entity_id);
create index idx_audit_log_created_at    on public.audit_log (created_at desc);

comment on table public.audit_log is
  'Imutável (sem policy de UPDATE/DELETE). Retenção mínima 12 meses (NFR12).';

-- =========================================================================
-- 5. Trigger updated_at
-- =========================================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

-- =========================================================================
-- 6. Trigger sync auth.users -> public.users
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, full_name, registration_date)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    current_date
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- 7. Triggers de audit_log
-- =========================================================================
create or replace function public.audit_table_changes()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_actor uuid := auth.uid();
begin
  if (tg_op = 'INSERT') then
    insert into public.audit_log (actor_user_id, action, entity_table, entity_id, after_data)
      values (v_actor, 'INSERT', tg_table_name, new.id, to_jsonb(new));
    return new;
  elsif (tg_op = 'UPDATE') then
    insert into public.audit_log (actor_user_id, action, entity_table, entity_id, before_data, after_data)
      values (v_actor, 'UPDATE', tg_table_name, new.id, to_jsonb(old), to_jsonb(new));
    return new;
  elsif (tg_op = 'DELETE') then
    insert into public.audit_log (actor_user_id, action, entity_table, entity_id, before_data)
      values (v_actor, 'DELETE', tg_table_name, old.id, to_jsonb(old));
    return old;
  end if;
  return null;
end;
$$;

create trigger trg_audit_users
  after insert or update or delete on public.users
  for each row execute function public.audit_table_changes();

create trigger trg_audit_user_consents
  after insert or update on public.user_consents
  for each row execute function public.audit_table_changes();