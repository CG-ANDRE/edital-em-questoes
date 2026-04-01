import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { concursos, materias } from "@/data/mockData";
import { ChevronDown, ChevronRight, Play, Star, XCircle, EyeOff } from "lucide-react";

export default function Practice() {
  const navigate = useNavigate();
  const [selectedConcurso, setSelectedConcurso] = useState("");
  const [expandedMaterias, setExpandedMaterias] = useState<string[]>([]);
  const [selectedLeis, setSelectedLeis] = useState<string[]>([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyUnanswered, setOnlyUnanswered] = useState(false);
  const [onlyErrors, setOnlyErrors] = useState(false);

  const toggleMateria = (id: string) => {
    setExpandedMaterias((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleLei = (id: string) => {
    setSelectedLeis((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const toggleAllLeis = (materia: typeof materias[0]) => {
    const allIds = materia.leis.map((l) => l.id);
    const allSelected = allIds.every((id) => selectedLeis.includes(id));
    if (allSelected) {
      setSelectedLeis((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedLeis((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const totalQuestions = materias
    .flatMap((m) => m.leis)
    .filter((l) => selectedLeis.length === 0 || selectedLeis.includes(l.id))
    .reduce((sum, l) => sum + l.questions, 0);

  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Configurar Prática</h1>
          <p className="text-muted-foreground">Selecione os filtros e comece a resolver questões.</p>
        </div>

        {/* Concurso */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 font-heading text-base font-bold text-foreground">Concurso</h2>
          <select
            value={selectedConcurso}
            onChange={(e) => setSelectedConcurso(e.target.value)}
            className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Todos os concursos</option>
            {concursos.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Matérias e Leis */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 font-heading text-base font-bold text-foreground">Matérias e Leis</h2>
          <div className="space-y-1">
            {materias.map((materia) => {
              const isExpanded = expandedMaterias.includes(materia.id);
              const allLeiIds = materia.leis.map((l) => l.id);
              const allSelected = allLeiIds.every((id) => selectedLeis.includes(id));
              const someSelected = allLeiIds.some((id) => selectedLeis.includes(id));

              return (
                <div key={materia.id} className="rounded-lg border">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                      onChange={() => toggleAllLeis(materia)}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                    <button
                      onClick={() => toggleMateria(materia.id)}
                      className="flex flex-1 items-center justify-between"
                    >
                      <span className="text-sm font-semibold text-foreground">{materia.name}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="border-t bg-muted/30 px-4 py-2 space-y-2">
                      {materia.leis.map((lei) => (
                        <label key={lei.id} className="flex items-center justify-between gap-2 py-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedLeis.includes(lei.id)}
                              onChange={() => toggleLei(lei.id)}
                              className="h-4 w-4 rounded border-border accent-primary"
                            />
                            <span className="text-sm text-foreground">{lei.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{lei.questions} questões</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 font-heading text-base font-bold text-foreground">Filtros adicionais</h2>
          <div className="space-y-3">
            {[
              { label: "Apenas favoritas", icon: Star, value: onlyFavorites, set: setOnlyFavorites },
              { label: "Apenas não resolvidas", icon: EyeOff, value: onlyUnanswered, set: setOnlyUnanswered },
              { label: "Caderno de erros", icon: XCircle, value: onlyErrors, set: setOnlyErrors },
            ].map((toggle) => (
              <label key={toggle.label} className="flex items-center justify-between rounded-lg border px-4 py-3">
                <div className="flex items-center gap-2">
                  <toggle.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{toggle.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggle.set(!toggle.value)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    toggle.value ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${
                      toggle.value ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => navigate("/question")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-heading text-base font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play className="h-5 w-5" />
          Iniciar Prática ({totalQuestions} questões)
        </button>
      </div>
    </Layout>
  );
}
