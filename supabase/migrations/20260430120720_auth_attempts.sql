-- Story 1.4 — Tabela auth_attempts (anti-bruteforce)

create table public.auth_attempts (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  ip_address    text,
  success       boolean not null default false,
  attempted_at  timestamptz not null default now()
);

create index idx_auth_attempts_email_time on public.auth_attempts (email, attempted_at desc);
create index idx_auth_attempts_ip_time    on public.auth_attempts (ip_address, attempted_at desc);

alter table public.auth_attempts enable row level security;
-- Sem policies para user comum; acesso apenas via service_role (Edge Function)

comment on table public.auth_attempts is
  'Anti-bruteforce. Usuário comum não tem acesso (RLS sem policies). TTL: 24h via cleanup manual ou pg_cron quando habilitado.';
