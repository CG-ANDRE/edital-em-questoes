import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as Sentry from "@sentry/react";

import { deleteAccount } from "@/features/settings/api";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CONFIRM_PHRASE = "EXCLUIR MINHA CONTA";

export function DeleteAccountDialog() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isReady = password.length > 0 && phrase === CONFIRM_PHRASE && !isDeleting;

  const reset = () => {
    setPassword("");
    setPhrase("");
    setError(null);
    setIsDeleting(false);
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAccount(password);
      await supabase.auth.signOut();
      queryClient.clear();
      setOpen(false);
      reset();
      navigate("/login?account_deleted=1", { replace: true });
    } catch (err) {
      const message = (err as Error).message;
      if (message === "REAUTH_FAILED") {
        setError("Senha incorreta. Para sua segurança, confirme a senha atual.");
      } else {
        setError("Não foi possível excluir agora. Tente novamente.");
        Sentry.captureException(err, {
          tags: { feature: "settings", action: "dsr-delete" },
        });
      }
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Excluir minha conta</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir conta permanentemente?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">Esta ação é irreversível.</span>
            <span className="block">
              Seus dados pessoais (nome, e-mail) serão apagados. Dados de
              desempenho serão anonimizados para estatísticas agregadas.
            </span>
            <span className="block">
              Recomendamos exportar seus dados antes de continuar.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delete-password">Senha atual</Label>
            <Input
              id="delete-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-phrase">
              Digite <strong>{CONFIRM_PHRASE}</strong> para confirmar
            </Label>
            <Input
              id="delete-phrase"
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              autoComplete="off"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={reset}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={!isReady}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeleting ? "Excluindo..." : "Excluir definitivamente"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
