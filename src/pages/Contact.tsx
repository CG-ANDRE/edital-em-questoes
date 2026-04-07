import Layout from "@/components/Layout";
import { Mail, Instagram, Lightbulb, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [suggestion, setSuggestion] = useState("");

  const handleSubmit = () => {
    if (!suggestion.trim()) {
      toast.error("Digite uma sugestão antes de enviar.");
      return;
    }
    toast.success("Sugestão enviada com sucesso!");
    setSuggestion("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Contato</h1>
          <p className="text-muted-foreground">
            Fale conosco por e-mail, redes sociais ou envie uma sugestão de lei.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* E-mail */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-heading text-base font-bold text-foreground">E-mail</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Dúvidas, sugestões ou problemas? Envie um e-mail para nossa equipe.
            </p>
            <a
              href="mailto:contato@cadernomapeado.com.br"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              contato@cadernomapeado.com.br →
            </a>
          </div>

          {/* Instagram */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <Instagram className="h-5 w-5 text-accent-foreground" />
            </div>
            <h3 className="font-heading text-base font-bold text-foreground">Instagram</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Siga-nos para dicas de estudo, novidades e conteúdos exclusivos.
            </p>
            <a
              href="https://instagram.com/cadernomapeado"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              @cadernomapeado →
            </a>
          </div>
        </div>

        {/* Sugerir nova lei */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-highlight/10">
              <Lightbulb className="h-5 w-5 text-highlight" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-foreground">Sugerir nova lei</h3>
              <p className="text-sm text-muted-foreground">
                Não encontrou a lei que procura? Sugira para adicionarmos à plataforma.
              </p>
            </div>
          </div>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Ex: Lei nº 14.133/2021 — Nova Lei de Licitações e Contratos"
            className="w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            rows={3}
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              <Send className="h-4 w-4" />
              Enviar sugestão
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
