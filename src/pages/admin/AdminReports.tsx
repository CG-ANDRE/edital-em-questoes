import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminStudents, adminContests, adminFeedbacks, adminQuestions } from "@/data/adminMockData";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";

const reportTypes = [
  { id: "students", label: "Alunos Cadastrados" },
  { id: "paying", label: "Alunos Pagantes" },
  { id: "cancellations", label: "Cancelamentos" },
  { id: "contests", label: "Concursos Mais Acessados" },
  { id: "questions", label: "Taxa de Acerto por Questão" },
  { id: "feedbacks", label: "Feedbacks Recebidos" },
  { id: "errors", label: "Erros Reportados" },
];

function exportCSV(data: Record<string, string | number>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(","), ...data.map((row) => headers.map((h) => `"${row[h]}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
  toast.success("Relatório exportado em CSV");
}

export default function AdminReports() {
  const [reportType, setReportType] = useState("students");

  const getReportData = () => {
    switch (reportType) {
      case "students": return adminStudents.map((s) => ({ Nome: s.name, Email: s.email, Status: s.status, Plano: s.plan, Cadastro: s.registeredAt }));
      case "paying": return adminStudents.filter((s) => s.subscriptionStatus === "paying").map((s) => ({ Nome: s.name, Email: s.email, Plano: s.plan, Cadastro: s.registeredAt }));
      case "cancellations": return adminStudents.filter((s) => s.status === "cancelled").map((s) => ({ Nome: s.name, Email: s.email, Plano: s.plan, Cadastro: s.registeredAt }));
      case "contests": return adminContests.map((c) => ({ Concurso: c.name, Banca: c.board, Alunos: c.studentsAccessed, Questões: c.questionsLinked, "Taxa Acerto": `${c.avgCorrectRate}%` }));
      case "questions": return adminQuestions.filter((q) => q.status === "active").map((q) => ({ Questão: q.statement.slice(0, 60) + "...", Disciplina: q.discipline, Respostas: q.totalAnswers, "Taxa Acerto": `${q.correctRate}%`, Erros: q.reportedErrors }));
      case "feedbacks": return adminFeedbacks.filter((f) => f.type === "feedback").map((f) => ({ Aluno: f.studentName, Conteúdo: f.content.slice(0, 80), Data: f.sentAt, Status: f.status }));
      case "errors": return adminFeedbacks.filter((f) => f.type === "error_report").map((f) => ({ Aluno: f.studentName, Conteúdo: f.content.slice(0, 80), Data: f.sentAt, Status: f.status, Prioridade: f.priority }));
      default: return [];
    }
  };

  const data = getReportData();
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Relatórios</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {reportTypes.map((r) => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportCSV(data as Record<string, string | number>[], `relatorio-${reportType}`)}><FileSpreadsheet className="h-4 w-4 mr-1" />CSV</Button>
            <Button variant="outline" onClick={() => toast.info("Exportação Excel em desenvolvimento")}><FileText className="h-4 w-4 mr-1" />Excel</Button>
            <Button variant="outline" onClick={() => toast.info("Exportação PDF em desenvolvimento")}><Download className="h-4 w-4 mr-1" />PDF</Button>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">{reportTypes.find((r) => r.id === reportType)?.label} — {data.length} registros</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>{headers.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 20).map((row, i) => (
                  <TableRow key={i}>{headers.map((h) => <TableCell key={h} className="text-sm">{String((row as Record<string, unknown>)[h])}</TableCell>)}</TableRow>
                ))}
                {data.length === 0 && <TableRow><TableCell colSpan={headers.length || 1} className="text-center text-muted-foreground py-8">Sem dados</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
