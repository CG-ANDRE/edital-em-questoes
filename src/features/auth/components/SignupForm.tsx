import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Sentry from "@sentry/react";

import { signupSchema, type SignupInput } from "@/lib/schemas/user.schema";
import { signUp } from "@/features/auth/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function SignupForm() {
  const navigate = useNavigate();
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      consentAccepted: false as unknown as true,
    },
  });

  const consentAccepted = form.watch("consentAccepted");
  const isSubmitDisabled = !consentAccepted || form.formState.isSubmitting;

  const onSubmit = async (values: SignupInput) => {
    try {
      await signUp(values);
      toast.success("Verifique seu e-mail para confirmar sua conta antes de continuar.");
      navigate("/login");
    } catch (err) {
      const message = (err as Error).message;
      if (message.toLowerCase().includes("already registered")) {
        toast.error("Esse e-mail já possui cadastro. Faça login ou recupere sua senha.");
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
        Sentry.captureException(err, { tags: { feature: "auth", step: "signup" } });
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      aria-label="Formulário de cadastro"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={!!form.formState.errors.name}
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

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
          autoComplete="new-password"
          aria-invalid={!!form.formState.errors.password}
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="passwordConfirmation">Confirmar senha</Label>
        <Input
          id="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!form.formState.errors.passwordConfirmation}
          {...form.register("passwordConfirmation")}
        />
        {form.formState.errors.passwordConfirmation && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.passwordConfirmation.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="consentAccepted"
          checked={consentAccepted as unknown as boolean}
          onCheckedChange={(checked) => {
            form.setValue("consentAccepted", checked === true ? (true as const) : (false as unknown as true), {
              shouldValidate: true,
            });
          }}
        />
        <label htmlFor="consentAccepted" className="text-sm leading-relaxed">
          Li e aceito a{" "}
          <Link to="#" className="underline">
            Política de Privacidade
          </Link>{" "}
          e os{" "}
          <Link to="#" className="underline">
            Termos de Uso
          </Link>
          .
        </label>
      </div>

      <Button type="submit" disabled={isSubmitDisabled} className="w-full">
        Criar conta
      </Button>
    </form>
  );
}
