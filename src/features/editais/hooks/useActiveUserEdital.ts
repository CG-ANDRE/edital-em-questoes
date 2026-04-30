import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/features/auth/hooks/useSession";
import { fetchActiveUserEdital } from "@/features/editais/api";

export const activeUserEditalQueryKey = (userId: string) =>
  ["user", userId, "activeEdital"] as const;

export function useActiveUserEdital() {
  const { session } = useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: userId
      ? activeUserEditalQueryKey(userId)
      : ["user", "anonymous", "activeEdital"],
    queryFn: () => {
      if (!userId) throw new Error("Não autenticado");
      return fetchActiveUserEdital(userId);
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}
