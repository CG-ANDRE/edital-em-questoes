// Parser de questões dos PDFs de gabarito do Edital em Questões — TJSC 2026
// Lê os arquivos .txt (extraídos via pdftotext -layout) e produz JSON estruturado.
//
// Uso: bun run _questoes-tjsc-raw/scripts/parse-questions.ts

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

type ParsedQuestion = {
  number: number;
  edital: "TJSC-2026";
  cargo: "tecnico" | "analista";
  materia: string;
  enunciado: string;
  alternativas: { letra: "a" | "b" | "c" | "d" | "e"; texto: string }[];
  gabarito: "a" | "b" | "c" | "d" | "e";
  comentario: string | null;
};

const RAW_DIR = resolve(import.meta.dir, "..");

// Padrões diferentes nos 2 PDFs
//   Técnico:  "Questão 01 (INÉDITA 2026) ..."
//   Analista: "(Questão 01 – INÉDITA 2026) ..." ou "(Questão 01 - INÉDITA 2026)"
const QUESTION_RE_TECNICO = /^Questão\s+(\d+)\s*\(INÉDITA\s+202\d\)\s*([\s\S]*?)$/m;
const QUESTION_RE_ANALISTA = /^\(Questão\s+(\d+)\s*[–-]\s*INÉDITA\s+202\d\)\s*([\s\S]*?)$/m;

const ALTERNATIVA_RE = /^([a-e])\)\s*(.+)$/i;
const GABARITO_RE = /^Gabarito:\s*([a-eA-E])\b/m;
// header de disciplina: linha em CAIXA ALTA com >= 3 chars, sem números, possivelmente com hífen ou espaço
const DISCIPLINE_HEADER_RE =
  /^[A-ZÀ-ÚÇÃÕÁÉÍÓÚÂÊÔ][A-ZÀ-ÚÇÃÕÁÉÍÓÚÂÊÔ\s\-]{2,}$/;

// Disciplinas conhecidas (ajuda a desambiguar headers de outras linhas em CAIXA ALTA)
const DISCIPLINAS_VALIDAS = new Set([
  "LÍNGUA PORTUGUESA",
  "LEGISLAÇÃO INSTITUCIONAL DO PJSC",
  "LEGISLAÇÃO INSTITUCIONAL",
  "ÉTICA E GESTÃO NO SERVIÇO PÚBLICO",
  "COMPETÊNCIAS DIGITAIS E INFORMÁTICA APLICADA AO SETOR PÚBLICO",
  "NOÇÕES DE INFORMÁTICA E PROTEÇÃO DE DADOS",
  "DIREITOS HUMANOS E ACESSO À JUSTIÇA",
  "NOÇÕES DE DIREITO ADMINISTRATIVO",
  "NOÇÕES DE DIREITO CONSTITUCIONAL",
  "NOÇÕES DE DIREITO CIVIL",
  "NOÇÕES DE DIREITO PROCESSUAL CIVIL",
  "NOÇÕES DE DIREITO PENAL",
  "NOÇÕES DE DIREITO PROCESSUAL PENAL",
  "DIREITO CONSTITUCIONAL",
  "DIREITO ADMINISTRATIVO",
  "DIREITO CIVIL E DIREITO DO CONSUMIDOR",
  "DIREITO CIVIL",
  "DIREITO PROCESSUAL CIVIL",
  "DIREITO PENAL",
  "DIREITO PROCESSUAL PENAL",
  "DIREITOS HUMANOS E TUTELA COLETIVA",
]);

/**
 * Detecta blocos de "Questão N" no texto. Retorna lista de [start, end, num, header].
 * end aponta para o início da próxima questão (ou EOF).
 */
function findQuestionBlocks(
  text: string,
  cargo: "tecnico" | "analista"
): { start: number; end: number; num: number; headerLine: string }[] {
  const re =
    cargo === "tecnico"
      ? /^Questão\s+(\d+)\s*\(INÉDITA\s+202\d\)/gm
      : /^\(Questão\s+(\d+)\s*[–-]\s*INÉDITA\s+202\d\)/gm;

  const matches: { start: number; end: number; num: number; headerLine: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const lineEnd = text.indexOf("\n", m.index);
    matches.push({
      start: m.index,
      end: text.length, // ajusta no próximo loop
      num: parseInt(m[1], 10),
      headerLine: text.slice(m.index, lineEnd === -1 ? text.length : lineEnd),
    });
  }
  for (let i = 0; i < matches.length - 1; i++) {
    matches[i].end = matches[i + 1].start;
  }
  return matches;
}

/**
 * Encontra a disciplina vigente para uma posição no texto, varrendo headers anteriores.
 */
function findDisciplineForPosition(text: string, position: number): string {
  const before = text.slice(0, position);
  const lines = before.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const trimmed = lines[i].trim();
    if (DISCIPLINAS_VALIDAS.has(trimmed)) return trimmed;
  }
  return "DESCONHECIDA";
}

/**
 * Parsea um bloco de uma única questão e retorna estrutura ou null se inválida.
 */
