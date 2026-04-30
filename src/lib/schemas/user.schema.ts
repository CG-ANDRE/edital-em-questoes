import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres com letras e números")
  .regex(/(?=.*[A-Za-z])(?=.*\d)/, "A senha deve conter letras e números");

export const signupSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome").max(80),
    email: z.string().email("E-mail inválido"),
    password: passwordSchema,
    passwordConfirmation: z.string(),
    consentAccepted: z.literal(true, {
      errorMap: () => ({ message: "Você deve aceitar os termos para continuar" }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "As senhas não coincidem",
  });

export type SignupInput = z.infer<typeof signupSchema>;
