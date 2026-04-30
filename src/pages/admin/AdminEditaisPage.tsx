import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreHorizontal, Plus } from "lucide-react";

import {
  fetchAdminEditais,
  publishEdital,
  archiveEdital,
  unpublishEdital,
  type AdminEditalListFilters,
} from "@/features/admin/editais/api";
import { StatusBadge } from "@/features/admin/editais/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateBR } from "@/lib/utils";
import type { EditalStatus } from "@/features/editais/types";

export default function AdminEditaisPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [filters, setFilters] = useState<AdminEditalListFilters>({ status: "all" });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "editais", filters],
    queryFn: () => fetchAdminEditais(filters),
  });

  const publishMut = useMutation({
    mutationFn: publishEdital,
    onSuccess: () => {
      toast.success("Edital publicado");
      qc.invalidateQueries({ queryKey: ["admin", "editais"] });
      qc.invalidateQueries({ queryKey: ["editais"] });
    },
    onError: () => toast.error("Falha ao publicar"),
  });

  const archiveMut = useMutation({
    mutationFn: archiveEdital,
    onSuccess: () => {
      toast.success("Edital arquivado");
      qc.invalidateQueries({ queryKey: ["admin", "editais"] });
    },
    onError: () => toast.error("Falha ao arquivar"),
  });

  const unpublishMut = useMutation({
    mutationFn: unpublishEdital,
    onSuccess: () => {
      toast.success("Edital despublicado");
      qc.invalidateQueries({ queryKey: ["admin", "editais"] });
    },
    onError: () => toast.error("Falha ao despublicar"),
  });

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Editais</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie o catálogo de editais publicados.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/editais/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo edital
          </Link>
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <Tabs
          value={filters.status ?? "all"}
          onValueChange={(v) =>
            setFilters((f) => ({ ...f, status: v as EditalStatus | "all" }))
          }
        >
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="draft">Rascunho</TabsTrigger>
            <TabsTrigger value="scheduled">Agendado</TabsTrigger>
            <TabsTrigger value="published">Publicado</TabsTrigger>
            <TabsTrigger value="archived">Arquivado</TabsTrigger>
          </TabsList>
        </Tabs>

        <Input
          type="search"
          placeholder="Buscar por título..."
          className="md:max-w-xs"
          value={filters.q ?? ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, q: e.target.value || undefined }))
          }
        />
      </div>

      {isLoading && <Skeleton className="h-64 w-full" />}

      {!isLoading && data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Banca</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data prova</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum edital encontrado.
                </TableCell>
              </TableRow>
            )}
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.titulo}</TableCell>
                <TableCell>{row.banca}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell>{formatDateBR(row.data_prova) ?? "—"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Ações">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`/admin/editais/${row.id}/editar`)}
                      >
                        Editar
                      </DropdownMenuItem>
                      {row.status !== "published" && row.status !== "archived" && (
                        <DropdownMenuItem onClick={() => publishMut.mutate(row.id)}>
                          Publicar
                        </DropdownMenuItem>
                      )}
                      {row.status === "published" && (
                        <DropdownMenuItem onClick={() => unpublishMut.mutate(row.id)}>
                          Despublicar
                        </DropdownMenuItem>
                      )}
                      {row.status !== "archived" && (
                        <DropdownMenuItem onClick={() => archiveMut.mutate(row.id)}>
                          Arquivar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
