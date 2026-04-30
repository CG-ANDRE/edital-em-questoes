-- Story 2.1 — Tabela editais (catálogo curado)

create type edital_status_enum as enum ('draft','scheduled','published','archived');

create table public.editais (
  id                      uuid primary key default gen_random_uuid(),
  titulo                  text not null,
  orgao                   text not null,
  banca                   text not null,
  cargo                   text not null,
  descricao               text,
  data_prova              date,
  data_inscricao_inicio   date,
  data_inscricao_fim      date,
  slug                    text not null unique,
  status                  edital_status_enum not null default 'draft',
  published_at            timestamptz,
  visibility              jsonb not null default '{"type":"public"}'::jsonb,
  search_vector           tsvector,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

comment on table public.editais is
  'Catálogo curado de editais de concurso (FR8, FR12, FR13).';

create index idx_editais_status_published_at on public.editais (status, published_at desc);
create index idx_editais_banca on public.editais (banca);
create index idx_editais_orgao on public.editais (orgao);
create index idx_editais_data_prova on public.editais (data_prova);
create index idx_editais_search_vector on public.editais using gin (search_vector);

-- search_vector trigger
create or replace function editais_search_vector_update()
returns trigger language plpgsql as $$
begin
  new.search_vector :=
    setweight(to_tsvector('portuguese', coalesce(new.titulo,'')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(new.cargo,'')),  'B') ||
    setweight(to_tsvector('portuguese', coalesce(new.orgao,'')),  'C') ||
    setweight(to_tsvector('portuguese', coalesce(new.banca,'')),  'C');
  return new;
end;
$$;

create trigger editais_search_vector_trg
  before insert or update on public.editais
  for each row execute function editais_search_vector_update();

-- updated_at (handle_updated_at criada na Story 1.2)
create trigger trg_editais_updated_at
  before update on public.editais
  for each row execute function public.handle_updated_at();

-- audit (audit_table_changes criada na Story 1.2)
create trigger trg_audit_editais
  after insert or update or delete on public.editais
  for each row execute function public.audit_table_changes();
