import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import * as Sentry from "@sentry/react";

import {
  createQuestionReportSchema,
  type CreateQuestionReportInput,
  type ReportReason,
} from "@/lib/schemas/question-report.schema";
import { createQuestionReport } from "@/features/questions/api";
import { useSession } from "@/features/auth/hooks/useSession";
import { posthog } from "@/lib/posthog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  questionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const REASON_OPTIONS: Array<{ value: ReportReason; label: string }> = [
  { value: "gabarito_incorreto", label: "Gabarito está incorreto" },
  { value: "enunciado_ambiguo", label: "Enunciado está ambíguo" },
  { value: "outro", label: "Outro problema" },
];

export function ReportQuestionDialog({ questionId, open, onOpenChange }: Props) {
  const { session } = useSession();
  const userId = session?.user.id ?? "";

  const form = useForm<CreateQuestionReportInput>({
    resolver: zodResolver(createQuestionReportSchema),
    mode: "onBlur",
    defaultValues: {
      questionId,
      reason: "gabarito_incorreto",
      comment: "",
    },
  });

  const reason = form.watch("reason");
  const commentRequired = reason === "outro";

  const mutation = useMutation({
    mutationFn: (input: CreateQuestionReportInput) =>
      createQuestionReport(input, userId),
    onSuccess: (_, input) => {
      posthog.capture("question:reported", {
        questionId: input.questionId,
        reason: input.reason,
      });
      toast.success("Obrigado pelo feedback. Vamos revisar.");
      form.reset({ questionId, reason: "gabarito_incorreto", comment: "" });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      if (err.message === "RATE_LIMIT_EXCEEDED") {
        toast.error(
          "Você atingiu o limite de 5 reports por dia. Tente novamente amanhã."
        );
        onOpenChange(false);
      } else {
        toast.error("Não foi possível enviar o report. Tente novamente.");
        Sentry.captureException(err, {
          tags: { feature: "questions", action: "report" },
        });
      }
    },
  });

  const commentLength = form.watch("comment")?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportar problema nesta questão</DialogTitle>
          <DialogDescription>
            Sua sinalização vai pra fila de curadoria para revisão.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className="space-y-4"
          aria-label="Reportar questão"
          noValidate
        >
          <div className="space-y-2">
            <Label>Motivo</Label>
            <RadioGroup
              value={reason}
              onValueChange={(v) =>
                form.setValue("reason", v as ReportReason, { shouldValidate: true })
              }
              className="space-y-2"
            >
              {REASON_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} id={`report-${opt.value}`} />
                  <Label htmlFor={`report-${opt.value}`} className="cursor-pointer">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-comment">
              Observações {commentRequired && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="report-comment"
              rows={4}
              maxLength={500}
              placeholder="Descreva o problema com clareza..."
              aria-invalid={!!form.formState.errors.comment}
              {...form.register("comment")}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {form.formState.errors.comment && (
                  <span className="text-destructive">
                    {form.formState.errors.comment.message}
                  </span>
                )}
              </span>
              <span>{commentLength}/500</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
