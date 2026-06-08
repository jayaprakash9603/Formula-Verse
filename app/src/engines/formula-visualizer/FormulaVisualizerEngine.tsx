import * as React from "react";
import { toast } from "sonner";
import type { FormulaVisualizerConfig } from "./types";
import { getFormula } from "./index";
import { useKatex, renderKatex } from "./useKatex";
import FormulaVarSliders from "./FormulaVarSliders";
import FormulaResultCard from "./FormulaResultCard";
import FormulaVisualizationPanel from "./FormulaVisualizationPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import AdSlot from "@/components/ads/AdSlot";
import { Toaster } from "@/components/ui/sonner";
import {
  Copy, Share2, RotateCcw, SlidersHorizontal,
  Calculator, Eye, Globe, ChevronRight,
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
    if (!resolved) throw new Error(`FormulaVerse: unknown formula slug "${slug}"`);
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
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 w-full px-4 sm:px-5 py-5">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-4">

          {/* Formula header card */}
          <Card className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl leading-none">{config.emoji}</span>
                  <div>
                    <h1 className="font-display font-bold text-base leading-tight">{config.name}</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">{config.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end shrink-0">
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 capitalize cursor-default"
                    style={{ color: categoryColor }}
                  >
                    {config.category}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] px-1.5 capitalize cursor-default">
                    {config.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="neu-inset rounded-lg p-4 text-center bg-formula-viz-bg">
                <KatexDisplay latex={config.latex} displayMode />
              </div>
            </div>
          </Card>

          {/* Ad: mobile above-fold */}
          <AdSlot placement="above-fold-mobile" className="lg:hidden" />

          {/* Sliders — desktop always visible */}
          <div className="hidden lg:block">
            <Card>
              <CardContent className="pt-4 pb-5">
                {SliderPanel}
              </CardContent>
            </Card>
          </div>

          {/* Sliders — mobile Sheet */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Adjust Variables
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Adjust Variables</SheetTitle>
                </SheetHeader>
                <div className="mt-4">{SliderPanel}</div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Result card */}
          <FormulaResultCard
            outputs={config.outputs}
            results={results}
            primaryId={config.outputs[0].id}
          />

          {/* Action buttons */}
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

        {/* ── Right column ── */}
        <div className="flex flex-col gap-4">

          {/* ── Tabs ── */}
          <div className="neu-raised rounded-xl overflow-hidden bg-card">
            <Tabs defaultValue="visualize" className="w-full">

              <TabsList className="rounded-none px-2 pt-2">
                <TabsTrigger value="calculator" className="neu-tab-active gap-2 rounded-none py-3.5">
                  <Calculator className="h-3.5 w-3.5 shrink-0" />
                  <span>Calculator</span>
                </TabsTrigger>
                <TabsTrigger value="visualize" className="neu-tab-active gap-2 rounded-none py-3.5">
                  <Eye className="h-3.5 w-3.5 shrink-0" />
                  <span>Visualize</span>
                </TabsTrigger>
                <TabsTrigger value="realworld" className="neu-tab-active gap-2 rounded-none py-3.5">
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span>Real World</span>
                </TabsTrigger>
              </TabsList>

              {/* ── Calculator tab ── */}
              <TabsContent value="calculator" className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Current input values and computed results
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {config.vars.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-3 neu-flat rounded-lg px-3 py-2.5 bg-background"
                    >
                      <span
                        className="font-mono font-bold text-sm w-5 shrink-0"
                        style={{ color: v.color }}
                      >
                        {v.symbol}
                      </span>
                      <span className="text-xs text-muted-foreground flex-1 truncate">{v.name}</span>
                      <span className="font-mono text-sm tabular-nums font-medium">
                        {values[v.id]}{v.unit ? <span className="text-muted-foreground text-xs ml-0.5">{v.unit}</span> : null}
                      </span>
                    </div>
                  ))}

                  {/* Output rows — highlighted */}
                  {config.outputs.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center gap-3 neu-raised rounded-lg px-3 py-2.5 sm:col-span-2 bg-background"
                    >
                      <span className="font-mono font-bold text-sm text-primary w-5 shrink-0">
                        {o.symbol}
                      </span>
                      <span className="text-xs text-muted-foreground flex-1 truncate">{o.name}</span>
                      <span className="font-mono text-sm tabular-nums font-bold text-primary">
                        {String(results[o.id])}{o.unit ? <span className="text-primary/70 text-xs ml-0.5">{o.unit}</span> : null}
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* ── Visualize tab ── */}
              <TabsContent value="visualize" className="p-0">
                <FormulaVisualizationPanel config={config} values={values} />
              </TabsContent>

              {/* ── Real World tab ── */}
              <TabsContent value="realworld" className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Where this formula appears in the real world
                </p>
                <ul className="flex flex-col gap-3">
                  {config.realWorld.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-3 neu-flat rounded-lg px-3.5 py-3 text-sm bg-background"
                    >
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5"
                        style={{
                          background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                          color: "var(--primary)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

            </Tabs>
          </div>

          {/* Ad: inline after result */}
          <AdSlot placement="inline-after-result" />

          <Separator />

          {/* Accordions */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="beginner">
              <AccordionTrigger>🎓 Beginner Explanation</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{config.beginnerExplanation}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="analogy">
              <AccordionTrigger>💡 Real-World Analogy</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{config.analogy}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Related formulas */}
          {config.relatedSlugs.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Related Formulas
              </h3>
              <div className="flex flex-wrap gap-2">
                {config.relatedSlugs.map((s) => (
                  <a
                    key={s}
                    href={`/tools/${s}`}
                    className="group flex cursor-pointer items-center gap-1 neu-flat neu-interactive rounded-full px-3 py-1 text-xs hover:text-primary hover:bg-primary/5"
                  >
                    {s.replace(/-visualizer$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Ad: bottom */}
          <AdSlot placement="bottom-related" />
        </div>
      </div>
    </>
  );
}
