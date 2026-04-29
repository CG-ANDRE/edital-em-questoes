import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const ANON_KEY     = process.env.VITE_SUPABASE_ANON_KEY!;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const SKIP = !SUPABASE_URL || !ANON_KEY || !SERVICE_KEY;

// Lazy — só instanciado quando env vars estão presentes
const admin: SupabaseClient<Database> = SKIP
  ? (null as unknown as SupabaseClient<Database>)
  : createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

const stamp = Date.now();
const userA = { email: `rls-a-${stamp}@example.test`, password: "Senha!Forte#1" };
const userB = { email: `rls-b-${stamp}@example.test`, password: "Senha!Forte#2" };
let userAId = "";
let userBId = "";

async function createConfirmedUser(email: string, password: string) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) throw error ?? new Error("createUser returned null");
  return data.user.id;
}

function clientAs(token: string) {
  return createClient<Database>(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function signIn(email: string, password: string) {
  const { data, error } = await admin.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw error ?? new Error("no session");
  return data.session.access_token;
}

describe.skipIf(SKIP)("RLS — users e user_consents", () => {
  beforeAll(async () => {
    if (SKIP) return;
    userAId = await createConfirmedUser(userA.email, userA.password);
    userBId = await createConfirmedUser(userB.email, userB.password);
  });

  afterAll(async () => {
    await admin.auth.admin.deleteUser(userAId);
    await admin.auth.admin.deleteUser(userBId);
  });

  it("usuário A NÃO consegue ler o registro de users do usuário B", async () => {
    const token = await signIn(userA.email, userA.password);
    const asA = clientAs(token);
    const { data, error } = await asA.from("users").select("*").eq("id", userBId);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("usuário A consegue ler o próprio registro de users", async () => {
    const token = await signIn(userA.email, userA.password);
    const asA = clientAs(token);
    const { data, error } = await asA.from("users").select("*").eq("id", userAId);
    expect(error).toBeNull();
    expect(data?.[0]?.id).toBe(userAId);
  });

  it("usuário A NÃO consegue inserir consent no nome do usuário B", async () => {
    const token = await signIn(userA.email, userA.password);
    const asA = clientAs(token);
    const { error } = await asA
      .from("user_consents")
      .insert({ user_id: userBId, consent_type: "privacy_policy_terms", granted_at: new Date().toISOString() });
    expect(error).not.toBeNull();
  });

  it("usuário B NÃO consegue ler consents do usuário A", async () => {
    const tokenA = await signIn(userA.email, userA.password);
    const asA = clientAs(tokenA);
    await asA
      .from("user_consents")
      .insert({ user_id: userAId, consent_type: "privacy_policy_terms", granted_at: new Date().toISOString() });

    const tokenB = await signIn(userB.email, userB.password);
    const asB = clientAs(tokenB);
    const { data, error } = await asB.from("user_consents").select("*").eq("user_id", userAId);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("usuário comum NÃO consegue ler audit_log", async () => {
    const token = await signIn(userA.email, userA.password);
    const asA = clientAs(token);
    const { data, error } = await asA.from("audit_log").select("*").limit(1);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });
});
