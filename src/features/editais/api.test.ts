import { describe, it, expect, vi, beforeEach } from "vitest";

const eqMock = vi.fn();
const gteMock = vi.fn();
const lteMock = vi.fn();
const orderMock = vi.fn();
const textSearchMock = vi.fn();
const selectMock = vi.fn();
const fromMock = vi.fn();

const queryBuilder = {
  eq: (...args: unknown[]) => { eqMock(...args); return queryBuilder; },
  gte: (...args: unknown[]) => { gteMock(...args); return queryBuilder; },
  lte: (...args: unknown[]) => { lteMock(...args); return queryBuilder; },
  textSearch: (...args: unknown[]) => { textSearchMock(...args); return queryBuilder; },
  order: (...args: unknown[]) => { orderMock(...args); return queryBuilder; },
  then: (resolve: (v: unknown) => void) => Promise.resolve({ data: [], error: null }).then(resolve),
};

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (...args: unknown[]) => {
      fromMock(...args);
      return {
        select: (...selectArgs: unknown[]) => {
          selectMock(...selectArgs);
          return queryBuilder;
        },
      };
    },
  },
}));

import { fetchPublishedEditais, mapEditalRowToEdital } from "@/features/editais/api";

const sampleRow = {
  id: "uuid-1",
  titulo: "INSS 2025",
  orgao: "INSS",
  banca: "CESPE",
  cargo: "Técnico",
  descricao: null,
  data_prova: "2026-12-15",
  data_inscricao_inicio: "2026-09-01",
  data_inscricao_fim: "2026-09-30",
  slug: "inss-2025-tecnico",
  status: "published" as const,
  published_at: "2026-04-30T00:00:00Z",
  visibility: { type: "public" },
  search_vector: null,
  created_at: "2026-04-30T00:00:00Z",
  updated_at: "2026-04-30T00:00:00Z",
};

describe("mapEditalRowToEdital", () => {
  it("mapeia snake_case → camelCase corretamente", () => {
    const result = mapEditalRowToEdital(sampleRow as never);
    expect(result.dataProva).toBe("2026-12-15");
    expect(result.dataInscricaoInicio).toBe("2026-09-01");
    expect(result.publishedAt).toBe("2026-04-30T00:00:00Z");
    expect(result.visibility).toEqual({ type: "public" });
  });
});

describe("fetchPublishedEditais", () => {
  beforeEach(() => {
    fromMock.mockReset();
    selectMock.mockReset();
    eqMock.mockReset();
    gteMock.mockReset();
    lteMock.mockReset();
    orderMock.mockReset();
    textSearchMock.mockReset();
  });

  it("aplica filtros banca + orgao + ano + q corretamente", async () => {
    await fetchPublishedEditais({
      banca: "CESPE",
      orgao: "INSS",
      ano: 2026,
      q: "tecnico",
    });
    expect(fromMock).toHaveBeenCalledWith("editais");
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(eqMock).toHaveBeenCalledWith("banca", "CESPE");
    expect(eqMock).toHaveBeenCalledWith("orgao", "INSS");
    expect(gteMock).toHaveBeenCalledWith("data_prova", "2026-01-01");
    expect(lteMock).toHaveBeenCalledWith("data_prova", "2026-12-31");
    expect(textSearchMock).toHaveBeenCalledWith("search_vector", "tecnico", {
      type: "websearch",
      config: "portuguese",
    });
    expect(orderMock).toHaveBeenCalledWith("data_prova", {
      ascending: true,
      nullsFirst: false,
    });
  });

  it("não aplica filtros opcionais quando ausentes", async () => {
    await fetchPublishedEditais({});
    expect(eqMock).not.toHaveBeenCalled();
    expect(gteMock).not.toHaveBeenCalled();
    expect(textSearchMock).not.toHaveBeenCalled();
  });

  it("ignora q vazio (após trim)", async () => {
    await fetchPublishedEditais({ q: "   " });
    expect(textSearchMock).not.toHaveBeenCalled();
  });
});
