import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/features/auth/hooks/useSession";
import { fetchNextQuestion, fetchQuestionFeedback } from "@/features/questions/api";

export const nextQuestionKey = (editalId: string, userId: string) =>
  ["questions", "next", editalId, userId] as const;

export const questionFeedbackKey = (questionId: string) =>
  ["questions", "feedback", questionId] as const;

export function useNextQuestion(editalId: string | undefined) {
  const { session } = useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: editalId && userId ? nextQuestionKey(editalId, userId) : ["questions", "next", "anonymous"],
    queryFn: () => {
      if (!editalId || !userId) throw new Error("Faltam editalId/userId");
      return fetchNextQuestion(editalId, userId);
    },
    enabled: !!editalId && !!userId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

export function useQuestionFeedback(questionId: string | undefined) {
  return useQuery({
    queryKey: questionId
      ? questionFeedbackKey(questionId)
      : ["questions", "feedback", "none"],
    queryFn: () => {
      if (!questionId) throw new Error("Falta questionId");
      return fetchQuestionFeedback(questionId);
    },
    enabled: !!questionId,
    staleTime: Infinity, // gabarito é estável; uma vez baixado, fica em cache
  });
}
