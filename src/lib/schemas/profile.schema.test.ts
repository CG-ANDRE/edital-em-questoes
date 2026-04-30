import { describe, it, expect } from "vitest";
import { profileUpdateSchema } from "@/lib/schemas/profile.schema";

const validInput = {
  full_name: "Maria Silva",
  target_concurso: "TJSC 2026",
  study_goal: "2 horas por dia",
  exam_date: "2027-01-15",
};

describe("profileUpdateSchema", () => {
  it("aceita input válido", () => {
    const r = profileUpdateSchema.safeParse(validInput);
    expect(r.success).toBe(true);
  });

  it("nome com 1 char falha", () => {
    const r = profileUpdateSchema.safeParse({ ...validInput, full_name: "M" });
    expect(r.success).toBe(false);
  });

  it("nome com 101 chars falha", () => {
    const r = profileUpdateSchema.safeParse({ ...validInput, full_name: "x".repeat(101) });
    expect(r.success).toBe(false);
  });

  it("aceita campos opcionais vazios", () => {
    const r = profileUpdateSchema.safeParse({
      full_name: "Maria",
      target_concurso: "",
      study_goal: "",
      exam_date: "",
    });
    expect(r.success).toBe(true);
  });

  it("rejeita exam_date com string inválida", () => {
    const r = profileUpdateSchema.safeParse({ ...validInput, exam_date: "não-é-data" });
    expect(r.success).toBe(false);
  });
});
