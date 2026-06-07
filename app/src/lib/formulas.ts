import {
  FORMULA_REGISTRY,
  FORMULA_SLUGS_ALL,
  FORMULA_SLUGS_LIVE,
} from "@/engines/formula-visualizer/index";
import type { FormulaVisualizerConfig } from "@/engines/formula-visualizer/types";

export { FORMULA_SLUGS_LIVE, FORMULA_SLUGS_ALL };

export function isPublic(config: FormulaVisualizerConfig): boolean {
  return config.status === "live";
}

export function getBySlug(slug: string): FormulaVisualizerConfig | undefined {
  return FORMULA_REGISTRY[slug];
}

export function getLiveFormulas(): FormulaVisualizerConfig[] {
  return FORMULA_SLUGS_LIVE.map((s) => FORMULA_REGISTRY[s]);
}

export function getLiveByCategory(category: string): FormulaVisualizerConfig[] {
  return getLiveFormulas().filter((f) => f.category === category);
}

export function getFeaturedFormulas(count = 3): FormulaVisualizerConfig[] {
  const featured = getLiveFormulas().filter((f) => f.featured);
  if (featured.length >= count) return featured.slice(0, count);
  const rest = getLiveFormulas().filter((f) => !f.featured);
  return [...featured, ...rest].slice(0, count);
}
