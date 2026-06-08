import type { Ref } from "react";
import { ChevronRight } from "lucide-react";
import { FormulaIcon } from "@/lib/formula-icons";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";
import { DIFFICULTY_META, type SidebarFormula } from "./constants";

interface Props {
  formula: SidebarFormula;
  isActive: boolean;
  itemRef?: Ref<HTMLAnchorElement>;
}

export default function FormulaListItem({ formula, isActive, itemRef }: Props) {
  const difficulty = DIFFICULTY_META[formula.difficulty] ?? DIFFICULTY_META.beginner;

  return (
    <a
      href={`/tools/${formula.slug}`}
      ref={itemRef}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        neuVariants({
          elevation: isActive ? "raised" : "none",
          shape: "lg",
          interactive: !isActive,
        }),
        "group relative mb-1 flex min-h-11 cursor-pointer items-center gap-3 px-3 py-2.5 no-underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive ? "bg-[var(--brand-soft)]" : "hover:bg-secondary/60",
      )}
    >
      {isActive ? (
        <span
          className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-primary"
          aria-hidden="true"
        />
      ) : null}

      <span
        className={cn(
          neuVariants({ elevation: isActive ? "raised" : "flat", shape: "sm" }),
          "flex h-8 w-8 shrink-0 items-center justify-center bg-background",
        )}
      >
        <FormulaIcon
          slug={formula.slug}
          size={15}
          style={{ color: isActive ? "var(--brand)" : "var(--muted-foreground)" }}
        />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className="block truncate text-[13px] font-medium leading-tight"
          style={{ color: isActive ? "var(--brand)" : "var(--foreground)" }}
        >
          {formula.name}
        </span>
        <span className="block truncate font-mono text-[11px] text-muted-foreground">
          {formula.shortForm}
        </span>
      </span>

      <span
        className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
        style={{
          color: difficulty.tone,
          background: `color-mix(in srgb, ${difficulty.tone} 14%, transparent)`,
        }}
        title={difficulty.label}
      >
        {difficulty.label.slice(0, 3)}
      </span>

      {isActive ? (
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
      ) : null}
    </a>
  );
}
