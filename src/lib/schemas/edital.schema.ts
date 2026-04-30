import { z } from "zod";

const isPastDate = (s: string | undefined | null) => {
  if (!s) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return false;
  return new Date(y, m - 1, d) < today;
};

export const selectEditalDatesSchema = z
  .object({
    data_inscricao: z
      .string()
      .optional()
      .nullable()
      .transform((v) => (v === "" ? null : v ?? null)),
    data_prova: z
      .string()
      .optional()
      .nullable()
      .transform((v) => (v === "" ? null : v ?? null)),
  })
  .superRefine((data, ctx) => {
    if (data.data_inscricao && isPastDate(data.data_inscricao)) {
      ctx.addIssue({
        code: "custom",
        path: ["data_inscricao"],
        message: "Data de inscrição deve ser hoje ou no futuro",
      });
    }
    if (data.data_prova && isPastDate(data.data_prova)) {
      ctx.addIssue({
        code: "custom",
        path: ["data_prova"],
        message: "Data da prova deve ser hoje ou no futuro",
      });
    }
    if (
      data.data_inscricao &&
      data.data_prova &&
      data.data_prova < data.data_inscricao
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["data_prova"],
        message: "Data da prova não pode ser anterior à inscrição",
      });
    }
  });

export type SelectEditalDatesInput = z.infer<typeof selectEditalDatesSchema>;
