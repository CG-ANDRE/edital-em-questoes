import { z } from "zod";

export const reportReasonEnum = z.enum([
  "gabarito_incorreto",
  "enunciado_ambiguo",
  "outro",
]);
export type ReportReason = z.infer<typeof reportReasonEnum>;

export const createQuestionReportSchema = z
  .object({
    questionId: z.string().uuid(),
    reason: reportReasonEnum,
    comment: z.string().trim().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.reason === "outro" && (!data.comment || data.comment.length < 10)) {
      ctx.addIssue({
        code: "custom",
        path: ["comment"],
        message: "Descreva o problema (mínimo 10 caracteres)",
      });
    }
  });

export type CreateQuestionReportInput = z.infer<typeof createQuestionReportSchema>;
