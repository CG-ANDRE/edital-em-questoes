import { DSRPanel } from "@/features/settings/components/DSRPanel";
import { DeleteAccountDialog } from "@/features/settings/components/DeleteAccountDialog";

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Privacidade</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seus direitos de proteção de dados pessoais (LGPD).
        </p>
      </header>

      <section className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Exportação de dados</h2>
          <DSRPanel />
        </div>

        <div className="border-t pt-8">
          <h2 className="text-lg font-semibold mb-2 text-destructive">
            Excluir conta
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Apaga permanentemente seus dados pessoais. Esta ação é
            irreversível.
          </p>
          <DeleteAccountDialog />
        </div>
      </section>
    </main>
  );
}
