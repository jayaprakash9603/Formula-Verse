import * as React from "react";
import { BookOpen, LayoutGrid, Library } from "lucide-react";
import { CategoryIcon } from "@/lib/formula-icons";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";
import { CATEGORY_META, type SidebarFormula } from "./constants";
import SidebarSearch from "./SidebarSearch";
import CategoryFilterBar from "./CategoryFilterBar";
import FormulaListItem from "./FormulaListItem";

interface Props {
  formulas: SidebarFormula[];
  currentSlug: string;
}

export default function FormulaSidebarContent({ formulas, currentSlug }: Props) {
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const activeRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, []);

  const categories = React.useMemo(
    () => [...new Set(formulas.map((f) => f.category))],
    [formulas],
  );

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return formulas.filter((f) => {
      const matchSearch =
        !q || f.name.toLowerCase().includes(q) || f.shortForm.toLowerCase().includes(q);
      const matchCat = !activeCategory || f.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [formulas, search, activeCategory]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, SidebarFormula[]>();
    for (const f of filtered) {
      const arr = map.get(f.category) ?? [];
      arr.push(f);
      map.set(f.category, arr);
    }
    return map;
  }, [filtered]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory(null);
  };

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-[var(--hairline)] px-4 pb-3 pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                neuVariants({ elevation: "flat", shape: "sm" }),
                "flex h-8 w-8 items-center justify-center bg-background text-primary",
              )}
            >
              <Library className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="text-sm font-bold tracking-tight text-foreground">Formula Library</h2>
          </div>
          <span
            className={cn(
              neuVariants({ elevation: "flat", shape: "pill" }),
              "px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground",
            )}
            aria-label={`${formulas.length} formulas`}
          >
            {formulas.length}
          </span>
        </div>
      </header>

      <SidebarSearch value={search} onChange={setSearch} />
      <CategoryFilterBar
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <nav
        id="formula-list"
        aria-label="Formula list"
        className="fv-sidebar-scroll flex-1 overflow-y-auto px-3 pb-2"
      >
        {filtered.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          [...grouped.entries()].map(([cat, items]) => {
            const meta = CATEGORY_META[cat];
            return (
              <section key={cat} className="mb-4">
                <div className="sticky top-0 z-10 mb-1.5 flex items-center gap-2 bg-[var(--sidebar-bg)] px-2 py-2 backdrop-blur-sm">
                  <CategoryIcon category={cat} size={14} className="shrink-0 text-primary" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {meta?.label ?? cat}
                  </span>
                  <span className="ml-auto text-[10px] tabular-nums text-muted-foreground/70">
                    {items.length}
                  </span>
                </div>
                {items.map((f) => (
                  <FormulaListItem
                    key={f.slug}
                    formula={f}
                    isActive={f.slug === currentSlug}
                    itemRef={f.slug === currentSlug ? activeRef : undefined}
                  />
                ))}
              </section>
            );
          })
        )}
      </nav>

      <footer className="border-t border-[var(--hairline)] p-4">
        <a
          href="/formulas"
          className={cn(
            neuVariants({ elevation: "flat", shape: "lg", interactive: true }),
            "flex min-h-11 cursor-pointer items-center justify-center gap-2 text-sm font-medium no-underline text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          View All Formulas
        </a>
      </footer>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <BookOpen className="h-9 w-9 text-muted-foreground/30" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-foreground">No matching formulas</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try a different search term or browse all categories.
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-primary transition-colors duration-200 hover:text-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Clear filters
      </button>
    </div>
  );
}
