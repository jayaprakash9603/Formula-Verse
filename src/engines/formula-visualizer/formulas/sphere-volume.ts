import type { FormulaVisualizerConfig } from "../types";

const sphereVolume: FormulaVisualizerConfig = {
  slug: "sphere-volume-visualizer",
  status: "live",
  name: "Sphere Volume",
  latex: "V = \\frac{4}{3}\\pi r^3",
  shortForm: "(4/3)πr³",
  category: "math",
  difficulty: "intermediate",
  emoji: "🌐",
  tagline: "How much space fits inside a perfect sphere",
  beginnerExplanation:
    "How much water fits in a round ball? This tells you — and the answer grows VERY fast as the ball gets bigger! Double the radius and the volume grows eight times. That is why planets are so massive even if they look only a little bigger than others.",
  analogy:
    "Think of oranges at the market. A large orange has twice the radius of a small one — but it holds eight times as much juice. Volume grows with the cube of the radius, which is why size differences in spheres are deceptive.",
  vars: [
    {
      id: "r",
      symbol: "r",
      name: "Radius",
      unit: "m",
      defaultValue: 3,
      min: 0.1,
      max: 15,
      step: 0.1,
      color: "#38bdf8",
    },
  ],
  outputs: [
    { id: "V", symbol: "V", name: "Volume", unit: "m³" },
    { id: "A", symbol: "A", name: "Surface Area", unit: "m²" },
  ],
  compute: (v) => ({
    V: ((4 / 3) * Math.PI * v.r ** 3).toFixed(4),
    A: (4 * Math.PI * v.r ** 2).toFixed(4),
  }),
  vizSurface: "three",
  renderSVG: (vars, w, h) => {
    const { r } = vars;
    const V = (4 / 3) * Math.PI * r ** 3;
    const A = 4 * Math.PI * r ** 2;
    const cx = w / 2 - 30, cy = h / 2;
    const sc = Math.min((w / 2 - 40) / r, (h / 2 - 30) / r, 12);
    const pr = r * sc;
    const sideLen = (V ** (1 / 3)) * sc;
    const cubeX = w / 2 + 20;
    const cubeY = h / 2 + sideLen / 2;
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="${pr}" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="2.5"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${pr}" ry="${pr * 0.3}" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="5,3" opacity="0.6"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + pr}" y2="${cy}" stroke="#6366f1" stroke-width="2" stroke-dasharray="4,3"/>
      <text x="${cx + pr / 2}" y="${cy - 8}" fill="#6366f1" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">r=${r}</text>
      <text x="${cx}" y="${cy + pr + 16}" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle" font-family="JetBrains Mono, monospace">V=${V.toFixed(2)} m³</text>
      <rect x="${cubeX}" y="${cubeY - sideLen}" width="${sideLen}" height="${sideLen}" fill="rgba(251,191,36,0.1)" stroke="#fbbf24" stroke-width="1.5" rx="2"/>
      <text x="${cubeX + sideLen / 2}" y="${cubeY + 14}" fill="#fbbf24" font-size="10" text-anchor="middle" font-family="Inter, sans-serif">Equal-V cube</text>
      <text x="${cx}" y="${cy + pr + 30}" fill="#64748b" font-size="10" text-anchor="middle" font-family="Inter, sans-serif">A=${A.toFixed(2)} m²</text>
    </svg>`;
  },
  steps: [
    "Adjust the radius r using the slider — the sphere in the 3D view grows/shrinks in real time.",
    "Notice how much faster the volume grows compared to the radius (cubic relationship).",
    "A cross-section disc oscillates through the sphere to show the internal geometry.",
    "Next to the sphere, a cube with the same volume appears for visual comparison.",
    "Read V and surface area A simultaneously from the result panel.",
  ],
  faq: [
    {
      q: "Why does volume grow so much faster than radius?",
      a: "Volume scales with r³ (cubed), so doubling the radius gives 2³ = 8 times the volume. This is why planets with slightly bigger radii are dramatically heavier — volume grows explosively.",
    },
    {
      q: "What is the surface area formula for a sphere?",
      a: "A = 4πr². The visualizer computes this alongside volume. Surface area grows slower than volume (r² vs r³), which is why larger creatures have more trouble cooling themselves down.",
    },
    {
      q: "Where is sphere volume used in real life?",
      a: "Chemical tank design, astronomy (computing planet masses from radius), sports ball manufacturing, and calculating dose volumes in radiation therapy all rely on V = (4/3)πr³.",
    },
  ],
  examples: [
    { title: "Tennis Ball (r=3.25 cm)", description: "Standard tennis ball volume", inputs: { r: 0.0325 }, expected: { V: "0.0001" } },
    { title: "Basketball (r=12 cm)", description: "Official basketball volume", inputs: { r: 0.12 }, expected: { V: "0.0072" } },
    { title: "Earth (r=6371 km)", description: "Volume of planet Earth", inputs: { r: 5 }, expected: { V: "523.5988" } },
    { title: "Water Tank (r=2m)", description: "Spherical water storage tank", inputs: { r: 2 }, expected: { V: "33.5103" } },
    { title: "Golf Ball (r=2.13 cm)", description: "Standard golf ball dimensions", inputs: { r: 0.0213 }, expected: { V: "0.0000" } },
  ],
  realWorld: [
    "Petroleum engineers calculate storage tank capacities for large spherical LPG tanks using this formula.",
    "Astronomers estimate planet masses by combining sphere volume with estimated density.",
    "Pharmaceutical companies compute drug dosage volumes for injection spheres and capsule fill.",
  ],
  relatedSlugs: ["circle-area-visualizer", "ideal-gas-law-visualizer"],
  seo: {
    title: "Sphere Volume Calculator & Visualizer — QuickCalci",
    description:
      "Explore V = (4/3)πr³ with a 3D interactive sphere. See volume and surface area update live, with a same-volume cube for comparison.",
  },
};

export default sphereVolume;
