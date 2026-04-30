import { describe, it, expect } from "vitest";
import { signupSchema } from "@/lib/schemas/user.schema";

const validInput = {
  name: "Maria Silva",
  email: "maria@example.com",
  password: "Senha123",
  passwordConfirmation: "Senha123",
  consentAccepted: true,
};

describe("signupSchema", () => {
  it("aceita input válido", () => {
    const result = signupSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejeita senha curta", () => {
    const r = signupSchema.safeParse({ ...validInput, password: "Ab1", passwordConfirmation: "Ab1" });
    expect(r.success).toBe(false);
  });

  it("rejeita senha sem dígito", () => {
    const r = signupSchema.safeParse({ ...validInput, password: "SenhaSemNumero", passwordConfirmation: "SenhaSemNumero" });
    expect(r.success).toBe(false);
  });

  it("rejeita email inválido", () => {
    const r = signupSchema.safeParse({ ...validInput, email: "naoEhEmail" });
    expect(r.success).toBe(false);
  });

  it("rejeita consent false", () => {
    const r = signupSchema.safeParse({ ...validInput, consentAccepted: false });
    expect(r.success).toBe(false);
  });

  it("rejeita confirmação divergente", () => {
    const r = signupSchema.safeParse({ ...validInput, passwordConfirmation: "Outra123" });
    expect(r.success).toBe(false);
  });

  it("rejeita nome muito curto", () => {
    const r = signupSchema.safeParse({ ...validInput, name: "M" });
    expect(r.success).toBe(false);
  });
});
