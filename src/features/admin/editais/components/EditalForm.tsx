import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as Sentry from "@sentry/react";

import {
  editalCreateSchema,
  type EditalCreateInputForm,
} from "@/lib/schemas/edital.schema";
import {
  createEdital,
  updateEdital,
  checkSlugAvailable,
  type EditalCreateInput,
} from "@/features/admin/editais/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import type { EditalRow, EditalVisibility } from "@/features/editais/types";
import { VisibilityEditor } from "@/features/admin/editais/components/VisibilityEditor";

type Props = {
  initial?: EditalRow;
  onSaved?: (id: string) => void;
};

const STATUS_OPTIONS: Array<{ value: "draft" | "scheduled" | "published" | "archived"; label: string }> = [
  { value: "draft", label: "Rascunho" },
  { value: "scheduled", label: "Agendado" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Arquivado" },
];

export function EditalForm({ initial, onSaved }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [slugDirty, setSlugDirty] = useState(!!initial);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<EditalVisibility>(
    (initial?.visibility as EditalVisibility | null) ?? { type: "public" }
  );

  const form = useForm<EditalCreateInputForm>({
    resolver: zodResolver(editalCreateSchema),
    mode: "onBlur",
    defaultValues: {
      titulo: initial?.titulo ?? "",
      slug: initial?.slug ?? "",
      banca: initial?.banca ?? "",
      cargo: initial?.cargo ?? "",
      orgao: initial?.orgao ?? "",
      descricao: initial?.descricao ?? "",
      data_prova: initial?.data_prova ?? "",
      data_inscricao_inicio: initial?.data_inscricao_inicio ?? "",
      data_inscricao_fim: initial?.data_inscricao_fim ?? "",
      status: initial?.status ?? "draft",
    },
  });

  const titulo = form.watch("titulo");
  useEffect(() => {
    if (!slugDirty) {
      form.setValue("slug", slugify(titulo), { shouldValidate: true });
    }
  }, [titulo, slugDirty, form]);

  const mutation = useMutation({
    mutationFn: async (values: EditalCreateInputForm) => {
      const ok = await checkSlugAvailable(values.slug, initial?.id);
      if (!ok) {
        setSlugError("Slug já em uso");
        throw new Error("Slug já em uso");
      }
      setSlugError(null);
      const payload: EditalCreateInput = {
        titulo: values.titulo!,
        slug: values.slug!,
        banca: values.banca!,
        cargo: values.cargo!,
        orgao: values.orgao!,
        descricao: values.descricao ?? null,
        data_prova: values.data_prova ?? null,
        data_inscricao_inicio: values.data_inscricao_inicio ?? null,
        data_inscricao_fim: values.data_inscricao_fim ?? null,
        status: values.status!,
        published_at:
          values.status === "published"
            ? initial?.published_at ?? new Date().toISOString()
            : initial?.published_at ?? null,
        visibility,
      };
      if (initial) {
        return updateEdital(initial.id, payload);
      }
      return createEdital(payload);
    },
    onSuccess: (row) => {
      toast.success(initial ? "Edital atualizado" : "Edital criado");
      qc.invalidateQueries({ queryKey: ["admin", "editais"] });
      qc.invalidateQueries({ queryKey: ["editais"] });
      onSaved?.(row.id);
      navigate("/admin/editais");
    },
    onError: (err) => {
      if ((err as Error).message === "Slug já em uso") return;
      toast.error("Não foi possível salvar. Tente novamente.");
      Sentry.captureException(err, {
        tags: { feature: "admin-editais", action: "save" },
      });
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
      className="space-y-4 max-w-3xl"
      aria-label="Formulário de edital"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          aria-invalid={!!form.formState.errors.titulo}
          {...form.register("titulo")}
        />
        {form.formState.errors.titulo && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.titulo.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            aria-invalid={!!form.formState.errors.slug || !!slugError}
            {...form.register("slug")}
            onChange={(e) => {
              setSlugDirty(true);
              form.setValue("slug", e.target.value, { shouldValidate: true });
              setSlugError(null);
            }}
          />
          {(form.formState.errors.slug || slugError) && (
            <p className="text-sm text-destructive" role="alert">
              {slugError ?? form.formState.errors.slug?.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="banca">Banca</Label>
          <Input id="banca" {...form.register("banca")} />
          {form.formState.errors.banca && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.banca.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="orgao">Órgão</Label>
          <Input id="orgao" {...form.register("orgao")} />
          {form.formState.errors.orgao && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.orgao.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cargo">Cargo</Label>
          <Input id="cargo" {...form.register("cargo")} />
          {form.formState.errors.cargo && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.cargo.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição (markdown)</Label>
        <Textarea id="descricao" rows={4} {...form.register("descricao")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data_prova">Data da prova</Label>
          <Input id="data_prova" type="date" {...form.register("data_prova")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="data_inscricao_inicio">Início inscrições</Label>
          <Input
            id="data_inscricao_inicio"
            type="date"
            {...form.register("data_inscricao_inicio")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="data_inscricao_fim">Fim inscrições</Label>
          <Input
            id="data_inscricao_fim"
            type="date"
            {...form.register("data_inscricao_fim")}
          />
          {form.formState.errors.data_inscricao_fim && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.data_inscricao_fim.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 border-t pt-4">
        <Label className="text-base font-semibold">Visibilidade</Label>
        <VisibilityEditor value={visibility} onChange={setVisibility} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={form.watch("status")}
          onValueChange={(v) =>
            form.setValue("status", v as EditalCreateInputForm["status"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger id="status" className="md:w-[240px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/editais")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : initial ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}
