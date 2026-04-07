import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminFeedbacks, type AdminFeedback as FeedbackType } from "@/data/adminMockData";
import { CheckCircle, Archive, Flag, MessageSquare, Landmark, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

function FeedbackCard({ f }: { f: FeedbackType }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{f.studentName}</span>
              <span className="text-xs text-muted-foreground">{f.studentEmail}</span>
              <AdminStatusBadge status={f.status} />
              <AdminStatusBadge status={f.priority} />
            </div>
            <p className="text-sm">{f.content}</p>
            {f.relatedContest && <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Concurso: {f.relatedContest}</span>}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{f.sentAt}</span>
              {f.assignedTo && <span>• Responsável: {f.assignedTo}</span>}
              {f.notes && <span>• {f.notes}</span>}
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" title="Resolver" onClick={() => toast.success("Marcado como resolvido")}><CheckCircle className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" title="Priorizar" onClick={() => toast.info("Prioridade alterada")}><Flag className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" title="Arquivar" onClick={() => toast.success("Arquivado")}><Archive className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminFeedback() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filterByStatus = (items: FeedbackType[]) =>
    statusFilter === "all" ? items : items.filter((f) => f.status === statusFilter);

  const feedbacks = filterByStatus(adminFeedbacks.filter((f) => f.type === "feedback"));
  const requests = filterByStatus(adminFeedbacks.filter((f) => f.type === "contest_request"));
  const errors = filterByStatus(adminFeedbacks.filter((f) => f.type === "error_report"));

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Feedbacks & Solicitações</h1>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="analyzing">Em análise</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="feedback">
          <TabsList>
            <TabsTrigger value="feedback" className="gap-1"><MessageSquare className="h-4 w-4" />Feedbacks ({feedbacks.length})</TabsTrigger>
            <TabsTrigger value="requests" className="gap-1"><Landmark className="h-4 w-4" />Solicitações ({requests.length})</TabsTrigger>
            <TabsTrigger value="errors" className="gap-1"><AlertTriangle className="h-4 w-4" />Erros ({errors.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="feedback"><div className="space-y-3">{feedbacks.length > 0 ? feedbacks.map((f) => <FeedbackCard key={f.id} f={f} />) : <p className="text-center text-muted-foreground py-8">Nenhum feedback</p>}</div></TabsContent>
          <TabsContent value="requests"><div className="space-y-3">{requests.length > 0 ? requests.map((f) => <FeedbackCard key={f.id} f={f} />) : <p className="text-center text-muted-foreground py-8">Nenhuma solicitação</p>}</div></TabsContent>
          <TabsContent value="errors"><div className="space-y-3">{errors.length > 0 ? errors.map((f) => <FeedbackCard key={f.id} f={f} />) : <p className="text-center text-muted-foreground py-8">Nenhum erro reportado</p>}</div></TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
