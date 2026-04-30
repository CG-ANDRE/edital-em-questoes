import { Link } from "react-router-dom";
import { SignupForm } from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="text-sm text-muted-foreground">
            Comece a estudar para o seu próximo concurso.
          </p>
        </header>

        <SignupForm />

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
