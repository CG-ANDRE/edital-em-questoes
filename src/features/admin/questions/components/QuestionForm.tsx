import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as Sentry from "@sentry/react";
import { Trash2, Plus } from "lucide-react";

import {
  questionSchema,
  QUESTION_LABELS,
  type QuestionInput,
} from "@/lib/schemas/question.schema";
import {
  createQuestion,
  updateQuestion,
  type QuestionRow,
} from "@/features/admin/questions/api";
import { useSession } from "@/features/auth/hooks/useSession";
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

type Props = {
  initial?: QuestionRow;
};

export function QuestionForm({ initial }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id ?? "";

  const form = useForm<QuestionInput>({
    resolver: zodResolver(questionSchema),
    mode: "onBlur",
    defaultValues: {
      enunciado: initial?.enunciado ?? "",
      alternativas:
        (initial?.alternativas as QuestionInput["alternativas"] | null) ?? [
          { label: "A", text: "" },
          { label: "B", text: "" },
          { label: "C", text: "" },
          { label: "D", text: "" },
          { label: "E", text: "" },
        ],
      correct_answer: (initial?.correct_answer as QuestionInput["correct_answer"]) ?? "A",
      justificativa: initial?.justificativa ?? "",
      materia: initial?.materia ?? "",
      banca: initial?.banca ?? "",
      cargo_alvo: initial?.cargo_alvo ?? "",
      dificuldade: initial?.dificuldade ?? "medio",
      status: initial?.status ?? "draft",
      change_reason: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "alternativas",
  });

  const mutation = useMutation({
    mutationFn: async (values: QuestionInput) => {
      // Re-label sequencial garantido pelo schema, mas reforçar antes do insert:
      const normalized: QuestionInput = {
        ...values,
        alternativas: values.alternativas.map((a, i) => ({
          ...a,
          label: QUESTION_LABELS[i],
        })),
      };
      if (initial) {
        return updateQuestion(initial.id, normalized, userId);
      }
      return createQuestion(normalized, userId);
    },
    onSuccess: () => {
      toast.success(initial ? "Questão atualizada" : "Questão criada");
      qc.invalidateQueries({ queryKey: ["admin", "questions"] });
      navigate("/admin/questions");
    },
    onError: (err) => {
      toast.error("Não foi possível salvar. Tente novamente.");
      Sentry.captureException(err, {
        tags: { feature: "admin-questions", action: "save" },
      });
    },
  });

  const addAlternativa = () => {
    if (fields.length >= 6) return;
    append({ label: QUESTION_LABELS[fields.length], text: "" });
  };

  const removeAlternativa = (index: number) => {
    if (fields.length <= 2) return;
    remove(index);
  };

  return (
    <form
      onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
      className="space-y-6 max-w-3xl"
      aria-label="Formulário de questão"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="enunciado">Enunciado</Label>
        <Textarea
          id="enunciado"
          rows={5}
          aria-invalid={!!form.formState.errors.enunciado}
          {...form.register("enunciado")}
        />
        {form.formState.errors.enunciado && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.enunciado.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Alternativas</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAlternativa}
            disabled={fields.length >= 6}
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>

        <RadioGroup
          value={form.watch("correct_answer")}
          onValueChange={(v) =>
            form.setValue("correct_answer", v as QuestionInput["correct_answer"], {
              shouldValidate: true,
            })
          }
          className="space-y-2"
        >
          {fields.map((field, i) => {
            const label = QUESTION_LABELS[i];
            return (
              <div key={field.id} className="flex items-start gap-3">
                <RadioGroupItem
                  value={label}
                  id={`alt-${i}`}
                  className="mt-3"
                  aria-label={`Marcar alternativa ${label} como correta`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold w-6">{label})</span>
                    <Input
                      placeholder={`Texto da alternativa ${label}`}
                      {...form.register(`alternativas.${i}.text`)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAlternativa(i)}
                      disabled={fields.length <= 2}
                      aria-label={`Remover alternativa ${label}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </RadioGroup>

        {form.formState.errors.alternativas && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.alternativas.message}
          </p>
        )}
        {form.formState.errors.correct_answer && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.correct_answer.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="justificativa">Justificativa / comentário</Label>
        <Textarea
          id="justificativa"
          rows={5}
          aria-invalid={!!form.formState.errors.justificativa}
          {...form.register("justificativa")}
        />
        {form.formState.errors.justificativa && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.justificativa.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="materia">Matéria</Label>
          <Input id="materia" {...form.register("materia")} />
          {form.formState.errors.materia && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.materia.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="banca">Banca</Label>
          <Input id="banca" placeholder="Ex.: FGV" {...form.register("banca")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cargo_alvo">Cargo alvo</Label>
          <Input
            id="cargo_alvo"
            placeholder="Ex.: Técnico Judiciário"
            {...form.register("cargo_alvo")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dificuldade">Dificuldade</Label>
          <Select
            value={form.watch("dificuldade")}
            onValueChange={(v) =>
              form.setValue("dificuldade", v as QuestionInput["dificuldade"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="dificuldade">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facil">Fácil</SelectItem>
              <SelectItem value="medio">Médio</SelectItem>
              <SelectItem value="dificil">Difícil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={form.watch("status")}
          onValueChange={(v) =>
            form.setValue("status", v as QuestionInput["status"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger id="status" className="md:w-[240px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="published">Publicada</SelectItem>
            <SelectItem value="archived">Arquivada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/questions")}
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
