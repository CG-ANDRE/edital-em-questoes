import { Badge } from "@/components/ui/badge";
import type { EditalStatus } from "@/features/editais/types";

const labels: Record<EditalStatus, string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  published: "Publicado",
  archived: "Arquivado",
};

const variants: Record<
  EditalStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  scheduled: "secondary",
  published: "default",
  archived: "destructive",
};

export function StatusBadge({ status }: { status: EditalStatus }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
