import { useState } from "react";
import { DayPlan } from "@/data/planningData";
import { Badge } from "@/components/ui/badge";
import { BookOpen, HelpCircle, RotateCcw, Clock, ChevronDown, ChevronUp } from "lucide-react";

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  estudo: BookOpen,
  questoes: HelpCircle,
  revisao: RotateCcw,
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
}

interface Props {
  plans: DayPlan[];
}

export default function PlanListView({ plans }: Props) {
  return (
    <div className="space-y-4">
      {plans.map((day) => {
        const total = day.blocks.reduce((s, b) => s + b.duration, 0);
        return (
          <div key={day.date} className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-heading text-sm font-bold text-primary">
                  {new Date(day.date + "T00:00:00").getDate()}
                </div>
                <div>
                  <p className="text-sm font-bold capitalize text-foreground">{formatDate(day.date)}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {Math.floor(total / 60)}h{total % 60 > 0 ? `${total % 60}min` : ""} de estudo
                  </div>
                </div>
              </div>
              <Badge variant="outline">Ciclo {day.cyclePosition}</Badge>
            </div>
            <div className="divide-y px-5">
              {day.blocks.map((block, bi) => {
                const Icon = TYPE_ICONS[block.type] || BookOpen;
                return (
                  <ExpandableBlock key={bi} block={block} Icon={Icon} />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
