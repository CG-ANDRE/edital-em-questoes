import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";

const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();
const unsubscribeMock = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => getSessionMock(...args),
      onAuthStateChange: (...args: unknown[]) => onAuthStateChangeMock(...args),
    },
  },
}));

import { useSession } from "@/features/auth/hooks/useSession";

function wrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useSession", () => {
  beforeEach(() => {
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
    unsubscribeMock.mockReset();
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    });
  });

  it("retorna session null quando getSession retorna null", async () => {
    getSessionMock.mockResolvedValue({ data: { session: null }, error: null });
    const { result } = renderHook(() => useSession(), { wrapper: wrapper() });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.session).toBeNull();
  });

  it("retorna isAuthenticated=true quando há session", async () => {
    getSessionMock.mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });
    const { result } = renderHook(() => useSession(), { wrapper: wrapper() });
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it("cleanup chama unsubscribe", async () => {
    getSessionMock.mockResolvedValue({ data: { session: null }, error: null });
    const { unmount } = renderHook(() => useSession(), { wrapper: wrapper() });
    await waitFor(() => expect(onAuthStateChangeMock).toHaveBeenCalled());
    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
