import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export const sessionQueryKey = ["auth", "session"] as const;

export function useSession() {
  const queryClient = useQueryClient();

  const query = useQuery<Session | null>({
    queryKey: sessionQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(sessionQueryKey, session);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    session: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
  };
}
