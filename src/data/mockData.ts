export const user = {
  name: "Ana Lima",
  email: "ana.lima@email.com",
  plan: "FREE" as const,
  streak: 3,
  xp: 45,
  dailyGoal: 10,
  dailyCompleted: 6,
  stats: {
    resolved: 127,
    correct: 89,
    wrong: 38,
    favorites: 12,
    accuracy: 70,
  },
  badges: [
    { id: 1, name: "Primeiro Passo", desc: "Resolva sua primeira questão", earned: true, icon: "🎯" },
    { id: 2, name: "Fogo no Estudo", desc: "3 dias seguidos de prática", earned: true, icon: "🔥" },
    { id: 3, name: "Maratonista", desc: "Resolva 100 questões", earned: true, icon: "🏃" },
    { id: 4, name: "Expert", desc: "90% de acerto em uma matéria", earned: false, icon: "🧠" },
    { id: 5, name: "Semana Completa", desc: "7 dias seguidos de prática", earned: false, icon: "📅" },
    { id: 6, name: "Centurião", desc: "Resolva 500 questões", earned: false, icon: "⚔️" },
  ],
};

export const concursos = [
  { id: "tjsp", name: "TJ SP - Escrevente Técnico Judiciário" },
  { id: "tjsc", name: "TJ SC - Técnico Judiciário Auxiliar" },
  { id: "pgmpoa", name: "PGM Porto Alegre - Analista da Procuradoria" },
  { id: "pf", name: "Polícia Federal - Agente" },
  { id: "gcm", name: "Guarda Municipal de Manaus" },
];

export const materias = [
  {
    id: "const",
    name: "Direito Constitucional",
    leis: [
      { id: "cf88", name: "Constituição Federal (CF/88)", questions: 45 },
      { id: "ec45", name: "EC nº 45/2004 - Reforma do Judiciário", questions: 8 },
    ],
  },
  {
    id: "penal",
    name: "Direito Penal",
    leis: [
      { id: "cp", name: "Código Penal (CP)", questions: 38 },
      { id: "lcp", name: "Lei das Contravenções Penais", questions: 12 },
    ],
  },
  {
    id: "proc_penal",
    name: "Direito Processual Penal",
    leis: [
      { id: "cpp", name: "Código de Processo Penal (CPP)", questions: 32 },
      { id: "lei12403", name: "Lei 12.403/11 - Prisões Cautelares", questions: 6 },
    ],
  },
  {
    id: "ambiental",
    name: "Direito Ambiental",
    leis: [
      { id: "lei9605", name: "Lei 9.605/98 - Crimes Ambientais", questions: 18 },
      { id: "lei12651", name: "Lei 12.651/12 - Código Florestal", questions: 10 },
    ],
  },
  {
    id: "leg_esp",
    name: "Legislação Especial",
    leis: [
      { id: "eca", name: "ECA - Estatuto da Criança e do Adolescente", questions: 15 },
      { id: "lei11343", name: "Lei 11.343/06 - Lei de Drogas", questions: 14 },
      { id: "lei13869", name: "Lei 13.869/19 - Abuso de Autoridade", questions: 9 },
    ],
  },
];

export interface Question {
  id: number;
  concurso: string;
  materia: string;
  lei: string;
  year: number;
  banca: string;
  type: "multiple" | "boolean";
  difficulty: "Fácil" | "Médio" | "Difícil";
  statement: string;
  options: string[];
  correctIndex: number;
  comment: string;
  article: string;
  favorite: boolean;
  answered: boolean;
  wasCorrect: boolean | null;
}

