import * as React from "react";
import { toast } from "sonner";
import type { FormulaVisualizerConfig } from "./types";
import { getFormula } from "./index";
import { useKatex, renderKatex } from "./useKatex";
import FormulaVarSliders from "./FormulaVarSliders";
import FormulaResultCard from "./FormulaResultCard";
import FormulaVisualizationPanel from "./FormulaVisualizationPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AdSlot from "@/components/ads/AdSlot";
import { Toaster } from "@/components/ui/sonner";
import {
  Copy, Share2, RotateCcw,
  Calculator, Globe, ChevronRight, GraduationCap, Lightbulb,
} from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  math: "var(--color-formula-math)",
  physics: "var(--color-formula-physics)",
  finance: "var(--color-formula-finance)",
  chemistry: "var(--color-formula-chem)",
  engineering: "var(--color-formula-eng)",
};

interface Props { slug: string; }

function getDefaultValues(config: FormulaVisualizerConfig): Record<string, number> {
  return Object.fromEntries(config.vars.map((v) => [v.id, v.defaultValue]));
}

function readUrlValues(config: FormulaVisualizerConfig): Record<string, number> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, number> = {};
  for (const v of config.vars) {
    const raw = params.get(v.symbol) ?? params.get(v.id);
    if (raw !== null) {
      const num = parseFloat(raw);
      if (!isNaN(num) && num >= v.min && num <= v.max) result[v.id] = num;
    }
  }
  return result;
}

function KatexDisplay({ latex, displayMode = false }: { latex: string; displayMode?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current) renderKatex(latex, ref.current, displayMode);
  }, [latex, displayMode]);
  return <div ref={ref} className={displayMode ? "katex-display" : "inline"} />;
}

