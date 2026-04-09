import { useState } from "react";
import { DayPlan, QuestionBlock } from "@/data/planningData";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SUBJECT_COLORS = [
  { bg: "bg-primary/15", border: "border-primary/30", text: "text-primary" },
  { bg: "bg-highlight/15", border: "border-highlight/30", text: "text-highlight" },
  { bg: "bg-[hsl(280,60%,92%)]", border: "border-[hsl(280,60%,75%)]", text: "text-[hsl(280,50%,40%)]" },
  { bg: "bg-[hsl(200,70%,90%)]", border: "border-[hsl(200,70%,70%)]", text: "text-[hsl(200,60%,35%)]" },
  { bg: "bg-[hsl(340,60%,92%)]", border: "border-[hsl(340,60%,75%)]", text: "text-[hsl(340,50%,40%)]" },
  { bg: "bg-[hsl(150,50%,90%)]", border: "border-[hsl(150,50%,65%)]", text: "text-[hsl(150,45%,30%)]" },
  { bg: "bg-[hsl(30,70%,90%)]", border: "border-[hsl(30,70%,70%)]", text: "text-[hsl(30,60%,35%)]" },
  { bg: "bg-[hsl(220,60%,92%)]", border: "border-[hsl(220,60%,75%)]", text: "text-[hsl(220,50%,40%)]" },
  { bg: "bg-secondary/15", border: "border-secondary/30", text: "text-secondary" },
  { bg: "bg-[hsl(60,50%,88%)]", border: "border-[hsl(60,50%,65%)]", text: "text-[hsl(60,40%,30%)]" },
  { bg: "bg-destructive/10", border: "border-destructive/30", text: "text-destructive" },
  { bg: "bg-[hsl(170,50%,90%)]", border: "border-[hsl(170,50%,65%)]", text: "text-[hsl(170,45%,30%)]" },
];

