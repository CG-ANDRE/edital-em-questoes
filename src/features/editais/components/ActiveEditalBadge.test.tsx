import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const useActiveMock = vi.fn();
vi.mock("@/features/editais/hooks/useActiveUserEdital", () => ({
  useActiveUserEdital: () => useActiveMock(),
}));

import { ActiveEditalBadge } from "@/features/editais/components/ActiveEditalBadge";

describe("ActiveEditalBadge", () => {
  it("retorna null quando não há edital ativo", () => {
    useActiveMock.mockReturnValue({ data: null });
    const { container } = render(<ActiveEditalBadge />);
    expect(container.firstChild).toBeNull();
  });

  it("renderiza nome do edital quando ativo", () => {
    useActiveMock.mockReturnValue({
      data: {
        edital_id: "e-1",
        data_prova: null,
        editais: { id: "e-1", titulo: "INSS 2026", orgao: "INSS", banca: "CESPE" },
      },
    });
    render(<ActiveEditalBadge />);
    expect(screen.getByText("INSS 2026")).toBeInTheDocument();
  });

  it("renderiza dias até prova quando data futura", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const iso = futureDate.toISOString().slice(0, 10);
    useActiveMock.mockReturnValue({
      data: {
        edital_id: "e-1",
        data_prova: iso,
        editais: { id: "e-1", titulo: "TJSC", orgao: "TJSC", banca: "FGV" },
      },
    });
    render(<ActiveEditalBadge />);
    expect(screen.getByText(/30d até prova/)).toBeInTheDocument();
  });
});
