import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/features/auth/hooks/useSession";
import { fetchProfile } from "@/features/settings/api";

export const profileQueryKey = (userId: string) => ["user", "profile", userId] as const;

export function useProfile() {
  const { session } = useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: userId ? profileQueryKey(userId) : ["user", "profile", "anonymous"],
    queryFn: () => {
      if (!userId) throw new Error("Não autenticado");
      return fetchProfile(userId);
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}
