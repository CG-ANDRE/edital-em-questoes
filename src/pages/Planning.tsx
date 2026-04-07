import { useState } from "react";
import Layout from "@/components/Layout";
import PremiumGate from "@/components/planning/PremiumGate";
import PlanningWizard from "@/components/planning/PlanningWizard";
import PlanResult from "@/components/planning/PlanResult";
import { user } from "@/data/mockData";
import { PlanningInput, DayPlan, generateStudyPlan } from "@/data/planningData";

export default function Planning() {
  const isPremium = (user.plan as string) === "PREMIUM";
  const [plans, setPlans] = useState<DayPlan[] | null>(null);
  const [lastInput, setLastInput] = useState<PlanningInput | null>(null);

  const handleGenerate = (input: PlanningInput) => {
    setLastInput(input);
    const generated = generateStudyPlan(input);
    setPlans(generated);
  };

  const handleRegenerate = () => {
    if (lastInput) {
      const generated = generateStudyPlan(lastInput);
      setPlans(generated);
    }
  };

  const handleEdit = () => {
    setPlans(null);
  };

  // For demo: allow access even if not premium (toggle this)
  const allowAccess = true; // set to `isPremium` for real gating

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Planejamento de Estudos</h1>
        <p className="text-sm text-muted-foreground">
          Monte um cronograma personalizado baseado no seu edital e rotina.
        </p>
      </div>
      {!allowAccess ? (
        <PremiumGate />
      ) : plans && lastInput ? (
        <PlanResult plans={plans} input={lastInput} onRegenerate={handleRegenerate} onEdit={handleEdit} />
      ) : (
        <PlanningWizard onGenerate={handleGenerate} />
      )}
    </Layout>
  );
}
