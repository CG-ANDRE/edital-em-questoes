import { useState } from "react";
import { DayPlan } from "@/data/planningData";
import { Badge } from "@/components/ui/badge";
import { Target, ChevronDown, ChevronUp } from "lucide-react";

function ExpandableBlock({ block }: { block: DayPlan["blocks"][0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-3">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-4 text-left">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Target className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{block.subject}</p>
          <p className="text-xs text-muted-foreground">{block.questions} questões</p>
        </div>
        <span className="text-sm font-bold text-primary">{block.questions}q</span>
        {block.assuntos && block.assuntos.length > 0 && (
          open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && block.assuntos && block.assuntos.length > 0 && (
        <div className="ml-12 mt-2 rounded-lg border bg-muted/30 p-3">
          <p className="mb-1.5 text-xs font-bold text-foreground">📋 Assuntos do Edital</p>
          <ul className="space-y-1">
            {block.assuntos.map((assunto, ai) => (
              <li key={ai} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {assunto}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

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
      {plans.map((day) => (
        <div key={day.date} className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-heading text-sm font-bold text-primary">
                {new Date(day.date + "T00:00:00").getDate()}
              </div>
              <div>
                <p className="text-sm font-bold capitalize text-foreground">{formatDate(day.date)}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  {day.totalQuestions} questões no dia
                </div>
              </div>
            </div>
            <Badge variant="outline">Ciclo {day.cyclePosition}</Badge>
          </div>
          <div className="divide-y px-5">
            {day.blocks.map((block, bi) => (
              <ExpandableBlock key={bi} block={block} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
