export type FormulaStatus = "live" | "dormant" | "retired";

export interface FormulaVarDef {
  id: string;
  symbol: string;
  name: string;
  unit: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  color: string;
}

export interface FormulaOutputDef {
  id: string;
  symbol: string;
  name: string;
  unit: string;
}

export interface FormulaExample {
  title: string;
  description: string;
  inputs: Record<string, number>;
  expected: Record<string, number | string>;
}

export type VizSurface = "svg" | "canvas" | "three";

export interface FormulaVisualizerConfig {
  slug: string;
  status: FormulaStatus;
  featured?: boolean;

  name: string;
  latex: string;
  shortForm: string;
  category: "math" | "physics" | "finance" | "chemistry" | "engineering";
  difficulty: "beginner" | "intermediate" | "advanced";
  emoji: string;
  tagline: string;
  beginnerExplanation: string;
  analogy: string;

  vars: FormulaVarDef[];
  outputs: FormulaOutputDef[];
  compute: (vars: Record<string, number>) => Record<string, number | string>;

  vizSurface: VizSurface;
  renderSVG?: (vars: Record<string, number>, w: number, h: number) => string;
  renderCanvas?: (
    vars: Record<string, number>,
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
  ) => void;
  renderThree?: (
    vars: Record<string, number>,
    scene: import("three").Scene,
  ) => void;

  steps: string[];
  faq: { q: string; a: string }[];
  examples: FormulaExample[];
  realWorld: string[];
  relatedSlugs: string[];

  seo: { title: string; description: string };
}
