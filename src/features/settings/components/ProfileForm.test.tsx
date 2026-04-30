import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const updateProfileMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock("@/features/settings/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/settings/api")>();
  return { ...actual, updateProfile: (...args: unknown[]) => updateProfileMock(...args) };
});

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));

import { ProfileForm } from "@/features/settings/components/ProfileForm";

const profile = {
  id: "u-1",
  email: "u@test.com",
  full_name: "Maria",
  target_concurso: "TJSC 2026",
  study_goal: "2h/dia",
  exam_date: "2027-01-15",
};

function renderForm() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ProfileForm profile={profile} />
    </QueryClientProvider>
  );
}

describe("ProfileForm", () => {
  beforeEach(() => {
    updateProfileMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  it("botão Salvar começa desabilitado (form não dirty)", () => {
    renderForm();
    expect(screen.getByRole("button", { name: /salvar/i })).toBeDisabled();
  });

  it("submit happy path chama updateProfile e mostra toast", async () => {
    updateProfileMock.mockResolvedValue(undefined);
    renderForm();

    fireEvent.input(screen.getByLabelText(/nome completo/i), { target: { value: "Maria Silva" } });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /salvar/i })).not.toBeDisabled()
    );
    fireEvent.submit(screen.getByRole("button", { name: /salvar/i }).closest("form")!);

    await waitFor(() => {
      expect(updateProfileMock).toHaveBeenCalledWith(
        "u-1",
        expect.objectContaining({ full_name: "Maria Silva" })
      );
      expect(toastSuccessMock).toHaveBeenCalledWith("Perfil atualizado");
    });
  });

  it("erro do updateProfile exibe toast de falha", async () => {
    updateProfileMock.mockRejectedValue(new Error("DB error"));
    renderForm();

    fireEvent.input(screen.getByLabelText(/nome completo/i), { target: { value: "Outro Nome" } });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /salvar/i })).not.toBeDisabled()
    );
    fireEvent.submit(screen.getByRole("button", { name: /salvar/i }).closest("form")!);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        expect.stringContaining("Não foi possível salvar")
      );
    });
  });
});