function parseQuestionBlock(
  block: string,
  num: number,
  cargo: "tecnico" | "analista",
  materia: string
): ParsedQuestion | null {
  const lines = block.split("\n");

  // 1. Encontrar a linha de gabarito
  const gabaritoMatch = block.match(GABARITO_RE);
  if (!gabaritoMatch) return null;
  const gabarito = gabaritoMatch[1].toLowerCase() as "a" | "b" | "c" | "d" | "e";
  const gabaritoIdx = lines.findIndex((l) => GABARITO_RE.test(l.trim()));

  // 2. Header da questão é linha 0; enunciado vai até a primeira alternativa "a)"
  const altIdx = lines.findIndex((l, i) => i > 0 && /^[a-e]\)\s/i.test(l.trim()));
  if (altIdx === -1) return null;

  // Enunciado: linha 0 (sem o prefixo) + linhas 1..altIdx-1
  let firstLine = lines[0];
  // Remove prefixo "Questão N (INÉDITA 2026)" ou "(Questão N – INÉDITA 2026)"
  firstLine = firstLine.replace(QUESTION_RE_TECNICO, "$2").replace(QUESTION_RE_ANALISTA, "$2");
  if (cargo === "tecnico") {
    firstLine = lines[0].replace(/^Questão\s+\d+\s*\(INÉDITA\s+202\d\)\s*/, "");
  } else {
    firstLine = lines[0].replace(/^\(Questão\s+\d+\s*[–-]\s*INÉDITA\s+202\d\)\s*/, "");
  }

  const enunciadoLines = [firstLine, ...lines.slice(1, altIdx)];
  const enunciado = enunciadoLines.join("\n").trim();
  if (enunciado.length < 5) return null;

  // 3. Alternativas: do altIdx até a linha antes do gabarito.
  // Anexar sentinela "\nGabarito:" para garantir que a última alternativa seja capturada
  // (regex JS não suporta \z; o lookahead precisa de uma âncora real).
  const altsBlock =
    lines.slice(altIdx, gabaritoIdx).join("\n") + "\nGabarito:";
  const altRe = /^([a-e])\)\s*([\s\S]*?)(?=^[a-e]\)|^Gabarito:)/gim;
  const alternativas: { letra: "a" | "b" | "c" | "d" | "e"; texto: string }[] = [];
  let am: RegExpExecArray | null;
  while ((am = altRe.exec(altsBlock)) !== null) {
    const letra = am[1].toLowerCase() as "a" | "b" | "c" | "d" | "e";
    const texto = am[2].trim().replace(/\s+/g, " ");
    if (texto) alternativas.push({ letra, texto });
  }
  if (alternativas.length < 4) return null; // exige pelo menos 4 alternativas

  // 4. Comentário: depois do gabarito
  const commentLines: string[] = [];
  for (let i = gabaritoIdx + 1; i < lines.length; i++) {
    const l = lines[i];
    if (DISCIPLINAS_VALIDAS.has(l.trim())) break; // próximo bloco
    commentLines.push(l);
  }
  let comentario: string | null = commentLines.join("\n").trim();
  // Remove "💬 Comentário:" header se existir
  comentario = comentario.replace(/^💬\s*Comentário:\s*/i, "").trim();
  if (comentario.length === 0) comentario = null;

  return {
    number: num,
    edital: "TJSC-2026",
    cargo,
    materia,
    enunciado: enunciado.replace(/\s+/g, " ").trim(),
    alternativas,
    gabarito,
    comentario,
  };
}

/**
 * Normaliza o texto bruto do PDF:
 *   - Substitui form feeds (\f) por newlines (pdftotext usa \f entre páginas)
 *   - Remove linhas que contêm apenas números (page numbers soltos no meio das questões)
 */
function normalize(text: string): string {
  return text
    .replace(/\f/g, "\n")
    .split("\n")
    .filter((l) => !/^\s*\d{1,4}\s*$/.test(l))
    .join("\n");
}

function parseFile(path: string, cargo: "tecnico" | "analista"): ParsedQuestion[] {
  const text = normalize(readFileSync(path, "utf-8"));
  const blocks = findQuestionBlocks(text, cargo);

  const results: ParsedQuestion[] = [];
  for (const b of blocks) {
    const blockText = text.slice(b.start, b.end);
    const materia = findDisciplineForPosition(text, b.start);
    const q = parseQuestionBlock(blockText, b.num, cargo, materia);
    if (q) results.push(q);
  }
  return results;
}

// =====================================================================
// EXECUÇÃO
// =====================================================================

console.log("📚 Parsing questões TJSC 2026...\n");

const tecnico = parseFile(`${RAW_DIR}/tecnico-gabarito.txt`, "tecnico");
const analista = parseFile(`${RAW_DIR}/cargo2-gabarito.txt`, "analista");

console.log(`✅ Técnico: ${tecnico.length} questões parseadas`);
console.log(`✅ Analista: ${analista.length} questões parseadas`);
console.log(`📊 Total: ${tecnico.length + analista.length} questões\n`);

// Agregação por matéria
const groupByMateria = (qs: ParsedQuestion[]) => {
  const map = new Map<string, number>();
  for (const q of qs) map.set(q.materia, (map.get(q.materia) ?? 0) + 1);
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
};

console.log("📚 Distribuição Técnico:");
for (const [m, n] of groupByMateria(tecnico)) console.log(`  ${n.toString().padStart(3)} — ${m}`);

console.log("\n📚 Distribuição Analista:");
for (const [m, n] of groupByMateria(analista)) console.log(`  ${n.toString().padStart(3)} — ${m}`);

// Salvar JSON
const outDir = resolve(import.meta.dir, "..");
mkdirSync(outDir, { recursive: true });

const all = [...tecnico, ...analista];
writeFileSync(`${outDir}/questoes-tjsc-2026.json`, JSON.stringify(all, null, 2));
console.log(`\n💾 Salvo em ${outDir}/questoes-tjsc-2026.json (${(JSON.stringify(all).length / 1024).toFixed(0)} KB)`);

// Sample para inspeção
console.log("\n📝 Amostra (1ª questão Técnico):");
console.log(JSON.stringify(tecnico[0], null, 2).slice(0, 1200));
