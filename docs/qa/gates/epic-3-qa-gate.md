---
storyId: epic-3
title: Epic 3 — Question Bank & Answer Flow
verdict: CONCERNS
severity: HIGH
reviewer: Quinn (QA / Test Architect)
reviewDate: 2026-04-30
storiesReviewed: [3.1, 3.2, 3.3, 3.4, 3.5, 3.6]
---

# QA Gate — Epic 3

## Verdict: **PASS WITH CONCERNS** ⚠️ (1 HIGH + 2 MEDIUM + 1 LOW)

Epic funcional e cobre todas as 6 stories, mas **identificada vulnerabilidade HIGH de integridade** que recomendo fortemente corrigir antes do push.

A funcionalidade roda perfeitamente — o problema é que um usuário malicioso pode trapacear no score de respostas, comprometendo Epic 5 (score de confiança) e qualquer feature de ranking/cronograma adaptativo (Epic 4) que dependa de dados confiáveis.

---

## 7 Quality Checks

| # | Check | Resultado |
|---|-------|-----------|
| 1 | Code review (patterns) | ✅ PASS |
| 2 | Unit tests | ✅ PASS — 90/90 passing |
| 3 | Acceptance Criteria | ✅ PASS — 6/6 stories |
| 4 | No regressions | ✅ PASS |
| 5 | Performance | ✅ PASS — search_vector + índices + lazy routes |
| 6 | Security | ⚠️ CONCERNS — 1 HIGH + 2 MEDIUM (ver abaixo) |
| 7 | Documentation | ✅ PASS |

---

## Concerns

### 🔴 H1 — `is_correct` é controlado pelo cliente [HIGH]

**Localização:** `src/features/questions/api.ts:54-83` + `supabase/migrations/20260430200634_user_answers.sql`

**Issue:** A função `answerQuestion`:

```ts
const isCorrect = q.correct_answer === input.selectedAnswer;
const payload: TablesInsert<"user_answers"> = {
  ...
  is_correct: isCorrect,  // ← CALCULADO NO CLIENT
};
const { data, error } = await supabase.from("user_answers").insert(payload);
```

A coluna `is_correct` aceita qualquer boolean no insert e a RLS só checa `auth.uid() = user_id`. **Usuário malicioso pode** abrir DevTools, alterar o payload para `is_correct: true` em qualquer resposta, e gravar como certa mesmo errando.

**Impacto:**
- Quebra integridade do score de confiança (FR27, Epic 5)
- Quebra cronograma adaptativo (Epic 4) — algoritmo prioriza matérias "fracas" baseado em is_correct
- Quebra rankings/conquistas (FR33)
- Qualquer métrica derivada vira inútil

**Fix proposto:** Trigger BEFORE INSERT que sobrescreve `is_correct` server-side:

```sql
create or replace function public.enforce_user_answer_correctness()
returns trigger
language plpgsql
set search_path = public
security definer
as $$
declare
  v_correct text;
begin
  select correct_answer into v_correct
    from public.questions where id = new.question_id;
  if v_correct is null then
    raise exception 'question not found' using errcode = 'P0001';
  end if;
  new.is_correct := (v_correct = new.selected_answer);
  return new;
end;
$$;

create trigger trg_user_answer_correctness
  before insert on public.user_answers
  for each row execute function public.enforce_user_answer_correctness();
```

Após esse trigger, `answerQuestion` no client pode parar de fazer o pré-fetch de `correct_answer` (ver M2 abaixo).

**Severity:** HIGH — não vaza PII mas compromete integridade de dados core.

---

### 🟡 M1 — `correct_answer` exposta no client antes da resposta [MEDIUM]

**Localização:** `src/features/questions/hooks/useNextQuestion.ts` + `fetchNextQuestion`

**Issue:** O `SELECT *` em `fetchNextQuestion` retorna `correct_answer` junto com a questão. Isso expõe o gabarito no DevTools (React DevTools / Network tab) **antes** do usuário submeter a resposta, permitindo que ele veja qual é a alternativa correta e marque essa.

**Impacto:** combinado com H1, qualquer usuário consegue ter 100% de acerto sem estudar.

