import * as React from "react";
import { getFormula } from "@/engines/formula-visualizer/index";
import ExplanationHero from "./ExplanationHero";
import ExplanationSections from "./ExplanationSections";

interface Props {
  slug: string;
}

export default function FormulaExplanationPage({ slug }: Props) {
  const config = React.useMemo(() => {
    const resolved = getFormula(slug);
    if (!resolved) throw new Error(`QuickCalci Formulas: unknown formula slug "${slug}"`);
    return resolved;
  }, [slug]);

  return (
    <article className="w-full overflow-x-hidden">
      <ExplanationHero config={config} />
      <ExplanationSections config={config} />
    </article>
  );
}
