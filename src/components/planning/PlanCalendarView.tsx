import { DayPlan, StudyBlock } from "@/data/planningData";
import { Badge } from "@/components/ui/badge";

const TYPE_COLORS: Record<string, string> = {
  estudo: "bg-primary/10 border-primary/30 text-primary",
  questoes: "bg-highlight/10 border-highlight/30 text-highlight",
  revisao: "bg-secondary/10 border-secondary/30 text-secondary",
};

const TYPE_LABELS: Record<string, string> = {
  estudo: "Estudo",
  questoes: "Questões",
  revisao: "Revisão",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function BlockCard({ block }: { block: StudyBlock }) {
  return (
    <div className={`rounded-lg border p-2 text-xs ${TYPE_COLORS[block.type]}`}>
      <p className="font-bold leading-tight">{block.subject}</p>
      <div className="mt-1 flex items-center justify-between">
        <span className="opacity-70">{block.duration} min</span>
        <span className="rounded bg-background/50 px-1 text-[10px] font-medium">{TYPE_LABELS[block.type]}</span>
      </div>
    </div>
  );
}

interface Props {
  plans: DayPlan[];
}

export default function PlanCalendarView({ plans }: Props) {
  // Group by weeks
  const weeks: DayPlan[][] = [];
  let currentWeek: DayPlan[] = [];

  plans.forEach((plan, i) => {
    currentWeek.push(plan);
    const nextPlan = plans[i + 1];
    if (!nextPlan || new Date(nextPlan.date + "T00:00:00").getDay() <= new Date(plan.date + "T00:00:00").getDay()) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <div className="space-y-6">
      {weeks.map((week, wi) => (
        <div key={wi}>
          <h4 className="mb-3 font-heading text-sm font-bold text-muted-foreground">
            Semana {wi + 1}
          </h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {week.map((day) => (
              <div key={day.date} className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-heading text-sm font-bold text-foreground">{day.dayOfWeek}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(day.date)}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Ciclo {day.cyclePosition}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {day.blocks.map((block, bi) => (
                    <BlockCard key={bi} block={block} />
                  ))}
                </div>
                <div className="mt-3 border-t pt-2">
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Total: {day.blocks.reduce((s, b) => s + b.duration, 0)} min
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
