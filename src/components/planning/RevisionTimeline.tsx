import { DayPlan, StudyBlock } from "@/data/planningData";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, BookOpen, HelpCircle, Clock, CalendarDays } from "lucide-react";

interface RevisionItem {
  date: string;
  dayLabel: string;
  daysFromNow: number;
  subject: string;
  disciplinaId: string;
  type: StudyBlock["type"];
  duration: number;
  assuntos: string[];
}

function buildRevisionTimeline(plans: DayPlan[]): RevisionItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const items: RevisionItem[] = [];

  for (const day of plans) {
    const dayDate = new Date(day.date + "T00:00:00");
    const diffMs = dayDate.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // Show today + future revision/question blocks, plus regular study
    for (const block of day.blocks) {
      if (diffDays < 0) continue; // skip past

      items.push({
        date: day.date,
        dayLabel: day.dayOfWeek,
        daysFromNow: diffDays,
        subject: block.subject,
        disciplinaId: block.disciplinaId,
        type: block.type,
        duration: block.duration,
        assuntos: block.assuntos || [],
      });
    }
  }

  return items.slice(0, 30); // limit for performance
}

function formatDateBR(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" }).toUpperCase();
}

function getDaysLabel(days: number) {
  if (days === 0) return "Hoje";
  if (days === 1) return "1 dia";
  return `${days} dias`;
}

function getTypeConfig(type: StudyBlock["type"]) {
  switch (type) {
    case "questoes":
      return { label: "QUESTÕES", color: "bg-highlight text-highlight-foreground", Icon: HelpCircle };
    case "revisao":
      return { label: "REVISÃO", color: "bg-secondary text-secondary-foreground", Icon: RotateCcw };
    default:
      return { label: "ESTUDO", color: "bg-primary text-primary-foreground", Icon: BookOpen };
  }
}

function getDayOfWeekShort(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { weekday: "short" }).toUpperCase().replace(".", "");
}

export default function RevisionTimeline({ plans }: { plans: DayPlan[] }) {
  const items = buildRevisionTimeline(plans);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <RotateCcw className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Nenhuma revisão programada.</p>
      </div>
    );
  }

  // Group by date
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
        <h3 className="font-heading text-lg font-bold text-foreground">Revisões Programadas</h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[72px] top-0 bottom-0 w-px bg-primary/20" />

        <div className="space-y-1">
          {Array.from(grouped.entries()).map(([date, dayItems]) => {
            const first = dayItems[0];
            return (
              <div key={date}>
                {/* Date header */}
                <div className="relative flex items-center gap-4 py-3">
                  <div className="w-[60px] text-right">
                    <p className="text-xs font-bold text-foreground">{formatDateBR(date).split(" DE ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground">{getDayOfWeekShort(date)}</p>
                  </div>
                  <div className="relative z-10 flex h-3 w-3 items-center justify-center">
                    <div className={`h-3 w-3 rounded-full ${first.daysFromNow === 0 ? "bg-primary ring-4 ring-primary/20" : "bg-primary/40"}`} />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {getDaysLabel(first.daysFromNow)}
                  </Badge>
                </div>

                {/* Blocks for this day */}
                {dayItems.map((item, i) => {
                  const { label, color, Icon } = getTypeConfig(item.type);
                  return (
                    <div key={i} className="relative ml-[76px] mb-2 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-bold text-foreground">{item.subject.replace(/^Questões de /, "").toUpperCase()}</p>
                          </div>
                          {item.assuntos.length > 0 && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {item.assuntos[0]}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge className={`${color} text-[10px]`}>{label}</Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {item.duration}min
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
