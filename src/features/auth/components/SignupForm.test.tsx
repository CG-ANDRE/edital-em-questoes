import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const signUpMock = vi.fn();
const navigateMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();
const captureExceptionMock = vi.fn();

vi.mock("@/features/auth/api", () => ({
  signUp: (...args: unknown[]) => signUpMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("@sentry/react", () => ({
  captureException: (...args: unknown[]) => captureExceptionMock(...args),
}));

import { SignupForm } from "@/features/auth/components/SignupForm";

function renderForm() {
  return render(
    <MemoryRouter>
      <SignupForm />
    </MemoryRouter>
  );
}

describe("SignupForm", () => {
  beforeEach(() => {
    signUpMock.mockReset();
    navigateMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
    captureExceptionMock.mockReset();
  });

  it("botão Criar conta começa desabilitado", () => {
    renderForm();
    const button = screen.getByRole("button", { name: /criar conta/i });
    expect(button).toBeDisabled();
  });

  it("botão habilita quando checkbox é marcado", () => {
    renderForm();
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    const button = screen.getByRole("button", { name: /criar conta/i });
    expect(button).not.toBeDisabled();
  });

  it("happy path: dispara toast de sucesso e navega para /login", async () => {
    signUpMock.mockResolvedValue({ userId: "u-1", requiresEmailConfirmation: true });
    renderForm();

    fireEvent.input(screen.getByLabelText(/nome completo/i), { target: { value: "Maria" } });
    fireEvent.input(screen.getByLabelText(/^e-mail$/i), { target: { value: "maria@test.com" } });
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: "Senha123" } });
    fireEvent.input(screen.getByLabelText(/confirmar senha/i), { target: { value: "Senha123" } });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.submit(screen.getByRole("button", { name: /criar conta/i }).closest("form")!);

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });

  it("erro 'already registered' exibe mensagem PT-BR", async () => {
    signUpMock.mockRejectedValue(new Error("User already registered"));
    renderForm();

    fireEvent.input(screen.getByLabelText(/nome completo/i), { target: { value: "Maria" } });
    fireEvent.input(screen.getByLabelText(/^e-mail$/i), { target: { value: "maria@test.com" } });
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: "Senha123" } });
    fireEvent.input(screen.getByLabelText(/confirmar senha/i), { target: { value: "Senha123" } });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.submit(screen.getByRole("button", { name: /criar conta/i }).closest("form")!);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        expect.stringContaining("Esse e-mail já possui cadastro")
      );
      expect(captureExceptionMock).not.toHaveBeenCalled();
    });
  });

  it("erro genérico dispara toast + Sentry", async () => {
    signUpMock.mockRejectedValue(new Error("Network error"));
    renderForm();

    fireEvent.input(screen.getByLabelText(/nome completo/i), { target: { value: "Maria" } });
    fireEvent.input(screen.getByLabelText(/^e-mail$/i), { target: { value: "maria@test.com" } });
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: "Senha123" } });
    fireEvent.input(screen.getByLabelText(/confirmar senha/i), { target: { value: "Senha123" } });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.submit(screen.getByRole("button", { name: /criar conta/i }).closest("form")!);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("Erro ao criar conta. Tente novamente.");
      expect(captureExceptionMock).toHaveBeenCalled();
    });
  });
});
