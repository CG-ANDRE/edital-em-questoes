import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as Sentry from "@sentry/react";

import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/schemas/profile.schema";
import { updateProfile, type ProfileRow } from "@/features/settings/api";
import { profileQueryKey } from "@/features/settings/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = { profile: ProfileRow };

export function ProfileForm({ profile }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    mode: "onBlur",
    defaultValues: {
      full_name: profile.full_name ?? "",
      target_concurso: profile.target_concurso ?? "",
      study_goal: profile.study_goal ?? "",
      exam_date: profile.exam_date ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      full_name: profile.full_name ?? "",
      target_concurso: profile.target_concurso ?? "",
      study_goal: profile.study_goal ?? "",
      exam_date: profile.exam_date ?? "",
    });
  }, [profile, form]);

  const mutation = useMutation({
    mutationFn: (data: ProfileUpdateInput) => updateProfile(profile.id, data),
    onSuccess: () => {
      toast.success("Perfil atualizado");
      queryClient.invalidateQueries({ queryKey: profileQueryKey(profile.id) });
      form.reset(form.getValues());
    },
    onError: (err) => {
      toast.error("Não foi possível salvar. Tente novamente.");
      Sentry.captureException(err, { tags: { feature: "settings", action: "updateProfile" } });
    },
  });

  const isSaveDisabled = !form.formState.isDirty || mutation.isPending;

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4 max-w-2xl"
      aria-label="Formulário de atualização de perfil"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="full_name">Nome completo</Label>
        <Input
          id="full_name"
          type="text"
          aria-invalid={!!form.formState.errors.full_name}
          {...form.register("full_name")}
        />
        {form.formState.errors.full_name && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.full_name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_concurso">Concurso alvo</Label>
        <Input
          id="target_concurso"
          type="text"
          placeholder="Ex.: TJSC 2026"
          aria-invalid={!!form.formState.errors.target_concurso}
          {...form.register("target_concurso")}
        />
        {form.formState.errors.target_concurso && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.target_concurso.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="study_goal">Meta de estudo</Label>
        <Textarea
          id="study_goal"
          rows={3}
          placeholder="Ex.: 2 horas por dia, 5 questões diárias..."
          aria-invalid={!!form.formState.errors.study_goal}
          {...form.register("study_goal")}
        />
        {form.formState.errors.study_goal && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.study_goal.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="exam_date">Data da prova</Label>
        <Input
          id="exam_date"
          type="date"
          aria-invalid={!!form.formState.errors.exam_date}
          {...form.register("exam_date")}
        />
        {form.formState.errors.exam_date && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.exam_date.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSaveDisabled}>
        {mutation.isPending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
