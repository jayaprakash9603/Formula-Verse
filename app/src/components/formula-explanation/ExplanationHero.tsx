import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";
import type { FormulaVisualizerConfig } from "@/engines/formula-visualizer/types";
import KatexBlock from "./KatexBlock";

const CATEGORY_COLORS: Record<string, string> = {
  math: "var(--color-formula-math)",
  physics: "var(--color-formula-physics)",
  finance: "var(--color-formula-finance)",
  chemistry: "var(--color-formula-chem)",
  engineering: "var(--color-formula-eng)",
};

interface Props {
  config: FormulaVisualizerConfig;
}

export default function ExplanationHero({ config }: Props) {
  const categoryColor = CATEGORY_COLORS[config.category] ?? "var(--primary)";

  return (
    <section className="relative overflow-hidden border-b border-[var(--hairline)] px-4 py-10 sm:px-6 sm:py-14">
      <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-[900px] flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize" style={{ color: categoryColor }}>
            {config.category}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {config.difficulty}
          </Badge>
        </div>
        <div className="flex items-start gap-4">
          <span
            className={cn(
              neuVariants({ elevation: "flat", shape: "lg" }),
              "flex h-14 w-14 shrink-0 items-center justify-center bg-background text-3xl",
            )}
            aria-hidden="true"
          >
            {config.emoji}
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{config.name}</h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">{config.tagline}</p>
          </div>
        </div>
        <div className={cn(neuVariants({ elevation: "inset", shape: "lg" }), "bg-formula-viz-bg px-6 py-5 text-center")}>
          <KatexBlock latex={config.latex} displayMode />
        </div>
        <a
          href={`/tools/${config.slug}`}
          className={cn(
            neuVariants({ elevation: "raised", shape: "lg", interactive: true }),
            "inline-flex w-fit cursor-pointer items-center gap-2 px-5 py-3 text-sm font-semibold no-underline",
          )}
          style={{ background: "var(--brand)", color: "var(--primary-foreground)" }}
        >
          Open live visualizer
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
