import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminQuestions, type AdminQuestion } from "@/data/adminMockData";
import { Search, Eye, Edit, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function AdminQuestions() {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<AdminQuestion | null>(null);

  const filtered = adminQuestions.filter((q) => {
    const matchSearch = q.statement.toLowerCase().includes(search.toLowerCase()) || q.discipline.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === "all" || q.difficulty === diffFilter;
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    return matchSearch && matchDiff && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestão de Questões</h1>
          <Button onClick={() => toast.info("Criar questão")}><Plus className="h-4 w-4 mr-1" />Nova Questão</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar questão..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={diffFilter} onValueChange={setDiffFilter}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Dificuldade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="reviewing">Revisando</SelectItem>
                  <SelectItem value="archived">Arquivada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Questão</TableHead>
                  <TableHead className="hidden md:table-cell">Disciplina</TableHead>
                  <TableHead className="hidden sm:table-cell">Dificuldade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Respostas</TableHead>
                  <TableHead className="hidden lg:table-cell">Taxa Acerto</TableHead>
                  <TableHead className="hidden lg:table-cell">Erros</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell><p className="font-medium truncate max-w-[200px]">{q.statement}</p><p className="text-xs text-muted-foreground">{q.contest || "Sem concurso"} — {q.topic}</p></TableCell>
                    <TableCell className="hidden md:table-cell">{q.discipline}</TableCell>
                    <TableCell className="hidden sm:table-cell"><AdminStatusBadge status={q.difficulty} /></TableCell>
                    <TableCell><AdminStatusBadge status={q.status} /></TableCell>
                    <TableCell className="hidden lg:table-cell">{q.totalAnswers}</TableCell>
                    <TableCell className="hidden lg:table-cell">{q.correctRate > 0 ? `${q.correctRate}%` : "—"}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {q.reportedErrors > 0 ? <span className="flex items-center gap-1 text-destructive text-sm"><AlertTriangle className="h-3 w-3" />{q.reportedErrors}</span> : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelected(q)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Editar questão")}><Edit className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selected && (
              <>
                <DialogHeader><DialogTitle>Preview da Questão</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <AdminStatusBadge status={selected.status} />
                    <AdminStatusBadge status={selected.difficulty} />
                    {selected.contest && <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">{selected.contest}</span>}
                  </div>
                  <p className="text-sm font-medium">{selected.statement}</p>
                  <div className="space-y-2">
                    {selected.alternatives.map((alt) => (
                      <div key={alt.letter} className={`p-3 rounded-lg border text-sm ${alt.letter === selected.correctAnswer ? "border-green-500 bg-green-50" : ""}`}>
                        <span className="font-bold mr-2">{alt.letter})</span>{alt.text}
                      </div>
                    ))}
                  </div>
                  {selected.explanation && (
                    <div className="p-3 rounded-lg bg-accent/50 text-sm">
                      <p className="font-semibold mb-1">Explicação:</p>
                      <p>{selected.explanation}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="p-2 rounded bg-muted"><p className="font-bold">{selected.totalAnswers}</p><p className="text-xs text-muted-foreground">Respostas</p></div>
                    <div className="p-2 rounded bg-muted"><p className="font-bold">{selected.correctRate}%</p><p className="text-xs text-muted-foreground">Taxa Acerto</p></div>
                    <div className="p-2 rounded bg-muted"><p className="font-bold">{selected.reportedErrors}</p><p className="text-xs text-muted-foreground">Erros Reportados</p></div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
