import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { parseAlternativas, correctAnswerOf } from "@/features/questions/api";
import type { AnswerLabel, Question } from "@/features/questions/types";
import type { UserAnswer } from "@/features/questions/types";

type Props = {
  question: Question;
  answer: UserAnswer;
  onNext: () => void;
};

export function AnswerFeedback({ question, answer, onNext }: Props) {
  const alternativas = parseAlternativas(question);
  const correct = correctAnswerOf(question);
  const selected = answer.selected_answer as AnswerLabel;
  const isCorrect = answer.is_correct;

  return (
    <div className="space-y-4">
      <Card className={isCorrect ? "border-green-500" : "border-destructive"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <span className="text-green-700">Resposta correta!</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-destructive" />
                <span className="text-destructive">Resposta incorreta</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            Você marcou <strong>{selected})</strong>
            {!isCorrect && (
              <>
                . O gabarito é <strong>{correct})</strong>
              </>
            )}
            .
          </p>

          <div className="space-y-2">
            {alternativas.map((alt) => {
              const isSelected = alt.label === selected;
              const isCorrectAlt = alt.label === correct;
              const cls = isCorrectAlt
                ? "bg-green-50 border-green-300"
                : isSelected && !isCorrect
                  ? "bg-red-50 border-red-300"
                  : "border-muted";
              return (
                <div
                  key={alt.label}
                  className={`flex items-start gap-3 p-3 rounded-md border ${cls}`}
                >
                  <span className="font-bold">{alt.label})</span>
                  <span className="flex-1 text-sm">{alt.text}</span>
                  {isCorrectAlt && (
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle className="h-4 w-4 text-destructive shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">💡 Comentário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {question.justificativa}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext} className="min-h-[44px]">
          Próxima questão
        </Button>
      </div>
    </div>
  );
}
