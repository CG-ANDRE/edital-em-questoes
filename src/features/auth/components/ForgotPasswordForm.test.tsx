import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const requestPasswordResetMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();
const captureMock = vi.fn();

vi.mock("@/features/auth/api", () => ({
  requestPasswordReset: (...args: unknown[]) => requestPasswordResetMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

vi.mock("@/lib/posthog", () => ({
  posthog: { capture: (...args: unknown[]) => captureMock(...args) },
}));

import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

function renderForm() {
  return render(
    <MemoryRouter>
      <ForgotPasswordForm />
    </MemoryRouter>
  );
}

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    requestPasswordResetMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
    captureMock.mockReset();
  });

  it("submit com email válido chama requestPasswordReset e mostra toast genérico", async () => {
    requestPasswordResetMock.mockResolvedValue(undefined);
    renderForm();

    fireEvent.input(screen.getByLabelText(/^e-mail$/i), { target: { value: "user@test.com" } });
    fireEvent.submit(screen.getByRole("button", { name: /enviar instruções/i }).closest("form")!);

    await waitFor(() => {
      expect(requestPasswordResetMock).toHaveBeenCalledWith("user@test.com");
      expect(toastSuccessMock).toHaveBeenCalledWith(
        expect.stringContaining("Se o email existir em nossa base")
      );
      expect(captureMock).toHaveBeenCalledWith("password_reset:requested", expect.any(Object));
    });
  });

  it("erro técnico exibe toast de erro distinto", async () => {
    requestPasswordResetMock.mockRejectedValue(new Error("Server down"));
    renderForm();

    fireEvent.input(screen.getByLabelText(/^e-mail$/i), { target: { value: "user@test.com" } });
    fireEvent.submit(screen.getByRole("button", { name: /enviar instruções/i }).closest("form")!);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        expect.stringContaining("Não foi possível enviar")
      );
    });
  });
});
