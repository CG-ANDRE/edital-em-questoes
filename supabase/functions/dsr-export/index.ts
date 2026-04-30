// @ts-nocheck — Deno runtime
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, errorResponse } from "../_shared/errors.ts";

const MAX_EXPORTS_PER_MONTH = 3;
const ROLLING_DAYS = 30;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("UNAUTHORIZED", "Token ausente", 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse("UNAUTHORIZED", "Sessão inválida", 401);

    // Rate limit: máx 3 exports nos últimos 30 dias
    const since = new Date(Date.now() - ROLLING_DAYS * 24 * 3600 * 1000).toISOString();
    const { count } = await supabase
      .from("audit_log")
      .select("*", { count: "exact", head: true })
      .eq("actor_user_id", user.id)
      .eq("action", "dsr_export")
      .gte("created_at", since);

    if ((count ?? 0) >= MAX_EXPORTS_PER_MONTH) {
      return new Response(
        JSON.stringify({
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: `Você já exportou seus dados ${MAX_EXPORTS_PER_MONTH} vezes nos últimos 30 dias. Tente novamente depois.`,
          },
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Coletar dados pessoais
    const { data: userRow } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: consents } = await supabase
      .from("user_consents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const payload = {
      exportedAt: new Date().toISOString(),
      schemaVersion: "1.0.0",
      user: userRow ?? null,
      consents: consents ?? [],
      answers: [],
      confidenceScores: [],
      achievements: [],
      loginHistory: [],
    };

    // Registrar no audit_log antes de retornar
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      null;
    const userAgent = req.headers.get("user-agent") ?? null;

    const { error: auditError } = await supabase.from("audit_log").insert({
      actor_user_id: user.id,
      action: "dsr_export",
      entity_table: "users",
      entity_id: user.id,
      metadata: { schemaVersion: "1.0.0", ipAddress, userAgent },
    });

    if (auditError) {
      return errorResponse("INTERNAL", "Falha ao registrar auditoria", 500);
    }

    const today = new Date().toISOString().slice(0, 10);
    const filename = `meus-dados-edital-em-questoes-${today}.json`;

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return errorResponse("INTERNAL", (err as Error).message, 500);
  }
});
