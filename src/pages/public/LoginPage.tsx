import { Link, useSearchParams } from "react-router-dom";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const [params] = useSearchParams();
  const accountDeleted = params.get("account_deleted") === "1";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md space-y-6">
        {accountDeleted && (
          <div
            className="rounded-md border border-muted bg-muted/30 p-4 text-sm text-muted-foreground text-center"
            role="status"
          >
            Sua conta foi excluída. Sentiremos sua falta.
          </div>
        )}

        <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Entrar</h1>
          <p className="text-sm text-muted-foreground">
            Continue de onde parou nos seus estudos.
          </p>
        </header>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
