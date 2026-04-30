-- Story 1.2 — RLS habilitada + policies base

-- =========================================================================
-- 1. Habilitar RLS em todas as tabelas
-- =========================================================================
alter table public.users          enable row level security;
alter table public.user_consents  enable row level security;
alter table public.audit_log      enable row level security;

-- =========================================================================
-- 2. Policies de users
-- =========================================================================
create policy users_select_own
  on public.users
  for select
  using (auth.uid() = id);

create policy users_update_own
  on public.users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
-- sem INSERT: handle_new_user trigger faz
-- sem DELETE: cascateado por auth.users

-- =========================================================================
-- 3. Policies de user_consents (append-only)
-- =========================================================================
create policy user_consents_select_own
  on public.user_consents
  for select
  using (auth.uid() = user_id);

create policy user_consents_insert_own
  on public.user_consents
  for insert
  with check (auth.uid() = user_id);
-- sem UPDATE/DELETE: revogar = INSERT novo registro com revoked_at

-- =========================================================================
-- 4. Policies de audit_log (imutável — NFR12)
-- =========================================================================
create policy audit_log_insert_authenticated
  on public.audit_log
  for insert
  to authenticated
  with check (true);

create policy audit_log_select_admin
  on public.audit_log
  for select
  using (
    coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') in ('founder', 'operations')
  );
-- sem UPDATE nem DELETE em audit_log