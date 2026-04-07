import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { adminRoles } from "@/data/adminMockData";
import { toast } from "sonner";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Configurações</h1>

        <Tabs defaultValue="general">
          <TabsList className="flex-wrap">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="emails">E-mails</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card><CardContent className="p-4 space-y-4">
              <div><Label>Nome da Plataforma</Label><Input defaultValue="LegisQuest" /></div>
              <div><Label>Descrição</Label><Textarea defaultValue="Plataforma de questões inéditas de legislação para concursos públicos" /></div>
              <div><Label>E-mail de Contato</Label><Input defaultValue="contato@legisquest.com" /></div>
              <div><Label>Instagram</Label><Input defaultValue="@legisquest" /></div>
              <Button onClick={() => toast.success("Configurações salvas")}>Salvar</Button>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="plans">
            <Card><CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plano</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Gratuito</TableCell>
                    <TableCell>R$ 0,00</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell><AdminStatusBadge status="active" /></TableCell>
                    <TableCell><Button variant="ghost" size="sm">Editar</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Premium Mensal</TableCell>
                    <TableCell>R$ 39,90</TableCell>
                    <TableCell>Mensal</TableCell>
                    <TableCell><AdminStatusBadge status="active" /></TableCell>
                    <TableCell><Button variant="ghost" size="sm">Editar</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Premium Semestral</TableCell>
                    <TableCell>R$ 179,90</TableCell>
                    <TableCell>Semestral</TableCell>
                    <TableCell><AdminStatusBadge status="active" /></TableCell>
                    <TableCell><Button variant="ghost" size="sm">Editar</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Premium Anual</TableCell>
                    <TableCell>R$ 299,90</TableCell>
                    <TableCell>Anual</TableCell>
                    <TableCell><AdminStatusBadge status="active" /></TableCell>
                    <TableCell><Button variant="ghost" size="sm">Editar</Button></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card><CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Permissões</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.label}</TableCell>
                      <TableCell><div className="flex flex-wrap gap-1">{role.permissions.map((p) => <span key={p} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">{p}</span>)}</div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="emails">
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm">E-mails Automáticos</h3>
              <div className="space-y-3">
                {["Boas-vindas ao novo aluno", "Confirmação de pagamento", "Lembrete de renovação", "Aviso de cancelamento", "Resumo semanal de atividades"].map((email) => (
                  <div key={email} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm">{email}</span>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
              <Button onClick={() => toast.success("Configurações de e-mail salvas")}>Salvar</Button>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: "Pagamentos (Stripe)", status: "Não conectado", connected: false },
                { name: "Armazenamento (Supabase Storage)", status: "Conectado", connected: true },
                { name: "E-mail (Resend)", status: "Não conectado", connected: false },
                { name: "Analytics", status: "Não conectado", connected: false },
              ].map((integration) => (
                <Card key={integration.name}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{integration.name}</p>
                      <p className={`text-xs ${integration.connected ? "text-green-600" : "text-muted-foreground"}`}>{integration.status}</p>
                    </div>
                    <Button variant="outline" size="sm">{integration.connected ? "Configurar" : "Conectar"}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
