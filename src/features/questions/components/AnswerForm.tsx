import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { parseAlternativas } from "@/features/questions/api";
import type { AnswerLabel, PublicQuestion } from "@/features/questions/types";

type Props = {
  question: PublicQuestion;
  onSubmit: (answer: AnswerLabel) => void;
  isPending: boolean;
};

export function AnswerForm({ question, onSubmit, isPending }: Props) {
  const [selected, setSelected] = useState<AnswerLabel | null>(null);
  const alternativas = parseAlternativas(question);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) onSubmit(selected);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Responder questão">
      <Card>
        <CardContent className="pt-6">
          <RadioGroup
            value={selected ?? ""}
            onValueChange={(v) => setSelected(v as AnswerLabel)}
            className="space-y-3"
          >
            {alternativas.map((alt) => (
              <div
                key={alt.label}
                className="flex items-start gap-3 p-3 rounded-md border hover:bg-muted/30 transition-colors"
              >
                <RadioGroupItem value={alt.label} id={`alt-${alt.label}`} className="mt-1" />
                <Label
                  htmlFor={`alt-${alt.label}`}
                  className="flex-1 cursor-pointer leading-relaxed"
                >
                  <span className="font-bold mr-2">{alt.label})</span>
                  {alt.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={!selected || isPending}
            aria-busy={isPending}
            className="w-full md:w-auto min-h-[44px]"
          >
            {isPending ? "Confirmando..." : "Confirmar resposta"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
