import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { DayPlan, PlanningInput, editais, StudyBlock } from "@/data/planningData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, BookOpen, ArrowLeft, Trophy, Play, ChevronDown, ChevronUp } from "lucide-react";

const STORAGE_KEY = "legisquest_study_plan";
const INPUT_STORAGE_KEY = "legisquest_study_plan_input";
const PROGRESS_KEY = "legisquest_study_progress";

interface BlockProgress {
  [dateBlockKey: string]: boolean;
}

function loadProgress(): BlockProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: BlockProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function getBlockKey(date: string, index: number) {
  return `${date}_${index}`;
}

export default function StudySession() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<DayPlan[] | null>(null);
  const [input, setInput] = useState<PlanningInput | null>(null);
  const [progress, setProgress] = useState<BlockProgress>(loadProgress());
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);

  useEffect(() => {
    try {
      const plansRaw = localStorage.getItem(STORAGE_KEY);
      const inputRaw = localStorage.getItem(INPUT_STORAGE_KEY);
      if (plansRaw && inputRaw) {
        setPlans(JSON.parse(plansRaw));
        setInput(JSON.parse(inputRaw));
      }
    } catch { /* ignore */ }
  }, []);

  if (!plans || !input) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h2 className="font-heading text-xl font-bold text-foreground">Nenhum planejamento encontrado</h2>
          <p className="mt-2 text-sm text-muted-foreground">Crie seu planejamento primeiro para iniciar os estudos.</p>
          <Button className="mt-4" onClick={() => navigate("/planning")}>Criar Planejamento</Button>
        </div>
      </Layout>
    );
  }

  const edital = editais[input.concursoId];
  const todayStr = new Date().toISOString().split("T")[0];
  const todayPlan = plans.find(p => p.date === todayStr);

  // Find the nearest plan day if today has no plan
  const currentPlan = todayPlan || plans.find(p => p.date >= todayStr) || plans[plans.length - 1];

  const completedToday = currentPlan?.blocks.filter((_, i) =>
    progress[getBlockKey(currentPlan.date, i)]
  ).length || 0;

  const totalBlocks = currentPlan?.blocks.length || 0;
  const dayProgress = totalBlocks > 0 ? Math.round((completedToday / totalBlocks) * 100) : 0;
  const allDone = completedToday === totalBlocks && totalBlocks > 0;

  const totalMinutesToday = currentPlan?.blocks.reduce((s, b) => s + b.duration, 0) || 0;
  const completedMinutes = currentPlan?.blocks.reduce((s, b, i) =>
    progress[getBlockKey(currentPlan.date, i)] ? s + b.duration : s, 0) || 0;

  const toggleBlock = (index: number) => {
    const key = getBlockKey(currentPlan.date, index);
    const updated = { ...progress, [key]: !progress[key] };
    setProgress(updated);
    saveProgress(updated);
  };

  // Overall plan progress
  const totalPlanBlocks = plans.reduce((s, p) => s + p.blocks.length, 0);
  const completedPlanBlocks = plans.reduce((s, p) =>
    s + p.blocks.filter((_, i) => progress[getBlockKey(p.date, i)]).length, 0);
  const overallProgress = totalPlanBlocks > 0 ? Math.round((completedPlanBlocks / totalPlanBlocks) * 100) : 0;

  const typeLabel = (t: string) => t === "estudo" ? "Estudo" : t === "revisao" ? "Revisão" : "Questões";
  const typeColor = (t: string) => t === "revisao" ? "bg-highlight" : t === "questoes" ? "bg-secondary" : "bg-primary";

  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Back button */}
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => navigate("/planning")}>
          <ArrowLeft className="h-4 w-4" /> Voltar ao Planejamento
        </Button>

        {/* Header */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {allDone ? "🎉 Parabéns!" : "📖 Sessão de Estudo"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentPlan.dayOfWeek}, {new Date(currentPlan.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-primary/10 text-primary border-0">
                <Clock className="mr-1 h-3 w-3" /> {totalMinutesToday}min
              </Badge>
              <Badge className="bg-highlight/10 text-highlight border-0">
                {totalBlocks} blocos
              </Badge>
            </div>
          </div>

          {/* Day progress */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso do dia</span>
              <span className="font-bold text-primary">{completedToday}/{totalBlocks} concluídos</span>
            </div>
            <Progress value={dayProgress} className="h-3" />
            <p className="mt-1 text-xs text-muted-foreground">
              {completedMinutes}min de {totalMinutesToday}min estudados
            </p>
          </div>

          {allDone && (
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/20 p-4">
              <Trophy className="h-8 w-8 text-highlight" />
              <div>
                <p className="font-bold text-foreground">Meta do dia concluída!</p>
                <p className="text-sm text-muted-foreground">Você completou todos os blocos de estudo de hoje. Continue assim!</p>
              </div>
            </div>
          )}
        </div>

        {/* Study blocks */}
        <div className="space-y-3">
          <h2 className="font-heading text-lg font-bold text-foreground">Blocos de Estudo</h2>
          {currentPlan.blocks.map((block, i) => {
            const done = !!progress[getBlockKey(currentPlan.date, i)];
            const isExpanded = expandedBlock === i;

            return (
              <div
                key={i}
                className={`rounded-xl border transition-all ${done ? "bg-primary/5 border-primary/20" : "bg-card"} shadow-sm`}
              >
                <div className="flex items-center gap-4 p-4">
                  <button
                    onClick={() => toggleBlock(i)}
                    className="shrink-0 transition-transform hover:scale-110"
                  >
                    {done ? (
                      <CheckCircle2 className="h-7 w-7 text-primary" />
                    ) : (
                      <Circle className="h-7 w-7 text-muted-foreground/40" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold ${done ? "text-primary line-through" : "text-foreground"}`}>
                      {block.subject}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${typeColor(block.type)}`} />
                      <span className="text-xs text-muted-foreground">
                        {typeLabel(block.type)} • {block.duration}min
                      </span>
                    </div>
                  </div>

                  {block.assuntos && block.assuntos.length > 0 && (
                    <button
                      onClick={() => setExpandedBlock(isExpanded ? null : i)}
                      className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  )}

                  {!done && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 gap-1.5"
                      onClick={() => toggleBlock(i)}
                    >
                      <Play className="h-3.5 w-3.5" /> Concluir
                    </Button>
                  )}
                </div>

                {/* Expandable topics */}
                {isExpanded && block.assuntos && block.assuntos.length > 0 && (
                  <div className="border-t px-4 py-3">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assuntos do Edital</p>
                    <div className="flex flex-wrap gap-1.5">
                      {block.assuntos.map((a, j) => (
                        <Badge key={j} variant="outline" className="text-xs font-normal">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overall progress */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">📊 Progresso Geral do Plano</h2>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{completedPlanBlocks} de {totalPlanBlocks} blocos concluídos</span>
            <span className="font-bold text-primary">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2.5" />
        </div>
      </div>
    </Layout>
  );
}
