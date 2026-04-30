import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as Sentry from "@sentry/react";

import { posthog } from "@/lib/posthog";
import { useSession } from "@/features/auth/hooks/useSession";
import { answerQuestion } from "@/features/questions/api";
import type {
  AnswerQuestionInput,
  PublicQuestion,
  UserAnswer,
} from "@/features/questions/types";

type Args = {
  question: PublicQuestion;
};

export function useAnswerQuestion({ question }: Args) {
  const qc = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id ?? "";

  return useMutation<UserAnswer, Error, AnswerQuestionInput>({
    mutationFn: (input) => answerQuestion(input, userId),
    onSuccess: (data, input) => {
      posthog.capture("question:answered", {
        is_correct: data.is_correct,
        time_spent_ms: data.time_spent_ms,
        materia: question.materia,
        banca: question.banca,
        edital_id: input.editalId,
        question_id: input.questionId,
      });
      // Invalidar próxima questão (será refeita ao avançar)
      qc.invalidateQueries({ queryKey: ["questions", "next", input.editalId, userId] });
      // Preparação para Epic 5
      qc.invalidateQueries({ queryKey: ["confidence-score", input.editalId] });
    },
    onError: (err) => {
      toast.error("Não foi possível registrar sua resposta. Tente novamente.");
      Sentry.captureException(err, { tags: { feature: "questions", action: "answer" } });
    },
  });
}
