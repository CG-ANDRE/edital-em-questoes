import { Badge } from "@/components/ui/badge";
import { useActiveUserEdital } from "@/features/editais/hooks/useActiveUserEdital";

function diasAteHoje(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const diff = target.getTime() - today.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function ActiveEditalBadge() {
  const { data: activeEdital } = useActiveUserEdital();
  if (!activeEdital || !activeEdital.editais) return null;

  const dias = activeEdital.data_prova
    ? diasAteHoje(activeEdital.data_prova)
    : null;

  return (
    <Badge variant="secondary" className="gap-2">
      <span className="font-medium">{activeEdital.editais.titulo}</span>
      {dias !== null && dias >= 0 && (
        <span className="text-muted-foreground">{dias}d até prova</span>
      )}
    </Badge>
  );
}
