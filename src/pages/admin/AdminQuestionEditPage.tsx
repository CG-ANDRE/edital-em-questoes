import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestionById } from "@/features/admin/questions/api";
import { QuestionForm } from "@/features/admin/questions/components/QuestionForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminQuestionEditPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "questions", "detail", id],
    queryFn: () => fetchQuestionById(id!),
    enabled: isEdit,
  });

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">
          {isEdit ? "Editar questão" : "Nova questão"}
        </h1>
      </header>

      {isEdit && isLoading && <Skeleton className="h-96 w-full" />}

      {(!isEdit || (isEdit && data)) && <QuestionForm initial={data ?? undefined} />}
    </main>
  );
}
