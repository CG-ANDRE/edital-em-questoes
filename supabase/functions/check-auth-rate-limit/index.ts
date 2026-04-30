// @ts-nocheck — Deno runtime
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, errorResponse, jsonResponse } from "../_shared/errors.ts";

const WINDOW_MINUTES = 10;
const MAX_FAILURES = 5;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const email: string | undefined = body.email;
    const recordFailure: boolean = body.recordFailure === true;

    if (!email || typeof email !== "string") {
      return errorResponse("VALIDATION_ERROR", "email obrigatório", 400);
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      "unknown";

    if (recordFailure) {
      const { error } = await supabase.from("auth_attempts").insert({
        email,
        ip_address: ipAddress,
        success: false,
      });
      if (error) return errorResponse("DB_ERROR", error.message, 500);
      return jsonResponse({ ok: true }, 201);
    }

    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

    const { count: byEmail } = await supabase
      .from("auth_attempts")
      .select("*", { count: "exact", head: true })
      .eq("email", email)
      .eq("success", false)
      .gte("attempted_at", since);

    const { count: byIp } = await supabase
      .from("auth_attempts")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ipAddress)
      .eq("success", false)
      .gte("attempted_at", since);

    const failures = Math.max(byEmail ?? 0, byIp ?? 0);
    const allowed = failures < MAX_FAILURES;
    const retryAfterSeconds = allowed ? 0 : WINDOW_MINUTES * 60;

    return jsonResponse({ allowed, retryAfterSeconds });
  } catch (err) {
    return errorResponse("INTERNAL", (err as Error).message, 500);
  }
});
