import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DayPlan, PlanningInput, editais } from "@/data/planningData";
import PlanCalendarView from "./PlanCalendarView";
import PlanListView from "./PlanListView";
import RevisionTimeline from "./RevisionTimeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List, Printer, Download, RefreshCw, Settings2, Save, CheckCircle2, Play, Target } from "lucide-react";

interface Props {
  plans: DayPlan[];
  input: PlanningInput;
  onRegenerate: () => void;
  onEdit: () => void;
  onSave: () => void;
  isSaved: boolean;
}

export default function PlanResult({ plans, input, onRegenerate, onEdit, onSave, isSaved }: Props) {
  const navigate = useNavigate();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const printRef = useRef<HTMLDivElement>(null);
  const edital = editais[input.concursoId];

  const totalDays = plans.length;
  const totalQuestions = plans.reduce((s, p) => s + p.totalQuestions, 0);

  const handlePrint = () => window.print();

  return (
    <div>
      {/* Header summary */}
      <div className="mb-6 rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground">
              🎯 Seu Plano de Questões
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {edital?.cargo} • {edital?.banca}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary/10 text-primary">{totalDays} dias</Badge>
            <Badge className="bg-highlight/10 text-highlight">
              <Target className="mr-1 h-3 w-3" /> {totalQuestions.toLocaleString()} questões
            </Badge>
            <Badge className="bg-secondary/10 text-secondary">{edital?.disciplinas.length} matérias</Badge>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => navigate("/study-session")} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Play className="h-3.5 w-3.5" /> Iniciar Questões
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
            <Settings2 className="h-3.5 w-3.5" /> Editar
          </Button>
          <Button variant="outline" size="sm" onClick={onRegenerate} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Regenerar
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-3.5 w-3.5" /> Imprimir
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-1.5 bg-highlight text-highlight-foreground hover:bg-highlight/90">
            <Download className="h-3.5 w-3.5" /> Baixar PDF
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaved}
            className={`gap-1.5 ${isSaved ? "bg-green-600 hover:bg-green-600 text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/90"}`}
          >
            {isSaved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {isSaved ? "Salvo" : "Salvar"}
          </Button>
        </div>
      </div>

      {/* View toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")} className="mb-6">
        <TabsList>
          <TabsTrigger value="calendar" className="gap-1.5">
            <CalendarDays className="h-4 w-4" /> Calendário
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-1.5">
            <List className="h-4 w-4" /> Lista Detalhada
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content */}
      <div ref={printRef} className="print-content">
        <div className="mb-6 hidden print:block">
          <h1 className="text-center font-heading text-xl font-bold">LegisQuest — Plano de Questões</h1>
          <p className="text-center text-sm text-muted-foreground">
            {edital?.cargo} • {edital?.banca} • {totalDays} dias • {totalQuestions.toLocaleString()} questões
          </p>
        </div>
        {view === "calendar" ? <PlanCalendarView plans={plans} /> : <PlanListView plans={plans} />}
      </div>

      <RevisionTimeline plans={plans} />
    </div>
  );
}
