import * as React from "react";
import type { FormulaVisualizerConfig } from "./types";
import { useRafLoop } from "./useRafLoop";

interface Props {
  config: FormulaVisualizerConfig;
  values: Record<string, number>;
  width?: number;
  height?: number;
}

/*
 * SvgPanel — re-mounts the inner <div> every time the SVG HTML changes.
 * Because SVG strings embed their own <style> + @keyframes, every remount
 * replays all animations from the start, giving a smooth "redraw" feel.
 */
function SvgPanel({ config, values, width, height }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dims, setDims] = React.useState({ w: width ?? 640, h: height ?? 380 });

  // Measure actual rendered container width so the SVG fills it
  React.useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width: cw, height: ch } = entries[0].contentRect;
      if (cw > 0) {
        const targetH = height ?? Math.round(cw * 0.6);
        setDims({ w: Math.round(cw), h: targetH });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [height]);

  const html = React.useMemo(
    () => config.renderSVG?.(values, dims.w, dims.h) ?? "",
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values, dims.w, dims.h],
  );

  return (
    <div
      ref={containerRef}
      className="w-full relative overflow-hidden"
      style={{ background: "var(--formula-viz-bg)", minHeight: dims.h }}
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

function CanvasPanel({ config, values, width, height }: Props) {
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
      style={{ background: "var(--formula-viz-bg)", display: "block" }}
    />
  );
}

const FormulaThreeScene = React.lazy(() => import("./FormulaThreeScene"));

export default function FormulaVisualizationPanel({ config, values, width, height }: Props) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (config.vizSurface === "three") {
    if (isMobile && config.renderSVG) {
      return <SvgPanel config={config} values={values} width={width} height={height} />;
    }
    return (
      <React.Suspense
        fallback={
          <div
            className="w-full flex items-center justify-center"
            style={{ aspectRatio: "4/3", background: "var(--formula-viz-bg)" }}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-xs">Loading 3D scene…</span>
            </div>
          </div>
        }
      >
        <FormulaThreeScene config={config} values={values} height={height ?? 340} />
      </React.Suspense>
    );
  }

  if (config.vizSurface === "canvas") {
    return <CanvasPanel config={config} values={values} width={width} height={height} />;
  }

  return <SvgPanel config={config} values={values} width={width} height={height} />;
}
