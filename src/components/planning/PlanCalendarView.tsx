import { useState } from "react";
import { DayPlan, StudyBlock } from "@/data/planningData";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Soft pastel palette for subjects — cycles through for variety
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

function formatDay(dateStr: string) {
  return new Date(dateStr + "T00:00:00").getDate();
}

interface Props {
  plans: DayPlan[];
}

export default function PlanCalendarView({ plans }: Props) {
  const [currentWeekIdx, setCurrentWeekIdx] = useState(0);

  // Build color map for subjects
  const subjectColorMap = new Map<string, (typeof SUBJECT_COLORS)[0]>();
  let colorIdx = 0;
  plans.forEach((day) => {
    day.blocks.forEach((block) => {
      const key = block.disciplinaId;
      if (!subjectColorMap.has(key)) {
        subjectColorMap.set(key, SUBJECT_COLORS[colorIdx % SUBJECT_COLORS.length]);
        colorIdx++;
      }
    });
  });

  // Group plans by week (Sun-Sat grid)
  const weeks: (DayPlan | null)[][] = [];
  if (plans.length === 0) return null;

  // Find the range
  const firstDate = new Date(plans[0].date + "T00:00:00");
  const lastDate = new Date(plans[plans.length - 1].date + "T00:00:00");

  // Build a lookup
  const planMap = new Map<string, DayPlan>();
  plans.forEach((p) => planMap.set(p.date, p));

  // Start from the Sunday of the first week
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

  // Get month label from current visible week
  const currentMonthLabel = (() => {
    const w = weeks[currentWeekIdx] || weeks[0];
    const firstDay = w.find((d) => d !== null);
    if (firstDay) return formatMonthYear(firstDay.date);
    // fallback: get date from position
    const refDate = new Date(startSunday);
    refDate.setDate(refDate.getDate() + currentWeekIdx * 7);
    return refDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  })();

  // Mini calendar data for the sidebar
  const allDatesWithPlans = new Set(plans.map((p) => p.date));

  // Current month for mini calendar
  const refDateForMonth = (() => {
    const w = weeks[currentWeekIdx] || weeks[0];
    const d = w.find((p) => p !== null);
    return d ? new Date(d.date + "T00:00:00") : firstDate;
  })();

  const miniCalMonth = refDateForMonth.getMonth();
  const miniCalYear = refDateForMonth.getFullYear();
  const miniCalFirstDay = new Date(miniCalYear, miniCalMonth, 1).getDay();
  const miniCalDaysInMonth = new Date(miniCalYear, miniCalMonth + 1, 0).getDate();

  // Subject legend
  const uniqueSubjects = Array.from(subjectColorMap.entries());

  return (
    <div className="flex gap-6">
      {/* Main calendar grid */}
      <div className="flex-1 min-w-0">
        {/* Navigation header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showPagination && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentWeekIdx((i) => Math.max(0, i - 1))}
                disabled={currentWeekIdx === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <h3 className="font-heading text-lg font-bold capitalize text-foreground">
              {currentMonthLabel}
            </h3>
            {showPagination && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentWeekIdx((i) => Math.min(weeks.length - 1, i + 1))}
                disabled={currentWeekIdx === weeks.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          {showPagination && (
            <span className="text-xs text-muted-foreground">
              Semana {currentWeekIdx + 1} de {weeks.length}
            </span>
          )}
        </div>

        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-px rounded-t-xl bg-border overflow-hidden">
          {WEEKDAY_HEADERS.map((day) => (
            <div
              key={day}
              className="bg-muted/50 px-2 py-2 text-center text-xs font-bold text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Week rows */}
        <div className="grid grid-cols-7 gap-px bg-border rounded-b-xl overflow-hidden">
          {visibleWeeks.flatMap((week, wi) =>
            week.map((day, di) => {
              const cellDate = new Date(startSunday);
              cellDate.setDate(cellDate.getDate() + (currentWeekIdx * 7) + di);
              const dayNum = cellDate.getDate();
              const hasStudy = day && day.blocks.length > 0;

              return (
                <div
                  key={`${wi}-${di}`}
                  className={`min-h-[180px] bg-card p-2 ${
                    !hasStudy ? "bg-muted/20" : ""
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className={`text-xs font-bold ${hasStudy ? "text-foreground" : "text-muted-foreground/50"}`}>
                      {dayNum}
                    </span>
                    {day && (
                      <span className="text-[9px] font-medium text-muted-foreground">
                        Ciclo {day.cyclePosition}
                      </span>
                    )}
                  </div>
                  {day && (
                    <div className="space-y-1">
                      {day.blocks.map((block, bi) => {
                        const colors = subjectColorMap.get(block.disciplinaId) || SUBJECT_COLORS[0];
                        return (
                          <div
                            key={bi}
                            className={`rounded-md border px-2 py-1.5 ${colors.bg} ${colors.border}`}
                          >
                            <p className={`text-[11px] font-bold leading-tight ${colors.text}`}>
                              {block.subject}
                            </p>
                            <p className={`text-[10px] ${colors.text} opacity-70`}>
                              {block.duration} min
                            </p>
                          </div>
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

      {/* Sidebar: mini calendar + legend */}
      <div className="hidden w-56 shrink-0 space-y-5 lg:block">
        {/* Mini calendar */}
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-3 text-center text-xs font-bold capitalize text-foreground">
            {new Date(miniCalYear, miniCalMonth).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
              <span key={i} className="text-[10px] font-bold text-muted-foreground">{d}</span>
            ))}
            {Array.from({ length: miniCalFirstDay }).map((_, i) => (
              <span key={`e-${i}`} />
            ))}
            {Array.from({ length: miniCalDaysInMonth }).map((_, i) => {
              const dayDate = `${miniCalYear}-${String(miniCalMonth + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
              const hasPlan = allDatesWithPlans.has(dayDate);
              return (
                <button
                  key={i}
                  onClick={() => {
                    // Find which week this date belongs to
                    const target = new Date(dayDate + "T00:00:00");
                    const diffMs = target.getTime() - startSunday.getTime();
                    const weekNum = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
                    if (weekNum >= 0 && weekNum < weeks.length) setCurrentWeekIdx(weekNum);
                  }}
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium transition-colors ${
                    hasPlan
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Semanas rápidas */}
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 text-xs font-bold text-foreground">SEMANAS ACADÊMICAS</p>
          <div className="space-y-1">
            {weeks.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentWeekIdx(i)}
                className={`block w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                  currentWeekIdx === i
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Semana {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Subject legend */}
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 text-xs font-bold text-foreground">MATÉRIAS</p>
          <div className="space-y-1.5">
            {uniqueSubjects.map(([id, colors]) => {
              const block = plans.flatMap((p) => p.blocks).find((b) => b.disciplinaId === id);
              if (!block) return null;
              return (
                <div key={id} className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-sm ${colors.bg} ${colors.border} border`} />
                  <span className="text-[11px] text-muted-foreground">{block.subject.replace(/^Questões de /, "")}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
