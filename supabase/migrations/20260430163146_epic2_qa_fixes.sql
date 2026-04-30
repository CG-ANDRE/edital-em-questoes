-- Epic 2 QA fixes
-- M1: fechar editais_select_published_public para authenticated only
-- M2: fixar search_path = public em funções PL/pgSQL

-- ============================================================
-- M1 — Recriar policy com `to authenticated`
-- ============================================================
drop policy if exists editais_select_published_public on public.editais;

create policy editais_select_published_public on public.editais
  for select to authenticated using (
    status = 'published' and (visibility ->> 'type') = 'public'
  );

-- ============================================================
-- M2 — Lockdown de search_path nas funções
-- ============================================================
create or replace function public.editais_search_vector_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('portuguese', coalesce(new.titulo,'')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(new.cargo,'')),  'B') ||
    setweight(to_tsvector('portuguese', coalesce(new.orgao,'')),  'C') ||
    setweight(to_tsvector('portuguese', coalesce(new.banca,'')),  'C');
  return new;
end;
$$;

create or replace function public.enforce_single_active_edital()
returns trigger
language plpgsql
set search_path = public
as $$
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
