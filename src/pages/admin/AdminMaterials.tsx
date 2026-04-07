import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminMaterials } from "@/data/adminMockData";
import { Plus, Search, Edit, Upload, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function AdminMaterials() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = adminMaterials.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.discipline.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Materiais de Legislação</h1>
          <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Novo Material</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar material..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead className="hidden md:table-cell">Disciplina</TableHead>
                  <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Processamento</TableHead>
                  <TableHead className="hidden lg:table-cell">Questões Geradas</TableHead>
                  <TableHead className="hidden lg:table-cell">Prioridade</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div><p className="font-medium">{m.title}</p><p className="text-xs text-muted-foreground">{m.contests.join(", ") || "Sem concurso"}</p></div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{m.discipline}</TableCell>
                    <TableCell className="hidden sm:table-cell uppercase text-xs">{m.fileType}</TableCell>
                    <TableCell><AdminStatusBadge status={m.status} /></TableCell>
                    <TableCell className="hidden lg:table-cell"><AdminStatusBadge status={m.processingStatus} /></TableCell>
                    <TableCell className="hidden lg:table-cell">{m.questionsGenerated}</TableCell>
                    <TableCell className="hidden lg:table-cell"><AdminStatusBadge status={m.priority} /></TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => toast.info("Editar material")}><Edit className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Novo Material</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Título</Label><Input placeholder="Ex: Constituição Federal de 1988" /></div>
              <div><Label>Descrição</Label><Textarea placeholder="Descrição do conteúdo..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Disciplina</Label><Input placeholder="Direito Constitucional" /></div>
                <div><Label>Tema</Label><Input placeholder="Constituição Federal" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Prioridade</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent><SelectItem value="high">Alta</SelectItem><SelectItem value="medium">Média</SelectItem><SelectItem value="low">Baixa</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>Versão</Label><Input placeholder="1.0" /></div>
              </div>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Arraste um arquivo ou clique para upload</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => { setDialogOpen(false); toast.success("Material enviado!"); }}>Enviar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
