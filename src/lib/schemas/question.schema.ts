import { z } from "zod";

export const QUESTION_LABELS = ["A", "B", "C", "D", "E", "F"] as const;
export type QuestionLabel = (typeof QUESTION_LABELS)[number];

export const questionAlternativaSchema = z.object({
  label: z.enum(QUESTION_LABELS),
  text: z.string().trim().min(1, "Texto da alternativa obrigatório").max(1000),
});

export const questionDificuldadeSchema = z.enum(["facil", "medio", "dificil"]);
export const questionStatusSchema = z.enum([
  "draft",
  "published",
  "archived",
  "pending_review",
]);

export const questionSchema = z
  .object({
    enunciado: z
      .string()
      .trim()
      .min(10, "Enunciado precisa ter ao menos 10 caracteres")
      .max(5000, "Máximo 5000 caracteres"),
    alternativas: z
      .array(questionAlternativaSchema)
      .min(2, "Mínimo 2 alternativas")
      .max(6, "Máximo 6 alternativas"),
    correct_answer: z
      .enum(QUESTION_LABELS, { errorMap: () => ({ message: "Selecione a alternativa correta" }) }),
    justificativa: z
      .string()
      .trim()
      .min(10, "Justificativa precisa ter ao menos 10 caracteres"),
    materia: z.string().trim().min(1, "Informe a matéria").max(120),
    banca: z.string().trim().max(120).optional().or(z.literal("")),
    cargo_alvo: z.string().trim().max(120).optional().or(z.literal("")),
    dificuldade: questionDificuldadeSchema,
    status: questionStatusSchema.default("draft"),
    change_reason: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // Labels devem ser sequenciais começando em A
    const labels = data.alternativas.map((a) => a.label);
    const expected = QUESTION_LABELS.slice(0, labels.length);
    if (JSON.stringify(labels) !== JSON.stringify(expected)) {
      ctx.addIssue({
        code: "custom",
        path: ["alternativas"],
        message: "Labels devem ser sequenciais começando em A (A, B, C...)",
      });
    }

    // Labels únicos
    if (new Set(labels).size !== labels.length) {
      ctx.addIssue({
        code: "custom",
        path: ["alternativas"],
        message: "Labels duplicados não são permitidos",
      });
    }

    // correct_answer deve existir entre as alternativas
    if (!labels.includes(data.correct_answer)) {
      ctx.addIssue({
        code: "custom",
        path: ["correct_answer"],
        message: "Alternativa correta não corresponde a nenhuma das listadas",
      });
    }
  });

export type QuestionInput = z.infer<typeof questionSchema>;
