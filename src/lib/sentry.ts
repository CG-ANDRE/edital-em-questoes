import * as Sentry from "@sentry/react";
import { env } from "@/lib/env";

export function initSentry() {
  if (!env.VITE_SENTRY_DSN) return;
  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    environment: env.MODE,
    tracesSampleRate: env.MODE === "production" ? 0.1 : 1.0,
  });
}
