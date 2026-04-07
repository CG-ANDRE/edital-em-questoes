import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adminContests } from "@/data/adminMockData";
import { Plus, Search, Edit, Trash2, Users, FileQuestion, Target } from "lucide-react";
import { toast } from "sonner";

export default function AdminContests() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = adminContests.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.organ.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestão de Concursos</h1>
          <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Novo Concurso</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar concurso..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="upcoming">Em breve</SelectItem>
                  <SelectItem value="closed">Encerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concurso</TableHead>
                  <TableHead className="hidden md:table-cell">Banca</TableHead>
                  <TableHead className="hidden sm:table-cell">Área</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell"><Users className="h-4 w-4 inline mr-1" />Alunos</TableHead>
                  <TableHead className="hidden lg:table-cell"><FileQuestion className="h-4 w-4 inline mr-1" />Questões</TableHead>
                  <TableHead className="hidden lg:table-cell"><Target className="h-4 w-4 inline mr-1" />Taxa Acerto</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell><div><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.organ} — {c.position}</p></div></TableCell>
                    <TableCell className="hidden md:table-cell">{c.board}</TableCell>
                    <TableCell className="hidden sm:table-cell">{c.area}</TableCell>
                    <TableCell><AdminStatusBadge status={c.status} /></TableCell>
                    <TableCell className="hidden lg:table-cell">{c.studentsAccessed}</TableCell>
                    <TableCell className="hidden lg:table-cell">{c.questionsLinked}</TableCell>
                    <TableCell className="hidden lg:table-cell">{c.avgCorrectRate > 0 ? `${c.avgCorrectRate}%` : "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Editar concurso")}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => toast.success("Concurso excluído")}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Novo Concurso</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nome</Label><Input placeholder="Ex: Polícia Federal" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Banca</Label><Input placeholder="CEBRASPE" /></div>
                <div><Label>Órgão</Label><Input placeholder="PF" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Cargo</Label><Input placeholder="Agente" /></div>
                <div><Label>Área</Label><Input placeholder="Policial" /></div>
              </div>
              <div><Label>Descrição</Label><Textarea placeholder="Descrição do concurso..." /></div>
              <div><Label>Tags (separadas por vírgula)</Label><Input placeholder="policial, federal" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => { setDialogOpen(false); toast.success("Concurso criado!"); }}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
