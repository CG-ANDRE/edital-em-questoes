import { useParams, Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { adminStudents, adminFeedbacks } from "@/data/adminMockData";
import { ArrowLeft, UserCheck, UserX, Lock, Unlock, KeyRound, Trash2, Mail, Phone, Calendar, Target, BookOpen, Flame } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminStudentDetail() {
  const { id } = useParams();
  const student = adminStudents.find((s) => s.id === id);
  const studentFeedbacks = adminFeedbacks.filter((f) => student && f.studentEmail === student.email);
  const [notes, setNotes] = useState(student?.notes || "");

  if (!student) {
    return <AdminLayout><div className="text-center py-12"><p className="text-muted-foreground">Aluno não encontrado</p><Link to="/admin/students" className="text-primary underline">Voltar</Link></div></AdminLayout>;
  }

  const correctRate = student.questionsAnswered > 0 ? ((student.correctAnswers / student.questionsAnswered) * 100).toFixed(1) : "0";

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/admin/students"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="text-sm text-muted-foreground">{student.email}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <AdminStatusBadge status={student.status} />
            <AdminStatusBadge status={student.subscriptionStatus} />
          </div>
        </div>

        {/* Actions */}
        <Card>
          <CardContent className="flex flex-wrap gap-2 p-4">
            <Button size="sm" variant="outline" onClick={() => toast.success("Usuário ativado")}><UserCheck className="h-4 w-4 mr-1" />Ativar</Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Usuário desativado")}><UserX className="h-4 w-4 mr-1" />Desativar</Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Acesso bloqueado")}><Lock className="h-4 w-4 mr-1" />Bloquear</Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Acesso desbloqueado")}><Unlock className="h-4 w-4 mr-1" />Desbloquear</Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Senha resetada")}><KeyRound className="h-4 w-4 mr-1" />Resetar Senha</Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Acesso liberado manualmente")}><UserCheck className="h-4 w-4 mr-1" />Liberar Acesso</Button>
            <Button size="sm" variant="destructive" onClick={() => toast.success("Acesso cancelado")}><Trash2 className="h-4 w-4 mr-1" />Cancelar</Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="data">
          <TabsList>
            <TabsTrigger value="data">Dados</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
            <TabsTrigger value="feedbacks">Feedbacks ({studentFeedbacks.length})</TabsTrigger>
            <TabsTrigger value="notes">Observações</TabsTrigger>
          </TabsList>

          <TabsContent value="data">
            <div className="grid sm:grid-cols-2 gap-4">
              <Card><CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-sm">Informações Pessoais</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{student.email}</div>
                  {student.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{student.phone}</div>}
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />Cadastro: {student.registeredAt}</div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />Último acesso: {student.lastAccess}</div>
                </div>
              </CardContent></Card>

              <Card><CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-sm">Assinatura</h3>
                <div className="space-y-2 text-sm">
                  <div>Plano: <span className="font-medium">{student.plan}</span></div>
                  <div className="flex items-center gap-2">Status: <AdminStatusBadge status={student.subscriptionStatus} /></div>
                  <div className="flex items-center gap-2"><Flame className="h-4 w-4 text-highlight" />Streak: {student.streak} dias</div>
                </div>
              </CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card><CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{student.questionsAnswered}</p>
                <p className="text-xs text-muted-foreground">Questões Respondidas</p>
              </CardContent></Card>
              <Card><CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{student.correctAnswers}</p>
                <p className="text-xs text-muted-foreground">Acertos ({correctRate}%)</p>
              </CardContent></Card>
              <Card><CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-destructive">{student.wrongAnswers}</p>
                <p className="text-xs text-muted-foreground">Erros</p>
              </CardContent></Card>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Card><CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Target className="h-4 w-4" />Concursos Acessados</h3>
                <div className="flex flex-wrap gap-2">{student.contestsAccessed.length > 0 ? student.contestsAccessed.map((c) => <AdminStatusBadge key={c} status="active" />) : <span className="text-sm text-muted-foreground">Nenhum</span>}
                {student.contestsAccessed.map((c) => <span key={c} className="text-sm bg-accent text-accent-foreground px-2 py-1 rounded">{c}</span>)}</div>
              </CardContent></Card>
              <Card><CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4" />Materiais Utilizados</h3>
                <div className="flex flex-wrap gap-2">{student.materialsUsed.length > 0 ? student.materialsUsed.map((m) => <span key={m} className="text-sm bg-accent text-accent-foreground px-2 py-1 rounded">{m}</span>) : <span className="text-sm text-muted-foreground">Nenhum</span>}</div>
              </CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="feedbacks">
            {studentFeedbacks.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">Nenhum feedback enviado</CardContent></Card>
            ) : (
              <div className="space-y-3">
                {studentFeedbacks.map((f) => (
                  <Card key={f.id}><CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AdminStatusBadge status={f.type === "feedback" ? "active" : f.type === "contest_request" ? "upcoming" : "error"} />
                      <AdminStatusBadge status={f.priority} />
                      <span className="text-xs text-muted-foreground ml-auto">{f.sentAt}</span>
                    </div>
                    <p className="text-sm">{f.content}</p>
                  </CardContent></Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes">
            <Card><CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm">Observações Internas</h3>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Adicione observações sobre este aluno..." rows={4} />
              <Button size="sm" onClick={() => toast.success("Observações salvas")}>Salvar</Button>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
