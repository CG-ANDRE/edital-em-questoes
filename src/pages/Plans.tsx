import Layout from "@/components/Layout";
import { Check, X, Crown, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "",
    description: "Para começar a estudar",
    highlighted: false,
    features: [
      { text: "10 questões por dia", included: true },
      { text: "Acesso a 2 matérias", included: true },
      { text: "Estatísticas básicas", included: true },
      { text: "Comentários do professor", included: false },
      { text: "Caderno de erros", included: false },
      { text: "Questões ilimitadas", included: false },
      { text: "Filtro por banca e ano", included: false },
      { text: "Heatmap de atividade", included: false },
      { text: "Simulados completos", included: false },
      { text: "Suporte prioritário", included: false },
    ],
  },
  {
    name: "Premium",
    price: "R$ 29,90",
    period: "/mês",
    description: "Acesso completo para aprovação",
    highlighted: true,
    features: [
      { text: "Questões ilimitadas", included: true },
      { text: "Todas as matérias e leis", included: true },
      { text: "Estatísticas avançadas", included: true },
      { text: "Comentários do professor", included: true },
      { text: "Caderno de erros", included: true },
      { text: "Questões ilimitadas", included: true },
      { text: "Filtro por banca e ano", included: true },
      { text: "Heatmap de atividade", included: true },
      { text: "Simulados completos", included: true },
      { text: "Suporte prioritário", included: true },
    ],
  },
];

export default function Plans() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">Escolha seu Plano</h1>
          <p className="mt-2 text-muted-foreground">
            Desbloqueie todo o potencial da plataforma para acelerar sua aprovação.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border-2 bg-card p-8 shadow-sm transition-transform hover:scale-[1.02] ${
                plan.highlighted
                  ? "border-highlight shadow-lg shadow-highlight/10"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 rounded-full bg-highlight px-4 py-1 text-xs font-bold text-highlight-foreground">
                    <Sparkles className="h-3 w-3" /> MAIS POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  {plan.highlighted && <Crown className="h-5 w-5 text-highlight" />}
                  <h2 className="font-heading text-xl font-bold text-foreground">{plan.name}</h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="font-heading text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {f.included ? (
                      <div className="rounded-full bg-accent p-0.5">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-muted p-0.5">
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                    <span className={`text-sm ${f.included ? "text-foreground" : "text-muted-foreground"}`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full rounded-xl py-3 font-heading text-sm font-bold transition-colors ${
                  plan.highlighted
                    ? "bg-highlight text-highlight-foreground hover:bg-highlight/90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {plan.highlighted ? "Assinar Premium" : "Plano Atual"}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Cancele a qualquer momento. Garantia de 7 dias.
          </p>
        </div>
      </div>
    </Layout>
  );
}
