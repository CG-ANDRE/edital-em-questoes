import { supabase } from "@/lib/supabase";
import { posthog } from "@/lib/posthog";
import * as Sentry from "@sentry/react";
import type { Session } from "@supabase/supabase-js";
import type { SignupInput } from "@/lib/schemas/user.schema";
export type SignInInput = { email: string; password: string };
import type { SignupResult } from "./types";

export async function signUp(input: SignupInput): Promise<SignupResult> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { full_name: input.name },
      emailRedirectTo: `${window.location.origin}/onboarding`,
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error("Cadastro não retornou usuário");

  const { error: consentError } = await supabase.functions.invoke("record-consent", {
    body: { consent_type: "privacy_policy_terms" },
  });

  if (consentError) {
    await supabase.auth.signOut();
    Sentry.captureException(consentError, { tags: { feature: "auth", step: "consent" } });
    throw new Error("Falha ao registrar consentimento. Tente novamente.");
  }

  posthog.capture("user:signed_up", { source: "signup_form" });

  return {
    userId: data.user.id,
    requiresEmailConfirmation: !data.session,
  };
}

export async function signIn(input: SignInInput): Promise<Session> {
  const { data: rl, error: rlErr } = await supabase.functions.invoke<{
    allowed: boolean;
    retryAfterSeconds: number;
  }>("check-auth-rate-limit", { body: { email: input.email } });

  if (rlErr) throw rlErr;
  if (rl && !rl.allowed) {
    const err = new Error("RATE_LIMITED") as Error & { retryAfterSeconds?: number };
    err.retryAfterSeconds = rl.retryAfterSeconds;
    throw err;
  }

  const { data, error } = await supabase.auth.signInWithPassword(input);

  if (error || !data.session) {
    await supabase.functions
      .invoke("check-auth-rate-limit", {
        body: { email: input.email, recordFailure: true },
      })
      .catch(() => {});
    throw error ?? new Error("INVALID_CREDENTIALS");
  }

  return data.session;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function requestPasswordReset(email: string): Promise<void> {
  const redirectTo = `${window.location.origin}/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error && error.status && error.status >= 500) {
    Sentry.captureException(error, { tags: { feature: "auth-password-reset" } });
    throw error;
  }
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    Sentry.captureException(error, { tags: { feature: "auth-password-reset" } });
    throw error;
  }
  await supabase.auth.signOut({ scope: "others" });
}
