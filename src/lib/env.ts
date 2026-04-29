import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_SENTRY_DSN: z.string().url().optional(),
  VITE_POSTHOG_KEY: z.string().min(1).optional(),
  VITE_POSTHOG_HOST: z.string().url().optional(),
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
