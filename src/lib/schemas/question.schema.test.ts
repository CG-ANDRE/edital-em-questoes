import { describe, it, expect } from "vitest";
import { questionSchema } from "@/lib/schemas/question.schema";

const validInput = {
  enunciado: "Qual a função do verbo na frase?",
  alternativas: [
    { label: "A" as const, text: "Indicar ação" },
    { label: "B" as const, text: "Indicar objeto" },
    { label: "C" as const, text: "Indicar adjetivo" },
    { label: "D" as const, text: "Indicar pronome" },
    { label: "E" as const, text: "Indicar artigo" },
  ],
  correct_answer: "A" as const,
  justificativa: "O verbo indica ação ou estado do sujeito.",
  materia: "LÍNGUA PORTUGUESA",
  banca: "FGV",
  cargo_alvo: "Técnico",
  dificuldade: "medio" as const,
  status: "draft" as const,
};

describe("questionSchema", () => {
  it("aceita input válido com 5 alternativas A-E", () => {
    const r = questionSchema.safeParse(validInput);
    expect(r.success).toBe(true);
  });

  it("rejeita enunciado curto demais", () => {
    const r = questionSchema.safeParse({ ...validInput, enunciado: "curto" });
    expect(r.success).toBe(false);
  });

  it("rejeita menos de 2 alternativas", () => {
    const r = questionSchema.safeParse({
      ...validInput,
      alternativas: [validInput.alternativas[0]],
    });
    expect(r.success).toBe(false);
  });

  it("rejeita labels não-sequenciais", () => {
    const r = questionSchema.safeParse({
      ...validInput,
      alternativas: [
        { label: "A" as const, text: "x" },
        { label: "C" as const, text: "y" },
      ],
    });
    expect(r.success).toBe(false);
  });

  it("rejeita correct_answer fora das alternativas", () => {
    const r = questionSchema.safeParse({
      ...validInput,
      correct_answer: "F" as const,
    });
    expect(r.success).toBe(false);
  });

  it("rejeita justificativa curta", () => {
    const r = questionSchema.safeParse({ ...validInput, justificativa: "curta" });
    expect(r.success).toBe(false);
  });
});
