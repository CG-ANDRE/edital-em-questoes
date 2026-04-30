import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Esqueci minha senha</h1>
          <p className="text-sm text-muted-foreground">
            Informe seu e-mail e enviaremos um link para redefinir.
          </p>
        </header>

        <ForgotPasswordForm />

        <p className="text-center text-sm text-muted-foreground">
          Lembrou?{" "}
          <Link to="/login" className="underline font-medium">
            Voltar ao login
          </Link>
        </p>
      </div>
    </main>
  );
}
