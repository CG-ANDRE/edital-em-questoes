## Legislação Mapeada - Questões

Plataforma completa de questões para concursos públicos, marca Caderno Mapeado.

### Identidade Visual

- Paleta verde (#3B6D11, #639922, #C0DD97, #EAF3DE) + laranja destaque (#EF9F27)
- Tipografia: Nunito (títulos) + Nunito Sans (corpo)
- Estilo clean, profissional, light mode

### Telas (6 páginas navegáveis)

1. **Login** — Logo CM Cursos, campos email/senha, botão verde, links criar conta/esqueci senha
2. **Dashboard** — Saudação "Ana Lima", streak 3 dias, 45 XP, meta diária com gráfico circular, resumo (resolvidas/acertos/erros/favoritas), barra de aproveitamento, badges de conquistas
3. **Configurar Prática** — Filtros por concurso (TJ SP, TJ SC, PGM Porto Alegre), matéria e lei com checkboxes expansíveis, toggles (favoritas/não resolvidas/caderno de erros), botão "Iniciar Prática (X questões)"
4. **Tela da Questão** — Enunciado, 5 alternativas ou Certo/Errado, feedback visual ao clicar (verde/vermelho), comentário do professor com fundamentação legal, navegação Anterior/Próxima/Aleatória
5. **Desempenho** — Tabs Visão Geral/Evolução/Análise, filtros período/dificuldade, gráfico de rosca, heatmap estilo GitHub, matérias que precisam reforço
6. **Planos** — Cards FREE vs PREMIUM com comparativo, lista de benefícios, botão "Assinar Premium"

### Navegação

- Navbar superior: Início | Questões | Desempenho | Planos
- Item ativo com destaque verde
- Botão "Premium" laranja no canto direito
- Avatar do usuário

### Dados Mockados

- Concursos: Polícia Federal, Guarda Municipal de Manaus
- Matérias: Direito Penal, Constitucional, Processual Penal, Ambiental, Legislação Especial
- Leis: CF-88, CP, CPP, Lei 9.605/98
- Questão exemplo sobre Art. 1º da CF-88
- Usuário: Ana Lima, plano FREE, 3 dias streak, 45 XP

### Implementação

- Componentes React com estado local para toda interatividade
- Gráficos SVG customizados (rosca, circular, heatmap)
- Responsivo desktop-first
- Todas as cores via CSS variables no design system