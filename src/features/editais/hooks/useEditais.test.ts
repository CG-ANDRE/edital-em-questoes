import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";

const fetchMock = vi.fn();
vi.mock("@/features/editais/api", () => ({
  fetchPublishedEditais: (...args: unknown[]) => fetchMock(...args),
}));

import { useEditais } from "@/features/editais/hooks/useEditais";

function wrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
}

describe("useEditais", () => {
  it("dispara fetchPublishedEditais com filtros e expõe data", async () => {
    fetchMock.mockResolvedValue([{ id: "u-1", titulo: "X" }]);
    const { result } = renderHook(() => useEditais({ banca: "CESPE" }), {
      wrapper: wrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchMock).toHaveBeenCalledWith({ banca: "CESPE" });
    expect(result.current.data).toHaveLength(1);
  });
});
