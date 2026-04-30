import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/features/auth/hooks/useSession";
import { useActiveUserEdital } from "@/features/editais/hooks/useActiveUserEdital";
import { useSelectEdital } from "@/features/editais/hooks/useSelectEdital";
import {
  selectEditalDatesSchema,
  type SelectEditalDatesInput,
} from "@/lib/schemas/edital.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  editalId: string;
  editalTitulo: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SelectEditalDialog({
  editalId,
  editalTitulo,
  open,
  onOpenChange,
}: Props) {
  const { session } = useSession();
  const userId = session?.user.id ?? "";

  const { data: activeEdital } = useActiveUserEdital();
  const isSwitching =
    !!activeEdital && activeEdital.edital_id !== editalId;

  const form = useForm<SelectEditalDatesInput>({
    resolver: zodResolver(selectEditalDatesSchema),
    mode: "onBlur",
    defaultValues: { data_inscricao: null, data_prova: null },
  });

  const mutation = useSelectEdital({
    userId,
    editalId,
    previousActiveEdital: activeEdital ?? null,
  });

  const onSubmit = (values: SelectEditalDatesInput) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Estudar para {editalTitulo}</DialogTitle>
          <DialogDescription>
            Informe as datas para personalizarmos seu cronograma. Os dois
            campos são opcionais.
          </DialogDescription>
        </DialogHeader>

        {isSwitching && activeEdital?.editais && (
          <Alert>
            <AlertDescription>
              Você já está estudando para{" "}
              <strong>{activeEdital.editais.titulo}</strong>. Confirmar trocará
              para este novo edital. (Estudar múltiplos editais é uma
              funcionalidade Premium em desenvolvimento.)
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data_inscricao">Data de inscrição</Label>
            <Input
              id="data_inscricao"
              type="date"
              aria-invalid={!!form.formState.errors.data_inscricao}
              {...form.register("data_inscricao")}
            />
            {form.formState.errors.data_inscricao && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.data_inscricao.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_prova">Data da prova</Label>
            <Input
              id="data_prova"
              type="date"
              aria-invalid={!!form.formState.errors.data_prova}
              {...form.register("data_prova")}
            />
            {form.formState.errors.data_prova && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.data_prova.message}
              </p>
            )}
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
              {mutation.isPending
                ? "Salvando..."
                : isSwitching
                  ? "Trocar edital ativo"
                  : "Começar a estudar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
