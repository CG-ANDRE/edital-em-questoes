import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const exportDataMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();
const captureMock = vi.fn();

vi.mock("@/features/settings/api", () => ({
  exportData: (...args: unknown[]) => exportDataMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

vi.mock("@sentry/react", () => ({
  captureException: (...args: unknown[]) => captureMock(...args),
}));

import { DSRPanel } from "@/features/settings/components/DSRPanel";

describe("DSRPanel", () => {
  beforeEach(() => {
    exportDataMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
    captureMock.mockReset();
  });

  it("clique chama exportData e mostra toast success", async () => {
    exportDataMock.mockResolvedValue(undefined);
    render(<DSRPanel />);

    fireEvent.click(screen.getByRole("button", { name: /exportar meus dados/i }));

    await waitFor(() => {
      expect(exportDataMock).toHaveBeenCalled();
      expect(toastSuccessMock).toHaveBeenCalledWith(
        expect.stringContaining("baixados com sucesso")
      );
    });
  });

  it("erro RATE_LIMIT_EXCEEDED exibe mensagem específica", async () => {
    exportDataMock.mockRejectedValue(new Error("RATE_LIMIT_EXCEEDED"));
    render(<DSRPanel />);

    fireEvent.click(screen.getByRole("button", { name: /exportar meus dados/i }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        expect.stringContaining("3 vezes nos últimos 30 dias")
      );
      expect(captureMock).not.toHaveBeenCalled();
    });
  });

  it("erro genérico dispara Sentry", async () => {
    exportDataMock.mockRejectedValue(new Error("Network"));
    render(<DSRPanel />);

    fireEvent.click(screen.getByRole("button", { name: /exportar meus dados/i }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        expect.stringContaining("Não foi possível exportar")
      );
      expect(captureMock).toHaveBeenCalled();
    });
  });
});
