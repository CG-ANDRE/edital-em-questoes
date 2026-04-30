import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreHorizontal, Plus } from "lucide-react";

import {
  fetchAdminQuestions,
  publishQuestion,
  archiveQuestion,
  type QuestionListFilters,
  type QuestionStatus,
} from "@/features/admin/questions/api";
import { QuestionStatusBadge } from "@/features/admin/questions/components/QuestionStatusBadge";
import { useSession } from "@/features/auth/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function AdminQuestionsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id ?? "";
  const [filters, setFilters] = useState<QuestionListFilters>({ status: "all" });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "questions", filters],
    queryFn: () => fetchAdminQuestions(filters),
  });

  const publishMut = useMutation({
    mutationFn: (id: string) => publishQuestion(id, userId),
    onSuccess: () => {
      toast.success("Questão publicada");
      qc.invalidateQueries({ queryKey: ["admin", "questions"] });
    },
    onError: () => toast.error("Falha ao publicar"),
  });

  const archiveMut = useMutation({
    mutationFn: (id: string) => archiveQuestion(id, userId),
    onSuccess: () => {
      toast.success("Questão arquivada");
      qc.invalidateQueries({ queryKey: ["admin", "questions"] });
    },
    onError: () => toast.error("Falha ao arquivar"),
  });

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Banco de Questões</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as questões disponíveis para os usuários.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/questions/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova questão
          </Link>
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <Tabs
          value={filters.status ?? "all"}
          onValueChange={(v) =>
            setFilters((f) => ({ ...f, status: v as QuestionStatus | "all" }))
          }
        >
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="draft">Rascunho</TabsTrigger>
            <TabsTrigger value="published">Publicada</TabsTrigger>
            <TabsTrigger value="archived">Arquivada</TabsTrigger>
          </TabsList>
        </Tabs>

        <Input
          type="search"
          placeholder="Buscar..."
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
              <TableHead>Enunciado</TableHead>
              <TableHead>Matéria</TableHead>
              <TableHead>Dificuldade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhuma questão encontrada.
                </TableCell>
              </TableRow>
            )}
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="max-w-md truncate">{row.enunciado}</TableCell>
                <TableCell>{row.materia}</TableCell>
                <TableCell className="capitalize">{row.dificuldade}</TableCell>
                <TableCell>
                  <QuestionStatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Ações">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`/admin/questions/${row.id}/editar`)}
                      >
                        Editar
                      </DropdownMenuItem>
                      {row.status !== "published" && row.status !== "archived" && (
                        <DropdownMenuItem onClick={() => publishMut.mutate(row.id)}>
                          Publicar
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
