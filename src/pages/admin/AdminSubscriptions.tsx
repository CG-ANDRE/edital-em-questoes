import AdminLayout from "@/components/admin/AdminLayout";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminSubscriptions } from "@/data/adminMockData";
import { CreditCard, DollarSign, TrendingUp, UserX, Receipt, Users } from "lucide-react";

export default function AdminSubscriptions() {
  const activeCount = adminSubscriptions.filter((s) => s.status === "active").length;
  const cancelledCount = adminSubscriptions.filter((s) => s.status === "cancelled").length;
  const overdueCount = adminSubscriptions.filter((s) => s.status === "overdue").length;
  const totalRevenue = adminSubscriptions.reduce((sum, s) => sum + s.payments.filter((p) => p.status === "paid").reduce((ps, p) => ps + p.amount, 0), 0);
  const avgTicket = activeCount > 0 ? (totalRevenue / adminSubscriptions.length).toFixed(2) : "0";
  const mrr = adminSubscriptions.filter((s) => s.status === "active").reduce((sum, s) => {
    if (s.plan.includes("Mensal")) return sum + s.amount;
    if (s.plan.includes("Semestral")) return sum + s.amount / 6;
    if (s.plan.includes("Anual")) return sum + s.amount / 12;
    return sum;
  }, 0);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Assinaturas & Pagamentos</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <AdminStatsCard title="Pagantes" value={activeCount} icon={Users} />
          <AdminStatsCard title="Receita Total" value={`R$ ${totalRevenue.toFixed(0)}`} icon={DollarSign} />
          <AdminStatsCard title="MRR Estimado" value={`R$ ${mrr.toFixed(0)}`} icon={TrendingUp} />
          <AdminStatsCard title="Cancelamentos" value={cancelledCount} icon={UserX} />
          <AdminStatsCard title="Inadimplentes" value={overdueCount} icon={Receipt} />
          <AdminStatsCard title="Ticket Médio" value={`R$ ${avgTicket}`} icon={CreditCard} />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Assinaturas</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="hidden md:table-cell">Plano</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Vencimento</TableHead>
                  <TableHead className="hidden lg:table-cell">Auto-renovação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminSubscriptions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div><p className="font-medium">{s.studentName}</p><p className="text-xs text-muted-foreground">{s.studentEmail}</p></div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{s.plan}</TableCell>
                    <TableCell>R$ {s.amount.toFixed(2)}</TableCell>
                    <TableCell><AdminStatusBadge status={s.status} /></TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{s.dueDate}</TableCell>
                    <TableCell className="hidden lg:table-cell">{s.autoRenew ? "Sim" : "Não"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
