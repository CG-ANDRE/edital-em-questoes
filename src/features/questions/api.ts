import { supabase } from "@/lib/supabase";
import type { TablesInsert } from "@/types/database.types";
import type {
  AnswerLabel,
  AnswerQuestionInput,
  Question,
  QuestionAlternativa,
  UserAnswer,
} from "./types";

/**
 * Busca a próxima questão para o usuário responder no edital ativo.
 * Estratégia MVP: questões publicadas que o usuário ainda não respondeu, ordem aleatória.
 */
export async function fetchNextQuestion(
  editalId: string,
  userId: string
): Promise<Question | null> {
  // Busca IDs já respondidos pelo usuário
  const { data: answered, error: aErr } = await supabase
    .from("user_answers")
    .select("question_id")
    .eq("user_id", userId);
  if (aErr) throw aErr;

  const answeredIds = (answered ?? [])
    .map((r) => r.question_id)
    .filter((id): id is string => !!id);

  // Busca questões publicadas vinculadas ao edital, excluindo as já respondidas
  let query = supabase
    .from("questions")
    .select("*, question_editais!inner(edital_id)")
    .eq("status", "published")
    .eq("question_editais.edital_id", editalId)
    .limit(50);

  if (answeredIds.length > 0) {
    query = query.not("id", "in", `(${answeredIds.join(",")})`);
  }

  const { data, error } = await query;
  if (error) throw error;
  if (!data || data.length === 0) return null;

  // Sorteia uma das 50 candidatas para randomização
  const random = data[Math.floor(Math.random() * data.length)];
  return random as Question;
}

export async function answerQuestion(
  input: AnswerQuestionInput,
  userId: string
): Promise<UserAnswer> {
  // Busca correct_answer da questão para computar is_correct
  const { data: q, error: qErr } = await supabase
    .from("questions")
    .select("correct_answer")
    .eq("id", input.questionId)
    .single();
  if (qErr) throw qErr;

  const isCorrect = q.correct_answer === input.selectedAnswer;

  const payload: TablesInsert<"user_answers"> = {
    user_id: userId,
    question_id: input.questionId,
    edital_id: input.editalId,
    selected_answer: input.selectedAnswer,
    is_correct: isCorrect,
    time_spent_ms: input.timeSpentMs,
  };

  const { data, error } = await supabase
    .from("user_answers")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Helper: extrai array tipado de alternativas do jsonb.
 */
export function parseAlternativas(q: Question): QuestionAlternativa[] {
  const alts = q.alternativas as unknown;
  if (!Array.isArray(alts)) return [];
  return alts as QuestionAlternativa[];
}

export function correctAnswerOf(q: Question): AnswerLabel {
  return q.correct_answer as AnswerLabel;
}
