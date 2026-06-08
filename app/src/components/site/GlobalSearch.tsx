import * as React from "react";
import { createPortal } from "react-dom";
import { Search, ArrowRight, X } from "lucide-react";
import { searchItems, type ScoredItem } from "@/lib/search-index";
import { HighlightText } from "@/components/site/HighlightText";
import { FormulaIcon, CategoryIcon } from "@/lib/formula-icons";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";

function ResultRow({
  item,
  isActive,
  onSelect,
  onHover,
  rowRef,
}: {
  item: ScoredItem;
  isActive: boolean;
  onSelect: (item: ScoredItem) => void;
  onHover: () => void;
  rowRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={rowRef}
      onClick={() => onSelect(item)}
      onMouseEnter={onHover}
      className={cn(
        "group/row flex w-full items-center gap-3 px-4 py-2.5 text-left transition-all cursor-pointer rounded-lg mx-1",
        isActive
          ? cn(neuVariants({ elevation: "raised", shape: "lg" }), "bg-background")
          : "hover:bg-muted/40",
      )}
      style={{ width: "calc(100% - 0.5rem)" }}
    >
      <span
        className={cn(neuVariants({ elevation: "flat", shape: "lg" }), "flex h-8 w-8 shrink-0 items-center justify-center")}
        style={{ backgroundColor: `${item.catColor}22`, color: item.catColor }}
      >
        {item.type === "formula" ? (
          <FormulaIcon slug={item.path.replace("/tools/", "")} size={14} />
        ) : (
          <CategoryIcon category={item.path.replace("/formulas/", "")} size={14} />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">
          <HighlightText text={item.label} indices={item.matchIndices} />
        </span>
        {item.sub && (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            <HighlightText text={item.sub} indices={item.subIndices ?? []} />
          </span>
        )}
      </div>

      <span
        className={cn(
          "hidden shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-opacity sm:inline-flex",
          isActive
            ? cn(neuVariants({ elevation: "flat", shape: "sm" }), "text-primary opacity-100")
            : "text-muted-foreground/70 opacity-0 group-hover/row:opacity-100",
        )}
      >
        {item.type}
      </span>

      <ArrowRight
        className={cn(
          "h-3.5 w-3.5 shrink-0 transition-all",
          isActive ? "translate-x-0.5 text-primary opacity-100" : "text-muted-foreground opacity-30 group-hover/row:opacity-70",
        )}
      />
    </button>
  );
}

export default function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rowRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const results = React.useMemo(() => searchItems(query), [query]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPod|iPad/.test(navigator.platform);
      const trigger = isMac ? e.metaKey && e.key === "k" : e.ctrlKey && e.key === "k";
      if (trigger) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName ?? "")
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (open) {
      const t = window.setTimeout(
        () => inputRef.current?.focus({ preventScroll: true }),
        40,
      );
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = prev;
      };
    }
    setQuery("");
    setActiveIdx(0);
  }, [open]);

  React.useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleSelect = React.useCallback((item: ScoredItem) => {
    setOpen(false);
    setQuery("");
    window.location.href = item.path;
  }, []);

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((prev) => {
          const next = Math.min(prev + 1, Math.max(results.length - 1, 0));
          rowRefs.current[next]?.scrollIntoView({ block: "nearest" });
          return next;
        });
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((prev) => {
          const next = Math.max(prev - 1, 0);
          rowRefs.current[next]?.scrollIntoView({ block: "nearest" });
          return next;
        });
      }
      if (e.key === "Enter" && results[activeIdx]) {
        handleSelect(results[activeIdx]);
      }
    },
    [open, results, activeIdx, handleSelect],
  );

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const groups = React.useMemo(() => {
    const map: Record<string, ScoredItem[]> = {};
    for (const item of results) {
      const label = item.type === "category" ? "Categories" : "Formulas";
      if (!map[label]) map[label] = [];
      map[label].push(item);
    }
    return Object.entries(map).map(([label, items]) => ({ label, items }));
  }, [results]);

  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPod|iPad/.test(navigator.platform);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          neuVariants({ elevation: "inset", shape: "lg", interactive: true }),
          "flex h-9 items-center gap-2 px-3 text-muted-foreground hover:text-foreground bg-background",
        )}
        aria-label="Search formulas"
      >
        <Search size={15} />
        <span className="hidden text-sm sm:inline">Search</span>
        <kbd className={cn(neuVariants({ elevation: "flat", shape: "sm" }), "ml-1 hidden items-center gap-0.5 px-1 py-0.5 font-mono text-[10px] md:inline-flex bg-secondary")}>
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Formula search"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            className="fixed inset-0 z-[200] flex items-start justify-center bg-background/70 px-4 pt-[10vh] backdrop-blur-sm"
          >
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className={cn(
                neuVariants({ elevation: "raised", shape: "lg" }),
                "flex max-h-[72vh] w-full max-w-xl flex-col overflow-hidden bg-background",
              )}
            >
              <div className="flex shrink-0 items-center gap-3 px-4 py-3.5">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground/60" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search formulas, categories…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className={cn(neuVariants({ elevation: "flat", shape: "sm", interactive: true }), "p-1 text-muted-foreground")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className={cn(neuVariants({ elevation: "flat", shape: "sm", interactive: true }), "p-1 text-muted-foreground")}
                >
                  <span className="font-mono text-[10px] rounded px-1 py-0.5">Esc</span>
                </button>
              </div>

              <div className="mx-4 neu-divider" />

              <div className="fv-search-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain py-2">
                {!query.trim() && (
                  <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                    <Search className="mb-3 h-9 w-9 text-muted-foreground/25" />
                    <p className="text-sm text-muted-foreground">
                      Search across all formulas and categories
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      Type to start — or press{" "}
                      <kbd className={cn(neuVariants({ elevation: "flat", shape: "sm" }), "font-mono px-1")}>
                        /
                      </kbd>{" "}
                      anywhere
                    </p>
                  </div>
                )}

                {query.trim() && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                    <p className="text-sm text-muted-foreground">
                      No results for{" "}
                      <span className="font-semibold text-foreground">
                        "{query}"
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      Try a different search term
                    </p>
                  </div>
                )}

                {groups.map((group) => (
                  <div key={group.label}>
                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {group.label}
                    </div>
                    {group.items.map((item) => {
                      const idx = results.indexOf(item);
                      return (
                        <ResultRow
                          key={`${item.type}-${item.path}`}
                          item={item}
                          isActive={idx === activeIdx}
                          onSelect={handleSelect}
                          onHover={() => setActiveIdx(idx)}
                          rowRef={(el) => {
                            rowRefs.current[idx] = el;
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {results.length > 0 && (
                <div className="flex shrink-0 items-center gap-3 px-4 py-2 text-[10px] text-muted-foreground/50">
                  <div className="absolute left-4 right-4 neu-divider" />
                  <span className="relative pt-2">↑↓ navigate</span>
                  <span className="relative pt-2">↵ open</span>
                  <span className="relative pt-2">esc close</span>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
