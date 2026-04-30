# Story 2.5 — Multi-edital Switch [DEFERRED]

**Status:** Deferred — implementar após Epic 7 (Monetization/Eduzz)

## Decisão

A Story 2.5 (Multi-edital) é marcada como **[Growth]** no PRD e tem dependência forte de:

1. Tabela `subscriptions` (criada no Epic 7 — Eduzz integration)
2. JWT `app_metadata.plan` ou query a `subscriptions.plan`
3. Hook `useUserPlan()` que lê o plano corrente

Sem essas dependências, implementar a 2.5 exigiria:
- Mockar plano como `'free'` para todos (regressão funcional vs. atual)
- Mockar plano como `'premium'` para todos (libera multi-edital sem cobrança)
- Criar feature flag temporária (cria débito a remover)

Nenhuma das opções é honesta para o estado atual do produto.

## Estado preservado

A Story 2.2 deixou pronta a base para Multi-edital quando o trigger `enforce_single_active_edital` for desabilitado:

- `user_editais.is_active boolean` permite múltiplos
- `unique(user_id, edital_id)` impede duplicação por edital
- RLS policies já permitem múltiplas linhas por user
- API helpers (`selectEdital`, `setActiveEdital`) funcionam para qualquer cardinalidade
- O único ponto a remover/condicionar é o **trigger** `trg_enforce_single_active_edital`

## Plano de execução pós-Epic 7

Quando o Epic 7 entregar `subscriptions`:

1. Migration `<ts>_user_editais_multi.sql`:
   - `DROP TRIGGER trg_enforce_single_active_edital`
   - Criar nova função `enforce_user_editais_limit()` que lê `subscriptions.plan` e aplica limite (1 free / 3 premium)
   - Recriar trigger com a nova função

2. Frontend:
   - Hook `useUserPlan()`
   - Componente `<EditalSwitcher />` no header
   - Botão "Estudar para este edital" no `EditalCard` checa limite antes de abrir dialog
   - RPC `switch_active_edital` no Postgres (transação atômica)

3. Testes de integração para limite de plano

## Impacto no Epic 2

**Nenhum bloqueio.** Stories 2.1–2.4 entregam o MVP completo de Discovery + Selection + Admin. Multi-edital é cap de valor incremental para premium, não pré-requisito de catálogo.

— Dex, sempre construindo 🔨
