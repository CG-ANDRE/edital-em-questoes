-- Story 2.1 — RLS policies para editais

alter table public.editais enable row level security;

create policy editais_select_published_public on public.editais
  for select using (
    status = 'published' and (visibility ->> 'type') = 'public'
  );

create policy editais_select_published_beta on public.editais
  for select to authenticated using (
    status = 'published'
    and (visibility ->> 'type') = 'beta'
    and (
      (auth.jwt() -> 'app_metadata' ->> 'cohort') = 'beta'
      or (auth.jwt() -> 'app_metadata' ->> 'role') in ('founder','curator','operations')
    )
  );

create policy editais_select_published_allowlist on public.editais
  for select to authenticated using (
    status = 'published'
    and (visibility ->> 'type') = 'allowlist'
    and exists (
      select 1
      from jsonb_array_elements_text(visibility -> 'userIds') as uid
      where uid::uuid = auth.uid()
    )
  );

create policy editais_admin_full on public.editais
  for all to authenticated
  using ( (auth.jwt() -> 'app_metadata' ->> 'role') in ('founder','operations') )
  with check ( (auth.jwt() -> 'app_metadata' ->> 'role') in ('founder','operations') );
