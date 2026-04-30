---
storyId: epic-2
title: Epic 2 — Edital Discovery & Selection
verdict: CONCERNS
reviewer: Quinn (QA / Test Architect)
reviewDate: 2026-04-30
storiesReviewed: [2.1, 2.2, 2.3, 2.4]
storyDeferred: 2.5
---

# QA Gate — Epic 2

## Verdict: **PASS WITH CONCERNS** ⚠️

Epic funcional e seguro para MVP, com 3 concerns MEDIUM e 1 LOW. **Não bloqueia push**.

Story 2.5 (Multi-edital) está deferida com decisão técnica documentada em `docs/decisions/STORY-2.5-DEFERRED.md` — depende do Epic 7 (subscriptions). Esta deferral é correta e não bloqueia o gate.

---

## 7 Quality Checks

| # | Check | Resultado |
|---|-------|-----------|
| 1 | Code review (patterns) | ✅ PASS |
| 2 | Unit tests | ✅ PASS — 80/80 passing |
| 3 | Acceptance Criteria | ✅ PASS — 4/5 stories; 2.5 deferida explicitamente |
| 4 | No regressions | ✅ PASS — Epic 1 segue funcional |
| 5 | Performance | ✅ PASS — tsvector + GIN, índice parcial em is_active, lazy routes |
| 6 | Security | ⚠️ CONCERNS — ver abaixo |
| 7 | Documentation | ✅ PASS — STORY-2.5-DEFERRED.md decisões registradas |

---

## Concerns (não-bloqueantes)

### M1 — `editais_select_published_public` aberto para anon role [MEDIUM]

**Localização:** `supabase/migrations/20260430155320_editais_rls_policies.sql:5-8`

```sql
create policy editais_select_published_public on public.editais
  for select using (
    status = 'published' and (visibility ->> 'type') = 'public'
  );
```

**Issue:** A policy **não tem `to authenticated`** — o que significa que o role `anon` (anon key) pode ler editais públicos publicados via API, mesmo sem login.

**Impacto atual:** Mitigado porque todas as rotas no app usam `<RequireAuth>`. Atacante teria que conhecer a anon key + URL Supabase para batidas diretas na API. Anon key é pública (Vercel build), então é tecnicamente acessível.

**Decisão recomendada:** Confirmar com produto:
- Se intenção é "catálogo público para SEO/marketing" → manter como está, documentar
- Se intenção é "apenas autenticados" → adicionar `to authenticated` na policy

**Severity:** MEDIUM — não vaza PII (editais são metadata pública), mas é decisão de produto não-explícita.

---

### M2 — `enforce_single_active_edital` sem `set search_path` explícito [MEDIUM]

**Localização:** `supabase/migrations/20260430155800_create_user_editais.sql:35-47`

**Issue:** A função PL/pgSQL não tem `security definer` nem `set search_path = public`. Por padrão funções são `security invoker`, o que está OK aqui (caller é o próprio user). Mas search_path não forçado pode ser vetor para injection se schema-malicioso for criado.

**Recomendação:** Adicionar `set search_path = public` na função para defesa-em-profundidade:

```sql
create or replace function public.enforce_single_active_edital()
returns trigger language plpgsql
set search_path = public
as $$ ... $$;
```

Mesma orientação aplicar em `editais_search_vector_update()` (Story 2.1).

**Severity:** MEDIUM — boa prática Supabase docs; risco real baixo (caller não controla schema).

---

### M3 — Curator sem acesso de leitura a editais não-publicados [MEDIUM]

**Localização:** `supabase/migrations/20260430155320_editais_rls_policies.sql`

**Issue:** A policy `editais_admin_full` só inclui `'founder'` e `'operations'`. Curator NÃO tem acesso de admin. Hoje isso não causa problema porque o painel `/admin/editais` usa `RequireRole role="founder"`, mas:
- Story 8.x (AI content pipeline) prevê **curator** revisando editais antes da publicação
- Sem policy específica, curator não verá rascunhos via SELECT

**Recomendação:** Quando o Epic 8 chegar, adicionar policy `editais_select_admin_review` que inclui `curator` para `status IN ('draft','scheduled')`.

**Severity:** MEDIUM — futuro próximo, mas hoje é tech debt apenas.

---

### L1 — `RequireRole` faz cast frágil de `app_metadata` [LOW]

**Localização:** `src/components/RequireRole.tsx:25-26`

```ts
const userRole =
  (session?.user.app_metadata as { role?: string } | null)?.role ?? null;
```

**Issue:** Cast direto de `app_metadata` para `{ role?: string }` quebra a tipagem. Se Supabase mudar shape, TS não pegaria. Funciona porque `app_metadata` é jsonb livre.

**Recomendação:** Definir tipo explícito em `src/features/auth/types.ts`:

```ts
export type AppMetadata = {
  role?: 'founder' | 'curator' | 'operations';
  cohort?: 'beta';
};
```

E usar via type assertion única na hora de extrair.

**Severity:** LOW — não há impacto de runtime; melhoria de manutenibilidade.

---

## Strengths

✅ **RLS allowlist robusta:** `jsonb_array_elements_text + uid::uuid` é seguro contra inputs malformados (UUID inválido falha cast antes de comparar)
✅ **`unique(user_id, edital_id)`** + CHECK constraint em datas: defesa em profundidade
✅ **Trigger `enforce_single_active_edital` AFTER**: minimiza risco de recursão
✅ **`UNIQUE` slug + regex `^[a-z0-9-]{3,100}$`**: previne colisões e caracteres inválidos
✅ **Filtros parametrizados via Supabase JS**: zero SQL injection
✅ **Code splitting** correto: `/editais` e `/admin/editais/*` em chunks separados
✅ **80/80 testes verdes**, lint 0 errors, typecheck OK
✅ **Story 2.5 deferral correto**: decisão técnica clara em `docs/decisions/STORY-2.5-DEFERRED.md`

---

## Issues Summary

| Severity | Count | Action |
|----------|-------|--------|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 3 | Tech debt (M3 fica ativo até Epic 8) |
| LOW | 1 | Boa prática (refactor pequeno) |
| **Total bloqueante** | **0** | **Aprovado para push** |

---

## Recommendations

1. **M1:** Decisão de produto — confirmar se catálogo deve ser público ou login-required
2. **M2:** Adicionar `set search_path = public` em ambas as funções (migration pequena)
3. **M3:** Documentar como follow-up para Epic 8 (curator policy)
4. **L1:** Refactor de tipos `AppMetadata` quando próxima feature de role-based for tocar

Stories 2.1–2.4 estão **APROVADAS** para promoção a `Done`.

— Quinn, guardião da qualidade 🛡️
