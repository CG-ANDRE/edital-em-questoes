import { Crown, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PremiumGate() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-highlight/10">
        <Lock className="h-10 w-10 text-highlight" />
      </div>
      <h2 className="font-heading text-2xl font-bold text-foreground">
        Recurso Premium
      </h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        O Planejamento Inteligente de Estudos está disponível apenas para alunos premium. 
        Gere cronogramas personalizados, ciclos de estudo otimizados e muito mais.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/plans">
          <Button className="gap-2 bg-highlight text-highlight-foreground hover:bg-highlight/90">
            <Crown className="h-4 w-4" />
            Assinar Premium
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline">Voltar ao Início</Button>
        </Link>
      </div>
      <div className="mt-10 grid max-w-lg gap-4 text-left sm:grid-cols-2">
        {[
          { icon: "📅", title: "Calendário de estudos", desc: "Planejamento visual dia a dia" },
          { icon: "🔄", title: "Ciclo inteligente", desc: "Distribuição otimizada de matérias" },
          { icon: "🎯", title: "Personalizado", desc: "Baseado no seu edital e rotina" },
          { icon: "🖨️", title: "Exportar PDF", desc: "Imprima seu planejamento" },
        ].map((f) => (
          <div key={f.title} className="flex gap-3 rounded-lg border bg-card p-3">
            <span className="text-xl">{f.icon}</span>
            <div>
              <p className="text-sm font-bold text-foreground">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
