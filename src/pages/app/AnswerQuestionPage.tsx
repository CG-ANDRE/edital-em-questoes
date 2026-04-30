import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useActiveUserEdital } from "@/features/editais/hooks/useActiveUserEdital";
import { useNextQuestion } from "@/features/questions/hooks/useNextQuestion";
import { useAnswerQuestion } from "@/features/questions/hooks/useAnswerQuestion";
import { QuestionCard } from "@/features/questions/components/QuestionCard";
import { AnswerForm } from "@/features/questions/components/AnswerForm";
import { AnswerFeedback } from "@/features/questions/components/AnswerFeedback";
import { useSession } from "@/features/auth/hooks/useSession";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import type { AnswerLabel, UserAnswer } from "@/features/questions/types";

export default function AnswerQuestionPage() {
  const qc = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id;
  const { data: activeEdital, isLoading: editalLoading } = useActiveUserEdital();
  const editalId = activeEdital?.edital_id;

  const {
    data: question,
    isLoading: questionLoading,
    refetch: refetchNext,
  } = useNextQuestion(editalId);

  const [answerResult, setAnswerResult] = useState<UserAnswer | null>(null);
  const startedAt = useRef<number>(Date.now());

  // Reset timer ao trocar de questão
  useEffect(() => {
    if (question) {
      startedAt.current = Date.now();
      setAnswerResult(null);
    }
  }, [question?.id]);

  const answerMutation = useAnswerQuestion({
    question: question ?? ({} as never),
  });

  const handleSubmit = (selected: AnswerLabel) => {
    if (!question || !editalId || !userId) return;
    const timeSpentMs = Date.now() - startedAt.current;
    answerMutation.mutate(
      {
        questionId: question.id,
        editalId,
        selectedAnswer: selected,
        timeSpentMs,
      },
      {
        onSuccess: (data) => {
          setAnswerResult(data);
        },
      }
    );
  };

  const handleNext = () => {
    setAnswerResult(null);
    if (editalId && userId) {
      qc.invalidateQueries({ queryKey: ["questions", "next", editalId, userId] });
    }
    refetchNext();
  };

  // Estado: sem edital ativo
  if (!editalLoading && !activeEdital) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="font-medium">Você ainda não escolheu um edital</p>
            <p className="text-sm text-muted-foreground">
              Selecione um edital no catálogo para começar a praticar.
            </p>
            <Button asChild>
              <Link to="/editais">Ir ao catálogo</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Praticar</h1>
        <p className="text-sm text-muted-foreground">
          {activeEdital?.editais?.titulo ?? "Carregando..."}
        </p>
      </header>

      {(editalLoading || questionLoading) && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {!questionLoading && !question && (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="font-medium">Você respondeu todas as questões disponíveis!</p>
            <p className="text-sm text-muted-foreground">
              Volte mais tarde — novas questões serão liberadas em breve.
            </p>
          </CardContent>
        </Card>
      )}

      {question && !answerResult && (
        <>
          <QuestionCard question={question} />
          <AnswerForm
            question={question}
            onSubmit={handleSubmit}
            isPending={answerMutation.isPending}
          />
        </>
      )}

      {question && answerResult && (
        <>
          <QuestionCard question={question} />
          <AnswerFeedback
            question={question}
            answer={answerResult}
            onNext={handleNext}
          />
        </>
      )}
    </main>
  );
}
