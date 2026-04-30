import { supabase } from "@/lib/supabase";
import type { Tables, TablesInsert } from "@/types/database.types";
import type { CreateQuestionReportInput } from "@/lib/schemas/question-report.schema";
import type {
  AnswerLabel,
  AnswerQuestionInput,
  PublicQuestion,
  Question,
  QuestionAlternativa,
  QuestionFeedback,
  UserAnswer,
} from "./types";

export type QuestionReport = Tables<"question_reports">;

// Campos seguros para retornar ao usuário ANTES da resposta.
// Exclui correct_answer e justificativa (anti-trapaça).
const PUBLIC_QUESTION_FIELDS =
  "id, enunciado, alternativas, materia, banca, cargo_alvo, dificuldade, status, source_type, image_url, search_vector, created_by, updated_by, created_at, updated_at";

/**
 * Busca a próxima questão para o usuário responder no edital ativo.
 * IMPORTANTE: NÃO retorna correct_answer nem justificativa (vazariam o gabarito).
 */
export async function fetchNextQuestion(
  editalId: string,
  userId: string
): Promise<PublicQuestion | null> {
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
    .select(`${PUBLIC_QUESTION_FIELDS}, question_editais!inner(edital_id)`)
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
  return random as unknown as PublicQuestion;
}

export async function answerQuestion(
  input: AnswerQuestionInput,
  userId: string
): Promise<UserAnswer> {
  // is_correct é sobrescrito pelo trigger BEFORE INSERT enforce_user_answer_correctness().
  // O valor enviado aqui é ignorado pelo banco — defesa server-side anti-trapaça.
  const payload: TablesInsert<"user_answers"> = {
    user_id: userId,
    question_id: input.questionId,
    edital_id: input.editalId,
    selected_answer: input.selectedAnswer,
    is_correct: false,
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
 * Busca correct_answer + justificativa apenas APÓS o usuário ter respondido.
 * Usado pelo AnswerFeedback para exibir gabarito.
 */
export async function fetchQuestionFeedback(
  questionId: string
): Promise<QuestionFeedback> {
  const { data, error } = await supabase
    .from("questions")
    .select("correct_answer, justificativa")
    .eq("id", questionId)
    .single();
  if (error) throw error;
  return {
    correctAnswer: data.correct_answer as AnswerLabel,
    justificativa: data.justificativa,
  };
}

/**
 * Helper: extrai array tipado de alternativas do jsonb.
 */
export function parseAlternativas(
  q: PublicQuestion | Question
): QuestionAlternativa[] {
  const alts = q.alternativas as unknown;
  if (!Array.isArray(alts)) return [];
  return alts as QuestionAlternativa[];
}

// Story 3.5 — Reportar questão
export async function createQuestionReport(
  input: CreateQuestionReportInput,
  userId: string
): Promise<QuestionReport> {
  const payload: TablesInsert<"question_reports"> = {
    question_id: input.questionId,
    user_id: userId,
    reason: input.reason,
    comment: input.comment?.trim() || null,
  };

  const { data, error } = await supabase
    .from("question_reports")
    .insert(payload)
    .select()
    .single();

  if (error) {
    const msg = error.message?.toLowerCase() ?? "";
    if (msg.includes("rate_limit_exceeded")) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw new Error("REPORT_FAILED");
  }
  return data;
}
