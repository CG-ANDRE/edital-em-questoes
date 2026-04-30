import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const updatePasswordMock = vi.fn();
const navigateMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock("@/features/auth/api", () => ({
  updatePassword: (...args: unknown[]) => updatePasswordMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

vi.mock("@/lib/posthog", () => ({ posthog: { capture: vi.fn() } }));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

function renderForm() {
  return render(
    <MemoryRouter>
      <ResetPasswordForm />
    </MemoryRouter>
  );
}

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    updatePasswordMock.mockReset();
    navigateMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  it("submit happy path chama updatePassword e navega para /dashboard", async () => {
    updatePasswordMock.mockResolvedValue(undefined);
    renderForm();

    fireEvent.input(screen.getByLabelText(/^nova senha$/i), { target: { value: "Senha123" } });
    fireEvent.input(screen.getByLabelText(/^confirmar senha$/i), { target: { value: "Senha123" } });
    fireEvent.submit(screen.getByRole("button", { name: /redefinir senha/i }).closest("form")!);

    await waitFor(() => {
      expect(updatePasswordMock).toHaveBeenCalledWith("Senha123");
      expect(toastSuccessMock).toHaveBeenCalledWith("Senha alterada com sucesso");
      expect(navigateMock).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
  });

  it("erro do updatePassword exibe toast de falha", async () => {
    updatePasswordMock.mockRejectedValue(new Error("network"));
    renderForm();

    fireEvent.input(screen.getByLabelText(/^nova senha$/i), { target: { value: "Senha123" } });
    fireEvent.input(screen.getByLabelText(/^confirmar senha$/i), { target: { value: "Senha123" } });
    fireEvent.submit(screen.getByRole("button", { name: /redefinir senha/i }).closest("form")!);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        expect.stringContaining("Não foi possível redefinir")
      );
    });
  });
});
