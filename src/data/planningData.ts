export interface Edital {
  concursoId: string;
  cargo: string;
  banca: string;
  disciplinas: Disciplina[];
}

export interface Disciplina {
  id: string;
  name: string;
  peso: number; // 1-5
  horasRecomendadas: number;
  categoria: "pesada" | "media" | "leve";
  assuntos: string[];
}

export interface PlanningInput {
  concursoId: string;
  cargo: string;
  banca: string;
  studyEveryDay: boolean;
  studyDays: string[];
  hoursPerDay: number;
  examDate: string | null;
  startDate: string;
  level: "iniciante" | "intermediario" | "avancado";
  difficultSubjects: string[];
  prioritySubjects: string[];
}

export interface StudyBlock {
  subject: string;
  disciplinaId: string;
  duration: number; // minutes
  type: "estudo" | "revisao" | "questoes";
  assuntos: string[];
}

export interface DayPlan {
  date: string;
  dayOfWeek: string;
  blocks: StudyBlock[];
  cyclePosition: number;
}

export const editais: Record<string, Edital> = {
  tjsp: {
    concursoId: "tjsp",
    cargo: "Escrevente Técnico Judiciário",
    banca: "VUNESP",
    disciplinas: [
      { id: "port_tjsp", name: "Língua Portuguesa", peso: 5, horasRecomendadas: 60, categoria: "pesada", assuntos: ["Compreensão e Interpretação de Texto", "Ortografia Oficial", "Acentuação Gráfica", "Emprego das Classes de Palavras", "Concordância Verbal e Nominal", "Regência Verbal e Nominal", "Sintaxe da Oração e do Período", "Pontuação", "Redação Oficial"] },
      { id: "const_tjsp", name: "Direito Constitucional", peso: 4, horasRecomendadas: 50, categoria: "pesada", assuntos: ["Princípios Fundamentais", "Direitos e Garantias Fundamentais", "Organização do Estado", "Organização dos Poderes", "Poder Judiciário", "Funções Essenciais à Justiça", "Controle de Constitucionalidade", "Remédios Constitucionais"] },
      { id: "admin_tjsp", name: "Direito Administrativo", peso: 4, horasRecomendadas: 50, categoria: "pesada", assuntos: ["Princípios da Administração Pública", "Atos Administrativos", "Poderes Administrativos", "Licitações e Contratos", "Serviços Públicos", "Servidores Públicos", "Responsabilidade Civil do Estado", "Improbidade Administrativa"] },
      { id: "civil_tjsp", name: "Direito Civil", peso: 3, horasRecomendadas: 40, categoria: "media", assuntos: ["Lei de Introdução às Normas do Direito Brasileiro", "Pessoas Naturais e Jurídicas", "Bens", "Fatos Jurídicos", "Prescrição e Decadência", "Obrigações", "Contratos", "Responsabilidade Civil"] },
      { id: "proc_civil_tjsp", name: "Direito Processual Civil", peso: 3, horasRecomendadas: 40, categoria: "media", assuntos: ["Normas Processuais Civis", "Jurisdição e Competência", "Partes e Procuradores", "Atos Processuais", "Tutela Provisória", "Procedimento Comum", "Cumprimento de Sentença", "Recursos"] },
      { id: "penal_tjsp", name: "Direito Penal", peso: 3, horasRecomendadas: 35, categoria: "media", assuntos: ["Aplicação da Lei Penal", "Crime", "Imputabilidade Penal", "Concurso de Pessoas", "Penas", "Crimes contra a Pessoa", "Crimes contra o Patrimônio", "Crimes contra a Administração Pública"] },
      { id: "proc_penal_tjsp", name: "Direito Processual Penal", peso: 2, horasRecomendadas: 25, categoria: "media", assuntos: ["Inquérito Policial", "Ação Penal", "Competência", "Prova", "Prisão e Liberdade Provisória", "Procedimentos", "Recursos", "Habeas Corpus"] },
      { id: "normas_tjsp", name: "Normas da Corregedoria", peso: 3, horasRecomendadas: 30, categoria: "media", assuntos: ["NSCGJ – Tomo I", "Registro Civil", "Registro de Imóveis", "Tabelionato de Notas", "Tabelionato de Protesto", "Disposições Gerais", "Fiscalização Judicial"] },
      { id: "info_tjsp", name: "Informática", peso: 2, horasRecomendadas: 20, categoria: "leve", assuntos: ["MS Word", "MS Excel", "MS PowerPoint", "Internet e Navegadores", "Segurança da Informação", "Correio Eletrônico"] },
      { id: "mat_tjsp", name: "Raciocínio Lógico", peso: 2, horasRecomendadas: 20, categoria: "leve", assuntos: ["Proposições Lógicas", "Tabelas-Verdade", "Equivalências Lógicas", "Diagramas Lógicos", "Sequências e Padrões", "Problemas de Contagem"] },
    ],
  },
  tjsc: {
    concursoId: "tjsc",
    cargo: "Técnico Judiciário Auxiliar",
    banca: "FGV",
    disciplinas: [
      { id: "port_tjsc", name: "Língua Portuguesa", peso: 5, horasRecomendadas: 55, categoria: "pesada", assuntos: ["Compreensão e Interpretação de Texto", "Tipologia Textual", "Ortografia", "Acentuação", "Morfologia", "Sintaxe", "Concordância", "Regência", "Pontuação"] },
      { id: "const_tjsc", name: "Direito Constitucional", peso: 4, horasRecomendadas: 45, categoria: "pesada", assuntos: ["Princípios Fundamentais", "Direitos e Garantias Fundamentais", "Organização do Estado", "Poder Judiciário", "Ministério Público", "Ordem Social"] },
      { id: "admin_tjsc", name: "Direito Administrativo", peso: 4, horasRecomendadas: 45, categoria: "pesada", assuntos: ["Princípios Administrativos", "Atos Administrativos", "Licitação", "Contratos Administrativos", "Servidores Públicos", "Processo Administrativo"] },
      { id: "civil_tjsc", name: "Direito Civil", peso: 3, horasRecomendadas: 35, categoria: "media", assuntos: ["Pessoa Natural e Jurídica", "Bens", "Negócio Jurídico", "Prescrição e Decadência", "Obrigações", "Contratos"] },
      { id: "penal_tjsc", name: "Direito Penal", peso: 3, horasRecomendadas: 35, categoria: "media", assuntos: ["Princípios do Direito Penal", "Aplicação da Lei Penal", "Teoria do Crime", "Penas", "Crimes contra a Administração Pública"] },
      { id: "info_tjsc", name: "Informática", peso: 2, horasRecomendadas: 20, categoria: "leve", assuntos: ["Sistemas Operacionais", "Editores de Texto", "Planilhas", "Internet", "Segurança da Informação"] },
      { id: "rl_tjsc", name: "Raciocínio Lógico", peso: 2, horasRecomendadas: 20, categoria: "leve", assuntos: ["Lógica Proposicional", "Raciocínio Sequencial", "Análise Combinatória", "Probabilidade"] },
      { id: "red_tjsc", name: "Redação Oficial", peso: 2, horasRecomendadas: 15, categoria: "leve", assuntos: ["Manual de Redação da Presidência", "Tipos de Documentos Oficiais", "Padrão Ofício", "Correio Eletrônico Formal"] },
    ],
  },
  pgmpoa: {
    concursoId: "pgmpoa",
    cargo: "Analista da Procuradoria",
    banca: "FUNDATEC",
    disciplinas: [
      { id: "port_pgm", name: "Língua Portuguesa", peso: 4, horasRecomendadas: 45, categoria: "pesada", assuntos: ["Interpretação de Texto", "Gramática", "Redação", "Semântica", "Coesão e Coerência"] },
      { id: "const_pgm", name: "Direito Constitucional", peso: 5, horasRecomendadas: 55, categoria: "pesada", assuntos: ["Teoria da Constituição", "Direitos Fundamentais", "Organização do Estado", "Tributação e Orçamento", "Ordem Econômica e Financeira"] },
      { id: "admin_pgm", name: "Direito Administrativo", peso: 5, horasRecomendadas: 55, categoria: "pesada", assuntos: ["Regime Jurídico Administrativo", "Organização Administrativa", "Atos Administrativos", "Licitações (Lei 14.133)", "Serviços Públicos", "Bens Públicos"] },
      { id: "civil_pgm", name: "Direito Civil", peso: 4, horasRecomendadas: 45, categoria: "pesada", assuntos: ["Parte Geral", "Obrigações", "Contratos", "Responsabilidade Civil", "Direitos Reais", "Família e Sucessões"] },
      { id: "trib_pgm", name: "Direito Tributário", peso: 3, horasRecomendadas: 35, categoria: "media", assuntos: ["Sistema Tributário Nacional", "Tributos Municipais", "Obrigação Tributária", "Crédito Tributário", "Execução Fiscal"] },
      { id: "proc_civil_pgm", name: "Direito Processual Civil", peso: 3, horasRecomendadas: 30, categoria: "media", assuntos: ["Processo de Conhecimento", "Tutelas Provisórias", "Recursos", "Execução", "Fazenda Pública em Juízo"] },
      { id: "ambiental_pgm", name: "Direito Ambiental", peso: 2, horasRecomendadas: 20, categoria: "leve", assuntos: ["Política Nacional do Meio Ambiente", "Licenciamento Ambiental", "Áreas Protegidas", "Responsabilidade Ambiental"] },
      { id: "urban_pgm", name: "Direito Urbanístico", peso: 2, horasRecomendadas: 15, categoria: "leve", assuntos: ["Estatuto da Cidade", "Plano Diretor", "Parcelamento do Solo", "Política Urbana"] },
    ],
  },
  pf: {
    concursoId: "pf",
    cargo: "Agente de Polícia Federal",
    banca: "CESPE/CEBRASPE",
    disciplinas: [
      { id: "port_pf", name: "Língua Portuguesa", peso: 4, horasRecomendadas: 45, categoria: "pesada", assuntos: ["Compreensão e Interpretação de Textos", "Tipologia Textual", "Ortografia", "Semântica", "Morfologia", "Sintaxe", "Pontuação", "Reescrita de Frases"] },
      { id: "const_pf", name: "Direito Constitucional", peso: 5, horasRecomendadas: 55, categoria: "pesada", assuntos: ["Princípios Fundamentais", "Direitos e Garantias Fundamentais", "Nacionalidade", "Direitos Políticos", "Organização do Estado", "Segurança Pública", "Defesa do Estado e das Instituições Democráticas"] },
      { id: "admin_pf", name: "Direito Administrativo", peso: 4, horasRecomendadas: 50, categoria: "pesada", assuntos: ["Organização Administrativa", "Atos Administrativos", "Agentes Públicos", "Poderes Administrativos", "Licitações e Contratos", "Responsabilidade Civil do Estado", "Processo Administrativo Federal"] },
      { id: "penal_pf", name: "Direito Penal", peso: 5, horasRecomendadas: 55, categoria: "pesada", assuntos: ["Aplicação da Lei Penal", "Teoria do Crime", "Excludentes de Ilicitude", "Concurso de Crimes", "Penas", "Crimes contra a Pessoa", "Crimes contra o Patrimônio", "Crimes contra a Administração Pública", "Legislação Penal Especial"] },
      { id: "proc_penal_pf", name: "Direito Processual Penal", peso: 4, horasRecomendadas: 45, categoria: "pesada", assuntos: ["Inquérito Policial", "Ação Penal", "Competência", "Prova", "Prisão e Medidas Cautelares", "Procedimentos", "Tribunal do Júri", "Recursos"] },
      { id: "leg_esp_pf", name: "Legislação Especial", peso: 3, horasRecomendadas: 35, categoria: "media", assuntos: ["Lei de Drogas (11.343/06)", "Estatuto do Desarmamento", "Crimes Hediondos", "Abuso de Autoridade", "Organizações Criminosas", "Lavagem de Dinheiro", "Tortura"] },
      { id: "rl_pf", name: "Raciocínio Lógico", peso: 3, horasRecomendadas: 30, categoria: "media", assuntos: ["Lógica Proposicional", "Lógica de Argumentação", "Diagramas Lógicos", "Análise Combinatória", "Probabilidade", "Geometria"] },
      { id: "info_pf", name: "Informática", peso: 2, horasRecomendadas: 20, categoria: "leve", assuntos: ["Redes de Computadores", "Segurança da Informação", "Sistemas Operacionais", "Cloud Computing", "Banco de Dados"] },
      { id: "contab_pf", name: "Contabilidade", peso: 2, horasRecomendadas: 20, categoria: "leve", assuntos: ["Contabilidade Geral", "Balanço Patrimonial", "DRE", "Análise de Balanços"] },
      { id: "estat_pf", name: "Estatística", peso: 2, horasRecomendadas: 15, categoria: "leve", assuntos: ["Estatística Descritiva", "Probabilidade", "Distribuições", "Amostragem"] },
    ],
  },
  gcm: {
    concursoId: "gcm",
    cargo: "Guarda Municipal",
    banca: "FGV",
    disciplinas: [
      { id: "port_gcm", name: "Língua Portuguesa", peso: 5, horasRecomendadas: 50, categoria: "pesada", assuntos: ["Interpretação de Texto", "Ortografia", "Acentuação", "Classes de Palavras", "Sintaxe", "Concordância e Regência", "Pontuação"] },
      { id: "const_gcm", name: "Direito Constitucional", peso: 4, horasRecomendadas: 40, categoria: "pesada", assuntos: ["Princípios Fundamentais", "Direitos e Garantias Fundamentais", "Segurança Pública (Art. 144)", "Defesa do Estado", "Organização dos Poderes"] },
      { id: "admin_gcm", name: "Direito Administrativo", peso: 3, horasRecomendadas: 30, categoria: "media", assuntos: ["Princípios Administrativos", "Atos Administrativos", "Poderes Administrativos", "Agentes Públicos", "Responsabilidade Civil"] },
      { id: "penal_gcm", name: "Direito Penal", peso: 4, horasRecomendadas: 40, categoria: "pesada", assuntos: ["Aplicação da Lei Penal", "Teoria do Crime", "Excludentes de Ilicitude", "Crimes contra a Pessoa", "Crimes contra o Patrimônio", "Crimes contra a Administração Pública"] },
      { id: "eca_gcm", name: "ECA", peso: 3, horasRecomendadas: 25, categoria: "media", assuntos: ["Direitos Fundamentais da Criança", "Medidas de Proteção", "Ato Infracional", "Medidas Socioeducativas", "Conselho Tutelar"] },
      { id: "leg_gcm", name: "Legislação Municipal", peso: 3, horasRecomendadas: 25, categoria: "media", assuntos: ["Lei Orgânica do Município", "Estatuto da Guarda Municipal", "Código de Posturas", "Regime Jurídico dos Servidores"] },
      { id: "rl_gcm", name: "Raciocínio Lógico", peso: 2, horasRecomendadas: 20, categoria: "leve", assuntos: ["Lógica Proposicional", "Sequências Numéricas", "Problemas de Contagem", "Raciocínio Verbal"] },
      { id: "info_gcm", name: "Informática", peso: 2, horasRecomendadas: 15, categoria: "leve", assuntos: ["Windows", "Editores de Texto", "Planilhas", "Internet e E-mail", "Segurança da Informação"] },
    ],
  },
};