**Fix proposto:**
1. `fetchNextQuestion` muda para `.select('id, enunciado, alternativas, materia, banca, cargo_alvo, dificuldade')` — exclui `correct_answer` e `justificativa` (esta também é spoiler).
2. Após resposta confirmada, `AnswerFeedback` busca os campos restantes via nova função `fetchQuestionFeedback(questionId)` que retorna `correct_answer` + `justificativa`.
3. Ou: criar view `questions_public` sem os campos sensíveis e mudar o RLS pra usar a view.

Sem H1 corrigido, M1 sozinho já permite trapaça (o user manda `is_correct: true`). Os dois fixes andam juntos.

**Severity:** MEDIUM — fix está acoplado ao H1.

---

### 🟡 M2 — Policy de questions não filtra `user_editais.is_active` [MEDIUM]

**Localização:** `supabase/migrations/20260430193949_init_question_editais.sql:62-72`

```sql
create policy questions_select_public_published on public.questions
  for select to authenticated using (
    status = 'published'
    and exists (
      select 1
      from public.question_editais qe
      join public.user_editais ue on ue.edital_id = qe.edital_id
      where qe.question_id = questions.id
        and ue.user_id = auth.uid()  -- ← falta and ue.is_active = true
    )
  );
```

**Issue:** Se o usuário trocar de edital (Story 2.2 marca antigo como `is_active=false`), o vínculo continua existindo em `user_editais`. A policy não filtra por `is_active`, então o usuário continua vendo questões do edital ANTIGO mesmo após trocar.

**Impacto:** UX confusa (usuário acha que mudou de edital mas continua recebendo as mesmas questões). Não é falha de segurança, é de comportamento.

**Fix proposto:** Adicionar `and ue.is_active = true` na policy. Migration de 1 linha.

**Severity:** MEDIUM — funcional, não-segurança.

---

### 🟢 L1 — `visibility.userIds` da allowlist potencialmente vazada [LOW]

**Localização:** Story 2.1 — não-novo, mas vale registrar agora que questões usam editais.

**Issue:** Quando `editais.visibility = {type:'allowlist', userIds:[...]}`, o array de UUIDs é retornado no SELECT do edital para qualquer usuário que satisfaça a policy `editais_select_published_allowlist` (que já filtra a presença do próprio uid). Mas o objeto `visibility` **inteiro** vai no payload, incluindo os outros UUIDs.

**Impacto:** Usuários da allowlist podem ver UUIDs uns dos outros. Sem PII (UUIDs não são identificáveis), mas vaza correlação.

**Fix proposto:** Mascarar `visibility.userIds` no client antes de retornar (ou criar view), ou aceitar como design decision MVP.

**Severity:** LOW — informação correlacional, não-PII.

---

## Strengths

✅ **Imutabilidade:** `user_answers` e `question_revisions` sem policy UPDATE/DELETE — append-only por design
✅ **Rate limit em `question_reports`:** trigger BEFORE INSERT impede abuso server-side (não depende de client)
✅ **Auditoria automatizada:** trigger `audit_questions_revisions` registra em `question_revisions` E `audit_log` (NFR12)
✅ **search_path lockdown:** todas as funções PL/pgSQL novas têm `set search_path = public`
✅ **CHECK constraints fortes:** `comment >= 10 chars when reason='outro'`, `resolved_consistency`, `selected_answer in (A-F)`, `time_spent_ms >= 0`
✅ **PostHog tracking padronizado:** `question:answered` + `question:reported` com convenção `<domain>:<action>`
✅ **90/90 testes verdes** + lint 0 errors + typecheck OK

---

## Issues Summary

| Severity | Count | Bloqueia push? |
|----------|-------|----------------|
| CRITICAL | 0 | — |
| HIGH | 1 | Recomendo fix antes (compromete integridade Epic 5) |
| MEDIUM | 2 | Fix recomendado |
| LOW | 1 | Acknowledge |
| **Total** | **4** | |

---

## Recommendation

**FORTEMENTE recomendo aplicar fixes H1 + M1 antes de promover Epic 3 a Done.**

São fixes pequenos (~1h):
- H1 + M1 são 1 trigger PL/pgSQL + 1 ajuste de SELECT no client + 1 nova função `fetchQuestionFeedback`
- M2 é 1 linha de SQL na policy

Se forem aplicados, gate vira PASS limpo no re-review.

— Quinn, guardião da qualidade 🛡️