const WEEKDAY_HEADERS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function formatMonthYear(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

interface Props {
  plans: DayPlan[];
}

export default function PlanCalendarView({ plans }: Props) {
  const [currentWeekIdx, setCurrentWeekIdx] = useState(0);

  const subjectColorMap = new Map<string, (typeof SUBJECT_COLORS)[0]>();
  let colorIdx = 0;
  plans.forEach((day) => {
    day.blocks.forEach((block) => {
      if (!subjectColorMap.has(block.disciplinaId)) {
        subjectColorMap.set(block.disciplinaId, SUBJECT_COLORS[colorIdx % SUBJECT_COLORS.length]);
        colorIdx++;
      }
    });
  });

  const weeks: (DayPlan | null)[][] = [];
  if (plans.length === 0) return null;

  const firstDate = new Date(plans[0].date + "T00:00:00");
  const lastDate = new Date(plans[plans.length - 1].date + "T00:00:00");
  const planMap = new Map<string, DayPlan>();
  plans.forEach((p) => planMap.set(p.date, p));

  const startSunday = new Date(firstDate);
  startSunday.setDate(startSunday.getDate() - startSunday.getDay());
  const endSaturday = new Date(lastDate);
  endSaturday.setDate(endSaturday.getDate() + (6 - endSaturday.getDay()));

  const cursor = new Date(startSunday);
  let currentWeek: (DayPlan | null)[] = [];

  while (cursor <= endSaturday) {
    const dateStr = cursor.toISOString().split("T")[0];
    currentWeek.push(planMap.get(dateStr) || null);
    if (cursor.getDay() === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const visibleWeeks = weeks.length <= 2 ? weeks : [weeks[currentWeekIdx]];
  const showPagination = weeks.length > 2;

  const currentMonthLabel = (() => {
    const w = weeks[currentWeekIdx] || weeks[0];
    const firstDay = w.find((d) => d !== null);
    if (firstDay) return formatMonthYear(firstDay.date);
    const refDate = new Date(startSunday);
    refDate.setDate(refDate.getDate() + currentWeekIdx * 7);
    return refDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  })();

  const allDatesWithPlans = new Set(plans.map((p) => p.date));
  const refDateForMonth = (() => {
    const w = weeks[currentWeekIdx] || weeks[0];
    const d = w.find((p) => p !== null);
    return d ? new Date(d.date + "T00:00:00") : firstDate;
  })();

  const miniCalMonth = refDateForMonth.getMonth();
  const miniCalYear = refDateForMonth.getFullYear();
  const miniCalFirstDay = new Date(miniCalYear, miniCalMonth, 1).getDay();
  const miniCalDaysInMonth = new Date(miniCalYear, miniCalMonth + 1, 0).getDate();

  const uniqueSubjects = Array.from(subjectColorMap.entries());

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showPagination && (
              <Button variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => setCurrentWeekIdx((i) => Math.max(0, i - 1))}
                disabled={currentWeekIdx === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <h3 className="font-heading text-lg font-bold capitalize text-foreground">{currentMonthLabel}</h3>
            {showPagination && (
              <Button variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => setCurrentWeekIdx((i) => Math.min(weeks.length - 1, i + 1))}
                disabled={currentWeekIdx === weeks.length - 1}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          {showPagination && (
            <span className="text-xs text-muted-foreground">Semana {currentWeekIdx + 1} de {weeks.length}</span>
          )}
        </div>

        <div className="grid grid-cols-7 gap-px rounded-t-xl bg-border overflow-hidden">
          {WEEKDAY_HEADERS.map((day) => (
            <div key={day} className="bg-muted/50 px-2 py-2 text-center text-xs font-bold text-muted-foreground">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-border rounded-b-xl overflow-hidden">
          {visibleWeeks.flatMap((week, wi) =>
            week.map((day, di) => {
              const cellDate = new Date(startSunday);
              cellDate.setDate(cellDate.getDate() + (currentWeekIdx * 7) + di);
              const dayNum = cellDate.getDate();
              const hasStudy = day && day.blocks.length > 0;

              return (
                <div key={`${wi}-${di}`} className={`min-h-[180px] bg-card p-2 ${!hasStudy ? "bg-muted/20" : ""}`}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className={`text-xs font-bold ${hasStudy ? "text-foreground" : "text-muted-foreground/50"}`}>{dayNum}</span>
                    {day && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 gap-0.5">
                        <Target className="h-2.5 w-2.5" /> {day.totalQuestions}
                      </Badge>
                    )}
                  </div>
                  {day && (
                    <div className="space-y-1">
                      {day.blocks.map((block, bi) => {
                        const colors = subjectColorMap.get(block.disciplinaId) || SUBJECT_COLORS[0];
                        return (
                          <Popover key={bi}>
                            <PopoverTrigger asChild>
                              <button className={`w-full rounded-md border px-2 py-1.5 text-left transition-shadow hover:shadow-md ${colors.bg} ${colors.border}`}>
                                <p className={`text-[11px] font-bold leading-tight ${colors.text}`}>{block.subject}</p>
                                <p className={`text-[10px] ${colors.text} opacity-70`}>{block.questions} questões</p>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-0" align="start">
                              <div className={`rounded-t-lg border-b px-4 py-3 ${colors.bg}`}>
                                <div className="flex items-center gap-2">
                                  <Target className={`h-4 w-4 ${colors.text}`} />
                                  <p className={`text-sm font-bold ${colors.text}`}>{block.subject}</p>
                                </div>
                                <p className={`mt-0.5 text-xs ${colors.text} opacity-70`}>{block.questions} questões para resolver</p>
                              </div>
                              <div className="px-4 py-3">
                                <p className="mb-2 text-xs font-bold text-foreground">📋 Assuntos do Edital</p>
                                {block.assuntos.length > 0 ? (
                                  <ul className="space-y-1.5">
                                    {block.assuntos.map((a, ai) => (
                                      <li key={ai} className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        {a}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-muted-foreground">Nenhum assunto cadastrado.</p>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden w-56 shrink-0 space-y-5 lg:block">
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-3 text-center text-xs font-bold capitalize text-foreground">
            {new Date(miniCalYear, miniCalMonth).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
              <span key={i} className="text-[10px] font-bold text-muted-foreground">{d}</span>
            ))}
            {Array.from({ length: miniCalFirstDay }).map((_, i) => <span key={`e-${i}`} />)}
            {Array.from({ length: miniCalDaysInMonth }).map((_, i) => {
              const dayDate = `${miniCalYear}-${String(miniCalMonth + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
              const hasPlan = allDatesWithPlans.has(dayDate);
              return (
                <button key={i}
                  onClick={() => {
                    const target = new Date(dayDate + "T00:00:00");
                    const diffMs = target.getTime() - startSunday.getTime();
                    const weekNum = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
                    if (weekNum >= 0 && weekNum < weeks.length) setCurrentWeekIdx(weekNum);
                  }}
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium transition-colors ${
                    hasPlan ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}>
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 text-xs font-bold text-foreground">SEMANAS</p>
          <div className="space-y-1">
            {weeks.slice(0, 8).map((_, i) => (
              <button key={i} onClick={() => setCurrentWeekIdx(i)}
                className={`block w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                  currentWeekIdx === i ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                }`}>
                Semana {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 text-xs font-bold text-foreground">MATÉRIAS</p>
          <div className="space-y-1.5">
            {uniqueSubjects.map(([id, colors]) => {
              const block = plans.flatMap((p) => p.blocks).find((b) => b.disciplinaId === id);
              if (!block) return null;
              return (
                <div key={id} className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-sm ${colors.bg} ${colors.border} border`} />
                  <span className="text-[11px] text-muted-foreground">{block.subject}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
