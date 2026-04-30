import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database.types";
import type {
  Edital,
  EditalListFilters,
  EditalRow,
  EditalVisibility,
} from "./types";

export type UserEdital = Tables<"user_editais">;
export type UserEditalWithEdital = UserEdital & {
  editais: Pick<EditalRow, "id" | "titulo" | "orgao" | "banca"> | null;
};

export type SelectEditalDates = {
  data_inscricao: string | null;
  data_prova: string | null;
};

export function mapEditalRowToEdital(row: EditalRow): Edital {
  return {
    id: row.id,
    titulo: row.titulo,
    orgao: row.orgao,
    banca: row.banca,
    cargo: row.cargo,
    descricao: row.descricao,
    dataProva: row.data_prova,
    dataInscricaoInicio: row.data_inscricao_inicio,
    dataInscricaoFim: row.data_inscricao_fim,
    slug: row.slug,
    status: row.status,
    visibility: (row.visibility ?? { type: "public" }) as EditalVisibility,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchPublishedEditais(
  filters: EditalListFilters = {}
): Promise<Edital[]> {
  let query = supabase.from("editais").select("*");

  if (filters.banca) query = query.eq("banca", filters.banca);
  if (filters.orgao) query = query.eq("orgao", filters.orgao);
  if (filters.ano) {
    query = query
      .gte("data_prova", `${filters.ano}-01-01`)
      .lte("data_prova", `${filters.ano}-12-31`);
  }
  const trimmed = filters.q?.trim();
  if (trimmed) {
    query = query.textSearch("search_vector", trimmed, {
      type: "websearch",
      config: "portuguese",
    });
  }

  query = query
    .order("data_prova", { ascending: true, nullsFirst: false })
    .order("published_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapEditalRowToEdital);
}

export async function fetchActiveUserEdital(
  userId: string
): Promise<UserEditalWithEdital | null> {
  const { data, error } = await supabase
    .from("user_editais")
    .select("*, editais ( id, titulo, orgao, banca )")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data as UserEditalWithEdital | null;
}

export async function selectEdital(
  userId: string,
  editalId: string,
  dates: SelectEditalDates
): Promise<UserEdital> {
  const payload = {
    user_id: userId,
    edital_id: editalId,
    is_active: true,
    data_inscricao: dates.data_inscricao,
    data_prova: dates.data_prova,
    registered_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_editais")
    .upsert(payload, { onConflict: "user_id,edital_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setActiveEdital(
  userId: string,
  editalId: string
): Promise<void> {
  const { error } = await supabase
    .from("user_editais")
    .update({ is_active: true })
    .eq("user_id", userId)
    .eq("edital_id", editalId);
  if (error) throw error;
}
