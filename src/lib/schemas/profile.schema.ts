import { z } from "zod";

export const profileUpdateSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Mínimo 2 caracteres")
      .max(100, "Máximo 100 caracteres"),
    target_concurso: z.string().trim().max(200).optional().or(z.literal("")),
    study_goal: z.string().trim().max(1000).optional().or(z.literal("")),
    exam_date: z
      .string()
      .optional()
      .nullable()
      .refine(
        (v) => {
          if (!v) return true;
          const d = new Date(v);
          return !isNaN(d.getTime());
        },
        { message: "Data inválida" }
      ),
  });

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
