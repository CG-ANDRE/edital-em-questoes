import { supabase } from "@/lib/supabase";
import type {
  EditalRow,
  EditalStatus,
  EditalVisibility,
} from "@/features/editais/types";

export type AdminEditalListFilters = {
  status?: EditalStatus | "all";
  banca?: string;
  q?: string;
};

export async function fetchAdminEditais(
  filters: AdminEditalListFilters = {}
): Promise<EditalRow[]> {
  let query = supabase
    .from("editais")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.banca) query = query.eq("banca", filters.banca);
  if (filters.q?.trim()) {
    query = query.ilike("titulo", `%${filters.q.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchEditalById(id: string): Promise<EditalRow | null> {
  const { data, error } = await supabase
    .from("editais")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export type EditalCreateInput = {
  titulo: string;
  slug: string;
  banca: string;
  cargo: string;
  orgao: string;
  descricao: string | null;
  data_prova: string | null;
  data_inscricao_inicio: string | null;
  data_inscricao_fim: string | null;
  status: EditalStatus;
  published_at: string | null;
  visibility?: EditalVisibility;
};

export async function createEdital(input: EditalCreateInput): Promise<EditalRow> {
  const { data, error } = await supabase
    .from("editais")
    .insert({
      ...input,
      published_at:
        input.status === "published"
          ? input.published_at ?? new Date().toISOString()
          : input.published_at,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEdital(
  id: string,
  patch: Partial<EditalCreateInput>
): Promise<EditalRow> {
  const { data, error } = await supabase
    .from("editais")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function publishEdital(id: string): Promise<EditalRow> {
  return updateEdital(id, {
    status: "published",
    published_at: new Date().toISOString(),
  });
}

export async function archiveEdital(id: string): Promise<EditalRow> {
  return updateEdital(id, { status: "archived" });
}

export async function unpublishEdital(id: string): Promise<EditalRow> {
  return updateEdital(id, { status: "draft" });
}

export async function checkSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase.from("editais").select("id", { head: true, count: "exact" }).eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { count, error } = await query;
  if (error) throw error;
  return (count ?? 0) === 0;
}
