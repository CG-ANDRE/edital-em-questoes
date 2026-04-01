import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { questions } from "@/data/mockData";
import { ChevronLeft, ChevronRight, Shuffle, Star, BookOpen, AlertCircle } from "lucide-react";

export default function QuestionPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set([2]));

  const q = questions[currentIndex];
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === q.correctIndex;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setSelectedOption(null);
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) goTo(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  };

  const goRandom = () => {
    let next: number;
    do {
      next = Math.floor(Math.random() * questions.length);
    } while (next === currentIndex && questions.length > 1);
    goTo(next);
  };

  const toggleFavorite = () => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(q.id)) next.delete(q.id);
      else next.add(q.id);
      return next;
    });
  };

  const optionLetter = (i: number) => q.type === "boolean" ? "" : String.fromCharCode(65 + i) + ") ";

  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/practice")} className="text-sm text-muted-foreground hover:text-foreground">
            ← Voltar aos filtros
          </button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border bg-card shadow-sm">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 border-b px-6 py-3">
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
              {q.concurso}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {q.materia}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {q.lei}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {q.year}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              q.difficulty === "Fácil" ? "bg-accent text-accent-foreground" :
              q.difficulty === "Médio" ? "bg-highlight/20 text-highlight" :
              "bg-destructive/15 text-destructive"
            }`}>
              {q.difficulty}
            </span>
            <button onClick={toggleFavorite} className="ml-auto">
              <Star className={`h-5 w-5 ${favorites.has(q.id) ? "fill-highlight text-highlight" : "text-muted-foreground"}`} />
            </button>
          </div>

          {/* Statement */}
          <div className="px-6 py-5">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{q.statement}</p>
          </div>

          {/* Options */}
          <div className="space-y-2 px-6 pb-6">
            {q.options.map((option, i) => {
              let optionClass = "border bg-background hover:border-primary/50 cursor-pointer";
              if (isAnswered) {
                if (i === q.correctIndex) {
                  optionClass = "border-2 border-primary bg-accent";
                } else if (i === selectedOption) {
                  optionClass = "border-2 border-destructive bg-destructive/10";
                } else {
                  optionClass = "border bg-muted/30 opacity-60";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left transition-all ${optionClass}`}
                >
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isAnswered && i === q.correctIndex
                      ? "bg-primary text-primary-foreground"
                      : isAnswered && i === selectedOption
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {q.type === "boolean" ? (option === "Certo" ? "C" : "E") : String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-foreground">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div className={`border-t px-6 py-5 ${isCorrect ? "bg-accent/50" : "bg-destructive/5"}`}>
              <div className="mb-3 flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <div className="rounded-full bg-primary p-1">
                      <AlertCircle className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-heading text-base font-bold text-primary">Resposta Correta! 🎉</span>
                  </>
                ) : (
                  <>
                    <div className="rounded-full bg-destructive p-1">
                      <AlertCircle className="h-4 w-4 text-destructive-foreground" />
                    </div>
                    <span className="font-heading text-base font-bold text-destructive">Resposta Incorreta</span>
                  </>
                )}
              </div>

              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-primary">Comentário do Professor</span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-foreground">{q.comment}</p>
                <div className="rounded-lg bg-accent/70 px-3 py-2">
                  <p className="text-xs font-semibold text-accent-foreground">📖 {q.article}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <button
            onClick={goRandom}
            className="flex items-center gap-1 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            <Shuffle className="h-4 w-4" /> Aleatória
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === questions.length - 1}
            className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            Próxima <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
