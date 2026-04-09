import { DayPlan, QuestionBlock } from "@/data/planningData";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, CalendarDays } from "lucide-react";

interface RevisionItem {
  date: string;
  dayLabel: string;
  daysFromNow: number;
  subject: string;
  disciplinaId: string;
  questions: number;
  assuntos: string[];
}

function buildTimeline(plans: DayPlan[]): RevisionItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const items: RevisionItem[] = [];

  for (const day of plans) {
    const dayDate = new Date(day.date + "T00:00:00");
    const diffDays = Math.round((dayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) continue;

    for (const block of day.blocks) {
      items.push({
        date: day.date,
        dayLabel: day.dayOfWeek,
        daysFromNow: diffDays,
        subject: block.subject,
        disciplinaId: block.disciplinaId,
        questions: block.questions,
        assuntos: block.assuntos || [],
      });
    }
  }
  return items.slice(0, 30);
}

function formatDateBR(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" }).toUpperCase();
}

function getDaysLabel(days: number) {
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  return `${days} dias`;
}

function getDayOfWeekShort(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "short" }).toUpperCase().replace(".", "");
}

export default function RevisionTimeline({ plans }: { plans: DayPlan[] }) {
  const items = buildTimeline(plans);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <Target className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Nenhuma meta programada.</p>
      </div>
    );
  }

  const grouped = new Map<string, RevisionItem[]>();
  items.forEach((item) => {
    const existing = grouped.get(item.date) || [];
    existing.push(item);
    grouped.set(item.date, existing);
  });

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h3 className="font-heading text-lg font-bold text-foreground">Metas Programadas</h3>
      </div>

      <div className="relative">
        <div className="absolute left-[72px] top-0 bottom-0 w-px bg-primary/20" />
        <div className="space-y-1">
          {Array.from(grouped.entries()).map(([date, dayItems]) => {
            const first = dayItems[0];
            const dayTotal = dayItems.reduce((s, i) => s + i.questions, 0);
            return (
              <div key={date}>
                <div className="relative flex items-center gap-4 py-3">
                  <div className="w-[60px] text-right">
                    <p className="text-xs font-bold text-foreground">{formatDateBR(date).split(" DE ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground">{getDayOfWeekShort(date)}</p>
                  </div>
                  <div className="relative z-10 flex h-3 w-3 items-center justify-center">
                    <div className={`h-3 w-3 rounded-full ${first.daysFromNow === 0 ? "bg-primary ring-4 ring-primary/20" : "bg-primary/40"}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{getDaysLabel(first.daysFromNow)}</Badge>
                    <Badge className="bg-primary/10 text-primary text-[10px] border-0">
                      <Target className="mr-0.5 h-2.5 w-2.5" /> {dayTotal} questões
                    </Badge>
                  </div>
                </div>

                {dayItems.map((item, i) => (
                  <div key={i} className="relative ml-[76px] mb-2 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="h-4 w-4 text-primary" />
                          <p className="text-sm font-bold text-foreground">{item.subject}</p>
                        </div>
                        {item.assuntos.length > 0 && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.assuntos[0]}</p>
                        )}
                      </div>
                      <Badge className="bg-primary/10 text-primary text-xs border-0 shrink-0">
                        {item.questions} questões
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
