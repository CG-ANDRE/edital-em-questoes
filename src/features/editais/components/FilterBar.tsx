import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";

type Props = {
  bancas: string[];
  orgaos: string[];
  isFetching: boolean;
};

const ALL = "__all__";

function currentYearOptions() {
  const now = new Date().getFullYear();
  return [now, now + 1];
}

export function FilterBar({ bancas, orgaos, isFetching }: Props) {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [qInput, setQInput] = useState(initialQ);
  const debouncedQ = useDebounce(qInput, 300);

  useEffect(() => {
    const current = params.get("q") ?? "";
    if (debouncedQ === current) return;
    const next = new URLSearchParams(params);
    if (debouncedQ) next.set("q", debouncedQ);
    else next.delete("q");
    setParams(next, { replace: true });
  }, [debouncedQ, params, setParams]);

  const yearOptions = useMemo(currentYearOptions, []);

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(params);
    if (value && value !== ALL) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por título, cargo, órgão..."
          aria-label="Buscar editais"
          className="pl-9"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      <Select
        value={params.get("banca") ?? ALL}
        onValueChange={(v) => updateParam("banca", v)}
      >
        <SelectTrigger className="md:w-[180px]" aria-label="Filtrar por banca">
          <SelectValue placeholder="Banca" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todas as bancas</SelectItem>
          {bancas.map((b) => (
            <SelectItem key={b} value={b}>
              {b}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("orgao") ?? ALL}
        onValueChange={(v) => updateParam("orgao", v)}
      >
        <SelectTrigger className="md:w-[180px]" aria-label="Filtrar por órgão">
          <SelectValue placeholder="Órgão" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos os órgãos</SelectItem>
          {orgaos.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("ano") ?? ALL}
        onValueChange={(v) => updateParam("ano", v)}
      >
        <SelectTrigger className="md:w-[140px]" aria-label="Filtrar por ano">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos os anos</SelectItem>
          {yearOptions.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
