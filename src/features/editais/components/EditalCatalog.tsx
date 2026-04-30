import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

import { useEditais } from "@/features/editais/hooks/useEditais";
import { EditalCard } from "@/features/editais/components/EditalCard";
import { FilterBar } from "@/features/editais/components/FilterBar";
import type { EditalListFilters } from "@/features/editais/types";

function paramsToFilters(params: URLSearchParams): EditalListFilters {
  const banca = params.get("banca") ?? undefined;
  const orgao = params.get("orgao") ?? undefined;
  const anoStr = params.get("ano");
  const q = params.get("q")?.trim() || undefined;
  const ano = anoStr ? Number(anoStr) : undefined;
  return {
    banca,
    orgao,
    ano: ano && !Number.isNaN(ano) ? ano : undefined,
    q,
  };
}

export function EditalCatalog() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => paramsToFilters(params), [params]);
  const { data, isLoading, isFetching, isError, refetch } = useEditais(filters);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bancas = useMemo(
    () => Array.from(new Set((data ?? []).map((e) => e.banca))).sort(),
    [data]
  );
  const orgaos = useMemo(
    () => Array.from(new Set((data ?? []).map((e) => e.orgao))).sort(),
    [data]
  );

  const clearFilters = () => setParams(new URLSearchParams(), { replace: true });

  return (
    <>
      <FilterBar bancas={bancas} orgaos={orgaos} isFetching={isFetching} />

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <Card className="p-6 text-center space-y-3">
          <p className="text-sm text-destructive">
            Não foi possível carregar os editais.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Tentar novamente
          </Button>
        </Card>
      )}

      {!isLoading && !isError && data && data.length === 0 && (
        <Card className="p-8 text-center space-y-4">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
          <div>
            <p className="font-medium">Nenhum edital encontrado</p>
            <p className="text-sm text-muted-foreground">
              Tente ajustar ou limpar os filtros.
            </p>
          </div>
          <Button onClick={clearFilters} variant="outline">
            Limpar filtros
          </Button>
        </Card>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((edital) => (
            <EditalCard
              key={edital.id}
              edital={edital}
              isFavorited={favoritedIds.has(edital.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </>
  );
}
