import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles, Calendar as CalendarIcon } from "lucide-react";
import { concursos } from "@/data/mockData";
import { editais, PlanningInput } from "@/data/planningData";

const DAYS = [
  { id: "segunda", label: "Seg" },
  { id: "terca", label: "Ter" },
  { id: "quarta", label: "Qua" },
  { id: "quinta", label: "Qui" },
  { id: "sexta", label: "Sex" },
  { id: "sabado", label: "Sáb" },
  { id: "domingo", label: "Dom" },
];

interface Props {
  onGenerate: (input: PlanningInput) => void;
}

export default function PlanningWizard({ onGenerate }: Props) {
  const [step, setStep] = useState(1);
  const [concursoId, setConcursoId] = useState("");
  const [studyEveryDay, setStudyEveryDay] = useState(true);
  const [studyDays, setStudyDays] = useState<string[]>([]);
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [examDate, setExamDate] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [level, setLevel] = useState<"iniciante" | "intermediario" | "avancado">("iniciante");
  const [difficultSubjects, setDifficultSubjects] = useState<string[]>([]);
  const [prioritySubjects, setPrioritySubjects] = useState<string[]>([]);

  const edital = concursoId ? editais[concursoId] : null;

  const toggleDay = (day: string) => {
    setStudyDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const toggleSubject = (id: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(id) ? list.filter((s) => s !== id) : [...list, id]);
  };

  const canProceed = () => {
    if (step === 1) return !!concursoId;
    if (step === 2) return studyEveryDay || studyDays.length > 0;
    if (step === 3) return hoursPerDay > 0;
    return true;
  };

  const handleGenerate = () => {
    onGenerate({
      concursoId,
      cargo: edital?.cargo || "",
      banca: edital?.banca || "",
      studyEveryDay,
      studyDays,
      hoursPerDay,
      examDate: examDate || null,
      startDate,
      level,
      difficultSubjects,
      prioritySubjects,
    });
  };

  const steps = [
    { num: 1, label: "Concurso" },
    { num: 2, label: "Rotina" },
    { num: 3, label: "Tempo" },
    { num: 4, label: "Contexto" },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <button
              onClick={() => s.num < step && setStep(s.num)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                step === s.num
                  ? "bg-primary text-primary-foreground"
                  : step > s.num
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s.num}
            </button>
            <span className={`hidden text-sm font-medium sm:inline ${step === s.num ? "text-foreground" : "text-muted-foreground"}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {/* Step 1: Concurso */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">Qual é o seu concurso?</h3>
              <p className="text-sm text-muted-foreground">Selecione o concurso para montar seu planejamento com base no edital.</p>
            </div>
            <div className="space-y-3">
              <Label>Concurso</Label>
              <Select value={concursoId} onValueChange={setConcursoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um concurso" />
                </SelectTrigger>
                <SelectContent>
                  {concursos.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {edital && (
              <div className="rounded-lg border bg-accent/30 p-4">
                <p className="text-sm font-bold text-foreground">📋 Detalhes do Edital</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">Cargo: {edital.cargo}</Badge>
                  <Badge variant="outline">Banca: {edital.banca}</Badge>
                  <Badge variant="outline">{edital.disciplinas.length} disciplinas</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {edital.disciplinas.map((d) => (
                    <span key={d.id} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Rotina */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">Sua rotina de estudo</h3>
              <p className="text-sm text-muted-foreground">Informe quais dias da semana você consegue estudar.</p>
            </div>
            <div className="space-y-4">
              <Label>Você estuda todos os dias?</Label>
              <RadioGroup
                value={studyEveryDay ? "sim" : "nao"}
                onValueChange={(v) => setStudyEveryDay(v === "sim")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="sim" id="every-yes" />
                  <Label htmlFor="every-yes" className="cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="nao" id="every-no" />
                  <Label htmlFor="every-no" className="cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
            </div>
            {!studyEveryDay && (
              <div className="space-y-3">
                <Label>Selecione os dias que estuda:</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => toggleDay(day.id)}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        studyDays.includes(day.id)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "border bg-card text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Tempo */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">Tempo disponível</h3>
              <p className="text-sm text-muted-foreground">Quantas horas por dia você tem para estudar?</p>
            </div>
            <div className="space-y-3">
              <Label>Horas por dia</Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={12}
                  step={0.5}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <span className="min-w-[4rem] rounded-lg bg-primary/10 px-3 py-1.5 text-center font-heading text-lg font-bold text-primary">
                  {hoursPerDay}h
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{hoursPerDay * 60} minutos por dia de estudo</p>
            </div>
          </div>
        )}

        {/* Step 4: Contexto */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">Contexto e prioridades</h3>
              <p className="text-sm text-muted-foreground">Informações adicionais para personalizar seu planejamento.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Data de início</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Data da prova (opcional)</Label>
                <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Seu nível de preparação</Label>
              <RadioGroup value={level} onValueChange={(v) => setLevel(v as typeof level)} className="flex gap-3">
                {[
                  { value: "iniciante", label: "🌱 Iniciante" },
                  { value: "intermediario", label: "📚 Intermediário" },
                  { value: "avancado", label: "🚀 Avançado" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem value={opt.value} id={`level-${opt.value}`} />
                    <Label htmlFor={`level-${opt.value}`} className="cursor-pointer text-sm">{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            {edital && (
              <>
                <div className="space-y-3">
                  <Label>Matérias com mais dificuldade (opcional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {edital.disciplinas.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => toggleSubject(d.id, difficultSubjects, setDifficultSubjects)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          difficultSubjects.includes(d.id)
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : "border-border text-muted-foreground hover:border-destructive/50"
                        }`}
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Matérias que deseja priorizar (opcional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {edital.disciplinas.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => toggleSubject(d.id, prioritySubjects, setPrioritySubjects)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          prioritySubjects.includes(d.id)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()} className="gap-1">
              Próximo <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleGenerate} disabled={!concursoId} className="gap-2 bg-highlight text-highlight-foreground hover:bg-highlight/90">
              <Sparkles className="h-4 w-4" />
              Gerar Planejamento
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
