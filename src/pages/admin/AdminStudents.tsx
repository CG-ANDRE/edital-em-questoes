import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminStudents } from "@/data/adminMockData";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminStudents() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = adminStudents.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchSub = subFilter === "all" || s.subscriptionStatus === subFilter;
    return matchSearch && matchStatus && matchSub;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Gestão de Alunos</h1>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={subFilter} onValueChange={(v) => { setSubFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Assinatura" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="paying">Pagante</SelectItem>
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                  <SelectItem value="overdue">Inadimplente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">E-mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Plano</TableHead>
                  <TableHead className="hidden lg:table-cell">Questões</TableHead>
                  <TableHead className="hidden lg:table-cell">Último Acesso</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{s.email}</TableCell>
                    <TableCell><AdminStatusBadge status={s.status} /></TableCell>
                    <TableCell className="hidden sm:table-cell">{s.plan}</TableCell>
                    <TableCell className="hidden lg:table-cell">{s.questionsAnswered}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{s.lastAccess}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild><Link to={`/admin/students/${s.id}`}><Eye className="h-4 w-4" /></Link></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum aluno encontrado</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <span className="text-sm text-muted-foreground">{filtered.length} aluno(s)</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                  <span className="text-sm">{page}/{totalPages}</span>
                  <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
