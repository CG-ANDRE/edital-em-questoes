// @ts-nocheck — Deno runtime
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, errorResponse, jsonResponse } from "../_shared/errors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("UNAUTHORIZED", "Token ausente", 401);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await userClient.auth.getUser();
    if (!user || !user.email) return errorResponse("UNAUTHORIZED", "Sessão inválida", 401);

    const body = await req.json();
    const password = typeof body.password === "string" ? body.password : "";
    if (!password) return errorResponse("VALIDATION_ERROR", "Senha obrigatória", 400);

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      null;

    // Rate limit: máx 3 falhas de reauth/hora por email (anti-bruteforce)
    const sinceHour = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentFailures } = await supabaseAdmin
      .from("auth_attempts")
      .select("*", { count: "exact", head: true })
      .eq("email", user.email)
      .eq("success", false)
      .gte("attempted_at", sinceHour);

    if ((recentFailures ?? 0) >= 3) {
      return new Response(
        JSON.stringify({
          error: {
            code: "RATE_LIMITED",
            message: "Muitas tentativas. Tente novamente em 1 hora.",
          },
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Re-auth via password (anti-hijack)
    const supabaseAnon = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );
    const { error: reauthError } = await supabaseAnon.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (reauthError) {
      // Registrar falha de reauth para alimentar o rate limit
      await supabaseAdmin
        .from("auth_attempts")
        .insert({
          email: user.email,
          ip_address: ipAddress,
          success: false,
        })
        .then(() => {})
        .catch(() => {});

      return errorResponse(
        "REAUTH_FAILED",
        "Senha incorreta. Para sua segurança, confirme a senha atual.",
        401
      );
    }

    const userAgent = req.headers.get("user-agent") ?? null;

    // Audit ANTES do delete (FK ON DELETE SET NULL preserva o registro)
    const { error: auditError } = await supabaseAdmin.from("audit_log").insert({
      actor_user_id: user.id,
      action: "dsr_delete",
      entity_table: "users",
      entity_id: user.id,
      metadata: {
        deletedAt: new Date().toISOString(),
        ipAddress,
        userAgent,
      },
    });

    if (auditError) {
      return errorResponse("DELETE_FAILED", "Falha ao registrar auditoria", 500);
    }

    // Delete em auth.users — cascateia para public.users (FK ON DELETE CASCADE)
    // user_consents também cascateia via public.users.id
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      return errorResponse("DELETE_FAILED", "Falha ao excluir conta", 500);
    }

    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    return errorResponse("INTERNAL", (err as Error).message, 500);
  }
});
