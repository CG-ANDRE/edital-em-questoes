import { Suspense } from "react";
import { EditalCatalog } from "@/features/editais/components/EditalCatalog";
import { EditalCatalogSkeleton } from "@/features/editais/components/EditalCatalogSkeleton";

export default function EditaisPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Catálogo de Editais</h1>
        <p className="text-muted-foreground text-sm">
          Encontre o concurso certo para você.
        </p>
      </header>
      <Suspense fallback={<EditalCatalogSkeleton />}>
        <EditalCatalog />
      </Suspense>
    </main>
  );
}
