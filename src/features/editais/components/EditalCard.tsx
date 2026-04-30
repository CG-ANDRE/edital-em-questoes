import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateBR } from "@/lib/utils";
import type { Edital } from "@/features/editais/types";

type Props = {
  edital: Edital;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
};

export function EditalCard({ edital, isFavorited, onToggleFavorite }: Props) {
  const dataProva = formatDateBR(edital.dataProva);
  const ini = formatDateBR(edital.dataInscricaoInicio);
  const fim = formatDateBR(edital.dataInscricaoFim);
  const ano = edital.dataProva ? edital.dataProva.slice(0, 4) : null;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex-1 space-y-1">
          <CardTitle className="text-base">{edital.titulo}</CardTitle>
          <CardDescription>
            {edital.orgao} — {edital.cargo}
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onToggleFavorite(edital.id)}
          aria-label={isFavorited ? "Remover dos favoritos" : "Favoritar edital"}
          aria-pressed={isFavorited}
          className="min-w-[44px] min-h-[44px]"
          title="Favoritar (em breve)"
        >
          <Star
            className={isFavorited ? "fill-yellow-500 text-yellow-500" : ""}
          />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{edital.banca}</Badge>
          {ano && <Badge variant="outline">{ano}</Badge>}
        </div>
        {dataProva && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Prova:</span> {dataProva}
          </p>
        )}
        {ini && fim && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Inscrições:</span> {ini} — {fim}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          variant="default"
          className="w-full min-h-[44px]"
          disabled
        >
          Ver edital
        </Button>
      </CardFooter>
    </Card>
  );
}
