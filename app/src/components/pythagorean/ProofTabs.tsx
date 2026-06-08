import { Layers, Triangle, Calculator, Shapes } from "lucide-react";
import SectionShell from "./SectionShell";
import SegmentedTabs, { type SegmentedTabItem } from "@/components/ui/segmented-tabs";

const PROOFS = [
  {
    id: "rearrangement",
    title: "Rearrangement",
    icon: Layers,
    steps: ["Place four identical triangles inside a large square.", "The inner square has side c.", "Rearrange to show two smaller squares of sides a and b.", "Same total area proves a² + b² = c²."],
  },
  {
    id: "similar",
    title: "Similar Triangles",
    icon: Triangle,
    steps: ["Drop an altitude from the right angle to the hypotenuse.", "This creates three similar triangles.", "Use ratios of corresponding sides.", "Algebraic manipulation yields a² + b² = c²."],
  },
  {
    id: "algebraic",
    title: "Algebraic",
    icon: Calculator,
    steps: ["Place the triangle on a coordinate grid.", "Use the distance formula for each side.", "Substitute coordinates for vertices.", "Simplify to get a² + b² = c²."],
  },
  {
    id: "geometric",
    title: "Geometric",
    icon: Shapes,
    steps: ["Construct squares on all three sides.", "Dissect the a² and b² squares.", "Translate pieces into the c² square.", "Visual area equality confirms the theorem."],
  },
];

function ProofPanel({ steps }: { steps: string[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="neu-flat rounded-2xl p-8 bg-card flex items-center justify-center min-h-[240px]">
        <svg viewBox="0 0 200 200" className="w-48 h-48" aria-hidden="true">
          <polygon points="40,160 40,80 120,160" fill="var(--brand-soft)" stroke="var(--primary)" strokeWidth="2" />
          <rect x="40" y="160" width="80" height="80" fill="var(--warning)" fillOpacity="0.3" />
          <rect x="0" y="80" width="80" height="80" fill="var(--primary)" fillOpacity="0.3" />
        </svg>
      </div>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={step} className="neu-flat rounded-xl p-4 bg-background flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full neu-raised text-xs font-bold text-primary bg-card">
              {i + 1}
            </span>
            <span className="text-sm text-foreground leading-relaxed pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ProofTabs() {
  const items: SegmentedTabItem[] = PROOFS.map((proof) => ({
    id: proof.id,
    label: proof.title,
    icon: proof.icon,
    content: <ProofPanel steps={proof.steps} />,
  }));

  return (
    <SectionShell
      id="proofs"
      title="Multiple Proof Methods"
      subtitle="Four different ways to see the same truth. Pick the one that clicks for you."
      className="bg-card/50"
      centered
      contentClassName="max-w-[1174px] mx-auto"
    >
      <SegmentedTabs items={items} ariaLabel="Proof methods" />
    </SectionShell>
  );
}