export default function FormulaVisualizerEngine({ slug }: Props) {
  const config = React.useMemo(() => {
    const resolved = getFormula(slug);
    if (!resolved) throw new Error(`QuickCalci Formulas: unknown formula slug "${slug}"`);
    return resolved;
  }, [slug]);

  useKatex();

  const [values, setValues] = React.useState<Record<string, number>>(() => ({
    ...getDefaultValues(config),
    ...readUrlValues(config),
  }));

  const results = React.useMemo(() => config.compute(values), [config, values]);

  const handleChange = React.useCallback((id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = React.useCallback(() => setValues(getDefaultValues(config)), [config]);

  const handleCopy = React.useCallback(() => {
    const primary = config.outputs[0];
    const val = results[primary.id];
    navigator.clipboard.writeText(`${primary.symbol} = ${val} ${primary.unit}`).then(() => {
      toast.success("Result copied to clipboard");
    });
  }, [config, results]);

  const handleShare = React.useCallback(() => {
    const params = new URLSearchParams();
    for (const v of config.vars) params.set(v.symbol, String(values[v.id]));
    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Share link copied!"));
  }, [config, values]);

  const categoryColor = CATEGORY_COLORS[config.category] ?? "var(--color-primary)";

  const SliderPanel = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variables</span>
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 gap-1 text-xs">
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>
      <FormulaVarSliders vars={config.vars} values={values} onChange={handleChange} />
    </div>
  );

  return (
    <>
      <Toaster />
      <div className="formula-viz-root w-full px-2 sm:px-3 pt-1.5">
        <div className="formula-viz-workspace">
          <header className="formula-viz-controls">
            <Card className="h-full overflow-hidden">
              <div className="flex h-full flex-col p-2.5 sm:p-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="neu-flat flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl leading-none bg-background"
                      aria-hidden="true"
                    >
                      {config.emoji}
                    </span>
                    <div className="min-w-0">
                      <h1 className="font-display text-base font-bold leading-tight">{config.name}</h1>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{config.tagline}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge
                      variant="outline"
                      className="cursor-default px-1.5 text-[10px] capitalize"
                      style={{ color: categoryColor }}
                    >
                      {config.category}
                    </Badge>
                    <Badge variant="secondary" className="cursor-default px-1.5 text-[10px] capitalize">
                      {config.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="neu-inset mt-auto rounded-lg bg-formula-viz-bg px-3 py-2 text-center">
                  <KatexDisplay latex={config.latex} displayMode />
                </div>
              </div>
            </Card>

            <Card className="h-full">
              <CardContent className="flex h-full flex-col pb-4 pt-3">{SliderPanel}</CardContent>
            </Card>

            <div className="formula-viz-controls-actions">
              <FormulaResultCard
                outputs={config.outputs}
                results={results}
                primaryId={config.outputs[0].id}
                compact
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleCopy}>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Result
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleShare}>
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </Button>
              </div>
            </div>
          </header>

          <section className="formula-viz-stage-wrap neu-raised overflow-hidden rounded-xl bg-card">
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--hairline)] px-3 py-2 sm:px-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Live Visualization
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 gap-1 text-xs">
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </header>
            <div className="viz-stage formula-viz-stage">
              <div className="viz-stage-grid" aria-hidden="true" />
              <div className="viz-stage-glow" aria-hidden="true" />
              <div className="relative z-[1] h-full w-full">
                <FormulaVisualizationPanel config={config} values={values} transparentBg fillContainer />
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4 py-4">
            <div className="neu-flat overflow-hidden rounded-2xl bg-card">
              <Tabs defaultValue="calculator" className="w-full">
                <TabsList className="rounded-none px-2 pt-2">
                  <TabsTrigger value="calculator" className="neu-tab-active gap-2 rounded-none py-3.5">
                    <Calculator className="h-3.5 w-3.5 shrink-0" />
                    <span>Calculator</span>
                  </TabsTrigger>
                  <TabsTrigger value="realworld" className="neu-tab-active gap-2 rounded-none py-3.5">
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    <span>Real World</span>
                  </TabsTrigger>
                  <TabsTrigger value="explain" className="neu-tab-active gap-2 rounded-none py-3.5">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    <span>Explain</span>
                  </TabsTrigger>
                </TabsList>

                {/* Calculator tab */}
                <TabsContent value="calculator" className="p-5">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current input values and computed results
                  </p>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {config.vars.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center gap-3 neu-flat rounded-lg bg-background px-3 py-2.5"
                      >
                        <span className="w-5 shrink-0 font-mono text-sm font-bold" style={{ color: v.color }}>
                          {v.symbol}
                        </span>
                        <span className="flex-1 truncate text-xs text-muted-foreground">{v.name}</span>
                        <span className="font-mono text-sm font-medium tabular-nums">
                          {values[v.id]}
                          {v.unit ? <span className="ml-0.5 text-xs text-muted-foreground">{v.unit}</span> : null}
                        </span>
                      </div>
                    ))}

                    {config.outputs.map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center gap-3 neu-raised rounded-lg bg-background px-3 py-2.5 sm:col-span-2"
                      >
                        <span className="w-5 shrink-0 font-mono text-sm font-bold text-primary">{o.symbol}</span>
                        <span className="flex-1 truncate text-xs text-muted-foreground">{o.name}</span>
                        <span className="font-mono text-sm font-bold tabular-nums text-primary">
                          {String(results[o.id])}
                          {o.unit ? <span className="ml-0.5 text-xs text-primary/70">{o.unit}</span> : null}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Real World tab */}
                <TabsContent value="realworld" className="p-5">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Where this formula appears in the real world
                  </p>
                  <ul className="flex flex-col gap-3">
                    {config.realWorld.map((item, i) => (
                      <li key={i} className="flex gap-3 neu-flat rounded-lg bg-background px-3.5 py-3 text-sm">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                          style={{
                            background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                            color: "var(--primary)",
                          }}
                        >
                          {i + 1}
                        </span>
                        <span className="leading-relaxed text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                {/* Explain tab */}
                <TabsContent value="explain" className="flex flex-col gap-3 p-5">
                  <a
                    href={`/tools/${slug}/explain`}
                    className="neu-flat neu-interactive flex cursor-pointer items-center justify-between rounded-lg bg-background px-4 py-3 text-sm font-medium no-underline text-primary hover:bg-primary/5"
                  >
                    Read the full explanation page
                    <ChevronRight className="h-4 w-4" />
                  </a>
                  <div className="neu-flat rounded-lg bg-background p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Beginner explanation
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{config.beginnerExplanation}</p>
                  </div>
                  <div className="neu-flat rounded-lg bg-background p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-warning" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Real-world analogy
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{config.analogy}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Ad: inline after result */}
            <AdSlot placement="inline-after-result" />

            {/* Related formulas */}
            {config.relatedSlugs.length > 0 && (
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Related Formulas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {config.relatedSlugs.map((s) => (
                    <a
                      key={s}
                      href={`/tools/${s}`}
                      className="group flex cursor-pointer items-center gap-1 neu-flat neu-interactive rounded-full px-3 py-1 text-xs hover:bg-primary/5 hover:text-primary"
                    >
                      {s.replace(/-visualizer$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      <ChevronRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <AdSlot placement="bottom-related" />
        </div>
      </div>
    </>
  );
}
