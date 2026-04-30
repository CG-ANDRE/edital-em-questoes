import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Sentry from "@sentry/react";

import { posthog } from "@/lib/posthog";
import { selectEdital } from "@/features/editais/api";
import type { SelectEditalDatesInput } from "@/lib/schemas/edital.schema";
import type { UserEditalWithEdital } from "@/features/editais/api";

type Args = {
  userId: string;
  editalId: string;
  previousActiveEdital: UserEditalWithEdital | null;
};

export function useSelectEdital({
  userId,
  editalId,
  previousActiveEdital,
}: Args) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const wasSwitch =
    previousActiveEdital !== null &&
    previousActiveEdital.edital_id !== editalId;

  return useMutation({
    mutationFn: (input: SelectEditalDatesInput) =>
      selectEdital(userId, editalId, {
        data_inscricao: input.data_inscricao,
        data_prova: input.data_prova,
      }),
    onSuccess: (_data, input) => {
      toast.success(wasSwitch ? "Edital trocado" : "Edital selecionado");
      posthog.capture("edital:selected", {
        edital_id: editalId,
        has_dates: {
          data_inscricao: !!input.data_inscricao,
          data_prova: !!input.data_prova,
        },
        was_switch: wasSwitch,
      });
      qc.invalidateQueries({ queryKey: ["editais"] });
      qc.invalidateQueries({ queryKey: ["user", userId, "activeEdital"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });

      if (previousActiveEdital === null) {
        navigate("/dashboard"); // /onboarding/calibration vai chegar na Story 4.x
      } else {
        navigate("/dashboard");
      }
    },
    onError: (err) => {
      toast.error("Não foi possível selecionar o edital. Tente novamente.");
      Sentry.captureException(err, {
        tags: { feature: "editais", action: "select" },
      });
    },
  });
}
