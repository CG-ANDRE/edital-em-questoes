---
storyId: epic-1
title: Epic 1 — Foundation & User Onboarding
verdict: CONCERNS
reviewer: Quinn (QA / Test Architect)
reviewDate: 2026-04-30
storiesReviewed: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8]
---

# QA Gate — Epic 1

## Verdict: **PASS WITH CONCERNS** ⚠️

Epic funcional, seguro para MVP, com 3 concerns MEDIUM e 2 LOW que devem ser endereçados como tech debt ou em Epic 2. **Não bloqueia push para produção.**

---

## 7 Quality Checks

| # | Check | Resultado | Notas |
|---|-------|-----------|-------|
| 1 | Code review (patterns) | ✅ PASS | Estrutura features-first respeitada; path aliases consistentes |
| 2 | Unit tests | ✅ PASS | 53/53 passing, 18 test files; cobertura ≥80% nas features críticas |
| 3 | Acceptance Criteria | ✅ PASS | 8 stories implementadas; 2 ACs adiados explicitamente (1.6 user_editais, 1.8 rate limit dedicado) |
| 4 | No regressions | ✅ PASS | Lovable starter preservado; lint pré-existente corrigido |
| 5 | Performance | ✅ PASS | Bundle não-impactado; queries usam índices criados (idx_auth_attempts_*, idx_audit_log_*) |
| 6 | Security | ⚠️ CONCERNS | RLS OK, anti-enumeration OK, auth flows OK; 2 gaps de rate limit (ver abaixo) |
| 7 | Documentation | ✅ PASS | Stories commitadas com decisões; commit messages detalhados |

---

## Concerns (não-bloqueantes)

### M1 — Rate limit ausente em dsr-delete [MEDIUM]

**Localização:** `supabase/functions/dsr-delete/index.ts`

**Issue:** Edge Function dsr-delete não tem rate limit próprio. Atacante com JWT roubado (XSS/CSRF) pode brute-force a senha do dono da conta para forçar delete.

**Mitigações existentes:**
- Supabase Auth rate limit nativo (~30 attempts/hour por IP)
- Re-auth obrigatória antes do delete
- Audit log registra cada tentativa

**Recomendação:** Adicionar checagem similar à `check-auth-rate-limit` antes do `signInWithPassword` (3 tentativas/hora por usuário). Story 1.8 AC11 já documentou como debt.

**Severity:** MEDIUM — exploitabilidade requer comprometimento prévio do JWT.

---

### M2 — `recordFailure` em check-auth-rate-limit pode ser abusado [MEDIUM]

**Localização:** `supabase/functions/check-auth-rate-limit/index.ts:31-37`

**Issue:** O caminho `recordFailure: true` insere em `auth_attempts` sem verificar se o caller deveria poder fazê-lo. Atacante pode poluir a tabela com falhas falsas para um email vítima, bloqueando logins legítimos por 10min.

**Impacto:** DoS leve — vítima espera janela expirar.

**Recomendação:** Antes de inserir failure, verificar se o IP do request já tem >N inserts no último minuto. Ou adicionar validação que apenas IPs internos do Supabase podem postar `recordFailure`.

**Severity:** MEDIUM — DoS bounded; sem comprometer credenciais.

---

### M3 — Detecção de erros do Supabase Auth frágil [MEDIUM]

**Localização:** `src/features/auth/components/LoginForm.tsx:48`

**Issue:** A detecção de erro de credenciais usa `err.name === "AuthApiError"`. Em versões futuras do `@supabase/supabase-js`, o nome da classe pode mudar, fazendo erros legítimos de credencial caírem no caminho "Erro ao fazer login" + Sentry capture.

**Recomendação:** Detectar via `err.status === 400` OU `err.message` contendo padrão conhecido. Cobrir com test de regressão se a versão do SDK mudar.

**Severity:** MEDIUM — degrada UX, não a segurança. Sentry capturaria, então alarme dispararia.

---

### L1 — Email enumeration no signup [LOW — acknowledged]

**Localização:** `src/features/auth/components/SignupForm.tsx:62`

**Issue:** Mensagem "Esse e-mail já possui cadastro" no signup expõe se um email está cadastrado. NFR8/OWASP A07 requer mensagens genéricas.

**Mitigação:** Limitação conhecida do Supabase Auth (`signUp` retorna "User already registered" quando duplicado). Alternativa seria silenciar e enviar email "alguém tentou criar conta com seu email" — fora de escopo do Epic 1.

**Severity:** LOW — trade-off UX vs segurança aceito para MVP. Reavaliar quando integrar Resend (Epic 7).

---

### L2 — Configuração manual pendente no Dashboard Supabase [LOW]

**Issue:** AC7 da Story 1.5 requer adicionar `*/reset-password` em **Authentication → URL Configuration → Redirect URLs**. Não foi confirmado.

**Recomendação:** Verificar no Dashboard antes do primeiro teste de reset de senha em produção.

**Severity:** LOW — bloqueia fluxo de reset password até config; teste manual pega.

---

## Strengths

✅ **Defense-in-depth:** Zod client + CHECK constraint DB + RLS por `auth.uid()` + service role para writes sensíveis
✅ **LGPD compliant:** Consent com IP/UA/timestamp via Edge Function (RLS bloqueia client direto), DSR export + delete self-service, audit log imutável (NFR12)
✅ **Anti-enumeration no login:** Mensagem genérica "Email ou senha incorretos"
✅ **audit_log preservado após delete:** FK ON DELETE SET NULL mantém registros para retenção 12m
✅ **Rate limit anti-bruteforce no login:** 5 tentativas/10min por email OU IP
✅ **Sentry capture sem PII:** Tags structuradas (`feature`, `step`), nunca password/email no payload
✅ **Husky pre-commit ativo:** Bloqueou possíveis erros locais durante o desenvolvimento
✅ **53/53 testes verdes** + Edge Functions deployadas + Vercel auto-deploy

---

## Recommendations (próximos passos)

1. **Criar tech debt items** para M1, M2, M3 no backlog do Epic 2
2. **Validar manualmente** o fluxo de reset password antes de marketing/lançamento (L2)
3. **Smoke test E2E manual** dos 5 fluxos principais:
   - Cadastro com checkbox LGPD → confirma email → login
   - Login → /dashboard
   - Esqueci senha → email → reset → login com nova senha
   - Editar perfil → salvar → ver atualizado
   - Privacy → exportar dados (download JSON) e excluir conta
4. **Configurar templates de email PT-BR** no Dashboard Supabase quando integrar Resend (Epic 7)
5. **Adicionar testes de integração reais** com `SUPABASE_SERVICE_ROLE_KEY` em ambiente local quando preview branch DBs forem habilitados

---

## Issues Summary

| Severity | Count | Action |
|----------|-------|--------|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 3 | Tech debt para Epic 2 |
| LOW | 2 | Acknowledge + monitor |
| **Total** | **5** | **Não bloqueia merge/push** |

---

## Gate Decision

**VERDICT: PASS WITH CONCERNS**

Epic 1 está pronto para promoção a `Done` e push para produção. Os 3 concerns MEDIUM devem ser registrados no backlog do Epic 2 como tech debt explícito antes do início do Epic 3.

— Quinn, guardião da qualidade 🛡️
