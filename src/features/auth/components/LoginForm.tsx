import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import * as Sentry from "@sentry/react";

import { signIn, type SignInInput } from "@/features/auth/api";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { sessionQueryKey } from "@/features/auth/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignInError = Error & { retryAfterSeconds?: number };

export function LoginForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const queryClient = useQueryClient();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: (session) => {
      queryClient.setQueryData(sessionQueryKey, session);
      const redirectTo = params.get("redirectTo");
      navigate(redirectTo ? decodeURIComponent(redirectTo) : "/dashboard", {
        replace: true,
      });
    },
    onError: (err: SignInError) => {
      if (err.message === "RATE_LIMITED") {
        const min = Math.ceil((err.retryAfterSeconds ?? 600) / 60);
        toast.error(`Muitas tentativas. Tente novamente em ${min} minutos.`);
        return;
      }

      // Detecção robusta de credenciais inválidas (não depende de err.name)
      const status = (err as { status?: number }).status;
      const isCredentialError =
        err.message === "INVALID_CREDENTIALS" ||
        status === 400 ||
        /invalid.*credential/i.test(err.message) ||
        /invalid.*login/i.test(err.message);

      if (isCredentialError) {
        toast.error("Email ou senha incorretos");
        return;
      }

      toast.error("Erro ao fazer login. Tente novamente.");
      Sentry.captureException(err, { tags: { feature: "auth", action: "signIn" } });
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutation.mutate(data as SignInInput))}
      className="space-y-4"
      aria-label="Formulário de login"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!form.formState.errors.email}
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!form.formState.errors.password}
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.password.message}
          </p>
        )}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-muted-foreground hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
