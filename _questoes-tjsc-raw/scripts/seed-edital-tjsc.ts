// Cria o edital TJSC-2026 e linka as 1120 questões a ele.
// Uso: bun run _questoes-tjsc-raw/scripts/seed-edital-tjsc.ts

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Faltam variáveis VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 1. Upsert edital TJSC-2026
console.log("📋 Criando edital TJSC-2026...");

const editalPayload = {
  titulo: "TJSC 2026 — Tribunal de Justiça de Santa Catarina",
  slug: "tjsc-2026",
  banca: "FGV",
  cargo: "Técnico Judiciário Auxiliar / Analista Jurídico",
  orgao: "Tribunal de Justiça de Santa Catarina",
  descricao:
    "Concurso público do TJSC 2026 para os cargos de Técnico Judiciário Auxiliar e Analista Jurídico. Banca FGV.",
  status: "published" as const,
  visibility: { type: "public" as const },
  published_at: new Date().toISOString(),
};

// Verifica se já existe
const { data: existing } = await supabase
  .from("editais")
  .select("id, titulo")
  .eq("slug", editalPayload.slug)
  .maybeSingle();

let editalId: string;

if (existing) {
  console.log(`   ↻ Edital "${existing.titulo}" já existe (id: ${existing.id})`);
  editalId = existing.id;
} else {
  const { data, error } = await supabase
    .from("editais")
    .insert(editalPayload)
    .select("id")
    .single();
  if (error) {
    console.error("❌ Falha ao inserir edital:", error.message);
    process.exit(1);
  }
  editalId = data.id;
  console.log(`   ✅ Edital criado (id: ${editalId})`);
}

// 2. Linkar todas as questões publicadas ao edital
console.log("\n🔗 Linkando todas as questões publicadas...");

// Paginação manual (Supabase default: 1000 rows por query)
const allQuestions: { id: string }[] = [];
let from = 0;
const PAGE = 1000;
while (true) {
  const { data, error } = await supabase
    .from("questions")
    .select("id")
    .eq("status", "published")
    .range(from, from + PAGE - 1);
  if (error) {
    console.error("❌ Falha ao listar questões:", error.message);
    process.exit(1);
  }
  if (!data || data.length === 0) break;
  allQuestions.push(...data);
  if (data.length < PAGE) break;
  from += PAGE;
}
const questions = allQuestions;
console.log(`   📊 ${questions.length} questões publicadas encontradas`);

const linkPayload = (questions ?? []).map((q) => ({
  question_id: q.id,
  edital_id: editalId,
}));

const BATCH = 200;
let inserted = 0;
let skipped = 0;

for (let i = 0; i < linkPayload.length; i += BATCH) {
  const batch = linkPayload.slice(i, i + BATCH);
  const { error, count } = await supabase
    .from("question_editais")
    .upsert(batch, { onConflict: "question_id,edital_id", ignoreDuplicates: true, count: "exact" });
  if (error) {
    console.error(`❌ Lote ${i}-${i + batch.length}: ${error.message}`);
  } else {
    inserted += count ?? 0;
    skipped += batch.length - (count ?? 0);
    process.stdout.write(`\r   ✅ ${i + batch.length}/${linkPayload.length} processadas`);
  }
}

console.log("\n");
console.log(`✅ Concluído:`);
console.log(`   • ${inserted} novos vínculos criados`);
console.log(`   • ${skipped} já existiam (skip)`);

// 3. Validação
const { count: totalLinks } = await supabase
  .from("question_editais")
  .select("*", { count: "exact", head: true })
  .eq("edital_id", editalId);

console.log(`\n📊 Total no banco: ${totalLinks} questões vinculadas ao edital TJSC-2026`);
