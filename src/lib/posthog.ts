import posthog from "posthog-js";
import { env } from "@/lib/env";

export function initPostHog() {
  if (!env.VITE_POSTHOG_KEY || !env.VITE_POSTHOG_HOST) return;
  posthog.init(env.VITE_POSTHOG_KEY, {
    api_host: env.VITE_POSTHOG_HOST,
    capture_pageview: true,
  });
}

export { posthog };
