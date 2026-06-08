import * as React from "react";

export type AdPlacement =
  | "above-fold-mobile"
  | "inline-after-result"
  | "bottom-related"
  | "sidebar"
  | "hub-grid";

interface AdSlotProps {
  placement: AdPlacement;
  client?: string;
  slotId?: string;
  className?: string;
}

const PLACEMENT_SIZES: Record<AdPlacement, string> = {
  "above-fold-mobile": "min-h-24 sm:min-h-28",
  "inline-after-result": "min-h-32",
  "bottom-related": "min-h-40",
  sidebar: "min-h-64",
  "hub-grid": "min-h-32",
};

/**
 * Lazy AdSense slot. Renders a reserved-size placeholder during SSR/idle
 * so layout shift is zero, then swaps to a real AdSense ins element after
 * the page is interactive (idle callback).
 *
 * Set window.__fvAdsenseClient = "ca-pub-XXXXX" before this component
 * mounts to enable real ads. Without it, the placeholder remains.
 */
export default function AdSlot({ placement, client, slotId, className = "" }: AdSlotProps) {
  const [active, setActive] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const cb = () => setActive(true);
    const win = window as Window & {
      requestIdleCallback?: (f: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(cb);
      return () => win.cancelIdleCallback?.(id);
    }
    const id = setTimeout(cb, 1500);
    return () => clearTimeout(id);
  }, []);

  React.useEffect(() => {
    if (!active) return;
    const w = window as unknown as { adsbygoogle?: unknown[] };
    try {
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // ignore
    }
  }, [active]);

  const c = client ?? (typeof window !== "undefined" ? (window as unknown as { __fvAdsenseClient?: string }).__fvAdsenseClient : undefined);

  return (
    <div
      ref={ref}
      data-placement={placement}
      className={`my-4 flex w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/20 bg-muted/10 text-xs text-muted-foreground ${PLACEMENT_SIZES[placement]} ${className}`}
      aria-label="Advertisement"
    >
      {active && c && slotId ? (
        <ins
          className="adsbygoogle block w-full"
          style={{ display: "block" }}
          data-ad-client={c}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <span>Sponsored</span>
      )}
    </div>
  );
}
