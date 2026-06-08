import type { FormulaVisualizerConfig } from "../types";

const newtonsSecondLaw: FormulaVisualizerConfig = {
  slug: "newtons-second-law-visualizer",
  status: "live",
  name: "Newton's Second Law",
  latex: "F = ma",
  shortForm: "F=ma",
  category: "physics",
  difficulty: "beginner",
  emoji: "🚀",
  tagline: "Force, mass, and acceleration — the engine of motion",
  beginnerExplanation:
    "Push a shopping cart — the harder you push (F) and the lighter it is (m), the faster it goes (a)! Double the force and the cart accelerates twice as fast. Double the mass and you need twice the force to get the same speed.",
  analogy:
    "Imagine pushing a supermarket trolley. An empty trolley is easy to push fast. Fill it with cans and you need way more effort to reach the same speed. That relationship between push, weight, and speed-up is exactly F = ma.",
  vars: [
    { id: "m", symbol: "m", name: "Mass", unit: "kg", defaultValue: 10, min: 0.5, max: 100, step: 0.5, color: "#60a5fa" },
    { id: "a", symbol: "a", name: "Acceleration", unit: "m/s²", defaultValue: 5, min: 0.1, max: 50, step: 0.5, color: "#34d399" },
  ],
  outputs: [{ id: "F", symbol: "F", name: "Force", unit: "N" }],
  compute: (v) => ({ F: (v.m * v.a).toFixed(2) }),
  vizSurface: "svg",
  renderSVG: (vars, w, h) => {
    const { m, a } = vars;
    const F = m * a;
    const blockW = Math.min(100, 20 + m * 0.8);
    const arrowLen = Math.min(140, F * 0.6 + 20);
    const blockX = 100, blockY = h / 2 - 20;
    const blockH = 40;
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="${blockY + blockH}" x2="${w - 20}" y2="${blockY + blockH}" stroke="#1e293b" stroke-width="2"/>
      <rect x="${blockX}" y="${blockY}" width="${blockW}" height="${blockH}" fill="rgba(96,165,250,0.15)" stroke="#60a5fa" stroke-width="2" rx="4"/>
      <text x="${blockX + blockW / 2}" y="${blockY + blockH / 2 + 5}" fill="#60a5fa" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">m=${m}kg</text>
      <line x1="${blockX - 10}" y1="${blockY + blockH / 2}" x2="${blockX - 10 - arrowLen}" y2="${blockY + blockH / 2}" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/>
      <polygon points="${blockX - 10 - arrowLen - 12},${blockY + blockH / 2 - 6} ${blockX - 10 - arrowLen},${blockY + blockH / 2} ${blockX - 10 - arrowLen - 12},${blockY + blockH / 2 + 6}" fill="#6366f1"/>
      <text x="${blockX - 10 - arrowLen / 2}" y="${blockY + blockH / 2 - 10}" fill="#6366f1" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">F=${F.toFixed(0)}N</text>
      <line x1="${blockX + blockW + 8}" y1="${blockY + blockH / 2}" x2="${blockX + blockW + 8 + Math.min(60, a * 2)}" y2="${blockY + blockH / 2}" stroke="#34d399" stroke-width="2.5" stroke-dasharray="5,3" stroke-linecap="round"/>
      <polygon points="${blockX + blockW + 8 + Math.min(60, a * 2)},${blockY + blockH / 2 - 5} ${blockX + blockW + 8 + Math.min(60, a * 2) + 10},${blockY + blockH / 2} ${blockX + blockW + 8 + Math.min(60, a * 2)},${blockY + blockH / 2 + 5}" fill="#34d399"/>
      <text x="${blockX + blockW + 8 + Math.min(60, a * 2) / 2}" y="${blockY + blockH / 2 - 12}" fill="#34d399" font-size="11" text-anchor="middle" font-family="Inter, sans-serif">a=${a}m/s²</text>
      <text x="${w / 2}" y="${h - 15}" fill="#64748b" font-size="10" text-anchor="middle" font-family="Inter, sans-serif">surface</text>
    </svg>`;
  },
  steps: [
    "Set the mass m of the object using the slider — the block in the visualizer widens with increasing mass.",
    "Set the acceleration a — the green dashed arrow on the right grows longer.",
    "The blue force arrow F = ma on the left updates instantly to show the required net force.",
    "Read the force in Newtons from the result panel.",
    "Notice that doubling m while keeping a fixed doubles F — the relationship is perfectly linear.",
  ],
  faq: [
    {
      q: "What is a Newton (N)?",
      a: "One Newton is the force needed to accelerate 1 kg at 1 m/s². An apple weighing about 100 g exerts roughly 1 Newton on your hand due to gravity.",
    },
    {
      q: "Is F=ma always exactly correct?",
      a: "It is exact for classical (non-relativistic) physics. At speeds close to light, Einstein's relativity gives more accurate results. For everyday engineering, F=ma is essentially perfect.",
    },
    {
      q: "Where is Newton's Second Law used in practice?",
      a: "Designing car brakes, calculating rocket thrust, modelling earthquake forces on buildings, and computing load limits for cranes all use F = ma.",
    },
  ],
  examples: [
    { title: "Car Braking (1000 kg, 8 m/s²)", description: "Force needed to stop a car", inputs: { m: 1000, a: 8 }, expected: { F: "8000.00" } },
    { title: "Shopping Cart (20 kg, 1 m/s²)", description: "Gentle push on a loaded trolley", inputs: { m: 20, a: 1 }, expected: { F: "20.00" } },
    { title: "Rocket Launch (1000 kg, 30 m/s²)", description: "Thrust required for rapid ascent", inputs: { m: 1000, a: 30 }, expected: { F: "30000.00" } },
    { title: "Football (0.5 kg, 50 m/s²)", description: "Force during a powerful kick", inputs: { m: 0.5, a: 50 }, expected: { F: "25.00" } },
    { title: "Elevator Load (500 kg, 2 m/s²)", description: "Net upward force in an accelerating lift", inputs: { m: 500, a: 2 }, expected: { F: "1000.00" } },
  ],
  realWorld: [
    "Car engineers use F=ma to design braking systems that stop vehicles within legal distances.",
    "SpaceX rocket engineers compute F=ma for every stage of a Falcon 9 launch to reach orbit.",
    "Sports scientists measure ground reaction forces during sprinting to optimise athlete performance.",
  ],
  relatedSlugs: ["kinetic-energy-visualizer", "einsteins-emc2-visualizer"],
  seo: {
    title: "Newton's Second Law F=ma Visualizer — QuickCalci Formulas",
    description:
      "Visualize F = ma with an animated block, force arrows, and acceleration gauge. Adjust mass and acceleration and see force update in real time.",
  },
};

export default newtonsSecondLaw;
