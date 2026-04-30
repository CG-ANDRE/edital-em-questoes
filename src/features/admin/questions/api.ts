import { supabase } from "@/lib/supabase";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import type { QuestionInput } from "@/lib/schemas/question.schema";

export type QuestionRow = Tables<"questions">;
export type QuestionStatus = QuestionRow["status"];
export type QuestionDificuldade = QuestionRow["dificuldade"];

export type QuestionListFilters = {
  status?: QuestionStatus | "all";
  materia?: string;
  banca?: string;
  dificuldade?: QuestionDificuldade;
  q?: string;
};

export async function fetchAdminQuestions(
  filters: QuestionListFilters = {}
): Promise<QuestionRow[]> {
  let query = supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.materia) query = query.eq("materia", filters.materia);
  if (filters.banca) query = query.eq("banca", filters.banca);
  if (filters.dificuldade) query = query.eq("dificuldade", filters.dificuldade);
  if (filters.q?.trim()) {
    query = query.textSearch("search_vector", filters.q.trim(), {
      type: "websearch",
      config: "portuguese",
    });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchQuestionById(
  id: string
): Promise<QuestionRow | null> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createQuestion(
  input: QuestionInput,
  userId: string
): Promise<QuestionRow> {
  const payload: TablesInsert<"questions"> = {
    enunciado: input.enunciado,
    alternativas: input.alternativas,
    correct_answer: input.correct_answer,
    justificativa: input.justificativa,
    materia: input.materia,
    banca: input.banca?.trim() || null,
    cargo_alvo: input.cargo_alvo?.trim() || null,
    dificuldade: input.dificuldade,
    status: input.status,
    source_type: "manual",
    created_by: userId,
    updated_by: userId,
  };

  const { data, error } = await supabase
    .from("questions")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateQuestion(
  id: string,
  patch: Partial<QuestionInput>,
  userId: string
): Promise<QuestionRow> {
  const payload: TablesUpdate<"questions"> = {
    enunciado: patch.enunciado,
    alternativas: patch.alternativas,
    correct_answer: patch.correct_answer,
    justificativa: patch.justificativa,
    materia: patch.materia,
    banca: patch.banca?.trim() || null,
    cargo_alvo: patch.cargo_alvo?.trim() || null,
    dificuldade: patch.dificuldade,
    status: patch.status,
    updated_by: userId,
  };

  const { data, error } = await supabase
    .from("questions")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function archiveQuestion(
  id: string,
  userId: string
): Promise<QuestionRow> {
  return updateQuestion(id, { status: "archived" }, userId);
}

export async function publishQuestion(
  id: string,
  userId: string
): Promise<QuestionRow> {
  return updateQuestion(id, { status: "published" }, userId);
}

export async function fetchQuestionRevisions(
  questionId: string
): Promise<Tables<"question_revisions">[]> {
  const { data, error } = await supabase
    .from("question_revisions")
    .select("*")
    .eq("question_id", questionId)
    .order("revised_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
