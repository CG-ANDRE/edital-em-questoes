import { describe, it, expect, vi } from "vitest";
import * as Sentry from "@sentry/react";

vi.mock("@sentry/react", () => ({ init: vi.fn() }));
vi.mock("@/lib/env", () => ({
  env: { VITE_SENTRY_DSN: undefined, MODE: "test" as const },
}));

import { initSentry } from "@/lib/sentry";

describe("initSentry", () => {
  it("does not call Sentry.init when DSN is absent", () => {
    initSentry();
    expect(Sentry.init).not.toHaveBeenCalled();
  });
});
