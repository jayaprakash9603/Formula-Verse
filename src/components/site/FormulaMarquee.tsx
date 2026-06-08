import * as React from "react";
import { renderKatex, useKatex } from "@/engines/formula-visualizer/useKatex";

const MARQUEE_FORMULAS = [
  "E=mc^2",
  "F=ma",
  "a^2+b^2=c^2",
  "A=\\pi r^2",
  "PV=nRT",
  "V=IR",
  "\\Delta x = v_0 t + \\tfrac{1}{2} a t^2",
  "\\int_a^b f(x)\\,dx",
  "\\sum_{n=0}^{\\infty} \\tfrac{1}{n!}",
  "\\nabla \\cdot \\vec{E} = \\tfrac{\\rho}{\\varepsilon_0}",
  "e^{i\\pi}+1=0",
  "\\tfrac{d}{dx}\\sin x=\\cos x",
];

function MarqueeGlyph({ latex }: { latex: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const paint = () => {
      renderKatex(latex, el, false);
      attempts += 1;
      if (!el.querySelector(".katex") && attempts < 40) {
        timer = window.setTimeout(paint, 80);
      }
    };

    paint();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [latex]);

  return (
    <span className="formula-marquee-glyph" aria-hidden="true">
      <span ref={ref} className="formula-marquee-katex" />
      <span className="formula-marquee-dot" aria-hidden="true" />
    </span>
  );
}

export default function FormulaMarquee() {
  useKatex();
  const track = [...MARQUEE_FORMULAS, ...MARQUEE_FORMULAS];

  return (
    <section className="formula-marquee-strip" aria-label="Featured formulas">
      <div className="formula-marquee-fade formula-marquee-fade--left" aria-hidden="true" />
      <div className="formula-marquee-fade formula-marquee-fade--right" aria-hidden="true" />
      <div className="formula-marquee-channel neu-inset">
        <div className="formula-marquee-track animate-marquee">
          {track.map((latex, index) => (
            <MarqueeGlyph key={`${latex}-${index}`} latex={latex} />
          ))}
        </div>
      </div>
    </section>
  );
}
