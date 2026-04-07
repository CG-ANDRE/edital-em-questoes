import AdminLayout from "@/components/admin/AdminLayout";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardMetrics, chartData, recentActivities } from "@/data/adminMockData";
import { Users, UserCheck, CreditCard, UserX, CalendarPlus, Landmark, BookOpen, FileQuestion, MessageSquare, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(181,99%,30%)", "hsl(181,70%,40%)", "hsl(181,45%,50%)", "hsl(36,85%,55%)", "hsl(0,84%,60%)"];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral da plataforma LegisQuest</p>
        </div>

        {/* Row 1: Main metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatsCard title="Total de Alunos" value={dashboardMetrics.totalStudents} icon={Users} trend={{ value: 12, positive: true }} />
          <AdminStatsCard title="Alunos Ativos" value={dashboardMetrics.activeStudents} icon={UserCheck} description={`${dashboardMetrics.activeVsRegistered}% do total`} />
          <AdminStatsCard title="Pagantes" value={dashboardMetrics.payingStudents} icon={CreditCard} description={`Taxa: ${dashboardMetrics.conversionRate}%`} trend={{ value: 8, positive: true }} />
          <AdminStatsCard title="Inativos/Cancelados" value={dashboardMetrics.inactiveStudents + dashboardMetrics.cancelledStudents} icon={UserX} />
        </div>

        {/* Row 2: Secondary metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <AdminStatsCard title="Novos Hoje" value={dashboardMetrics.newToday} icon={CalendarPlus} />
          <AdminStatsCard title="Novos na Semana" value={dashboardMetrics.newThisWeek} icon={CalendarPlus} />
          <AdminStatsCard title="Concursos" value={dashboardMetrics.totalContests} icon={Landmark} />
          <AdminStatsCard title="Materiais" value={dashboardMetrics.totalMaterials} icon={BookOpen} />
          <AdminStatsCard title="Questões" value={dashboardMetrics.totalQuestions} icon={FileQuestion} />
          <AdminStatsCard title="Feedbacks" value={dashboardMetrics.totalFeedbacks + dashboardMetrics.totalContestRequests + dashboardMetrics.totalErrorReports} icon={MessageSquare} />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Evolução de Cadastros</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData.registrations}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="hsl(181,99%,30%)" strokeWidth={2} dot={{ fill: "hsl(181,99%,30%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Evolução de Pagantes</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData.paying}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="hsl(36,85%,55%)" strokeWidth={2} dot={{ fill: "hsl(36,85%,55%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Uso por Dia da Semana</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData.usage}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="hsl(181,99%,30%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Concursos Mais Acessados</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={chartData.contestsAccess} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                    {chartData.contestsAccess.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent activities */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Últimas Atividades</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                    {a.type === "user" && <Users className="h-4 w-4 text-accent-foreground" />}
                    {a.type === "material" && <BookOpen className="h-4 w-4 text-accent-foreground" />}
                    {a.type === "feedback" && <MessageSquare className="h-4 w-4 text-accent-foreground" />}
                    {a.type === "error" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    {a.type === "payment" && <CreditCard className="h-4 w-4 text-accent-foreground" />}
                    {a.type === "question" && <FileQuestion className="h-4 w-4 text-accent-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
