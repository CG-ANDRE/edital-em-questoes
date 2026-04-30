import { supabase } from "@/lib/supabase";
import type { ProfileUpdateInput } from "@/lib/schemas/profile.schema";

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  target_concurso: string | null;
  study_goal: string | null;
  exam_date: string | null;
};

export async function fetchProfile(userId: string): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, target_concurso, study_goal, exam_date")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  input: ProfileUpdateInput
): Promise<void> {
  const payload = {
    full_name: input.full_name,
    target_concurso: input.target_concurso?.trim() || null,
    study_goal: input.study_goal?.trim() || null,
    exam_date: input.exam_date || null,
  };

  const { error } = await supabase.from("users").update(payload).eq("id", userId);
  if (error) throw error;
}
