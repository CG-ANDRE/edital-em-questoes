# Integration Tests

Testes que rodam contra Supabase real (Cloud ou local). **NÃO entram no CI padrão** (`bun test --run`) — são executados manualmente.

## Pré-requisitos

```bash
# Exportar vars na sessão (NUNCA commitar esses valores)
export VITE_SUPABASE_URL=https://<ref>.supabase.co
export VITE_SUPABASE_ANON_KEY=<anon-key>
export SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # NUNCA vazar; bypassa RLS
```

## Executar

```bash
bun test:integration
```

## Supabase local (alternativa)

```bash
bunx supabase start          # sobe Postgres + Auth local
# vars locais ficam em .env.local após supabase start (não commitar)
bun test:integration
bunx supabase stop
```
