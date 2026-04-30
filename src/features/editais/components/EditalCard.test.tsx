import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@/features/editais/components/SelectEditalDialog", () => ({
  SelectEditalDialog: () => null,
}));

import { EditalCard } from "@/features/editais/components/EditalCard";
import type { Edital } from "@/features/editais/types";

const edital: Edital = {
  id: "uuid-1",
  titulo: "INSS 2025 — Técnico do Seguro Social",
  orgao: "INSS",
  banca: "CESPE/Cebraspe",
  cargo: "Técnico",
  descricao: null,
  dataProva: "2026-12-15",
  dataInscricaoInicio: "2026-09-01",
  dataInscricaoFim: "2026-09-30",
  slug: "inss-2025",
  status: "published",
  visibility: { type: "public" },
  publishedAt: "2026-04-30T00:00:00Z",
  createdAt: "2026-04-30T00:00:00Z",
  updatedAt: "2026-04-30T00:00:00Z",
};

describe("EditalCard", () => {
  it("renderiza título, órgão, cargo e banca", () => {
    render(<EditalCard edital={edital} isFavorited={false} onToggleFavorite={vi.fn()} />);
    expect(screen.getByText(/INSS 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/INSS — Técnico/i)).toBeInTheDocument();
    expect(screen.getByText(/CESPE\/Cebraspe/i)).toBeInTheDocument();
  });

  it("formata data da prova em PT-BR", () => {
    render(<EditalCard edital={edital} isFavorited={false} onToggleFavorite={vi.fn()} />);
    expect(screen.getByText(/15\/12\/2026/)).toBeInTheDocument();
  });

  it("exibe janela de inscrição quando ambas as datas presentes", () => {
    render(<EditalCard edital={edital} isFavorited={false} onToggleFavorite={vi.fn()} />);
    expect(screen.getByText(/01\/09\/2026/)).toBeInTheDocument();
    expect(screen.getByText(/30\/09\/2026/)).toBeInTheDocument();
  });

  it("botão de favoritar atende touch target 44x44", () => {
    render(<EditalCard edital={edital} isFavorited={false} onToggleFavorite={vi.fn()} />);
    const btn = screen.getByRole("button", { name: /favoritar edital/i });
    expect(btn.className).toMatch(/min-w-\[44px\]/);
    expect(btn.className).toMatch(/min-h-\[44px\]/);
  });

  it("clique chama onToggleFavorite com id correto", () => {
    const onToggle = vi.fn();
    render(<EditalCard edital={edital} isFavorited={false} onToggleFavorite={onToggle} />);
    fireEvent.click(screen.getByRole("button", { name: /favoritar/i }));
    expect(onToggle).toHaveBeenCalledWith("uuid-1");
  });
});
