import { Link } from "react-router-dom";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md space-y-6">
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
