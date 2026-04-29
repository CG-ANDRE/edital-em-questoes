import { describe, it, expect, vi } from "vitest";
import posthog from "posthog-js";

vi.mock("posthog-js", () => ({ default: { init: vi.fn() } }));
vi.mock("@/lib/env", () => ({
  env: { VITE_POSTHOG_KEY: undefined, VITE_POSTHOG_HOST: undefined },
}));

import { initPostHog } from "@/lib/posthog";

describe("initPostHog", () => {
  it("does not call posthog.init when key is absent", () => {
    initPostHog();
    expect(posthog.init).not.toHaveBeenCalled();
  });
});
