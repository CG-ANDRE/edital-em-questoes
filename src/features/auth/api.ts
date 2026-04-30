import { supabase } from "@/lib/supabase";
import { posthog } from "@/lib/posthog";
import * as Sentry from "@sentry/react";
import type { SignupInput } from "@/lib/schemas/user.schema";
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
