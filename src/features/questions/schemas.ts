import { z } from "zod";

export const answerQuestionSchema = z.object({
  questionId: z.string().uuid(),
  editalId: z.string().uuid(),
  selectedAnswer: z.enum(["A", "B", "C", "D", "E", "F"]),
  timeSpentMs: z.number().int().nonnegative(),
});

export type AnswerQuestionFormInput = z.infer<typeof answerQuestionSchema>;
