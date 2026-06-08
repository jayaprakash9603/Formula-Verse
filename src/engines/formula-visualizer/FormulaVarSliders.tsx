import * as React from "react";
import type { FormulaVarDef } from "./types";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface Props {
  vars: FormulaVarDef[];
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
}

export default function FormulaVarSliders({ vars, values, onChange }: Props) {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-5">
        {vars.map((v) => (
          <div key={v.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="font-mono text-base font-bold cursor-help"
                      style={{ color: v.color }}
                    >
                      {v.symbol}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{v.name}</p>
                    {v.unit && <p className="text-xs opacity-70">Unit: {v.unit}</p>}
                  </TooltipContent>
                </Tooltip>
                <span className="text-xs text-muted-foreground">{v.name}</span>
              </div>
              <Badge variant="secondary" className="font-mono text-xs tabular-nums">
                {values[v.id]} {v.unit}
              </Badge>
            </div>
            <Slider
              min={v.min}
              max={v.max}
              step={v.step}
              value={[values[v.id]]}
              onValueChange={([val]) => onChange(v.id, val)}
              className="[&_[role=slider]]:border-primary/50"
              style={
                {
                  "--tw-ring-color": v.color,
                  "--slider-range-bg": v.color,
                } as React.CSSProperties
              }
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/60">
              <span>{v.min} {v.unit}</span>
              <span>{v.max} {v.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
