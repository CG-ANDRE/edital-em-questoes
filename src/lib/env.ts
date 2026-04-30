import { z } from "zod";

const optionalString = (schema: z.ZodString) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_SENTRY_DSN: optionalString(z.string().url()),
  VITE_POSTHOG_KEY: optionalString(z.string().min(1)),
  VITE_POSTHOG_HOST: optionalString(z.string().url()),
  MODE: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Variáveis de ambiente inválidas ou ausentes:\n${missing}`);
}

export const env = parsed.data;
