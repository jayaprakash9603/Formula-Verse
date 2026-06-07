import * as React from "react";
import { renderKatex, useKatex } from "@/engines/formula-visualizer/useKatex";
import { ArrowRight, Check } from "lucide-react";
import { FormulaIcon } from "@/lib/formula-icons";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";

const FRAME_MS_ABSTRACT = 1900;
const FRAME_MS_STEP     = 1300;
const FRAME_MS_RESULT   = 2300;

export interface FormulaAnimCardProps {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  vars: Array<{ symbol: string }>;
  animFrames: string[];
}

function KatexFrame({
  latex,
  active,
  accent,
}: {
  latex: string;
  active: boolean;
  accent: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) renderKatex(latex, ref.current, true);
  }, [latex]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 350ms ease-in-out",
        pointerEvents: "none",
        color: accent ? "var(--brand)" : "inherit",
      }}
    />
  );
}

export default function FormulaAnimCard({
  slug,
  name,
  tagline,
  category,
  vars,
  animFrames,
}: FormulaAnimCardProps) {
  useKatex();
  const n = animFrames.length;

  const [hovered, setHovered] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const hoveredRef  = React.useRef(false);
  const timerRef    = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const isResult = activeIdx === n - 1;

  function frameDuration(idx: number) {
    if (idx === 0)     return FRAME_MS_ABSTRACT;
    if (idx === n - 1) return FRAME_MS_RESULT;
    return FRAME_MS_STEP;
  }

  React.useEffect(() => {
    hoveredRef.current = hovered;

    if (!hovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setActiveIdx(0);
      return;
    }

    function scheduleNext(idx: number) {
      timerRef.current = setTimeout(() => {
        if (!hoveredRef.current) return;
        const next = (idx + 1) % n;
        setActiveIdx(next);
        scheduleNext(next);
      }, frameDuration(idx));
    }

    scheduleNext(0);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hovered]); // eslint-disable-line react-hooks/exhaustive-deps

  const phaseLabel = !hovered
    ? "Hover to animate"
    : activeIdx === 0
    ? "Formula"
    : isResult
    ? "Result"
    : n > 3
    ? `Step ${activeIdx} of ${n - 2}`
    : "Substituting…";

  const progress = hovered && n > 1 ? (activeIdx / (n - 1)) * 100 : 0;

  return (
    <a
      href={`/tools/${slug}`}
      className={cn(
        neuVariants({ elevation: "raised", shape: "lg", interactive: true }),
        "group relative flex flex-col overflow-hidden no-underline formula-card-hover bg-card",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-0">
        <span
          className={cn(
            neuVariants({ elevation: "flat", shape: "pill" }),
            "text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 text-muted-foreground bg-muted",
          )}
        >
          {category}
        </span>
        <span
          className={cn(
            neuVariants({ elevation: "flat", shape: "lg" }),
            "flex h-7 w-7 items-center justify-center bg-muted transition-all duration-200",
          )}
        >
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
        </span>
      </div>

      <div className="mx-5 mt-3 mb-0 flex flex-col gap-0">
        <div
          className="text-[9px] font-semibold uppercase tracking-widest mb-1.5"
          style={{
            color: hovered && isResult ? "var(--brand)" : "var(--muted-foreground)",
            minHeight: "12px",
            transition: "color 350ms ease",
          }}
        >
          {phaseLabel}
        </div>

        <div
          className={cn(
            neuVariants({ elevation: "inset", shape: "lg" }),
            "relative overflow-hidden bg-background",
          )}
          style={{
            minHeight: "88px",
            transition: "box-shadow 350ms ease",
          }}
        >
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, var(--brand-soft) 0%, transparent 70%)",
              opacity: hovered && isResult ? 1 : 0,
              transition: "opacity 350ms ease",
            }}
          />

          {animFrames.map((latex, i) => (
            <KatexFrame
              key={i}
              latex={latex}
              active={i === activeIdx}
              accent={i === n - 1}
            />
          ))}

          <div
            className="absolute bottom-5 left-0 right-0 flex justify-center pointer-events-none"
            style={{
              opacity: hovered && isResult ? 1 : 0,
              transition: "opacity 350ms ease",
            }}
          >
            <span
              className={cn(neuVariants({ elevation: "flat", shape: "pill" }), "flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5")}
              style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
            >
              <Check size={9} strokeWidth={3} />
              Computed
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{
                width: `${progress}%`,
                transition: "width 500ms ease-in-out",
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-5 pt-3 pb-5 gap-2">
        <div className="flex items-center gap-2 font-display font-semibold text-base leading-snug group-hover:text-primary transition-colors duration-200">
          <FormulaIcon slug={slug} size={16} className="text-foreground shrink-0" />
          {name}
        </div>
        <div className="text-xs leading-relaxed text-muted-foreground">
          {tagline}…
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 relative">
          <div className="absolute top-0 left-0 right-0 neu-divider" />
          <div className="flex gap-1.5 flex-wrap pt-3">
            {vars.map((v) => (
              <span
                key={v.symbol}
                className={cn(
                  neuVariants({ elevation: "flat", shape: "sm" }),
                  "text-[10px] font-mono px-2 py-0.5 font-semibold bg-muted text-foreground",
                )}
              >
                {v.symbol}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground whitespace-nowrap group-hover:text-primary transition-colors duration-200 pt-3">
            Click to explore →
          </span>
        </div>
      </div>
    </a>
  );
}
