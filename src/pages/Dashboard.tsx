import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { user } from "@/data/mockData";
import { editais, DayPlan, PlanningInput } from "@/data/planningData";
import { Flame, Zap, Target, CheckCircle2, XCircle, Star, TrendingUp, CalendarDays, BookOpen, ArrowRight, GraduationCap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

function CircularProgress({ value, max, size = 120 }: { value: number; max: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth="10"
        strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" className="transition-all duration-700" />
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [savedPlan, setSavedPlan] = useState<{ plans: DayPlan[]; input: PlanningInput } | null>(null);

  useEffect(() => {
    try {
      const plansRaw = localStorage.getItem("legisquest_study_plan");
      const inputRaw = localStorage.getItem("legisquest_study_plan_input");
      if (plansRaw && inputRaw) {
        setSavedPlan({ plans: JSON.parse(plansRaw), input: JSON.parse(inputRaw) });
      }
    } catch { /* ignore */ }
  }, []);

  const edital = savedPlan ? editais[savedPlan.input.concursoId] : null;
  const todayStr = new Date().toISOString().split("T")[0];
  const todayPlan = savedPlan?.plans.find(p => p.date === todayStr);
  const upcomingPlans = savedPlan?.plans.filter(p => p.date >= todayStr).slice(0, 5) || [];
  const totalQuestions = savedPlan ? savedPlan.plans.reduce((s, p) => s + p.totalQuestions, 0) : 0;
  const totalDays = savedPlan?.plans.length || 0;
  const daysCompleted = savedPlan?.plans.filter(p => p.date < todayStr).length || 0;
  const progressPercent = totalDays > 0 ? Math.round((daysCompleted / totalDays) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Olá, {user.name.split(" ")[0]}! 👋</h1>
            <p className="text-muted-foreground">Continue sua jornada de estudos hoje.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2 shadow-sm border">
              <Flame className="h-5 w-5 text-highlight" />
              <div>
                <p className="text-lg font-bold text-foreground">{user.streak}</p>
                <p className="text-xs text-muted-foreground">dias seguidos</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2 shadow-sm border">
              <Zap className="h-5 w-5 text-highlight" />
              <div>
                <p className="text-lg font-bold text-foreground">{user.xp}</p>
                <p className="text-xs text-muted-foreground">XP total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goal + Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Meta Diária</h2>
            <div className="relative">
              <CircularProgress value={user.dailyCompleted} max={user.dailyGoal} size={140} />
              <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                <span className="font-heading text-3xl font-bold text-primary">{user.dailyCompleted}</span>
                <span className="text-sm text-muted-foreground">de {user.dailyGoal}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Faltam <span className="font-bold text-primary">{user.dailyGoal - user.dailyCompleted}</span> questões para bater a meta!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            {[
              { label: "Questões Resolvidas", value: user.stats.resolved, icon: Target, color: "text-primary" },
              { label: "Acertos", value: user.stats.correct, icon: CheckCircle2, color: "text-primary" },
              { label: "Erros", value: user.stats.wrong, icon: XCircle, color: "text-destructive" },
              { label: "Favoritas", value: user.stats.favorites, icon: Star, color: "text-highlight" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
                <div className={`rounded-lg bg-muted p-2.5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy Bar */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-lg font-bold text-foreground">Aproveitamento Geral</h2>
            </div>
            <span className="font-heading text-2xl font-bold text-primary">{user.stats.accuracy}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${user.stats.accuracy}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{user.stats.correct} acertos</span>
            <span>{user.stats.wrong} erros</span>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="mb-4 font-heading text-lg font-bold text-foreground">🏆 Conquistas</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {user.badges.map((badge) => (
              <div key={badge.id} className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
                badge.earned ? "bg-card shadow-sm" : "bg-muted/50 opacity-50 grayscale"
              }`}>
                <span className="mb-2 text-3xl">{badge.icon}</span>
                <p className="text-xs font-bold text-foreground">{badge.name}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Planning Section */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-lg font-bold text-foreground">🎯 Plano de Questões</h2>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/planning")}>
              {savedPlan ? "Ver Completo" : "Criar Plano"} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {savedPlan && edital ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-0">
                  <GraduationCap className="mr-1 h-3 w-3" /> {edital.cargo}
                </Badge>
                <Badge className="bg-highlight/10 text-highlight border-0">
                  <Target className="mr-1 h-3 w-3" /> {totalQuestions.toLocaleString()} questões
                </Badge>
                <Badge className="bg-secondary/10 text-secondary border-0">
                  <BookOpen className="mr-1 h-3 w-3" /> {edital.disciplinas.length} matérias
                </Badge>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progresso do ciclo</span>
                  <span className="font-bold text-primary">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2.5" />
                <p className="mt-1 text-xs text-muted-foreground">{daysCompleted} de {totalDays} dias concluídos</p>
              </div>

              {todayPlan ? (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">🎯 Meta de Hoje — {todayPlan.totalQuestions} questões</h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {todayPlan.blocks.map((block, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                        <Target className="h-4 w-4 text-primary shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{block.subject}</p>
                          <p className="text-xs text-muted-foreground">{block.questions} questões</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" className="mt-3 w-full gap-1.5" onClick={() => navigate("/study-session")}>
                    <Play className="h-4 w-4" /> Iniciar Questões de Hoje
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Nenhuma meta programada para hoje</p>
                </div>
              )}

              {upcomingPlans.length > 1 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">📋 Próximos Dias</h3>
                  <div className="space-y-1.5">
                    {upcomingPlans.slice(1).map((day, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">{day.dayOfWeek}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(day.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                          </span>
                        </div>
                        <Badge className="bg-primary/10 text-primary text-[10px] border-0">
                          <Target className="mr-0.5 h-2.5 w-2.5" /> {day.totalQuestions}q
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-muted/20 p-8 text-center">
              <Target className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="font-medium text-foreground">Nenhum plano de questões criado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Crie seu plano personalizado baseado no edital e resolva questões todos os dias.
              </p>
              <Button className="mt-4 gap-1.5" onClick={() => navigate("/planning")}>
                <Target className="h-4 w-4" /> Criar Plano de Questões
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
