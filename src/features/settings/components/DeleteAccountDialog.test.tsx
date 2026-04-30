import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const deleteAccountMock = vi.fn();
const navigateMock = vi.fn();
const signOutMock = vi.fn();

vi.mock("@/features/settings/api", () => ({
  deleteAccount: (...args: unknown[]) => deleteAccountMock(...args),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: { auth: { signOut: (...args: unknown[]) => signOutMock(...args) } },
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));

import { DeleteAccountDialog } from "@/features/settings/components/DeleteAccountDialog";

function renderDialog() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <DeleteAccountDialog />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("DeleteAccountDialog", () => {
  beforeEach(() => {
    deleteAccountMock.mockReset();
    navigateMock.mockReset();
    signOutMock.mockReset();
    signOutMock.mockResolvedValue(undefined);
  });

  it("botão de confirmação fica disabled sem senha + frase", async () => {
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: /excluir minha conta/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/senha atual/i)).toBeInTheDocument();
    });

    const confirmBtn = screen.getByRole("button", { name: /excluir definitivamente/i });
    expect(confirmBtn).toBeDisabled();
  });

  it("habilita após senha + frase exata", async () => {
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: /excluir minha conta/i }));

    await waitFor(() => screen.getByLabelText(/senha atual/i));
    fireEvent.change(screen.getByLabelText(/senha atual/i), { target: { value: "abc" } });
    fireEvent.change(
      screen.getByLabelText(/digite/i),
      { target: { value: "EXCLUIR MINHA CONTA" } }
    );

    expect(screen.getByRole("button", { name: /excluir definitivamente/i })).not.toBeDisabled();
  });

  it("happy path chama deleteAccount + signOut + navigate", async () => {
    deleteAccountMock.mockResolvedValue(undefined);
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: /excluir minha conta/i }));
    await waitFor(() => screen.getByLabelText(/senha atual/i));
    fireEvent.change(screen.getByLabelText(/senha atual/i), { target: { value: "Senha123" } });
    fireEvent.change(screen.getByLabelText(/digite/i), { target: { value: "EXCLUIR MINHA CONTA" } });
    fireEvent.click(screen.getByRole("button", { name: /excluir definitivamente/i }));

    await waitFor(() => {
      expect(deleteAccountMock).toHaveBeenCalledWith("Senha123");
      expect(signOutMock).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith("/login?account_deleted=1", {
        replace: true,
      });
    });
  });

  it("REAUTH_FAILED exibe erro inline e mantém dialog aberto", async () => {
    deleteAccountMock.mockRejectedValue(new Error("REAUTH_FAILED"));
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: /excluir minha conta/i }));
    await waitFor(() => screen.getByLabelText(/senha atual/i));
    fireEvent.change(screen.getByLabelText(/senha atual/i), { target: { value: "errada" } });
    fireEvent.change(screen.getByLabelText(/digite/i), { target: { value: "EXCLUIR MINHA CONTA" } });
    fireEvent.click(screen.getByRole("button", { name: /excluir definitivamente/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toMatch(/Senha incorreta/i);
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});
