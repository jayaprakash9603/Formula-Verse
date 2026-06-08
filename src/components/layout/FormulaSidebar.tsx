import * as React from "react";
import { LayoutGrid, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";
import type { SidebarFormula } from "./formula-sidebar/constants";
import FormulaSidebarContent from "./formula-sidebar/FormulaSidebarContent";

export type { SidebarFormula };

interface Props {
  formulas: SidebarFormula[];
  currentSlug: string;
}

const SIDEBAR_STYLE: React.CSSProperties = {
  width: "280px",
  position: "sticky",
  top: "var(--fv-stack-top, 5.75rem)",
  height: "calc(100vh - var(--fv-stack-top, 5.75rem))",
  background: "var(--sidebar-bg)",
  overflow: "hidden",
};

export default function FormulaSidebar({ formulas, currentSlug }: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const close = () => setMobileOpen(false);
    document.addEventListener("astro:before-swap", close);
    return () => document.removeEventListener("astro:before-swap", close);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <aside
        className="formula-sidebar hidden shrink-0 border-r border-[var(--hairline)] lg:flex lg:flex-col"
        style={SIDEBAR_STYLE}
      >
        <FormulaSidebarContent formulas={formulas} currentSlug={currentSlug} />
      </aside>

      <div className="lg:hidden">
        {mobileOpen ? (
          <button
            type="button"
            aria-label="Close formula library"
            className="fixed inset-0 z-40 cursor-pointer bg-background/60 backdrop-blur-sm motion-reduce:transition-none"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div
          className={cn(
            neuVariants({ elevation: "raised", shape: "none" }),
            "formula-sidebar fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--hairline)] motion-reduce:transition-none",
          )}
          style={{
            width: "min(320px, 88vw)",
            background: "var(--sidebar-bg)",
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          role="dialog"
          aria-modal={mobileOpen}
          aria-label="Formula library"
          aria-hidden={!mobileOpen}
        >
          <div className="flex min-h-14 items-center justify-between border-b border-[var(--hairline)] px-4">
            <span className="text-sm font-bold text-foreground">Formula Library</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
              className={cn(
                neuVariants({ elevation: "flat", shape: "lg", interactive: true }),
                "flex h-11 w-11 cursor-pointer items-center justify-center bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <FormulaSidebarContent formulas={formulas} currentSlug={currentSlug} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open formula library"
          className={cn(
            neuVariants({ elevation: "raised", shape: "pill", interactive: true }),
            "fixed bottom-5 left-4 z-30 flex min-h-11 cursor-pointer items-center gap-2 px-4 text-xs font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          style={{ background: "var(--brand)" }}
        >
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          All Formulas
        </button>
      </div>
    </>
  );
}
