import * as React from "react";
import type { FormulaVisualizerConfig } from "./types";
import { useRafLoop } from "./useRafLoop";

interface Props {
  config: FormulaVisualizerConfig;
  values: Record<string, number>;
  width?: number;
  height?: number;
  transparentBg?: boolean;
  fillContainer?: boolean;
}

/*
 * SvgPanel — re-mounts the inner <div> every time the SVG HTML changes.
 * Because SVG strings embed their own <style> + @keyframes, every remount
 * replays all animations from the start, giving a smooth "redraw" feel.
 */
function SvgPanel({ config, values, width, height, transparentBg, fillContainer }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dims, setDims] = React.useState({ w: width ?? 640, h: height ?? 380 });

  React.useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width: cw, height: ch } = entries[0].contentRect;
      if (cw <= 0) return;
      const targetH = height
        ?? (fillContainer && ch > 120
          ? Math.round(ch)
          : Math.round(Math.min(Math.max(cw * 0.52, 240), 440)));
      setDims({ w: Math.round(cw), h: targetH });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [height, fillContainer]);

  const html = React.useMemo(
    () => config.renderSVG?.(values, dims.w, dims.h) ?? "",
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values, dims.w, dims.h],
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden${fillContainer ? " flex h-full min-h-full items-center justify-center" : ""}`}
      style={{ background: transparentBg ? "transparent" : "var(--formula-viz-bg)", minHeight: fillContainer ? "100%" : dims.h }}
    >
      {/* key={html} forces remount → CSS animations inside the SVG restart */}
      <div
        key={html}
        className="viz-animate-in"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ width: "100%", height: dims.h }}
      />
    </div>
  );
}

function CanvasPanel({ config, values, width, height, transparentBg }: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const w = width ?? 480;
  const h = height ?? 340;

  useRafLoop(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    config.renderCanvas?.(values, ctx, w, h);
  }, [values, w, h]);

  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      className="w-full"
      style={{ background: transparentBg ? "transparent" : "var(--formula-viz-bg)", display: "block" }}
    />
  );
}

const FormulaThreeScene = React.lazy(() => import("./FormulaThreeScene"));

class VizErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function ThreeUnavailable({ height }: { height: number }) {
  return (
    <div
      className="flex w-full items-center justify-center px-6 text-center text-sm text-muted-foreground"
      style={{ minHeight: height }}
    >
      The interactive 3D view is unavailable here — the values still update live in the panel.
    </div>
  );
}

export default function FormulaVisualizationPanel({ config, values, width, height, transparentBg, fillContainer }: Props) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (config.vizSurface === "three") {
    if (isMobile && config.renderSVG) {
      return <SvgPanel config={config} values={values} width={width} height={height} transparentBg={transparentBg} fillContainer={fillContainer} />;
    }
    const threeFallback = config.renderSVG ? (
      <SvgPanel config={config} values={values} width={width} height={height} transparentBg={transparentBg} fillContainer={fillContainer} />
    ) : (
      <ThreeUnavailable height={height ?? 340} />
    );
    return (
      <VizErrorBoundary fallback={threeFallback}>
        <React.Suspense
          fallback={
            <div
              className="w-full flex items-center justify-center"
              style={{ aspectRatio: "4/3", background: transparentBg ? "transparent" : "var(--formula-viz-bg)" }}
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-xs">Loading 3D scene…</span>
              </div>
            </div>
          }
        >
          <FormulaThreeScene
            config={config}
            values={values}
            height={height ?? 340}
            fillContainer={fillContainer}
          />
        </React.Suspense>
      </VizErrorBoundary>
    );
  }

  if (config.vizSurface === "canvas") {
    return <CanvasPanel config={config} values={values} width={width} height={height} transparentBg={transparentBg} />;
  }

  return <SvgPanel config={config} values={values} width={width} height={height} transparentBg={transparentBg} fillContainer={fillContainer} />;
}
