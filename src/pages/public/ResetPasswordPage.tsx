import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    const timeout = setTimeout(() => {
      if (!ready) setExpired(true);
    }, 3000);

    return () => {
      data.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [ready]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Redefinir senha</h1>
          <p className="text-sm text-muted-foreground">
            Defina uma nova senha para sua conta.
          </p>
        </header>

        {ready ? (
          <ResetPasswordForm />
        ) : expired ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Link inválido ou expirado.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block underline font-medium"
            >
              Solicitar novo link
            </Link>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Validando link...
          </p>
        )}
      </div>
    </main>
  );
}
