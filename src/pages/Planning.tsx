import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PremiumGate from "@/components/planning/PremiumGate";
import PlanningWizard from "@/components/planning/PlanningWizard";
import PlanResult from "@/components/planning/PlanResult";
import { user } from "@/data/mockData";
import { PlanningInput, DayPlan, generateStudyPlan } from "@/data/planningData";

const STORAGE_KEY = "legisquest_study_plan";
const INPUT_STORAGE_KEY = "legisquest_study_plan_input";

function loadSavedPlan(): { plans: DayPlan[]; input: PlanningInput } | null {
  try {
    const plansRaw = localStorage.getItem(STORAGE_KEY);
    const inputRaw = localStorage.getItem(INPUT_STORAGE_KEY);
    if (plansRaw && inputRaw) {
      return { plans: JSON.parse(plansRaw), input: JSON.parse(inputRaw) };
    }
  } catch {
    // ignore
  }
  return null;
}

export default function Planning() {
  const isPremium = (user.plan as string) === "PREMIUM";
  const [plans, setPlans] = useState<DayPlan[] | null>(null);
  const [lastInput, setLastInput] = useState<PlanningInput | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Load saved plan on mount
  useEffect(() => {
    const saved = loadSavedPlan();
    if (saved) {
      setPlans(saved.plans);
      setLastInput(saved.input);
      setIsSaved(true);
    }
  }, []);

  const handleGenerate = (input: PlanningInput) => {
    setLastInput(input);
    const generated = generateStudyPlan(input);
    setPlans(generated);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (plans && lastInput) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
      localStorage.setItem(INPUT_STORAGE_KEY, JSON.stringify(lastInput));
      setIsSaved(true);
    }
  };

  const handleRegenerate = () => {
    if (lastInput) {
      const generated = generateStudyPlan(lastInput);
      setPlans(generated);
      setIsSaved(false);
    }
  };

  const handleEdit = () => {
    setPlans(null);
  };

  const allowAccess = true;

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
        <PlanResult
          plans={plans}
          input={lastInput}
          onRegenerate={handleRegenerate}
          onEdit={handleEdit}
          onSave={handleSave}
          isSaved={isSaved}
        />
      ) : (
        <PlanningWizard onGenerate={handleGenerate} />
      )}
    </Layout>
  );
}
