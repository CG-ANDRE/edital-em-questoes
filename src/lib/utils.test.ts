import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (alias smoke test)", () => {
  it("resolves @/lib/utils via path alias", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("merges conflicting tailwind classes", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });
});
