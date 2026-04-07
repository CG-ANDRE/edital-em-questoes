// Admin Mock Data for LegisQuest

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registeredAt: string;
  lastAccess: string;
  status: 'active' | 'inactive' | 'blocked' | 'trial' | 'cancelled';
  subscriptionStatus: 'paying' | 'free' | 'trial' | 'cancelled' | 'overdue';
  plan: string;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  contestsAccessed: string[];
  materialsUsed: string[];
  streak: number;
  notes: string;
}

export interface AdminSubscription {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  plan: string;
  amount: number;
  status: 'active' | 'cancelled' | 'overdue' | 'expired';
  startDate: string;
  dueDate: string;
  autoRenew: boolean;
  payments: { date: string; amount: number; status: string }[];
}

export interface AdminContest {
  id: string;
  name: string;
  board: string;
  organ: string;
  position: string;
  area: string;
  status: 'active' | 'upcoming' | 'closed';
  description: string;
  tags: string[];
  createdAt: string;
  notes: string;
  studentsAccessed: number;
  questionsAnswered: number;
  avgCorrectRate: number;
  materialsLinked: string[];
  questionsLinked: number;
}

export interface AdminMaterial {
  id: string;
  title: string;
  description: string;
  contests: string[];
  discipline: string;
  topic: string;
  priority: 'high' | 'medium' | 'low';
  version: string;
  status: 'active' | 'inactive' | 'processing' | 'error';
  fileType: 'pdf' | 'docx' | 'txt' | 'text';
  uploadedAt: string;
  uploadedBy: string;
  updatedAt: string;
  notes: string;
  questionsGenerated: number;
  processingStatus: 'completed' | 'processing' | 'pending' | 'error';
}

