import { lazy, Suspense, useEffect, useRef, useState } from "react";
import SectionShell from "./SectionShell";

const Derivation3D = lazy(() => import("./Derivation3D"));

const STEPS = [
  "Start with a right triangle and build a square on each side: a² = 9, b² = 16, c² = 25.",
  "Slide the whole a-square (the smaller one) into the centre of the c-square on the hypotenuse.",
  "Cut the b-square through its centre into four equal pieces.",
  "Slide those four pieces in around the a-square — they slot into the gaps left over.",
  "The pieces fill the c-square with no gaps and no overlaps, so a² + b² = c².",
];

function ScenePlaceholder() {
  return (
    <div className="flex h-[380px] w-full items-center justify-center rounded-xl sm:h-[440px]">
      <span className="text-sm text-muted-foreground">Loading 3D model…</span>
    </div>
  );
}

export default function DerivationAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = mountRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionShell
      id="derivation"
      title="Visual Derivation"
      subtitle="Watch the proof assemble in 3D. The a-square and the four pieces of the b-square slide across and fit together to fill the c-square exactly — drag to rotate."
      centered
      contentClassName="max-w-[1174px] mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
        <div ref={mountRef} className="neu-flat rounded-2xl p-4 sm:p-6 bg-card">
          {inView ? (
            <Suspense fallback={<ScenePlaceholder />}>
              <Derivation3D />
            </Suspense>
          ) : (
            <ScenePlaceholder />
          )}
        </div>

        <div className="space-y-4">
          {STEPS.map((text, i) => (
            <div key={text} className="neu-flat rounded-xl p-4 text-sm bg-card">
              <span className="font-bold text-primary mr-2">{i + 1}.</span>
              <span className="text-muted-foreground">{text}</span>
            </div>
          ))}
          <div className="neu-inset rounded-xl p-4 text-center font-mono text-lg font-bold text-foreground">
            a² + b² = c²
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
