// @ts-nocheck — Deno runtime; type-checked by Supabase deploy, not by tsc
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, errorResponse, jsonResponse } from "../_shared/errors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("UNAUTHENTICATED", "Token ausente", 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse("UNAUTHENTICATED", "Sessão inválida", 401);

    const body = await req.json();
    if (body.consent_type !== "privacy_policy_terms") {
      return errorResponse("VALIDATION_ERROR", "Tipo de consentimento inválido", 400);
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      null;
    const userAgent = req.headers.get("user-agent") ?? null;

    const { error } = await supabase.from("user_consents").insert({
      user_id: user.id,
      consent_type: body.consent_type,
      granted_at: new Date().toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) return errorResponse("DB_ERROR", error.message, 500);

    return jsonResponse({ ok: true }, 201);
  } catch (err) {
    return errorResponse("INTERNAL", (err as Error).message, 500);
  }
});
