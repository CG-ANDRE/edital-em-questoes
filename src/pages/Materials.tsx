import Layout from "@/components/Layout";
import { Lock, Crown, BookOpen, Landmark } from "lucide-react";
import { Link } from "react-router-dom";

const materials = [
  {
    id: 1,
    title: "História e Geografia de Roraima — ALERR 2026",
    description: "Cobertura completa do edital: ocupação territorial, fronteiras, povos indígenas, governadores...",
    tag: "ALERR",
    premium: true,
  },
  {
    id: 2,
    title: "Direito Constitucional — PF 2026",
    description: "Resumo esquematizado dos principais artigos cobrados pela CESPE/CEBRASPE.",
    tag: "PF",
    premium: true,
  },
  {
    id: 3,
    title: "Legislação Penal Especial — PCDF 2026",
    description: "Lei de Drogas, Abuso de Autoridade, Maria da Penha e outras leis essenciais.",
    tag: "PCDF",
    premium: true,
  },
  {
    id: 4,
    title: "Direito Administrativo — TJ SP 2026",
    description: "Atos administrativos, licitações, contratos e servidores públicos.",
    tag: "TJ SP",
    premium: false,
  },
];

export default function Materials() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-bold text-foreground">Materiais</h1>
              <span className="rounded-full bg-highlight px-3 py-0.5 text-xs font-bold text-highlight-foreground">
                PREMIUM
              </span>
            </div>
            <p className="mt-1 text-muted-foreground">
              Resumos completos por concurso, direto na plataforma. Você pode ler as 2 primeiras páginas gratuitamente.
            </p>
          </div>
        </div>

        {/* Aviso acesso parcial */}
        <div className="flex items-center gap-3 rounded-2xl border border-highlight/30 bg-highlight/5 px-5 py-4">
          <Lock className="h-5 w-5 text-highlight" />
          <p className="text-sm text-foreground">
            <span className="font-semibold text-highlight">Acesso parcial</span> — Você pode ler as 2 primeiras páginas de cada resumo. Assine o{" "}
            <Link to="/plans" className="font-bold text-primary hover:underline">Premium</Link> para acesso completo.
          </p>
        </div>

        {/* Lista de materiais */}
        <div className="space-y-3">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                {mat.premium ? (
                  <Landmark className="h-6 w-6 text-primary" />
                ) : (
                  <BookOpen className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                    {mat.tag}
                  </span>
                  {mat.premium && (
                    <span className="flex items-center gap-1 rounded-full bg-highlight/10 px-2.5 py-0.5 text-xs font-bold text-highlight">
                      <Crown className="h-3 w-3" />
                      PREMIUM
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-sm font-bold text-foreground">{mat.title}</h3>
                <p className="text-xs text-muted-foreground">{mat.description}</p>
              </div>
              <span className="text-muted-foreground">›</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
