import * as React from "react";
import {
  Triangle, Circle, TrendingUp, Zap, Rocket, Gauge,
  CircuitBoard, Waves, DollarSign, Thermometer, Box, Globe,
  Calculator, FlaskConical, Settings, Hash,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps formula slug → Lucide icon component.
 * To change an icon, swap the component value here.
 */
export const FORMULA_ICON_MAP: Record<string, LucideIcon> = {
  "pythagorean-theorem-visualizer":  Triangle,
  "circle-area-visualizer":          Circle,
  "quadratic-formula-visualizer":    TrendingUp,
  "einsteins-emc2-visualizer":       Zap,
  "newtons-second-law-visualizer":   Rocket,
  "kinetic-energy-visualizer":       Gauge,
  "ohms-law-visualizer":             CircuitBoard,
  "wave-equation-visualizer":        Waves,
  "compound-interest-visualizer":    DollarSign,
  "ideal-gas-law-visualizer":        Thermometer,
  "pythagorean-3d-theorem":          Box,
  "sphere-volume-visualizer":        Globe,
};

/**
 * Maps category key → Lucide icon component.
 * To change a category icon, swap the value here.
 */
export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  math:        Calculator,
  physics:     Zap,
  finance:     TrendingUp,
  chemistry:   FlaskConical,
  engineering: Settings,
};

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function FormulaIcon({ slug, size = 16, ...rest }: IconProps & { slug: string }) {
  const Icon = FORMULA_ICON_MAP[slug] ?? Hash;
  return <Icon size={size} {...rest} />;
}

export function CategoryIcon({ category, size = 16, ...rest }: IconProps & { category: string }) {
  const Icon = CATEGORY_ICON_MAP[category] ?? Hash;
  return <Icon size={size} {...rest} />;
}
