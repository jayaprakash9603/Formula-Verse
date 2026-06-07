import type { FormulaVisualizerConfig } from "../types";

const circleArea: FormulaVisualizerConfig = {
  slug: "circle-area-visualizer",
  status: "live",
  featured: true,
  name: "Circle Area",
  latex: "A = \\pi r^2",
  shortForm: "A=πr²",
  category: "math",
  difficulty: "beginner",
  emoji: "⭕",
  tagline: "How much space fits inside a circle",
  beginnerExplanation:
    "If you draw a circle with chalk, this tells you how many tiles you need to fill the inside! The bigger the radius, the way more tiles you need — because squaring the radius makes it grow super fast.",
  analogy:
    "Imagine a sprinkler in the middle of a garden. The water reaches out equally in all directions. This formula tells you exactly how big a wet circle appears on the ground.",
  vars: [
    {
      id: "r",
      symbol: "r",
      name: "Radius",
      unit: "m",
      defaultValue: 5,
      min: 0.5,
      max: 15,
      step: 0.5,
      color: "#8b5cf6",
    },
  ],
  outputs: [{ id: "A", symbol: "A", name: "Area", unit: "m²" }],
  compute: (v) => ({
    A: (Math.PI * v.r ** 2).toFixed(4),
    C: (2 * Math.PI * v.r).toFixed(4),
  }),
  vizSurface: "svg",
  renderSVG: (vars, w, h) => {
    const { r } = vars;
    const cx = w / 2, cy = h / 2 - 16;
    const maxR = Math.min(w, h) / 2 - 44;
    const sc = Math.min(maxR / r, 12);
    const pr = r * sc;
    const rings = 5;
    const area = (Math.PI * r ** 2).toFixed(2);
    const circ = (2 * Math.PI * r).toFixed(2);
    // circumference path length for dash animation
    const circumLen = Math.round(2 * Math.PI * pr);

    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" overflow="visible">
<defs>
  <radialGradient id="circleFill" cx="50%" cy="50%" r="50%">
    <stop offset="0%"   stop-color="#8b5cf6" stop-opacity="0.28"/>
    <stop offset="70%"  stop-color="#8b5cf6" stop-opacity="0.12"/>
    <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.04"/>
  </radialGradient>
  <filter id="centerGlow">
    <feGaussianBlur stdDeviation="4" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="ringGlow">
    <feGaussianBlur stdDeviation="3" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<style>
  @keyframes ringIn {
    from { r: 0; opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes circumSpin {
    to { stroke-dashoffset: -${circumLen}; }
  }
  @keyframes radiusIn {
    from { opacity: 0; stroke-dashoffset: 300; }
    to   { opacity: 1; stroke-dashoffset: 0; }
  }
  @keyframes popIn {
    0%   { transform: scale(0); opacity: 0; }
    70%  { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity: 0.7; transform: scale(1); }
    50%      { opacity: 1;   transform: scale(1.04); }
  }
  ${Array.from({ length: rings }, (_, i) => `.ring-${i} { animation: ringIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.05 + i * 0.07}s both; }`).join(" ")}
  .circ-outer { stroke-dasharray: ${circumLen}; animation: radiusIn 0.6s ease-out 0.35s both, circumSpin 4s linear 0.95s infinite; }
  .radius-line { stroke-dasharray: 300; animation: radiusIn 0.45s ease-out 0.2s both; }
  .center-dot  { transform-origin: ${cx}px ${cy}px; animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.15s both; }
  .edge-dot    { transform-origin: ${cx + pr}px ${cy}px; animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.5s both; }
  .label       { animation: fadeUp 0.4s ease-out 0.55s both; }
  .r-label     { animation: fadeUp 0.4s ease-out 0.35s both; }
  .main-circle { animation: pulse 3s ease-in-out 1s infinite; transform-origin: ${cx}px ${cy}px; }
</style>

<!-- Concentric fill rings (staggered pop-in) -->
${Array.from({ length: rings }, (_, i) => {
  const rr = pr * ((i + 1) / rings);
  const op = 0.06 + i * 0.04;
  const strokeOp = 0.15 + i * 0.07;
  return `<circle class="ring-${i}" cx="${cx}" cy="${cy}" r="${rr}" fill="rgba(139,92,246,${op})" stroke="rgba(139,92,246,${strokeOp})" stroke-width="1"/>`;
}).join("\n")}

<!-- Main circle — pulsing + animated circumference -->
<circle class="main-circle circ-outer" filter="url(#ringGlow)"
  cx="${cx}" cy="${cy}" r="${pr}"
  fill="url(#circleFill)"
  stroke="#8b5cf6" stroke-width="2.5"/>

<!-- Radius line -->
<line class="radius-line" x1="${cx}" y1="${cy}" x2="${cx + pr}" y2="${cy}"
  stroke="#818cf8" stroke-width="2.5" stroke-dasharray="6 3" stroke-linecap="round"/>

<!-- Centre dot -->
<circle class="center-dot" filter="url(#centerGlow)"
  cx="${cx}" cy="${cy}" r="5" fill="#818cf8" stroke="#fff" stroke-width="1.5"/>

<!-- Edge dot -->
<circle class="edge-dot" cx="${cx + pr}" cy="${cy}" r="4.5" fill="#a78bfa" stroke="#fff" stroke-width="1.5"/>

<!-- Radius label pill -->
<g class="r-label">
  <rect x="${cx + pr / 2 - 30}" y="${cy - 26}" width="60" height="20" rx="10" fill="#818cf822"/>
  <text x="${cx + pr / 2}" y="${cy - 12}" fill="#818cf8"
    font-size="13" font-weight="700" text-anchor="middle" font-family="Inter,sans-serif">r = ${r} m</text>
</g>

<!-- Area result -->
<g class="label">
  <rect x="${cx - 68}" y="${cy + pr + 10}" width="136" height="24" rx="12" fill="#8b5cf622"/>
  <text x="${cx}" y="${cy + pr + 27}" fill="#a78bfa"
    font-size="14" font-weight="700" text-anchor="middle" font-family="JetBrains Mono,monospace">A = ${area} m²</text>
</g>
<g class="label" style="animation-delay:0.62s">
  <text x="${cx}" y="${cy + pr + 50}" fill="#64748b"
    font-size="11" text-anchor="middle" font-family="Inter,sans-serif">Circumference = ${circ} m</text>
</g>
</svg>`;
  },
  steps: [
    "Adjust the radius r with the slider — the circle in the visualizer grows and shrinks live.",
    "Watch the concentric rings animate outward as the radius increases.",
    "Read the area A from the result panel (in square metres by default).",
    "The circumference C is also calculated and displayed below the main result.",
    "Use the Share button to encode your radius value into the URL for sharing.",
  ],
  faq: [
    {
      q: "Why does the area grow so fast when I increase r?",
      a: "Because r is squared. Doubling the radius quadruples the area. This is why a small increase in a wheel's size makes a big difference in its coverage.",
    },
    {
      q: "What is π (pi)?",
      a: "Pi (≈3.14159) is the ratio of any circle's circumference to its diameter. It appears in every circle calculation and is one of the most important constants in mathematics.",
    },
    {
      q: "How is circle area used in real life?",
      a: "Calculating sensor coverage zones, designing roundabouts, computing pizza sizes, and estimating the area of circular crop fields all use A = πr².",
    },
  ],
  examples: [
    { title: "Small Coin (r = 1 cm)", description: "Area of a typical coin", inputs: { r: 1 }, expected: { A: "3.1416" } },
    { title: "Dinner Plate (r = 15 cm)", description: "Standard plate coverage", inputs: { r: 15 }, expected: { A: "706.8583" } },
    { title: "Swimming Pool (r = 5 m)", description: "Circular pool area", inputs: { r: 5 }, expected: { A: "78.5398" } },
    { title: "Radar Coverage (r = 50 km)", description: "Air traffic radar sweep zone", inputs: { r: 50 }, expected: { A: "7853.9816" } },
    { title: "Large Pizza (r = 15 cm)", description: "How much pizza fits on a 30cm round tray", inputs: { r: 15 }, expected: { A: "706.8583" } },
  ],
  realWorld: [
    "Engineers calculate the cross-section area of pipes and cables to determine flow capacity.",
    "Farmers use circle area to plan irrigation coverage for circular sprinkler systems.",
    "Astronomers compute the apparent disk area of planets and stars when measuring brightness.",
  ],
  relatedSlugs: ["pythagorean-theorem-visualizer", "sphere-volume-visualizer"],
  seo: {
    title: "Circle Area Calculator & Visualizer — FormulaVerse",
    description:
      "See A = πr² come alive with animated concentric rings. Adjust the radius and watch the circle area update instantly with live labels.",
  },
};

export default circleArea;
