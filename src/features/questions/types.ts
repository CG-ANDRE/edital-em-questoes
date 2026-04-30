import type { Tables } from "@/types/database.types";

export type Question = Tables<"questions">;
export type UserAnswer = Tables<"user_answers">;

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
