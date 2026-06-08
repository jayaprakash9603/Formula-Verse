import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SidebarSearch({ value, onChange }: Props) {
  return (
    <div className="px-4 pb-3">
      <label htmlFor="formula-sidebar-search" className="sr-only">
        Search formulas
      </label>
      <div
        className={cn(
          neuVariants({ elevation: "inset", shape: "lg" }),
          "flex min-h-11 items-center gap-2.5 bg-background px-3 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-ring",
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          id="formula-sidebar-search"
          type="search"
          placeholder="Search formulas…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          autoComplete="off"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