const DAY_NAMES: Record<string, string> = {
  "0": "Domingo",
  "1": "Segunda-feira",
  "2": "Terça-feira",
  "3": "Quarta-feira",
  "4": "Quinta-feira",
  "5": "Sexta-feira",
  "6": "Sábado",
};

const DAY_MAP: Record<string, number> = {
  domingo: 0,
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
};

export function generateStudyPlan(input: PlanningInput): DayPlan[] {
  const edital = editais[input.concursoId];
  if (!edital) return [];

  const totalMinutes = input.hoursPerDay * 60;

  // Build weighted discipline list
  let disciplinas = [...edital.disciplinas].map((d) => {
    let weight = d.peso;
    if (input.prioritySubjects.includes(d.id)) weight += 2;
    if (input.difficultSubjects.includes(d.id)) weight += 1;
    return { ...d, weight };
  });

  // Sort by weight desc
  disciplinas.sort((a, b) => b.weight - a.weight);

  // Calculate total weight
  const totalWeight = disciplinas.reduce((s, d) => s + d.weight, 0);

  // Build cycle: assign time proportionally
  // A cycle is a sequence of study blocks that repeats
  const cycleLength = Math.max(disciplinas.length, 5);

  // Create cycle slots - each slot has subject + time
  const cycle: StudyBlock[] = [];

  // Distribute disciplines across cycle positions
  // Higher weight = more appearances
  const appearances: Record<string, number> = {};
  disciplinas.forEach((d) => {
    appearances[d.id] = Math.max(1, Math.round((d.weight / totalWeight) * cycleLength));
  });

  // Flatten into cycle order, interleaving heavy and light
  const heavy = disciplinas.filter((d) => d.categoria === "pesada");
  const medium = disciplinas.filter((d) => d.categoria === "media");
  const light = disciplinas.filter((d) => d.categoria === "leve");

  const buildCycleQueue = () => {
    const queue: Disciplina[] = [];
    const maxRounds = Math.max(...Object.values(appearances));

    for (let round = 0; round < maxRounds; round++) {
      // Interleave: heavy, medium, light
      for (const d of heavy) {
        if (round < (appearances[d.id] || 0)) queue.push(d);
      }
      for (const d of medium) {
        if (round < (appearances[d.id] || 0)) queue.push(d);
      }
      for (const d of light) {
        if (round < (appearances[d.id] || 0)) queue.push(d);
      }
    }
    return queue;
  };

  const cycleQueue = buildCycleQueue();

  // Now fill daily plans
  const activeDays: number[] = input.studyEveryDay
    ? [0, 1, 2, 3, 4, 5, 6]
    : input.studyDays.map((d) => DAY_MAP[d] ?? 0);

  const start = new Date(input.startDate + "T00:00:00");
  const weeksToGenerate = input.examDate
    ? Math.ceil((new Date(input.examDate + "T00:00:00").getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000))
    : 8; // default 8 weeks

  const totalDays = Math.min(weeksToGenerate * 7, 120); // max ~4 months
  const plans: DayPlan[] = [];
  let queueIndex = 0;
  let cyclePos = 1;

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();

    if (!activeDays.includes(dayOfWeek)) continue;

    const blocks: StudyBlock[] = [];
    let remainingMinutes = totalMinutes;

    // Fill blocks from cycle queue
    while (remainingMinutes >= 25 && queueIndex < cycleQueue.length * 10) {
      const disc = cycleQueue[queueIndex % cycleQueue.length];

      // Time allocation: proportional to weight, min 30min, max 90min
      const baseTime = Math.round((disc.peso / 5) * 60);
      const studyTime = Math.min(Math.max(baseTime, 30), Math.min(90, remainingMinutes));

      if (studyTime > remainingMinutes) break;

      blocks.push({
        subject: disc.name,
        disciplinaId: disc.id,
        duration: studyTime,
        type: "estudo",
        assuntos: disc.assuntos || [],
      });
      remainingMinutes -= studyTime;
      queueIndex++;

      // Add questions block after heavy subjects (if time allows)
      if (disc.categoria === "pesada" && remainingMinutes >= 20) {
        const questionTime = Math.min(20, remainingMinutes);
        blocks.push({
          subject: `Questões de ${disc.name}`,
          disciplinaId: disc.id,
          duration: questionTime,
          type: "questoes",
          assuntos: disc.assuntos || [],
        });
        remainingMinutes -= questionTime;
      }
    }

    // Add revision block at end if time remains
    if (remainingMinutes >= 15) {
      blocks.push({
        subject: "Revisão do dia",
        disciplinaId: "revisao",
        duration: Math.min(remainingMinutes, 30),
        type: "revisao",
        assuntos: ["Revisar conteúdos estudados no dia"],
      });
    }

    const dateStr = date.toISOString().split("T")[0];
    plans.push({
      date: dateStr,
      dayOfWeek: DAY_NAMES[String(dayOfWeek)],
      blocks,
      cyclePosition: cyclePos,
    });
    cyclePos++;
  }

  return plans;
}
