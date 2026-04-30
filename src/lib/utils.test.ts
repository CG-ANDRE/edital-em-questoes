import { describe, it, expect } from "vitest";
import { cn, formatDateBR, slugify } from "@/lib/utils";

describe("cn (alias smoke test)", () => {
  it("resolves @/lib/utils via path alias", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("merges conflicting tailwind classes", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });
});

describe("formatDateBR", () => {
  it("formata YYYY-MM-DD para DD/MM/YYYY", () => {
    expect(formatDateBR("2026-12-15")).toBe("15/12/2026");
  });

  it("retorna null para input nulo", () => {
    expect(formatDateBR(null)).toBeNull();
    expect(formatDateBR(undefined)).toBeNull();
  });

  it("retorna null para input inválido", () => {
    expect(formatDateBR("nao-e-data")).toBeNull();
  });
});

describe("slugify", () => {
  it("normaliza acentos e converte espaços", () => {
    expect(slugify("Concurso INSS 2026 — Técnico")).toBe("concurso-inss-2026-tecnico");
  });

  it("remove múltiplos hífens", () => {
    expect(slugify("a---b   c")).toBe("a-b-c");
  });

  it("trata string vazia", () => {
    expect(slugify("")).toBe("");
  });

  it("remove hífens nas pontas", () => {
    expect(slugify("---abc---")).toBe("abc");
  });
});
