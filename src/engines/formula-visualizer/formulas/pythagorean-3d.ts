import type { FormulaVisualizerConfig } from "../types";

const pythagorean3d: FormulaVisualizerConfig = {
  slug: "pythagorean-3d-theorem",
  status: "live",
  name: "3D Pythagorean Theorem",
  latex: "a^2 + b^2 + c^2 = d^2",
  shortForm: "a²+b²+c²=d²",
  category: "math",
  difficulty: "intermediate",
  emoji: "🧊",
  tagline: "The 2D triangle rule upgraded for 3D space",
  beginnerExplanation:
    "The 2D triangle rule upgraded for 3D boxes — finds the diagonal across a room from one corner to the opposite corner! Measure the width, depth, and height of your room, and this tells you the longest possible straight line inside it.",
  analogy:
    "Imagine a room in your house. You can walk diagonally across the floor — that is 2D Pythagoras. But what is the longest thing you could fit diagonally from the floor-front-left corner to the ceiling-back-right corner? That is the 3D version!",
  vars: [
    { id: "a", symbol: "a", name: "Width", unit: "m", defaultValue: 3, min: 0.5, max: 15, step: 0.5, color: "#6366f1" },
    { id: "b", symbol: "b", name: "Depth", unit: "m", defaultValue: 4, min: 0.5, max: 15, step: 0.5, color: "#8b5cf6" },
    { id: "c", symbol: "c", name: "Height", unit: "m", defaultValue: 5, min: 0.5, max: 15, step: 0.5, color: "#34d399" },
  ],
  outputs: [{ id: "d", symbol: "d", name: "Space Diagonal", unit: "m" }],
  compute: (v) => ({ d: Math.sqrt(v.a ** 2 + v.b ** 2 + v.c ** 2).toFixed(4) }),
  vizSurface: "three",
  renderSVG: (vars, w, h) => {
    const { a, b, c } = vars;
    const d = Math.sqrt(a ** 2 + b ** 2 + c ** 2);
    const sc = Math.min(25, (w - 80) / (a + b + c));
    const ox = 40, oy = h - 40;
    const ax = ox + a * sc, ay = oy;
    const bx = ax + b * sc * 0.5, by = ay - b * sc * 0.5;
    const cx2 = ox + b * sc * 0.5, cy2 = oy - b * sc * 0.5;
    const topX = cx2 + a * sc, topY = cy2 - c * sc;
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${ox},${oy} ${ax},${ay} ${bx},${by} ${cx2},${cy2}" fill="rgba(99,102,241,0.08)" stroke="#6366f1" stroke-width="1.5"/>
      <polygon points="${ox},${oy - c * sc} ${ax},${ay - c * sc} ${bx},${by - c * sc} ${cx2},${cy2 - c * sc}" fill="rgba(139,92,246,0.08)" stroke="#8b5cf6" stroke-width="1.5"/>
      <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy - c * sc}" stroke="#34d399" stroke-width="2.5"/>
      <line x1="${ax}" y1="${ay}" x2="${ax}" y2="${ay - c * sc}" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4,3"/>
      <line x1="${bx}" y1="${by}" x2="${bx}" y2="${by - c * sc}" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4,3"/>
      <line x1="${cx2}" y1="${cy2}" x2="${cx2}" y2="${cy2 - c * sc}" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4,3"/>
      <line x1="${ox}" y1="${oy}" x2="${topX}" y2="${topY}" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="6,3"/>
      <text x="${(ox + topX) / 2 + 10}" y="${(oy + topY) / 2}" fill="#fbbf24" font-size="12" font-weight="700" font-family="JetBrains Mono, monospace">d=${d.toFixed(2)}</text>
      <text x="${ax / 2 + ox / 2}" y="${oy + 14}" fill="#6366f1" font-size="11" font-family="Inter, sans-serif" text-anchor="middle">a=${a}</text>
      <text x="${ox - 14}" y="${oy - c * sc / 2}" fill="#34d399" font-size="11" font-family="Inter, sans-serif" text-anchor="middle">c=${c}</text>
      <text x="${ox + 8}" y="${oy - 8}" fill="#8b5cf6" font-size="11" font-family="Inter, sans-serif">b=${b}</text>
    </svg>`;
  },
  steps: [
    "Set dimension a (width) of the 3D box using the slider.",
    "Set dimension b (depth) of the box.",
    "Set dimension c (height) of the box.",
    "The glowing diagonal d is computed as √(a²+b²+c²) — the longest straight line through the box.",
    "Orbit the 3D cube with your mouse to view the diagonal from any angle.",
  ],
  faq: [
    {
      q: "Why is this useful if we already have 2D Pythagoras?",
      a: "Many real problems are 3D — fitting furniture diagonally through a door, calculating cable lengths in 3D rooms, or determining shortest distances in 3D space all need the 3D extension.",
    },
    {
      q: "Does this work for any rectangular box?",
      a: "Yes — any rectangular cuboid (box with all right angles). The formula √(a²+b²+c²) gives the space diagonal from any corner to the opposite corner.",
    },
    {
      q: "What is the relationship to 2D Pythagoras?",
      a: "The 3D version applies Pythagoras twice: first the floor diagonal = √(a²+b²), then the space diagonal = √(floor_diagonal² + c²) = √(a²+b²+c²).",
    },
  ],
  examples: [
    { title: "Small Room (3×4×5m)", description: "The classic 3D Pythagorean triple", inputs: { a: 3, b: 4, c: 5 }, expected: { d: "7.0711" } },
    { title: "Shipping Container (12×2.4×2.6m)", description: "Standard 40ft shipping container diagonal", inputs: { a: 12, b: 2.4, c: 2.6 }, expected: { d: "12.4677" } },
    { title: "TV Through Door (1×0.6×1.2m)", description: "Will the TV fit through the door diagonally?", inputs: { a: 1, b: 0.6, c: 1.2 }, expected: { d: "1.6613" } },
    { title: "Warehouse (50×30×10m)", description: "Longest conveyor belt possible", inputs: { a: 50, b: 30, c: 10 }, expected: { d: "59.1608" } },
    { title: "Cube (5×5×5m)", description: "Space diagonal of a perfect cube", inputs: { a: 5, b: 5, c: 5 }, expected: { d: "8.6603" } },
  ],
  realWorld: [
    "Removal companies calculate the longest item that can fit diagonally in a truck using 3D Pythagoras.",
    "3D game engines use a³+b²+c²=d² to compute distances between objects for collision detection.",
    "Architects calculate cable lengths in 3D roof structures spanning different elevations.",
  ],
  relatedSlugs: ["pythagorean-theorem-visualizer", "sphere-volume-visualizer"],
  seo: {
    title: "3D Pythagorean Theorem a²+b²+c²=d² — QuickCalci",
    description:
      "Explore a²+b²+c²=d² with an interactive 3D rotating cuboid. See the space diagonal glow as you adjust width, depth, and height.",
  },
};

export default pythagorean3d;
