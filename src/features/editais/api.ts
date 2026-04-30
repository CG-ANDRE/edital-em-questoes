import { supabase } from "@/lib/supabase";
import type {
  Edital,
  EditalListFilters,
  EditalRow,
  EditalVisibility,
} from "./types";

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