export interface AdminQuestion {
  id: string;
  statement: string;
  alternatives: { letter: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  legislation: string;
  contest: string;
  discipline: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'active' | 'reviewing' | 'archived';
  createdAt: string;
  updatedAt: string;
  totalAnswers: number;
  correctRate: number;
  reportedErrors: number;
}

export interface AdminFeedback {
  id: string;
  studentName: string;
  studentEmail: string;
  type: 'feedback' | 'contest_request' | 'error_report';
  content: string;
  sentAt: string;
  status: 'new' | 'analyzing' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
  assignedTo: string;
  relatedContest?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
}

export interface AdminRole {
  id: string;
  name: string;
  label: string;
  permissions: string[];
}

// ---- MOCK DATA ----

export const adminStudents: AdminStudent[] = [
  { id: "s1", name: "Ana Clara Santos", email: "ana.clara@email.com", phone: "(11) 98765-4321", registeredAt: "2025-01-15", lastAccess: "2026-04-07", status: "active", subscriptionStatus: "paying", plan: "Premium Anual", questionsAnswered: 842, correctAnswers: 621, wrongAnswers: 221, contestsAccessed: ["ALERR", "PF", "PCDF"], materialsUsed: ["CF88", "CPP", "Lei 8.112"], streak: 45, notes: "" },
  { id: "s2", name: "Carlos Eduardo Lima", email: "carlos.lima@email.com", phone: "(21) 97654-3210", registeredAt: "2025-03-20", lastAccess: "2026-04-06", status: "active", subscriptionStatus: "paying", plan: "Premium Mensal", questionsAnswered: 534, correctAnswers: 380, wrongAnswers: 154, contestsAccessed: ["TJ SP", "PF"], materialsUsed: ["CF88", "CPC"], streak: 12, notes: "" },
  { id: "s3", name: "Maria Fernanda Oliveira", email: "maria.f@email.com", registeredAt: "2025-06-10", lastAccess: "2026-03-15", status: "inactive", subscriptionStatus: "cancelled", plan: "Premium Mensal", questionsAnswered: 120, correctAnswers: 72, wrongAnswers: 48, contestsAccessed: ["PCDF"], materialsUsed: ["CF88"], streak: 0, notes: "Cancelou por falta de tempo" },
  { id: "s4", name: "João Pedro Almeida", email: "joao.pedro@email.com", registeredAt: "2026-01-05", lastAccess: "2026-04-07", status: "active", subscriptionStatus: "trial", plan: "Trial 7 dias", questionsAnswered: 65, correctAnswers: 42, wrongAnswers: 23, contestsAccessed: ["PF"], materialsUsed: ["CF88"], streak: 7, notes: "" },
  { id: "s5", name: "Beatriz Souza Costa", email: "beatriz.sc@email.com", phone: "(31) 91234-5678", registeredAt: "2024-11-20", lastAccess: "2026-04-05", status: "active", subscriptionStatus: "paying", plan: "Premium Anual", questionsAnswered: 1203, correctAnswers: 962, wrongAnswers: 241, contestsAccessed: ["ALERR", "PF", "PCDF", "TJ SP"], materialsUsed: ["CF88", "CPP", "CPC", "Lei 8.112", "Lei 9.784"], streak: 90, notes: "Aluna destaque" },
  { id: "s6", name: "Lucas Martins", email: "lucas.m@email.com", registeredAt: "2026-02-14", lastAccess: "2026-02-28", status: "cancelled", subscriptionStatus: "cancelled", plan: "Premium Mensal", questionsAnswered: 30, correctAnswers: 15, wrongAnswers: 15, contestsAccessed: ["PF"], materialsUsed: ["CF88"], streak: 0, notes: "" },
  { id: "s7", name: "Fernanda Lima Rocha", email: "fernanda.lr@email.com", phone: "(85) 99876-5432", registeredAt: "2025-09-01", lastAccess: "2026-04-07", status: "active", subscriptionStatus: "paying", plan: "Premium Semestral", questionsAnswered: 678, correctAnswers: 502, wrongAnswers: 176, contestsAccessed: ["ALERR", "TJ SP"], materialsUsed: ["CF88", "CPP", "CPC"], streak: 33, notes: "" },
  { id: "s8", name: "Rafael Gomes", email: "rafael.g@email.com", registeredAt: "2026-03-01", lastAccess: "2026-04-01", status: "active", subscriptionStatus: "free", plan: "Gratuito", questionsAnswered: 45, correctAnswers: 28, wrongAnswers: 17, contestsAccessed: ["PF"], materialsUsed: ["CF88"], streak: 5, notes: "" },
  { id: "s9", name: "Isabela Nascimento", email: "isabela.n@email.com", registeredAt: "2025-07-22", lastAccess: "2026-04-06", status: "active", subscriptionStatus: "overdue", plan: "Premium Mensal", questionsAnswered: 310, correctAnswers: 217, wrongAnswers: 93, contestsAccessed: ["PCDF", "PF"], materialsUsed: ["CF88", "CPP"], streak: 0, notes: "Pagamento atrasado há 5 dias" },
  { id: "s10", name: "Thiago Barbosa", email: "thiago.b@email.com", registeredAt: "2026-04-07", lastAccess: "2026-04-07", status: "active", subscriptionStatus: "trial", plan: "Trial 7 dias", questionsAnswered: 3, correctAnswers: 2, wrongAnswers: 1, contestsAccessed: [], materialsUsed: [], streak: 1, notes: "Cadastro novo hoje" },
  { id: "s11", name: "Juliana Prado", email: "juliana.p@email.com", registeredAt: "2026-04-06", lastAccess: "2026-04-07", status: "active", subscriptionStatus: "free", plan: "Gratuito", questionsAnswered: 12, correctAnswers: 8, wrongAnswers: 4, contestsAccessed: ["PF"], materialsUsed: [], streak: 2, notes: "" },
  { id: "s12", name: "Pedro Henrique Dias", email: "pedro.hd@email.com", registeredAt: "2026-04-05", lastAccess: "2026-04-07", status: "active", subscriptionStatus: "trial", plan: "Trial 7 dias", questionsAnswered: 25, correctAnswers: 18, wrongAnswers: 7, contestsAccessed: ["ALERR"], materialsUsed: ["CF88"], streak: 3, notes: "" },
];

export const adminSubscriptions: AdminSubscription[] = [
  { id: "sub1", studentId: "s1", studentName: "Ana Clara Santos", studentEmail: "ana.clara@email.com", plan: "Premium Anual", amount: 299.90, status: "active", startDate: "2025-01-15", dueDate: "2026-01-15", autoRenew: true, payments: [{ date: "2025-01-15", amount: 299.90, status: "paid" }, { date: "2026-01-15", amount: 299.90, status: "paid" }] },
  { id: "sub2", studentId: "s2", studentName: "Carlos Eduardo Lima", studentEmail: "carlos.lima@email.com", plan: "Premium Mensal", amount: 39.90, status: "active", startDate: "2025-03-20", dueDate: "2026-04-20", autoRenew: true, payments: [{ date: "2026-03-20", amount: 39.90, status: "paid" }] },
  { id: "sub3", studentId: "s3", studentName: "Maria Fernanda Oliveira", studentEmail: "maria.f@email.com", plan: "Premium Mensal", amount: 39.90, status: "cancelled", startDate: "2025-06-10", dueDate: "2025-12-10", autoRenew: false, payments: [{ date: "2025-06-10", amount: 39.90, status: "paid" }] },
  { id: "sub4", studentId: "s5", studentName: "Beatriz Souza Costa", studentEmail: "beatriz.sc@email.com", plan: "Premium Anual", amount: 299.90, status: "active", startDate: "2024-11-20", dueDate: "2026-11-20", autoRenew: true, payments: [{ date: "2024-11-20", amount: 299.90, status: "paid" }, { date: "2025-11-20", amount: 299.90, status: "paid" }] },
  { id: "sub5", studentId: "s7", studentName: "Fernanda Lima Rocha", studentEmail: "fernanda.lr@email.com", plan: "Premium Semestral", amount: 179.90, status: "active", startDate: "2025-09-01", dueDate: "2026-09-01", autoRenew: true, payments: [{ date: "2025-09-01", amount: 179.90, status: "paid" }, { date: "2026-03-01", amount: 179.90, status: "paid" }] },
  { id: "sub6", studentId: "s9", studentName: "Isabela Nascimento", studentEmail: "isabela.n@email.com", plan: "Premium Mensal", amount: 39.90, status: "overdue", startDate: "2025-07-22", dueDate: "2026-04-02", autoRenew: true, payments: [{ date: "2026-03-02", amount: 39.90, status: "paid" }, { date: "2026-04-02", amount: 39.90, status: "overdue" }] },
];

export const adminContests: AdminContest[] = [
  { id: "c1", name: "Assembleia Legislativa de Roraima", board: "FGV", organ: "ALERR", position: "Analista Legislativo", area: "Legislativa", status: "active", description: "Concurso para Analista Legislativo da ALERR", tags: ["legislativo", "estadual", "FGV"], createdAt: "2025-01-10", notes: "", studentsAccessed: 156, questionsAnswered: 4520, avgCorrectRate: 68.5, materialsLinked: ["CF88", "Regimento ALERR"], questionsLinked: 180 },
  { id: "c2", name: "Polícia Federal", board: "CEBRASPE", organ: "PF", position: "Agente", area: "Policial", status: "active", description: "Concurso para Agente da Polícia Federal", tags: ["policial", "federal", "CEBRASPE"], createdAt: "2025-02-15", notes: "", studentsAccessed: 312, questionsAnswered: 8940, avgCorrectRate: 62.3, materialsLinked: ["CF88", "CPP", "Lei 12.830"], questionsLinked: 320 },
  { id: "c3", name: "Polícia Civil do DF", board: "CEBRASPE", organ: "PCDF", position: "Delegado", area: "Policial", status: "active", description: "Concurso para Delegado da PCDF", tags: ["policial", "distrital", "CEBRASPE"], createdAt: "2025-03-20", notes: "", studentsAccessed: 198, questionsAnswered: 5670, avgCorrectRate: 58.7, materialsLinked: ["CF88", "CPP", "Lei 8.112"], questionsLinked: 210 },
  { id: "c4", name: "Tribunal de Justiça de SP", board: "VUNESP", organ: "TJ SP", position: "Escrevente", area: "Judiciária", status: "active", description: "Concurso para Escrevente Técnico Judiciário", tags: ["judiciário", "estadual", "VUNESP"], createdAt: "2025-04-05", notes: "", studentsAccessed: 245, questionsAnswered: 6230, avgCorrectRate: 71.2, materialsLinked: ["CF88", "CPC", "Lei 8.935"], questionsLinked: 250 },
  { id: "c5", name: "Receita Federal", board: "CEBRASPE", organ: "RFB", position: "Auditor Fiscal", area: "Fiscal", status: "upcoming", description: "Concurso para Auditor Fiscal da Receita Federal", tags: ["fiscal", "federal", "CEBRASPE"], createdAt: "2026-03-01", notes: "Edital previsto para Q3 2026", studentsAccessed: 0, questionsAnswered: 0, avgCorrectRate: 0, materialsLinked: [], questionsLinked: 0 },
  { id: "c6", name: "INSS - Técnico do Seguro Social", board: "CEBRASPE", organ: "INSS", position: "Técnico", area: "Previdenciária", status: "closed", description: "Concurso encerrado do INSS", tags: ["previdência", "federal"], createdAt: "2024-06-15", notes: "Concurso realizado em 2024", studentsAccessed: 89, questionsAnswered: 2100, avgCorrectRate: 74.1, materialsLinked: ["CF88", "Lei 8.213"], questionsLinked: 90 },
];

export const adminMaterials: AdminMaterial[] = [
  { id: "m1", title: "Constituição Federal de 1988", description: "Texto completo da CF/88 com emendas atualizadas", contests: ["ALERR", "PF", "PCDF", "TJ SP"], discipline: "Direito Constitucional", topic: "Constituição Federal", priority: "high", version: "EC 132/2023", status: "active", fileType: "pdf", uploadedAt: "2025-01-05", uploadedBy: "Admin", updatedAt: "2026-01-10", notes: "", questionsGenerated: 450, processingStatus: "completed" },
  { id: "m2", title: "Código de Processo Penal", description: "CPP atualizado com Lei 14.245/2021", contests: ["PF", "PCDF"], discipline: "Direito Processual Penal", topic: "Processo Penal", priority: "high", version: "2024.1", status: "active", fileType: "pdf", uploadedAt: "2025-02-10", uploadedBy: "Admin", updatedAt: "2025-11-20", notes: "", questionsGenerated: 280, processingStatus: "completed" },
  { id: "m3", title: "Código de Processo Civil", description: "CPC/2015 atualizado", contests: ["TJ SP"], discipline: "Direito Processual Civil", topic: "Processo Civil", priority: "high", version: "2024.2", status: "active", fileType: "pdf", uploadedAt: "2025-03-15", uploadedBy: "Admin", updatedAt: "2025-12-05", notes: "", questionsGenerated: 320, processingStatus: "completed" },
  { id: "m4", title: "Lei 8.112/1990 - Servidores Públicos", description: "Regime jurídico dos servidores públicos civis da União", contests: ["PF", "PCDF"], discipline: "Direito Administrativo", topic: "Servidor Público", priority: "medium", version: "2023.1", status: "active", fileType: "pdf", uploadedAt: "2025-04-20", uploadedBy: "Admin", updatedAt: "2025-10-15", notes: "", questionsGenerated: 150, processingStatus: "completed" },
  { id: "m5", title: "Lei 9.784/1999 - Processo Administrativo", description: "Lei do Processo Administrativo Federal", contests: ["PF", "PCDF", "ALERR"], discipline: "Direito Administrativo", topic: "Processo Administrativo", priority: "medium", version: "2023.1", status: "active", fileType: "docx", uploadedAt: "2025-05-10", uploadedBy: "Admin", updatedAt: "2025-09-20", notes: "", questionsGenerated: 90, processingStatus: "completed" },
  { id: "m6", title: "Regimento Interno ALERR", description: "Regimento interno da Assembleia Legislativa de Roraima", contests: ["ALERR"], discipline: "Legislação Específica", topic: "Regimento Interno", priority: "high", version: "2024.1", status: "active", fileType: "pdf", uploadedAt: "2025-06-01", uploadedBy: "Admin", updatedAt: "2025-06-01", notes: "", questionsGenerated: 60, processingStatus: "completed" },
  { id: "m7", title: "Lei Orgânica da PF", description: "Lei 12.830/2013 - Investigação criminal conduzida pelo delegado", contests: ["PF"], discipline: "Legislação Específica", topic: "Polícia Federal", priority: "medium", version: "1.0", status: "active", fileType: "txt", uploadedAt: "2025-07-15", uploadedBy: "Admin", updatedAt: "2025-07-15", notes: "", questionsGenerated: 35, processingStatus: "completed" },
  { id: "m8", title: "Novo material - CTN", description: "Código Tributário Nacional atualizado", contests: [], discipline: "Direito Tributário", topic: "CTN", priority: "low", version: "1.0", status: "processing", fileType: "pdf", uploadedAt: "2026-04-06", uploadedBy: "Admin", updatedAt: "2026-04-06", notes: "Processando questões automaticamente", questionsGenerated: 0, processingStatus: "processing" },
];

export const adminQuestions: AdminQuestion[] = [
  { id: "q1", statement: "De acordo com a Constituição Federal, é correto afirmar que os direitos e garantias fundamentais:", alternatives: [{ letter: "A", text: "São taxativos e não admitem ampliação" }, { letter: "B", text: "Incluem os direitos decorrentes de tratados internacionais" }, { letter: "C", text: "São aplicáveis apenas aos cidadãos brasileiros" }, { letter: "D", text: "Excluem os direitos sociais" }, { letter: "E", text: "São absolutos e não comportam restrição" }], correctAnswer: "B", explanation: "O art. 5°, §2° da CF/88 estabelece que os direitos expressos não excluem outros decorrentes de tratados internacionais.", legislation: "CF/88", contest: "PF", discipline: "Direito Constitucional", topic: "Direitos Fundamentais", difficulty: "medium", status: "active", createdAt: "2025-02-10", updatedAt: "2025-02-10", totalAnswers: 456, correctRate: 72.3, reportedErrors: 0 },
  { id: "q2", statement: "No âmbito do processo penal, a prisão temporária:", alternatives: [{ letter: "A", text: "Pode ser decretada de ofício pelo juiz" }, { letter: "B", text: "Tem prazo máximo de 30 dias, prorrogáveis" }, { letter: "C", text: "Deve ser requerida pelo Ministério Público ou representação da autoridade policial" }, { letter: "D", text: "É cabível para qualquer tipo de crime" }, { letter: "E", text: "Não exige fundamentação" }], correctAnswer: "C", explanation: "A Lei 7.960/89 prevê que a prisão temporária deve ser requerida pelo MP ou representação policial.", legislation: "CPP", contest: "PCDF", discipline: "Direito Processual Penal", topic: "Prisões", difficulty: "hard", status: "active", createdAt: "2025-03-15", updatedAt: "2025-03-15", totalAnswers: 312, correctRate: 54.8, reportedErrors: 1 },
  { id: "q3", statement: "Segundo a Lei 8.112/90, o servidor público em estágio probatório:", alternatives: [{ letter: "A", text: "Não pode ocupar cargo em comissão" }, { letter: "B", text: "Pode ser exonerado a qualquer tempo sem motivação" }, { letter: "C", text: "Será avaliado conforme critérios de assiduidade, disciplina, capacidade de iniciativa, produtividade e responsabilidade" }, { letter: "D", text: "Tem estabilidade imediata após a posse" }, { letter: "E", text: "Não pode tirar férias" }], correctAnswer: "C", explanation: "O art. 20 da Lei 8.112/90 lista os critérios de avaliação do estágio probatório.", legislation: "Lei 8.112", contest: "PF", discipline: "Direito Administrativo", topic: "Servidor Público", difficulty: "easy", status: "active", createdAt: "2025-04-20", updatedAt: "2025-04-20", totalAnswers: 523, correctRate: 82.1, reportedErrors: 0 },
  { id: "q4", statement: "Em relação ao mandado de segurança coletivo, é INCORRETO afirmar:", alternatives: [{ letter: "A", text: "Pode ser impetrado por partido político com representação no Congresso" }, { letter: "B", text: "Pode ser impetrado por organização sindical" }, { letter: "C", text: "Protege direito líquido e certo" }, { letter: "D", text: "Pode ser impetrado por qualquer cidadão em nome da coletividade" }, { letter: "E", text: "É previsto na Constituição Federal" }], correctAnswer: "D", explanation: "O mandado de segurança coletivo tem legitimados específicos previstos no art. 5°, LXX da CF.", legislation: "CF/88", contest: "TJ SP", discipline: "Direito Constitucional", topic: "Remédios Constitucionais", difficulty: "medium", status: "active", createdAt: "2025-05-10", updatedAt: "2025-05-10", totalAnswers: 289, correctRate: 65.4, reportedErrors: 2 },
  { id: "q5", statement: "A competência residual para legislar pertence:", alternatives: [{ letter: "A", text: "À União" }, { letter: "B", text: "Aos Estados" }, { letter: "C", text: "Aos Municípios" }, { letter: "D", text: "Ao Distrito Federal" }, { letter: "E", text: "Aos Territórios" }], correctAnswer: "B", explanation: "Conforme art. 25, §1° da CF/88, a competência residual pertence aos Estados.", legislation: "CF/88", contest: "ALERR", discipline: "Direito Constitucional", topic: "Organização do Estado", difficulty: "easy", status: "active", createdAt: "2025-06-05", updatedAt: "2025-06-05", totalAnswers: 678, correctRate: 78.9, reportedErrors: 0 },
  { id: "q6", statement: "Questão em revisão sobre processo civil - CPC art. 300", alternatives: [{ letter: "A", text: "Opção A" }, { letter: "B", text: "Opção B" }, { letter: "C", text: "Opção C" }, { letter: "D", text: "Opção D" }], correctAnswer: "A", explanation: "Em revisão", legislation: "CPC", contest: "TJ SP", discipline: "Direito Processual Civil", topic: "Tutela Provisória", difficulty: "hard", status: "reviewing", createdAt: "2026-04-01", updatedAt: "2026-04-05", totalAnswers: 0, correctRate: 0, reportedErrors: 0 },
  { id: "q7", statement: "Rascunho - Direito Tributário CTN", alternatives: [{ letter: "A", text: "Opção A" }, { letter: "B", text: "Opção B" }, { letter: "C", text: "Opção C" }, { letter: "D", text: "Opção D" }], correctAnswer: "C", explanation: "", legislation: "CTN", contest: "", discipline: "Direito Tributário", topic: "Obrigação Tributária", difficulty: "medium", status: "draft", createdAt: "2026-04-06", updatedAt: "2026-04-06", totalAnswers: 0, correctRate: 0, reportedErrors: 0 },
];

export const adminFeedbacks: AdminFeedback[] = [
  { id: "f1", studentName: "Ana Clara Santos", studentEmail: "ana.clara@email.com", type: "feedback", content: "A plataforma é excelente! Gostaria de mais questões sobre Direito Administrativo.", sentAt: "2026-04-05", status: "new", priority: "low", notes: "", assignedTo: "" },
  { id: "f2", studentName: "Carlos Eduardo Lima", studentEmail: "carlos.lima@email.com", type: "contest_request", content: "Poderiam adicionar questões para o concurso da CGU? Estou focado nesse certame.", sentAt: "2026-04-04", status: "analyzing", priority: "medium", notes: "Verificar viabilidade", assignedTo: "Admin", relatedContest: "CGU" },
  { id: "f3", studentName: "Beatriz Souza Costa", studentEmail: "beatriz.sc@email.com", type: "error_report", content: "A questão Q4 sobre mandado de segurança coletivo tem a alternativa D muito parecida com a E. Sugestão: revisar enunciado.", sentAt: "2026-04-06", status: "new", priority: "high", notes: "", assignedTo: "", relatedContest: "TJ SP" },
  { id: "f4", studentName: "Fernanda Lima Rocha", studentEmail: "fernanda.lr@email.com", type: "feedback", content: "Adorei os materiais sobre Regimento Interno da ALERR. Muito bem organizados!", sentAt: "2026-04-03", status: "resolved", priority: "low", notes: "Agradecido", assignedTo: "Admin" },
  { id: "f5", studentName: "João Pedro Almeida", studentEmail: "joao.pedro@email.com", type: "contest_request", content: "Seria possível ter questões para o concurso da Receita Federal?", sentAt: "2026-04-07", status: "new", priority: "medium", notes: "", assignedTo: "", relatedContest: "RFB" },
  { id: "f6", studentName: "Rafael Gomes", studentEmail: "rafael.g@email.com", type: "error_report", content: "Ao tentar acessar a página de questões, aparece um erro de carregamento intermitente.", sentAt: "2026-04-06", status: "analyzing", priority: "urgent", notes: "Investigar logs do servidor", assignedTo: "Tech" },
  { id: "f7", studentName: "Isabela Nascimento", studentEmail: "isabela.n@email.com", type: "feedback", content: "Gostaria que houvesse um modo noturno na plataforma.", sentAt: "2026-04-02", status: "archived", priority: "low", notes: "Backlog de features", assignedTo: "Admin" },
  { id: "f8", studentName: "Thiago Barbosa", studentEmail: "thiago.b@email.com", type: "contest_request", content: "Quero questões para PRF 2026!", sentAt: "2026-04-07", status: "new", priority: "medium", notes: "", assignedTo: "" },
];

export const systemLogs: SystemLog[] = [
  { id: "l1", timestamp: "2026-04-07T10:32:00", level: "info", message: "Novo aluno cadastrado: Thiago Barbosa", source: "auth" },
  { id: "l2", timestamp: "2026-04-07T09:15:00", level: "info", message: "Material CTN enviado para processamento", source: "materials" },
  { id: "l3", timestamp: "2026-04-07T08:45:00", level: "warning", message: "Latência elevada detectada: 2.3s média", source: "monitoring" },
  { id: "l4", timestamp: "2026-04-06T22:10:00", level: "error", message: "Falha no processamento do material: timeout", source: "materials" },
  { id: "l5", timestamp: "2026-04-06T18:30:00", level: "info", message: "Backup automático do banco concluído", source: "database" },
  { id: "l6", timestamp: "2026-04-06T14:20:00", level: "warning", message: "Pagamento pendente: Isabela Nascimento", source: "payments" },
  { id: "l7", timestamp: "2026-04-06T12:00:00", level: "info", message: "12 novas questões ativadas para concurso PF", source: "questions" },
  { id: "l8", timestamp: "2026-04-05T23:55:00", level: "critical", message: "Falha na conexão com banco de dados (recuperado)", source: "database" },
  { id: "l9", timestamp: "2026-04-05T16:40:00", level: "info", message: "Relatório semanal gerado automaticamente", source: "reports" },
  { id: "l10", timestamp: "2026-04-05T10:00:00", level: "info", message: "Manutenção programada concluída", source: "system" },
];

export const adminRoles: AdminRole[] = [
  { id: "r1", name: "super_admin", label: "Super Admin", permissions: ["all"] },
  { id: "r2", name: "admin_ops", label: "Admin Operacional", permissions: ["students", "contests", "materials", "feedback"] },
  { id: "r3", name: "admin_content", label: "Admin Conteúdo", permissions: ["materials", "contests", "questions"] },
  { id: "r4", name: "admin_finance", label: "Admin Financeiro", permissions: ["subscriptions", "reports"] },
  { id: "r5", name: "support", label: "Suporte", permissions: ["feedback", "students.view"] },
];

// Dashboard metrics
export const dashboardMetrics = {
  totalStudents: 12,
  activeStudents: 9,
  payingStudents: 4,
  inactiveStudents: 1,
  cancelledStudents: 2,
  newToday: 2,
  newThisWeek: 4,
  newThisMonth: 5,
  totalContests: 6,
  totalMaterials: 8,
  totalQuestions: 7,
  totalFeedbacks: 3,
  totalContestRequests: 3,
  totalErrorReports: 2,
  activeVsRegistered: 75,
  conversionRate: 33.3,
};

export const chartData = {
  registrations: [
    { month: "Out", value: 1 }, { month: "Nov", value: 2 }, { month: "Dez", value: 1 },
    { month: "Jan", value: 2 }, { month: "Fev", value: 1 }, { month: "Mar", value: 2 },
    { month: "Abr", value: 3 },
  ],
  paying: [
    { month: "Out", value: 0 }, { month: "Nov", value: 1 }, { month: "Dez", value: 1 },
    { month: "Jan", value: 2 }, { month: "Fev", value: 2 }, { month: "Mar", value: 3 },
    { month: "Abr", value: 4 },
  ],
  usage: [
    { day: "Seg", sessions: 45 }, { day: "Ter", sessions: 62 }, { day: "Qua", sessions: 58 },
    { day: "Qui", sessions: 71 }, { day: "Sex", sessions: 55 }, { day: "Sáb", sessions: 38 },
    { day: "Dom", sessions: 29 },
  ],
  contestsAccess: [
    { name: "PF", value: 312 }, { name: "TJ SP", value: 245 }, { name: "PCDF", value: 198 },
    { name: "ALERR", value: 156 }, { name: "INSS", value: 89 },
  ],
  questionsAnswered: [
    { name: "PF", value: 8940 }, { name: "TJ SP", value: 6230 }, { name: "PCDF", value: 5670 },
    { name: "ALERR", value: 4520 }, { name: "INSS", value: 2100 },
  ],
};

export const systemMetrics = {
  avgLatency: 180,
  avgPageLoad: 1.2,
  avgResponseTime: 0.8,
  dbStatus: "healthy" as const,
  storageUsed: 2.4,
  storageTotal: 10,
  totalUploads: 8,
  processingQueue: 1,
  uptime: 99.8,
  errorsLast24h: 2,
  warningsLast24h: 3,
};

export const recentActivities = [
  { id: "a1", action: "Novo cadastro", description: "Thiago Barbosa se cadastrou na plataforma", time: "Há 2 horas", type: "user" as const },
  { id: "a2", action: "Material enviado", description: "CTN enviado para processamento", time: "Há 5 horas", type: "material" as const },
  { id: "a3", action: "Feedback recebido", description: "João Pedro solicitou questões para RFB", time: "Há 6 horas", type: "feedback" as const },
  { id: "a4", action: "Erro reportado", description: "Rafael Gomes reportou erro de carregamento", time: "Há 8 horas", type: "error" as const },
  { id: "a5", action: "Pagamento pendente", description: "Isabela Nascimento com pagamento atrasado", time: "Há 1 dia", type: "payment" as const },
  { id: "a6", action: "Questões ativadas", description: "12 novas questões para concurso PF", time: "Há 1 dia", type: "question" as const },
];
