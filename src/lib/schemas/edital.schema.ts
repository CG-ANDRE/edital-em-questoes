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

const optionalDate = z
  .string()
  .optional()
  .nullable()
  .transform((v) => (v === "" ? null : v ?? null));

export const editalCreateSchema = z
  .object({
    titulo: z.string().trim().min(5, "Mínimo 5 caracteres").max(200),
    slug: z.string().regex(/^[a-z0-9-]{3,100}$/, "Slug inválido (use a-z, 0-9, hífen, 3-100 chars)"),
    banca: z.string().min(2, "Informe a banca").max(80),
    cargo: z.string().trim().min(2, "Informe o cargo").max(120),
    orgao: z.string().trim().min(2, "Informe o órgão").max(120),
    descricao: optionalDate,
    data_prova: optionalDate,
    data_inscricao_inicio: optionalDate,
    data_inscricao_fim: optionalDate,
    status: z.enum(["draft", "scheduled", "published", "archived"]),
  })
  .superRefine((data, ctx) => {
    if (
      data.data_inscricao_inicio &&
      data.data_inscricao_fim &&
      data.data_inscricao_fim < data.data_inscricao_inicio
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["data_inscricao_fim"],
        message: "Fim das inscrições não pode ser antes do início",
      });
    }
  });

export type EditalCreateInputForm = z.infer<typeof editalCreateSchema>;
