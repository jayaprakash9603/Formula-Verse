import type { FormulaVisualizerConfig } from "./types";
import pythagorean from "./formulas/pythagorean";
import circleArea from "./formulas/circle-area";
import quadratic from "./formulas/quadratic";
import emc2 from "./formulas/emc2";
import newtonsSecondLaw from "./formulas/newtons-second-law";
import kineticEnergy from "./formulas/kinetic-energy";
import ohmsLaw from "./formulas/ohms-law";
import waveEquation from "./formulas/wave-equation";
import compoundInterest from "./formulas/compound-interest";
import idealGasLaw from "./formulas/ideal-gas-law";
import pythagorean3d from "./formulas/pythagorean-3d";
import sphereVolume from "./formulas/sphere-volume";

export const FORMULA_REGISTRY: Record<string, FormulaVisualizerConfig> = {
  [pythagorean.slug]: pythagorean,
  [circleArea.slug]: circleArea,
  [quadratic.slug]: quadratic,
  [emc2.slug]: emc2,
  [newtonsSecondLaw.slug]: newtonsSecondLaw,
  [kineticEnergy.slug]: kineticEnergy,
  [ohmsLaw.slug]: ohmsLaw,
  [waveEquation.slug]: waveEquation,
  [compoundInterest.slug]: compoundInterest,
  [idealGasLaw.slug]: idealGasLaw,
  [pythagorean3d.slug]: pythagorean3d,
  [sphereVolume.slug]: sphereVolume,
};

export const FORMULA_SLUGS_ALL = Object.keys(FORMULA_REGISTRY);
export const FORMULA_SLUGS_LIVE = FORMULA_SLUGS_ALL.filter(
  (s) => FORMULA_REGISTRY[s].status === "live",
);

export function getFormula(slug: string): FormulaVisualizerConfig | undefined {
  return FORMULA_REGISTRY[slug];
}

export function getFormulasByCategory(
  category: string,
): FormulaVisualizerConfig[] {
  return FORMULA_SLUGS_LIVE.map((s) => FORMULA_REGISTRY[s]).filter(
    (f) => f.category === category,
  );
}

export { type FormulaVisualizerConfig } from "./types";
