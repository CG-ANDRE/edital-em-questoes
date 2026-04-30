import { describe, it, expect, vi, beforeEach } from "vitest";

const signUpMock = vi.fn();
const signOutMock = vi.fn();
const invokeMock = vi.fn();
const captureMock = vi.fn();
const sentryCaptureMock = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: (...args: unknown[]) => signUpMock(...args),
      signOut: (...args: unknown[]) => signOutMock(...args),
    },
    functions: {
      invoke: (...args: unknown[]) => invokeMock(...args),
    },
  },
}));

vi.mock("@/lib/posthog", () => ({
  posthog: { capture: (...args: unknown[]) => captureMock(...args) },
}));

vi.mock("@sentry/react", () => ({
  captureException: (...args: unknown[]) => sentryCaptureMock(...args),
}));

import { signUp } from "@/features/auth/api";

const validInput = {
  name: "Maria",
  email: "maria@example.com",
  password: "Senha123",
  passwordConfirmation: "Senha123",
  consentAccepted: true as const,
};

describe("signUp", () => {
  beforeEach(() => {
    signUpMock.mockReset();
    signOutMock.mockReset();
    invokeMock.mockReset();
    captureMock.mockReset();
    sentryCaptureMock.mockReset();
  });

  it("happy path: retorna userId e dispara PostHog", async () => {
    signUpMock.mockResolvedValue({ data: { user: { id: "u-123" }, session: null }, error: null });
    invokeMock.mockResolvedValue({ data: { ok: true }, error: null });

    const result = await signUp(validInput);

    expect(result).toEqual({ userId: "u-123", requiresEmailConfirmation: true });
    expect(captureMock).toHaveBeenCalledWith("user:signed_up", { source: "signup_form" });
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it("erro de consent dispara signOut e Sentry", async () => {
    signUpMock.mockResolvedValue({ data: { user: { id: "u-456" }, session: null }, error: null });
    invokeMock.mockResolvedValue({ data: null, error: new Error("consent failed") });

    await expect(signUp(validInput)).rejects.toThrow("Falha ao registrar consentimento");
    expect(signOutMock).toHaveBeenCalled();
    expect(sentryCaptureMock).toHaveBeenCalled();
  });

  it("erro do auth.signUp propaga", async () => {
    signUpMock.mockResolvedValue({ data: { user: null }, error: new Error("User already registered") });

    await expect(signUp(validInput)).rejects.toThrow("User already registered");
    expect(invokeMock).not.toHaveBeenCalled();
  });
});
