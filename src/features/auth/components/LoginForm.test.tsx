import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const signInMock = vi.fn();
const navigateMock = vi.fn();
const toastErrorMock = vi.fn();
const captureExceptionMock = vi.fn();

vi.mock("@/features/auth/api", () => ({
  signIn: (...args: unknown[]) => signInMock(...args),
}));

vi.mock("sonner", () => ({
  toast: { error: (...args: unknown[]) => toastErrorMock(...args) },
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

vi.mock("@sentry/react", () => ({
  captureException: (...args: unknown[]) => captureExceptionMock(...args),
}));

import { LoginForm } from "@/features/auth/components/LoginForm";

function renderForm() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    signInMock.mockReset();
    navigateMock.mockReset();
    toastErrorMock.mockReset();
    captureExceptionMock.mockReset();
  });

  it("submit com credenciais válidas chama signIn e navega", async () => {
    signInMock.mockResolvedValue({ access_token: "tok" });
    renderForm();

    fireEvent.input(screen.getByLabelText(/^e-mail$/i), { target: { value: "user@test.com" } });
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: "Senha123" } });
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }).closest("form")!);

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith({ email: "user@test.com", password: "Senha123" });
      expect(navigateMock).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
  });

  it("erro INVALID_CREDENTIALS exibe mensagem genérica", async () => {
    signInMock.mockRejectedValue(new Error("INVALID_CREDENTIALS"));
    renderForm();

    fireEvent.input(screen.getByLabelText(/^e-mail$/i), { target: { value: "u@t.com" } });
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: "errada" } });
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }).closest("form")!);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("Email ou senha incorretos");
      expect(captureExceptionMock).not.toHaveBeenCalled();
    });
  });

  it("erro RATE_LIMITED exibe mensagem com tempo restante", async () => {
    const err = new Error("RATE_LIMITED") as Error & { retryAfterSeconds?: number };
    err.retryAfterSeconds = 600;
    signInMock.mockRejectedValue(err);
    renderForm();

    fireEvent.input(screen.getByLabelText(/^e-mail$/i), { target: { value: "u@t.com" } });
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: "x" } });
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }).closest("form")!);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        expect.stringContaining("Muitas tentativas")
      );
    });
  });

  it("erro genérico dispara Sentry", async () => {
    signInMock.mockRejectedValue(new Error("Network error"));
    renderForm();

    fireEvent.input(screen.getByLabelText(/^e-mail$/i), { target: { value: "u@t.com" } });
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: "x" } });
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }).closest("form")!);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("Erro ao fazer login. Tente novamente.");
      expect(captureExceptionMock).toHaveBeenCalled();
    });
  });
});
