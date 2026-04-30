import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const useSessionMock = vi.fn();

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: () => useSessionMock(),
}));

import { RequireAuth } from "@/components/RequireAuth";

function renderProtected(initialPath = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <div>Protected Content</div>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("RequireAuth", () => {
  it("não renderiza children nem redireciona enquanto isLoading", () => {
    useSessionMock.mockReturnValue({ isLoading: true, isAuthenticated: false, session: null });
    renderProtected();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("redireciona para /login quando não autenticado", () => {
    useSessionMock.mockReturnValue({ isLoading: false, isAuthenticated: false, session: null });
    renderProtected();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renderiza children quando autenticado", () => {
    useSessionMock.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      session: { access_token: "tok" },
    });
    renderProtected();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
