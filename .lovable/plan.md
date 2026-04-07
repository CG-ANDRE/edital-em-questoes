

## Plano: Area Administrativa Completa - LegisQuest

Todas as telas do admin serao criadas com dados mock, prontas para conexao futura com backend. O admin sera completamente separado da visao do aluno, com rota `/admin/*` e layout proprio com sidebar.

---

### Arquitetura

```text
/admin                -> Dashboard geral
/admin/students       -> Gestao de Alunos
/admin/students/:id   -> Ficha do Aluno
/admin/subscriptions  -> Assinaturas / Pagamentos
/admin/contests       -> Gestao de Concursos
/admin/materials      -> Materiais de Legislacao
/admin/questions      -> Gestao de Questoes
/admin/feedback       -> Feedbacks / Solicitacoes / Erros
/admin/reports        -> Relatorios
/admin/monitoring     -> Monitoramento / Performance
/admin/settings       -> Configuracoes
```

---

### Arquivos a criar

**Dados mock:**
- `src/data/adminMockData.ts` — Dados completos: alunos, assinaturas, concursos, materiais, questoes, feedbacks, metricas de sistema, configuracoes, logs

**Layout:**
- `src/components/admin/AdminLayout.tsx` — Layout com sidebar colapsavel (usando Shadcn Sidebar), header com busca e perfil admin
- `src/components/admin/AdminSidebar.tsx` — Menu lateral com todas as 10 secoes + icones + destaque da rota ativa

**Paginas (10):**
1. `src/pages/admin/AdminDashboard.tsx` — Cards de metricas (alunos, receita, questoes, feedbacks), graficos de evolucao (recharts), ultimas atividades
2. `src/pages/admin/AdminStudents.tsx` — Tabela com busca, filtros (status, plano, data), paginacao
3. `src/pages/admin/AdminStudentDetail.tsx` — Ficha completa do aluno com tabs (dados, atividade, historico, feedbacks), acoes admin
4. `src/pages/admin/AdminSubscriptions.tsx` — Metricas financeiras (MRR, churn, ticket medio), tabela de assinaturas
5. `src/pages/admin/AdminContests.tsx` — CRUD de concursos, tabela com filtros, modal de criacao/edicao
6. `src/pages/admin/AdminMaterials.tsx` — Gestao de materiais, upload simulado, vinculo com concursos, status de processamento
7. `src/pages/admin/AdminQuestions.tsx` — Tabela de questoes, filtros (concurso, disciplina, dificuldade, status), preview da questao
8. `src/pages/admin/AdminFeedback.tsx` — Tabs por categoria (feedback/solicitacao/erro), filtros, acoes (resolver, priorizar)
9. `src/pages/admin/AdminReports.tsx` — Selecao de tipo de relatorio, preview em tabela, botoes de exportacao (CSV/Excel)
10. `src/pages/admin/AdminMonitoring.tsx` — Metricas de saude (latencia, erros, storage), alertas visuais, logs recentes
11. `src/pages/admin/AdminSettings.tsx` — Tabs: geral, planos, permissoes, emails, integracoes

**Roteamento:**
- `src/App.tsx` — Adicionar rotas `/admin/*` com todas as sub-rotas

---

### Componentes reutilizaveis do admin

- `AdminStatsCard` — Card de metrica com icone, valor e variacao
- `AdminDataTable` — Tabela padrao com busca, filtros, paginacao
- `AdminStatusBadge` — Badge colorido para status (ativo, inativo, pagante, etc.)
- `AdminChartCard` — Card com grafico (recharts) embutido

---

### Detalhes tecnicos

- **Sidebar**: Shadcn Sidebar com `collapsible="icon"`, icones lucide-react
- **Graficos**: recharts (ja instalado) para evolucao de cadastros, receita, uso
- **Tabelas**: Shadcn Table com componente wrapper para filtros/busca/paginacao
- **Modais**: Shadcn Dialog para CRUD (criar/editar concurso, questao, material)
- **Tabs**: Shadcn Tabs para secoes com multiplas visoes (feedback, settings, ficha aluno)
- **Exportacao**: Gerar CSV/Excel via blob download no browser
- **Niveis de acesso**: Mock de roles (Super Admin, Operacional, Conteudo, Financeiro, Suporte) — exibido nas configuracoes, sem enforcement real por enquanto
- **Acesso**: Rota `/admin` acessivel via login (sem auth real, apenas navegacao)

---

### Metricas do Dashboard

Cards principais: Total alunos, Ativos, Pagantes, Inativos, Novos hoje/semana/mes, Total concursos, Total materiais, Total questoes, Feedbacks, Solicitacoes, Erros, Taxa ativo/cadastrado, Taxa conversao

Graficos: Evolucao cadastros, Evolucao pagantes, Uso por periodo, Concursos mais acessados, Questoes mais respondidas

---

### Escopo da entrega

Todas as 10 secoes serao criadas com dados mock realistas, interface profissional com o design system existente (cores teal, Nunito), sidebar navegavel e responsiva. O sistema fica preparado para substituir mock por chamadas reais ao backend quando o Supabase for conectado.

