import { describe, it, expect } from "vitest";
import { selectEditalDatesSchema } from "@/lib/schemas/edital.schema";

const inFuture = (offsetDays = 30) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

const inPast = (offsetDays = 30) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
};

describe("selectEditalDatesSchema", () => {
  it("aceita ambas datas vazias", () => {
    const r = selectEditalDatesSchema.safeParse({
      data_inscricao: null,
      data_prova: null,
    });
    expect(r.success).toBe(true);
  });

  it("aceita strings vazias e converte para null", () => {
    const r = selectEditalDatesSchema.safeParse({
      data_inscricao: "",
      data_prova: "",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.data_inscricao).toBeNull();
      expect(r.data.data_prova).toBeNull();
    }
  });

  it("aceita prova >= inscrição (futuras)", () => {
    const r = selectEditalDatesSchema.safeParse({
      data_inscricao: inFuture(15),
      data_prova: inFuture(60),
    });
    expect(r.success).toBe(true);
  });

  it("rejeita inscrição no passado", () => {
    const r = selectEditalDatesSchema.safeParse({
      data_inscricao: inPast(10),
      data_prova: null,
    });
    expect(r.success).toBe(false);
  });

  it("rejeita prova no passado", () => {
    const r = selectEditalDatesSchema.safeParse({
      data_inscricao: null,
      data_prova: inPast(5),
    });
    expect(r.success).toBe(false);
  });

  it("rejeita prova < inscrição", () => {
    const r = selectEditalDatesSchema.safeParse({
      data_inscricao: inFuture(60),
      data_prova: inFuture(15),
    });
    expect(r.success).toBe(false);
  });
});
