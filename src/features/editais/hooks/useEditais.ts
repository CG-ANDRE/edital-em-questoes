import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPublishedEditais } from "../api";
import type { EditalListFilters } from "../types";

export function useEditais(filters: EditalListFilters) {
  return useQuery({
    queryKey: ["editais", "list", filters] as const,
    queryFn: () => fetchPublishedEditais(filters),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}
