import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EditalVisibility } from "@/features/editais/types";

type Props = {
  value: EditalVisibility;
  onChange: (v: EditalVisibility) => void;
  disabled?: boolean;
};

export function VisibilityEditor({ value, onChange, disabled }: Props) {
  const userIdsText =
    value.type === "allowlist" ? value.userIds.join("\n") : "";

  const handleTypeChange = (type: string) => {
    if (type === "public") onChange({ type: "public" });
    else if (type === "beta") onChange({ type: "beta" });
    else if (type === "allowlist") onChange({ type: "allowlist", userIds: [] });
  };

  const handleAllowlistChange = (text: string) => {
    const userIds = text
      .split(/\s+|,/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    onChange({ type: "allowlist", userIds });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Quem vê este edital quando publicado. Founders e Operations sempre veem
        todos.
      </p>

      <RadioGroup
        value={value.type}
        onValueChange={handleTypeChange}
        disabled={disabled}
        className="space-y-3"
      >
        <div className="flex items-start gap-2">
          <RadioGroupItem value="public" id="vis-public" />
          <div>
            <Label htmlFor="vis-public" className="font-medium">
              Público
            </Label>
            <p className="text-xs text-muted-foreground">
              Visível para todos os usuários autenticados.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <RadioGroupItem value="beta" id="vis-beta" />
          <div>
            <Label htmlFor="vis-beta" className="font-medium">
              Beta (cohort)
            </Label>
            <p className="text-xs text-muted-foreground">
              Visível apenas para usuários com{" "}
              <code className="text-xs">app_metadata.cohort = 'beta'</code>.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <RadioGroupItem value="allowlist" id="vis-allowlist" />
          <div className="flex-1">
            <Label htmlFor="vis-allowlist" className="font-medium">
              Lista específica (allowlist)
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              Visível apenas para os user IDs listados abaixo (um por linha).
            </p>
            {value.type === "allowlist" && (
              <Textarea
                rows={4}
                placeholder="uuid-1&#10;uuid-2"
                value={userIdsText}
                onChange={(e) => handleAllowlistChange(e.target.value)}
                disabled={disabled}
                aria-label="User IDs da allowlist"
              />
            )}
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
