import type { FormulaVisualizerConfig } from "../types";

const R_GAS = 8.314;

const idealGasLaw: FormulaVisualizerConfig = {
  slug: "ideal-gas-law-visualizer",
  status: "live",
  name: "Ideal Gas Law",
  latex: "PV = nRT",
  shortForm: "PV=nRT",
  category: "chemistry",
  difficulty: "intermediate",
  emoji: "🫧",
  tagline: "Pressure, volume, temperature — the three faces of a gas",
  beginnerExplanation:
    "Blow up a balloon and sit on it — when you squish the space (V), the air pushes harder (P). Heat makes molecules bounce faster and also push harder. This formula captures all three relationships in one equation.",
  analogy:
    "Imagine molecules as bouncy balls inside a box. More heat makes them bounce faster and hit the walls harder (higher pressure). Shrink the box and they hit the walls more often (even higher pressure). This is PV = nRT in action.",
  vars: [
    { id: "n", symbol: "n", name: "Moles of Gas", unit: "mol", defaultValue: 1, min: 0.1, max: 10, step: 0.1, color: "#fb923c" },
    { id: "T", symbol: "T", name: "Temperature", unit: "K", defaultValue: 300, min: 100, max: 1000, step: 5, color: "#f87171" },
    { id: "V", symbol: "V", name: "Volume", unit: "L", defaultValue: 24.6, min: 0.1, max: 100, step: 0.1, color: "#60a5fa" },
  ],
  outputs: [{ id: "P", symbol: "P", name: "Pressure", unit: "Pa" }],
  compute: (v) => ({
    P: ((v.n * R_GAS * v.T) / (v.V * 0.001)).toFixed(2),
  }),
  vizSurface: "three",
  renderSVG: (vars, w, h) => {
    const { n, T, V } = vars;
    const P = (n * R_GAS * T) / (V * 0.001);
    const pts: string[] = [];
    for (let vL = 0.5; vL <= 50; vL += 0.5) {
      const px = (n * R_GAS * T) / (vL * 0.001);
      if (px < 1e7) pts.push(`${30 + vL * 4},${180 - Math.min(150, px / 80000)}`);
    }
    const cx = 30 + V * 4;
    const cy = 180 - Math.min(150, P / 80000);
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <polyline points="${pts.join(" ")}" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${Math.min(250, cx)}" cy="${Math.max(10, cy)}" r="7" fill="#fb923c" stroke="#fff" stroke-width="2"/>
      <line x1="20" y1="180" x2="${w - 10}" y2="180" stroke="#1e293b" stroke-width="1.5"/>
      <line x1="20" y1="10" x2="20" y2="180" stroke="#1e293b" stroke-width="1.5"/>
      <text x="${w - 8}" y="192" fill="#64748b" font-size="10" text-anchor="end" font-family="Inter, sans-serif">V (L)</text>
      <text x="24" y="18" fill="#64748b" font-size="10" font-family="Inter, sans-serif">P (Pa)</text>
      <text x="${w / 2}" y="155" fill="#fb923c" font-size="11" font-weight="700" text-anchor="middle" font-family="JetBrains Mono, monospace">P = ${P.toExponential(2)} Pa</text>
      <text x="${w / 2}" y="168" fill="#64748b" font-size="10" text-anchor="middle" font-family="Inter, sans-serif">n=${n}mol  T=${T}K  V=${V}L</text>
    </svg>`;
  },
  steps: [
    "Set the number of moles n of gas (more molecules = more pressure).",
    "Adjust temperature T in Kelvin — higher temperature means faster-moving molecules and higher pressure.",
    "Change the volume V — a smaller container means more frequent wall collisions (higher pressure).",
    "The 3D visualizer shows bouncing molecules: hot molecules move faster and glow brighter.",
    "Click any molecule to see its velocity vector arrow.",
  ],
  faq: [
    {
      q: "Why is temperature in Kelvin, not Celsius?",
      a: "The ideal gas law requires absolute temperature. Kelvin starts at absolute zero (−273.15°C), where molecular motion ceases. Using Celsius would give wrong (or negative) results.",
    },
    {
      q: "What is an 'ideal' gas?",
      a: "An ideal gas assumes molecules have no volume and no intermolecular forces. Real gases deviate at high pressure and low temperature, but PV=nRT is an excellent approximation for most everyday conditions.",
    },
    {
      q: "Where is the ideal gas law used in practice?",
      a: "HVAC engineers calculate air volumes, divers compute gas consumption at depth, meteorologists model atmosphere layers, and engine designers optimise combustion chamber pressure.",
    },
  ],
  examples: [
    { title: "Air at Room Temperature (1 mol)", description: "1 mole of ideal gas at 25°C", inputs: { n: 1, T: 298, V: 24.5 }, expected: { P: "101322.10" } },
    { title: "Hot Gas (500K)", description: "Gas heated to 500K", inputs: { n: 1, T: 500, V: 24.6 }, expected: { P: "169072.36" } },
    { title: "Compressed Gas (10L)", description: "Squishing gas to smaller volume", inputs: { n: 1, T: 300, V: 10 }, expected: { P: "249420.00" } },
    { title: "5 Moles at STP", description: "Multiple moles at standard conditions", inputs: { n: 5, T: 273, V: 112 }, expected: { P: "101557.28" } },
    { title: "High Temperature (1000K)", description: "Extreme heating scenario", inputs: { n: 1, T: 1000, V: 24.6 }, expected: { P: "338240.65" } },
  ],
  realWorld: [
    "Scuba divers calculate how long a tank will last at depth using PV = nRT and Boyle's law.",
    "Automotive engineers compute the pressure inside a cylinder after fuel combustion to optimise engine efficiency.",
    "Weather balloons expand as they rise because pressure drops with altitude, following the ideal gas law.",
  ],
  relatedSlugs: ["sphere-volume-visualizer", "pythagorean-3d-theorem"],
  seo: {
    title: "Ideal Gas Law PV=nRT Calculator & Visualizer — QuickCalci Formulas",
    description:
      "Explore PV = nRT with a 3D animated container of bouncing gas molecules. Adjust temperature, volume, and moles to see pressure respond live.",
  },
};

export default idealGasLaw;
