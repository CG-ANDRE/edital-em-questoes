import { useState } from "react";
import Layout from "@/components/Layout";
import { user, performanceBySubject, weeklyActivity } from "@/data/mockData";
import { TrendingUp, Target, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

function DonutChart({ correct, wrong, size = 180 }: { correct: number; wrong: number; size?: number }) {
  const total = correct + wrong;
  const r = (size - 20) / 2;
  const c = 2 * Math.PI * r;
  const correctArc = (correct / total) * c;
  const wrongArc = (wrong / total) * c;

  return (
    <div className="relative">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--destructive))" strokeWidth="16" strokeDasharray={`${wrongArc} ${c}`} strokeDashoffset={0} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth="16" strokeDasharray={`${correctArc} ${c}`} strokeDashoffset={-wrongArc} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-3xl font-bold text-foreground">{Math.round((correct / total) * 100)}%</span>
        <span className="text-xs text-muted-foreground">aproveitamento</span>
      </div>
    </div>
  );
}

function Heatmap({ data }: { data: number[][] }) {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const getColor = (v: number) => {
    if (v === 0) return "bg-muted";
    if (v <= 2) return "bg-accent";
    if (v <= 5) return "bg-secondary/50";
    return "bg-primary";
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-1">
        <div className="flex flex-col gap-1 pr-2 pt-6">
          {days.map((d) => (
            <div key={d} className="flex h-4 items-center text-[10px] text-muted-foreground">{d}</div>
          ))}
        </div>
        {data.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            <span className="mb-1 text-center text-[10px] text-muted-foreground">S{wi + 1}</span>
            {week.map((day, di) => (
              <div
                key={di}
                className={`h-4 w-4 rounded-sm ${getColor(day)}`}
                title={`${day} questões`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span>Menos</span>
        <div className="h-3 w-3 rounded-sm bg-muted" />
        <div className="h-3 w-3 rounded-sm bg-accent" />
        <div className="h-3 w-3 rounded-sm bg-secondary/50" />
        <div className="h-3 w-3 rounded-sm bg-primary" />
        <span>Mais</span>
      </div>
    </div>
  );
}

export default function Performance() {
  const [activeTab, setActiveTab] = useState<"overview" | "evolution" | "analysis">("overview");
  const tabs = [
    { key: "overview" as const, label: "Visão Geral" },
    { key: "evolution" as const, label: "Evolução" },
    { key: "analysis" as const, label: "Análise" },
  ];

  const weakSubjects = performanceBySubject.filter((s) => s.accuracy < 70).sort((a, b) => a.accuracy - b.accuracy);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Desempenho</h1>
          <p className="text-muted-foreground">Acompanhe sua evolução nos estudos.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-card font-bold text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Resolvidas", value: user.stats.resolved, icon: Target, color: "text-primary" },
                { label: "Acertos", value: user.stats.correct, icon: CheckCircle2, color: "text-primary" },
                { label: "Erros", value: user.stats.wrong, icon: XCircle, color: "text-destructive" },
                { label: "Aproveitamento", value: `${user.stats.accuracy}%`, icon: TrendingUp, color: "text-secondary" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center rounded-xl border bg-card p-4 shadow-sm">
                  <s.icon className={`mb-2 h-6 w-6 ${s.color}`} />
                  <span className="font-heading text-xl font-bold text-foreground">{s.value}</span>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Donut Chart */}
            <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-heading text-base font-bold text-foreground">Acertos vs Erros</h3>
              <DonutChart correct={user.stats.correct} wrong={user.stats.wrong} />
              <div className="mt-4 flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Acertos ({user.stats.correct})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Erros ({user.stats.wrong})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "evolution" && (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-heading text-base font-bold text-foreground">Mapa de Atividade</h3>
              <Heatmap data={weeklyActivity} />
            </div>

            {/* Per subject bars */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-heading text-base font-bold text-foreground">Desempenho por Matéria</h3>
              <div className="space-y-4">
                {performanceBySubject.map((s) => (
                  <div key={s.materia}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{s.materia}</span>
                      <span className="font-bold text-foreground">{s.accuracy}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${s.accuracy >= 70 ? "bg-primary" : "bg-highlight"}`}
                        style={{ width: `${s.accuracy}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.correct}/{s.total} questões corretas</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-highlight" />
                <h3 className="font-heading text-base font-bold text-foreground">Matérias que Precisam de Reforço</h3>
              </div>
              {weakSubjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">Parabéns! Todas as matérias estão acima de 70%.</p>
              ) : (
                <div className="space-y-3">
                  {weakSubjects.map((s) => (
                    <div key={s.materia} className="flex items-center justify-between rounded-xl border border-highlight/30 bg-highlight/5 px-4 py-3">
                      <div>
                        <p className="font-semibold text-foreground">{s.materia}</p>
                        <p className="text-xs text-muted-foreground">{s.total} questões resolvidas · {s.correct} acertos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading text-xl font-bold text-highlight">{s.accuracy}%</p>
                        <p className="text-xs text-muted-foreground">de aproveitamento</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="mb-3 font-heading text-base font-bold text-foreground">💡 Dicas de Estudo</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Foque nas matérias com aproveitamento abaixo de 70% para equilibrar seu desempenho.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Use o Caderno de Erros para revisar questões que você errou anteriormente.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Mantenha sua ofensiva diária para criar consistência nos estudos.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
