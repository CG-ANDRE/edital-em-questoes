import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnswerForm } from "@/features/questions/components/AnswerForm";
import type { Question } from "@/features/questions/types";

const question: Question = {
  id: "uuid-1",
  enunciado: "Qual a função do verbo na frase?",
  alternativas: [
    { label: "A", text: "Indicar ação" },
    { label: "B", text: "Indicar objeto" },
    { label: "C", text: "Indicar adjetivo" },
    { label: "D", text: "Indicar pronome" },
    { label: "E", text: "Indicar artigo" },
  ],
  correct_answer: "A",
  justificativa: "O verbo indica ação.",
  materia: "LÍNGUA PORTUGUESA",
  banca: "FGV",
  cargo_alvo: "Técnico",
  dificuldade: "medio",
  status: "published",
  source_type: "manual",
  image_url: null,
  search_vector: null,
  created_by: null,
  updated_by: null,
  created_at: "2026-04-30T00:00:00Z",
  updated_at: "2026-04-30T00:00:00Z",
} as never;

describe("AnswerForm", () => {
  it("renderiza 5 alternativas", () => {
    render(<AnswerForm question={question} onSubmit={vi.fn()} isPending={false} />);
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    expect(screen.getByText(/Indicar ação/)).toBeInTheDocument();
    expect(screen.getByText(/Indicar artigo/)).toBeInTheDocument();
  });

  it("botão começa desabilitado até selecionar alternativa", () => {
    render(<AnswerForm question={question} onSubmit={vi.fn()} isPending={false} />);
    expect(screen.getByRole("button", { name: /confirmar resposta/i })).toBeDisabled();

    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[0]);
    expect(screen.getByRole("button", { name: /confirmar resposta/i })).not.toBeDisabled();
  });

  it("submit chama onSubmit com letra selecionada", () => {
    const onSubmit = vi.fn();
    render(<AnswerForm question={question} onSubmit={onSubmit} isPending={false} />);

    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[2]); // index 2 = letra C
    fireEvent.submit(screen.getByRole("button", { name: /confirmar resposta/i }).closest("form")!);

    expect(onSubmit).toHaveBeenCalledWith("C");
  });

  it("isPending=true desabilita botão e mostra Confirmando...", () => {
    render(<AnswerForm question={question} onSubmit={vi.fn()} isPending={true} />);
    const btn = screen.getByRole("button", { name: /confirmando/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });
});
