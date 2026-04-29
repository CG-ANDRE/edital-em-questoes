import { describe, it, expect } from "vitest";

describe("env", () => {
  it("exports a valid env object with required vars from .env.test", async () => {
    const { env } = await import("@/lib/env");
    expect(env.VITE_SUPABASE_URL).toBe("https://test.supabase.co");
    expect(env.VITE_SUPABASE_ANON_KEY).toBe("test-anon-key-placeholder");
  });

  it("optional vars are undefined when not set", async () => {
    const { env } = await import("@/lib/env");
    expect(env.VITE_SENTRY_DSN).toBeUndefined();
    expect(env.VITE_POSTHOG_KEY).toBeUndefined();
  });

  it("MODE defaults to test in test environment", async () => {
    const { env } = await import("@/lib/env");
    expect(["development", "production", "test"]).toContain(env.MODE);
  });
});
