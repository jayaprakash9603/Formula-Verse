import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FormulaOutputDef } from "./types";

interface Props {
  outputs: FormulaOutputDef[];
  results: Record<string, number | string>;
  primaryId: string;
}

export default function FormulaResultCard({ outputs, results, primaryId }: Props) {
  const [pulse, setPulse] = React.useState(false);
  const prevRef = React.useRef<string>("");
  const primaryVal = String(results[primaryId] ?? "—");

  React.useEffect(() => {
    if (prevRef.current && prevRef.current !== primaryVal) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 350);
      return () => clearTimeout(t);
    }
    prevRef.current = primaryVal;
  }, [primaryVal]);

  const primary = outputs.find((o) => o.id === primaryId) ?? outputs[0];
  const secondary = outputs.filter((o) => o.id !== primaryId);

  return (
    <Card className={cn("bg-primary/5 transition-all duration-200", pulse && "animate-pulse-ring ring-2 ring-primary/50")}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{primary.name}</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-4xl font-bold text-primary tabular-nums leading-none">
              {primaryVal}
            </span>
            {primary.unit && (
              <span className="text-sm text-muted-foreground">{primary.unit}</span>
            )}
          </div>
        </div>
        {secondary.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3 justify-center pt-3 relative">
            <div className="absolute top-0 left-0 right-0 neu-divider" />
            {secondary.map((o) => (
              <div key={o.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-mono font-semibold text-foreground/70">{o.symbol}</span>
                <span>=</span>
                <span className="font-mono tabular-nums">{String(results[o.id] ?? "—")}</span>
                {o.unit && <span>{o.unit}</span>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