export const questions: Question[] = [
  {
    id: 1,
    concurso: "Polícia Federal",
    materia: "Direito Constitucional",
    lei: "CF/88",
    year: 2023,
    banca: "CESPE/CEBRASPE",
    type: "multiple",
    difficulty: "Médio",
    statement:
      "A Constituição Federal de 1988, em seu artigo 1º, estabelece os fundamentos da República Federativa do Brasil. Assinale a alternativa que apresenta CORRETAMENTE todos os fundamentos previstos neste dispositivo constitucional:",
    options: [
      "Soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, e pluralismo político.",
      "Soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, e pluralismo partidário.",
      "Soberania, nacionalidade, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, e pluralismo político.",
      "Soberania, cidadania, dignidade da pessoa humana, liberdade de expressão, e pluralismo político.",
      "Independência, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, e pluralismo político.",
    ],
    correctIndex: 0,
    comment:
      "Os fundamentos da República Federativa do Brasil estão taxativamente previstos no art. 1º da CF/88: I - a soberania; II - a cidadania; III - a dignidade da pessoa humana; IV - os valores sociais do trabalho e da livre iniciativa; V - o pluralismo político. Memorize o mnemônico: SO-CI-DI-VA-PLU.",
    article: "Art. 1º, incisos I a V, da Constituição Federal de 1988",
    favorite: false,
    answered: false,
    wasCorrect: null,
  },
  {
    id: 2,
    concurso: "Guarda Municipal de Manaus",
    materia: "Direito Constitucional",
    lei: "CF/88",
    year: 2022,
    banca: "FGV",
    type: "boolean",
    difficulty: "Fácil",
    statement:
      "Considerando o disposto na Constituição Federal, julgue o item a seguir:\n\nA República Federativa do Brasil tem como fundamento a independência nacional.",
    options: ["Certo", "Errado"],
    correctIndex: 1,
    comment:
      "ERRADO. A independência nacional é um PRINCÍPIO que rege as relações internacionais (art. 4º, I, CF/88), e não um fundamento da República. Os fundamentos estão no art. 1º: soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, e pluralismo político.",
    article: "Art. 1º e Art. 4º, I, da Constituição Federal de 1988",
    favorite: true,
    answered: true,
    wasCorrect: true,
  },
  {
    id: 3,
    concurso: "Polícia Federal",
    materia: "Direito Penal",
    lei: "CP",
    year: 2023,
    banca: "CESPE/CEBRASPE",
    type: "multiple",
    difficulty: "Difícil",
    statement:
      "Acerca do conceito de crime e da aplicação da lei penal no tempo, assinale a alternativa correta:",
    options: [
      "A lei penal mais grave aplica-se ao fato anterior, ainda que decidido por sentença condenatória transitada em julgado.",
      "Considera-se praticado o crime no momento do resultado, conforme a teoria do resultado adotada pelo CP.",
      "A lei posterior que de qualquer modo favorecer o agente aplica-se aos fatos anteriores, ainda que decididos por sentença condenatória transitada em julgado.",
      "A analogia pode ser utilizada em Direito Penal, inclusive para criar tipos penais incriminadores.",
      "A lei excepcional ou temporária não se aplica ao fato praticado durante sua vigência, após o término de seu período.",
    ],
    correctIndex: 2,
    comment:
      "A alternativa C está correta conforme o art. 2º, parágrafo único, do Código Penal: 'A lei posterior, que de qualquer modo favorecer o agente, aplica-se aos fatos anteriores, ainda que decididos por sentença condenatória transitada em julgado.' Trata-se do princípio da retroatividade da lei penal mais benéfica (novatio legis in mellius).",
    article: "Art. 2º, parágrafo único, do Código Penal",
    favorite: false,
    answered: true,
    wasCorrect: false,
  },
  {
    id: 4,
    concurso: "Guarda Municipal de Manaus",
    materia: "Direito Ambiental",
    lei: "Lei 9.605/98",
    year: 2022,
    banca: "FGV",
    type: "multiple",
    difficulty: "Médio",
    statement:
      "De acordo com a Lei 9.605/98 (Lei de Crimes Ambientais), assinale a alternativa que apresenta uma circunstância que atenua a pena nos crimes ambientais:",
    options: [
      "Ter o agente cometido a infração para obter vantagem econômica.",
      "Baixo grau de instrução ou escolaridade do agente.",
      "Ter o agente cometido a infração em período de defeso à fauna.",
      "Reincidência nos crimes de natureza ambiental.",
      "Ter o agente cometido a infração atingindo espécies ameaçadas.",
    ],
    correctIndex: 1,
    comment:
      "O art. 14, inciso I, da Lei 9.605/98 prevê como circunstância atenuante o 'baixo grau de instrução ou escolaridade do agente'. As demais alternativas apresentam circunstâncias agravantes (art. 15 da mesma lei).",
    article: "Art. 14, I, da Lei 9.605/98",
    favorite: false,
    answered: false,
    wasCorrect: null,
  },
  {
    id: 5,
    concurso: "Polícia Federal",
    materia: "Direito Processual Penal",
    lei: "CPP",
    year: 2023,
    banca: "CESPE/CEBRASPE",
    type: "boolean",
    difficulty: "Médio",
    statement:
      "Julgue o item seguinte, relativo ao inquérito policial:\n\nO inquérito policial é peça indispensável para o oferecimento da denúncia pelo Ministério Público.",
    options: ["Certo", "Errado"],
    correctIndex: 1,
    comment:
      "ERRADO. O inquérito policial é DISPENSÁVEL para o oferecimento da denúncia. Conforme o art. 39, §5º, do CPP e entendimento consolidado, o Ministério Público pode oferecer denúncia com base em peças de informação que tragam elementos suficientes de autoria e materialidade, independentemente de inquérito policial.",
    article: "Art. 39, §5º, do Código de Processo Penal",
    favorite: false,
    answered: false,
    wasCorrect: null,
  },
];

export const performanceBySubject = [
  { materia: "Direito Constitucional", total: 45, correct: 36, accuracy: 80 },
  { materia: "Direito Penal", total: 38, correct: 24, accuracy: 63 },
  { materia: "Direito Processual Penal", total: 22, correct: 15, accuracy: 68 },
  { materia: "Direito Ambiental", total: 14, correct: 9, accuracy: 64 },
  { materia: "Legislação Especial", total: 8, correct: 5, accuracy: 62 },
];

export const weeklyActivity = [
  [0, 3, 5, 0, 8, 2, 0],
  [4, 0, 6, 3, 0, 7, 1],
  [2, 5, 0, 4, 6, 0, 3],
  [0, 7, 3, 5, 0, 4, 8],
  [6, 0, 4, 0, 7, 3, 5],
  [3, 8, 0, 6, 4, 0, 2],
  [0, 5, 7, 3, 0, 6, 4],
];
