import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchQuestionRevisions } from "@/features/admin/questions/api";

const changeTypeLabels: Record<string, string> = {
  create: "Criação",
  edit: "Edição",
  publish: "Publicação",
  archive: "Arquivamento",
  unarchive: "Desarquivamento",
};

const changeTypeVariants: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  create: "default",
  edit: "secondary",
  publish: "default",
  archive: "destructive",
  unarchive: "outline",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function RevisionsHistory({ questionId }: { questionId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "questions", "revisions", questionId],
    queryFn: () => fetchQuestionRevisions(questionId),
  });

  if (isLoading) return <Skeleton className="h-32 w-full" />;
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma revisão registrada ainda.
      </p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Histórico de revisões</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map((rev) => (
          <div
            key={rev.id}
            className="flex items-start justify-between gap-3 p-3 rounded-md border"
          >
            <div className="space-y-1 flex-1">
              <Badge variant={changeTypeVariants[rev.change_type] ?? "outline"}>
                {changeTypeLabels[rev.change_type] ?? rev.change_type}
              </Badge>
              {rev.change_reason && (
                <p className="text-xs text-muted-foreground">{rev.change_reason}</p>
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {dateFormatter.format(new Date(rev.revised_at))}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
