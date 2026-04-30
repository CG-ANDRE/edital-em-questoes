import { useProfile } from "@/features/settings/hooks/useProfile";
import { ProfileForm } from "@/features/settings/components/ProfileForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const { data: profile, isLoading, isError, refetch } = useProfile();

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Atualize suas informações pessoais e metas de estudo.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-4">Perfil</h2>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {isError && (
          <div className="space-y-4">
            <p className="text-sm text-destructive">Erro ao carregar perfil.</p>
            <button
              onClick={() => refetch()}
              className="text-sm underline font-medium"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {profile && <ProfileForm profile={profile} />}
      </section>
    </main>
  );
}
