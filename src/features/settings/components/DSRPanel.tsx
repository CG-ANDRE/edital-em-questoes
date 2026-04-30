import { useState } from "react";
import { toast } from "sonner";
import * as Sentry from "@sentry/react";

import { exportData } from "@/features/settings/api";
import { Button } from "@/components/ui/button";

export function DSRPanel() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportData();
      toast.success("Seus dados foram baixados com sucesso");
    } catch (err) {
      const message = (err as Error).message;
      if (message === "RATE_LIMIT_EXCEEDED") {
        toast.error(
          "Você já exportou seus dados 3 vezes nos últimos 30 dias. Tente novamente depois."
        );
      } else {
        toast.error("Não foi possível exportar agora. Tente novamente.");
        Sentry.captureException(err, {
          tags: { feature: "settings", action: "dsr-export" },
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Você pode baixar uma cópia dos seus dados pessoais armazenados no
        Edital em Questões em formato JSON, em conformidade com a LGPD.
        Limite: 3 exportações a cada 30 dias.
      </p>
      <Button onClick={handleExport} disabled={isExporting}>
        {isExporting ? "Exportando..." : "Exportar meus dados"}
      </Button>
    </div>
  );
}
