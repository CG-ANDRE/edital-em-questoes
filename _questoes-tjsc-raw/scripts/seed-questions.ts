// Importa as 1120 questões parseadas do TJSC para a tabela public.questions
// Uso: bun run _questoes-tjsc-raw/scripts/seed-questions.ts
//
// Pré-req: variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY definidas (.env.local)

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type Parsed = {
  number: number;
  edital: "TJSC-2026";
  cargo: "tecnico" | "analista";
  materia: string;
  enunciado: string;
  alternativas: { letra: string; texto: string }[];
  gabarito: string;
  comentario: string | null;
};

const RAW_DIR = resolve(import.meta.dir, "..");
const data: Parsed[] = JSON.parse(
  readFileSync(`${RAW_DIR}/questoes-tjsc-2026.json`, "utf-8")
);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Faltam variáveis: VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const cargoLabel = (c: "tecnico" | "analista") =>
  c === "tecnico" ? "Técnico Judiciário Auxiliar" : "Analista Jurídico";

// Normaliza letra: a-e → A-E
const upper = (l: string): "A" | "B" | "C" | "D" | "E" => {
  const u = l.toUpperCase();
  if (!"ABCDE".includes(u)) throw new Error(`Letra inválida: ${l}`);
  return u as "A" | "B" | "C" | "D" | "E";
};

console.log(`📚 Importando ${data.length} questões...\n`);

const BATCH_SIZE = 50;
let inserted = 0;
let failed = 0;

for (let i = 0; i < data.length; i += BATCH_SIZE) {
  const batch = data.slice(i, i + BATCH_SIZE);
  const payload = batch.map((q) => ({
    enunciado: q.enunciado,
    alternativas: q.alternativas.map((a) => ({
      label: upper(a.letra),
      text: a.texto,
    })),
    correct_answer: upper(q.gabarito),
    justificativa: q.comentario ?? "Sem justificativa registrada.",
    materia: q.materia,
    banca: "FGV",
    cargo_alvo: cargoLabel(q.cargo),
    dificuldade: "medio" as const,
    status: "published" as const,
    source_type: "manual" as const,
  }));

  const { error, count } = await supabase
    .from("questions")
    .insert(payload, { count: "exact" });

  if (error) {
    failed += batch.length;
    console.error(
      `❌ Lote ${i}-${i + batch.length}: ${error.message}${
        error.details ? ` — ${error.details}` : ""
      }`
    );
  } else {
    inserted += count ?? batch.length;
    process.stdout.write(`\r✅ ${inserted}/${data.length} questões inseridas...`);
  }
}

console.log("\n");
console.log(`✅ Importação concluída: ${inserted} questões`);
if (failed > 0) console.log(`⚠️  Falharam: ${failed} questões`);
