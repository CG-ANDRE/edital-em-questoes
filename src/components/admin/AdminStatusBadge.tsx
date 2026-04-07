import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Ativo", variant: "default" },
  inactive: { label: "Inativo", variant: "secondary" },
  blocked: { label: "Bloqueado", variant: "destructive" },
  trial: { label: "Trial", variant: "outline" },
  cancelled: { label: "Cancelado", variant: "destructive" },
  paying: { label: "Pagante", variant: "default" },
  free: { label: "Gratuito", variant: "outline" },
  overdue: { label: "Inadimplente", variant: "destructive" },
  upcoming: { label: "Em breve", variant: "outline" },
  closed: { label: "Encerrado", variant: "secondary" },
  processing: { label: "Processando", variant: "outline" },
  error: { label: "Erro", variant: "destructive" },
  draft: { label: "Rascunho", variant: "secondary" },
  reviewing: { label: "Revisando", variant: "outline" },
  archived: { label: "Arquivado", variant: "secondary" },
  new: { label: "Novo", variant: "default" },
  analyzing: { label: "Em análise", variant: "outline" },
  resolved: { label: "Resolvido", variant: "default" },
  expired: { label: "Expirado", variant: "destructive" },
  completed: { label: "Concluído", variant: "default" },
  pending: { label: "Pendente", variant: "outline" },
  high: { label: "Alta", variant: "destructive" },
  medium: { label: "Média", variant: "outline" },
  low: { label: "Baixa", variant: "secondary" },
  urgent: { label: "Urgente", variant: "destructive" },
  easy: { label: "Fácil", variant: "default" },
  hard: { label: "Difícil", variant: "destructive" },
  healthy: { label: "Saudável", variant: "default" },
  degraded: { label: "Degradado", variant: "outline" },
  down: { label: "Indisponível", variant: "destructive" },
  info: { label: "Info", variant: "secondary" },
  warning: { label: "Aviso", variant: "outline" },
  critical: { label: "Crítico", variant: "destructive" },
};

export function AdminStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
