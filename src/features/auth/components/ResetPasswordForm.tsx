import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

import { updatePassword } from "@/features/auth/api";
import { passwordSchema } from "@/lib/schemas/user.schema";
import { posthog } from "@/lib/posthog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetSchema = z
  .object({
    novaSenha: passwordSchema,
    confirmarSenha: z.string(),
  })
  .refine((d) => d.novaSenha === d.confirmarSenha, {
    path: ["confirmarSenha"],
    message: "As senhas não coincidem",
  });

type ResetInput = z.infer<typeof resetSchema>;

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const form = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
    mode: "onBlur",
    defaultValues: { novaSenha: "", confirmarSenha: "" },
  });

  const onSubmit = async (values: ResetInput) => {
    try {
      await updatePassword(values.novaSenha);
      posthog.capture("password_reset:completed");
      toast.success("Senha alterada com sucesso");
      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("Não foi possível redefinir agora. Tente novamente.");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      aria-label="Formulário de redefinição de senha"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="novaSenha">Nova senha</Label>
        <Input
          id="novaSenha"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!form.formState.errors.novaSenha}
          {...form.register("novaSenha")}
        />
        {form.formState.errors.novaSenha && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.novaSenha.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmarSenha">Confirmar senha</Label>
        <Input
          id="confirmarSenha"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!form.formState.errors.confirmarSenha}
          {...form.register("confirmarSenha")}
        />
        {form.formState.errors.confirmarSenha && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.confirmarSenha.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
        {form.formState.isSubmitting ? "Redefinindo..." : "Redefinir senha"}
      </Button>
    </form>
  );
}
