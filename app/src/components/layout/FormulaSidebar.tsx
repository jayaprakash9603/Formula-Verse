import * as React from "react";
import { Search, X, ChevronRight, LayoutGrid, BookOpen } from "lucide-react";
import { FormulaIcon, CategoryIcon } from "@/lib/formula-icons";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";

export interface SidebarFormula {
  slug: string;
  name: string;
  category: string;
  shortForm: string;
  difficulty: string;
}

const CATEGORY_META: Record<string, { label: string }> = {
  math:        { label: "Mathematics" },
  physics:     { label: "Physics" },
  finance:     { label: "Finance" },
  chemistry:   { label: "Chemistry" },
  engineering: { label: "Engineering" },
};

const DIFFICULTY_OPACITY: Record<string, number> = {
  beginner: 0.9,
  intermediate: 0.55,
  advanced: 0.3,
};

interface Props {
  formulas: SidebarFormula[];
  currentSlug: string;
}

export default function FormulaSidebar({ formulas, currentSlug }: Props) {
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const activeRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    document.addEventListener("astro:before-swap", () => setMobileOpen(false));
  }, []);

  const categories = React.useMemo(
    () => [...new Set(formulas.map((f) => f.category))],
    [formulas],
  );

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return formulas.filter((f) => {
      const matchSearch = !q || f.name.toLowerCase().includes(q) || f.shortForm.toLowerCase().includes(q);
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

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Formula Library
          </span>
          <span className={cn(neuVariants({ elevation: "flat", shape: "pill" }), "text-[10px] font-semibold px-1.5 py-0.5 bg-primary text-primary-foreground")}>
            {formulas.length}
          </span>
        </div>

        <div className={cn(neuVariants({ elevation: "inset", shape: "lg" }), "flex items-center gap-2 px-3 py-2 bg-background")}>
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search formulas…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
          />
          {search && (
            <button onClick={() => setSearch("")} className="cursor-pointer text-muted-foreground">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="px-3 py-2.5 flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            neuVariants({ elevation: !activeCategory ? "raised" : "flat", shape: "pill", interactive: true }),
            "text-[10px] font-semibold px-2.5 py-1",
            !activeCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
          )}
        >
          All
        </button>
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? null : cat)}
              className={cn(
                neuVariants({ elevation: isActive ? "raised" : "flat", shape: "pill", interactive: true }),
                "text-[10px] font-semibold px-2.5 py-1",
                isActive ? "text-primary bg-background" : "bg-secondary text-muted-foreground",
              )}
            >
              <CategoryIcon category={cat} size={10} />
              {meta.label.slice(0, 4)}
            </button>
          );
        })}
      </div>

      <div className="mx-3 neu-divider" />

      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center px-3">
            <BookOpen className="h-8 w-8 opacity-20" />
            <p className="text-xs text-muted-foreground">No formulas match your search</p>
            <button
              className="text-xs text-primary underline cursor-pointer"
              onClick={() => { setSearch(""); setActiveCategory(null); }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          [...grouped.entries()].map(([cat, items]) => {
            const meta = CATEGORY_META[cat];
            return (
              <div key={cat} className="mb-3">
                <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1 sticky top-0 z-10 bg-card">
                  <CategoryIcon category={cat} size={13} className="text-muted-foreground shrink-0" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    {meta.label}
                  </span>
                </div>

                {items.map((f) => {
                  const isActive = f.slug === currentSlug;
                  return (
                    <a
                      key={f.slug}
                      href={`/tools/${f.slug}`}
                      ref={isActive ? activeRef : undefined}
                      className={cn(
                        neuVariants({
                          elevation: isActive ? "raised" : "none",
                          shape: "lg",
                          interactive: !isActive,
                        }),
                        "flex items-center gap-2.5 px-2.5 py-2 mb-0.5 no-underline group",
                      )}
                      style={isActive ? { background: "var(--brand-soft)" } : undefined}
                    >
                      <FormulaIcon
                        slug={f.slug}
                        size={14}
                        style={{ color: isActive ? "var(--brand)" : "var(--muted-foreground)", flexShrink: 0 }}
                      />

                      <div className="flex-1 min-w-0">
                        <div
                          className="text-xs font-medium leading-tight truncate"
                          style={{ color: isActive ? "var(--brand)" : "var(--foreground)" }}
                        >
                          {f.name}
                        </div>
                        <div className="text-[10px] font-mono truncate text-muted-foreground">
                          {f.shortForm}
                        </div>
                      </div>

                      <span
                        className="shrink-0 h-1.5 w-1.5 rounded-full bg-foreground"
                        style={{ opacity: DIFFICULTY_OPACITY[f.difficulty] ?? 0.5 }}
                        title={f.difficulty}
                      />

                      {isActive && <ChevronRight className="h-3 w-3 shrink-0 text-primary" />}
                    </a>
                  );
                })}
              </div>
            );
          })
        )}
      </nav>

      <div className="px-3 py-3">
        <a
          href="/formulas"
          className={cn(
            neuVariants({ elevation: "flat", shape: "lg", interactive: true }),
            "flex items-center justify-center gap-1.5 py-2 text-xs font-medium no-underline bg-secondary text-muted-foreground hover:text-foreground",
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          View All Formulas
        </a>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className="hidden lg:flex flex-col shrink-0 neu-flat"
        style={{
          width: "260px",
          position: "sticky",
          top: "56px",
          height: "calc(100vh - 56px)",
          background: "var(--card)",
          overflow: "hidden",
        }}
      >
        {SidebarContent}
      </aside>

      <div className="lg:hidden">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div
          className={cn(neuVariants({ elevation: "raised", shape: "none" }), "fixed inset-y-0 left-0 z-50 flex flex-col")}
          style={{
            width: "min(300px, 85vw)",
            background: "var(--card)",
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-bold">All Formulas</span>
            <button
              onClick={() => setMobileOpen(false)}
              className={cn(neuVariants({ elevation: "flat", shape: "lg", interactive: true }), "flex h-8 w-8 items-center justify-center bg-secondary")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            {SidebarContent}
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className={cn(
            neuVariants({ elevation: "raised", shape: "pill", interactive: true }),
            "fixed bottom-5 left-4 z-30 flex items-center gap-2 px-4 py-3 text-xs font-semibold bg-primary text-primary-foreground",
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          All Formulas
        </button>
      </div>
    </>
  );
}
