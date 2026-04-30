import type { Database } from "@/types/database.types";

export type EditalRow = Database["public"]["Tables"]["editais"]["Row"];
export type EditalStatus = Database["public"]["Enums"]["edital_status_enum"];

export type EditalVisibility =
  | { type: "public" }
  | { type: "beta" }
  | { type: "allowlist"; userIds: string[] };

export interface Edital {
  id: string;
  titulo: string;
  orgao: string;
  banca: string;
  cargo: string;
  descricao: string | null;
  dataProva: string | null;
  dataInscricaoInicio: string | null;
  dataInscricaoFim: string | null;
  slug: string;
  status: EditalStatus;
  visibility: EditalVisibility;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EditalListFilters {
  banca?: string;
  orgao?: string;
  ano?: number;
  q?: string;
}
