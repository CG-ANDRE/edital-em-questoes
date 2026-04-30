import { Badge } from "@/components/ui/badge";
import type { QuestionStatus } from "@/features/admin/questions/api";

const labels: Record<QuestionStatus, string> = {
  draft: "Rascunho",
  published: "Publicada",
  archived: "Arquivada",
  pending_review: "Aguarda revisão",
};

const variants: Record<
  QuestionStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  published: "default",
  archived: "destructive",
  pending_review: "secondary",
};

export function QuestionStatusBadge({ status }: { status: QuestionStatus }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
