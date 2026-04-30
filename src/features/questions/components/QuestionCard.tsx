import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Question } from "@/features/questions/types";

const dificuldadeLabel: Record<Question["dificuldade"], string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

export function QuestionCard({ question }: { question: Question }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{question.materia}</Badge>
          {question.banca && <Badge variant="outline">{question.banca}</Badge>}
          <Badge variant="outline">{dificuldadeLabel[question.dificuldade]}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-base leading-relaxed">
          {question.enunciado}
        </p>
      </CardContent>
    </Card>
  );
}
