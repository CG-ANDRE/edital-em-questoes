import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEditalById } from "@/features/admin/editais/api";
import { EditalForm } from "@/features/admin/editais/components/EditalForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminEditalEditPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "editais", "detail", id],
    queryFn: () => fetchEditalById(id!),
    enabled: isEdit,
  });

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">
          {isEdit ? "Editar edital" : "Novo edital"}
        </h1>
      </header>

      {isEdit && isLoading && <Skeleton className="h-96 w-full" />}

      {(!isEdit || (isEdit && data)) && (
        <EditalForm initial={data ?? undefined} />
      )}
    </main>
  );
}
