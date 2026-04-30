import type { Tables } from "@/types/database.types";

/**
 * Tipo completo do row de questions (inclui correct_answer e justificativa).
 * USAR APENAS EM CONTEXTOS ADMIN (curator/founder) ou após resposta confirmada.
 */
export type Question = Tables<"questions">;
export type UserAnswer = Tables<"user_answers">;

/**
 * Tipo público da questão — sem correct_answer e justificativa.
 * Usado em fetchNextQuestion para evitar vazar gabarito antes da resposta.
 */
export type PublicQuestion = Omit<Question, "correct_answer" | "justificativa">;

export type QuestionAlternativa = {
  label: "A" | "B" | "C" | "D" | "E" | "F";
  text: string;
};

export type AnswerLabel = "A" | "B" | "C" | "D" | "E" | "F";

export type AnswerQuestionInput = {
  questionId: string;
  editalId: string;
  selectedAnswer: AnswerLabel;
  timeSpentMs: number;
};

export type QuestionFeedback = {
  correctAnswer: AnswerLabel;
  justificativa: string;
};
