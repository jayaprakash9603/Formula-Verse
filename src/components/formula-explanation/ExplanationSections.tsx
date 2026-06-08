import { GraduationCap, Lightbulb, Globe, ListOrdered, HelpCircle } from "lucide-react";
import type { FormulaVisualizerConfig } from "@/engines/formula-visualizer/types";

interface Props {
  config: FormulaVisualizerConfig;
}

export default function ExplanationSections({ config }: Props) {
  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-10 sm:px-6 sm:py-12">
      <Section icon={GraduationCap} title="Beginner explanation" body={config.beginnerExplanation} />
      <Section icon={Lightbulb} title="Real-world analogy" body={config.analogy} />

      <section className="mb-10">
        <SectionHeading icon={Globe} title="Where it appears in the real world" />
        <ul className="flex flex-col gap-3">
          {config.realWorld.map((item, i) => (
            <li key={i} className="neu-flat flex gap-3 rounded-xl bg-background px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <SectionHeading icon={ListOrdered} title="How to use the visualizer" />
        <ol className="flex flex-col gap-3">
          {config.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm leading-relaxed text-muted-foreground">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {config.faq.length > 0 ? (
        <section className="mb-10">
          <SectionHeading icon={HelpCircle} title="Common questions" />
          <div className="flex flex-col gap-3">
            {config.faq.map((item) => (
              <details key={item.q} className="neu-flat group rounded-xl bg-background px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold text-foreground">{item.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <RelatedLinks config={config} />
    </div>
  );
}

function Section({ icon: Icon, title, body }: { icon: typeof GraduationCap; title: string; body: string }) {
  return (
    <section className="mb-10">
      <SectionHeading icon={Icon} title={title} />
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </section>
  );
}

function SectionHeading({ icon: Icon, title }: { icon: typeof GraduationCap; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="font-display text-xl font-semibold">{title}</h2>
    </div>
  );
}

function RelatedLinks({ config }: { config: FormulaVisualizerConfig }) {
  if (config.relatedSlugs.length === 0) return null;

  return (
    <section className="border-t border-[var(--hairline)] pt-8">
      <h2 className="mb-4 font-display text-lg font-semibold">Related formulas</h2>
      <div className="flex flex-wrap gap-2">
        {config.relatedSlugs.map((relatedSlug) => (
          <a
            key={relatedSlug}
            href={`/tools/${relatedSlug}/explain`}
            className="neu-flat neu-interactive cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium no-underline text-muted-foreground hover:text-primary"
          >
            {relatedSlug.replace(/-visualizer$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </a>
        ))}
      </div>
    </section>
  );
}
