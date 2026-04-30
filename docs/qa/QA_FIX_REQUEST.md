# QA Fix Request — Epic 1 Concerns

**Status:** Open
**From:** @qa (Quinn)
**To:** @dev (Dex)
**Severity:** 3 MEDIUM (tech debt fechável)
**Estimated effort:** ~1h total
**Goal:** Fechar concerns do gate Epic 1 → verdict vira PASS limpo

---

## M1 — Rate limit em dsr-delete

**Localização:** `supabase/functions/dsr-delete/index.ts`

**Issue:** Endpoint destrutivo sem rate limit próprio. Atacante com JWT roubado (XSS/CSRF) pode brute-force a senha.

**Fix proposto:** Replicar lógica de `check-auth-rate-limit` antes do `signInWithPassword`:

```ts
// Após autenticar user mas ANTES de chamar signInWithPassword:
const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
const { count } = await supabaseAdmin
  .from("auth_attempts")
  .select("*", { count: "exact", head: true })
  .eq("email", user.email)
  .eq("success", false)
  .gte("attempted_at", since);

if ((count ?? 0) >= 3) {
  return errorResponse(
    "RATE_LIMITED",
    "Muitas tentativas. Tente novamente em 1 hora.",
    429
  );
}

// ... signInWithPassword ...

// Em caso de reauth_failed, registrar a tentativa:
if (reauthError) {
  await supabaseAdmin.from("auth_attempts").insert({
    email: user.email,
    ip_address: ipAddress,
    success: false,
  });
  return errorResponse("REAUTH_FAILED", "Senha incorreta...", 401);
}
```

**Validação:** Test E2E manual ou test de integração: 4 chamadas seguidas com senha errada → 4ª retorna 429.

---

## M2 — Proteção do recordFailure em check-auth-rate-limit

**Localização:** `supabase/functions/check-auth-rate-limit/index.ts`

**Issue:** O caminho `recordFailure: true` insere em `auth_attempts` sem verificar se o caller tem direito. Atacante pode poluir a tabela com falhas falsas para DoS no login da vítima.

**Fix proposto:** Antes de inserir failure, verificar se o IP do request já fez muitos POSTs no último minuto:

```ts
if (recordFailure) {
  // Anti-flood: máximo 10 inserts/minuto pelo mesmo IP
  const sinceMinute = new Date(Date.now() - 60 * 1000).toISOString();
  const { count: ipBurst } = await supabase
    .from("auth_attempts")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ipAddress)
    .gte("attempted_at", sinceMinute);

  if ((ipBurst ?? 0) >= 10) {
    return errorResponse("RATE_LIMITED", "Muitas requisições", 429);
  }

  const { error } = await supabase.from("auth_attempts").insert({
    email,
    ip_address: ipAddress,
    success: false,
  });
  if (error) return errorResponse("DB_ERROR", error.message, 500);
  return jsonResponse({ ok: true }, 201);
}
```

**Validação:** Curl em loop de 11 calls em <1s → 11ª retorna 429.

---

## M3 — Detecção robusta de erro de credencial

**Localização:** `src/features/auth/components/LoginForm.tsx:48`

**Issue:** Detecção via `err.name === "AuthApiError"` quebra se o nome da classe mudar em versões futuras do `@supabase/supabase-js`.

**Fix proposto:** Usar combinação de `status` e padrão de mensagem:

```ts
onError: (err: SignInError) => {
  if (err.message === "RATE_LIMITED") { /* ... */ return; }

  // Detecção robusta de credenciais inválidas:
  const status = (err as { status?: number }).status;
  const isCredentialError =
    err.message === "INVALID_CREDENTIALS" ||
    status === 400 ||
    /invalid.*credential/i.test(err.message) ||
    /invalid.*login/i.test(err.message);

  if (isCredentialError) {
    toast.error("Email ou senha incorretos");
    return;
  }
  toast.error("Erro ao fazer login. Tente novamente.");
  Sentry.captureException(err, { tags: { feature: "auth", action: "signIn" } });
},
```

**Validação:** Test do LoginForm já mockam errors — adicionar caso com `{ status: 400, message: "Invalid login credentials" }` e verificar toast genérico.

---

## Validação final pós-fixes

```bash
bun run lint && bun run typecheck && bun run test
```

Esperado: 0 errors, 0 fail.

Após fixes, deployar Edge Functions atualizadas:
```bash
SUPABASE_ACCESS_TOKEN=<token> bunx supabase functions deploy dsr-delete
SUPABASE_ACCESS_TOKEN=<token> bunx supabase functions deploy check-auth-rate-limit
```

Quando concluído, ping @qa para re-review e atualizar gate para PASS limpo.

— Quinn, guardião da qualidade 🛡️
