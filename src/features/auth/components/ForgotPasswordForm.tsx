import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

import { requestPasswordReset } from "@/features/auth/api";
import { posthog } from "@/lib/posthog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotSchema = z.object({
  email: z.string().email("Email inválido"),
});
type ForgotInput = z.infer<typeof forgotSchema>;

const GENERIC_MESSAGE =
  "Se o email existir em nossa base, enviaremos as instruções de redefinição em alguns minutos.";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotInput) => {
    posthog.capture("password_reset:requested", { timestamp: new Date().toISOString() });
    try {
      await requestPasswordReset(values.email);
      toast.success(GENERIC_MESSAGE);
      setSubmitted(true);
    } catch {
      toast.error("Não foi possível enviar agora. Tente novamente em alguns minutos.");
    }
  };

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">{GENERIC_MESSAGE}</p>
        <Link to="/login" className="text-sm underline font-medium">
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      aria-label="Formulário de recuperação de senha"
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

      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
        {form.formState.isSubmitting ? "Enviando..." : "Enviar instruções"}
      </Button>
    </form>
  );
}
