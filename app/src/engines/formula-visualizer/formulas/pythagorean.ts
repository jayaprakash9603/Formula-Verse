import type { FormulaVisualizerConfig } from "../types";

const pythagorean: FormulaVisualizerConfig = {
  slug: "pythagorean-theorem-visualizer",
  status: "live",
  featured: true,
  name: "Pythagorean Theorem",
  latex: "a^2 + b^2 = c^2",
  shortForm: "a²+b²=c²",
  category: "math",
  difficulty: "beginner",
  emoji: "📐",
  tagline: "The secret of right triangles",
  beginnerExplanation:
    "Imagine a ramp in a playground. The two flat parts tell you exactly how long the slanting part is — every time, with no measuring tape! If one side goes 3 steps across and the other goes 4 steps up, the slant is always exactly 5 steps.",
  analogy:
    "Think of a pizza box corner. If you go 3 slices across and 4 slices up, the diagonal cut is always exactly 5 slices. Every right corner in the universe follows this same rule — no exceptions!",
  vars: [
    {
      id: "a",
      symbol: "a",
      name: "Side A",
      unit: "units",
      defaultValue: 3,
      min: 0.5,
      max: 14,
      step: 0.5,
      color: "#6366f1",
    },
    {
      id: "b",
      symbol: "b",
      name: "Side B",
      unit: "units",
      defaultValue: 4,
      min: 0.5,
      max: 14,
      step: 0.5,
      color: "#8b5cf6",
    },
  ],
  outputs: [
    { id: "c", symbol: "c", name: "Hypotenuse", unit: "units" },
  ],
  compute: (v) => ({ c: Math.sqrt(v.a ** 2 + v.b ** 2).toFixed(4) }),
  vizSurface: "three",
  renderSVG: (vars, w, h) => {
    const { a, b } = vars;
    const c = Math.sqrt(a ** 2 + b ** 2);
    const pad = { l: 70, r: 90, t: 40, b: 55 };
    const drawW = w - pad.l - pad.r;
    const drawH = h - pad.t - pad.b;
    const sc = Math.min(drawW / (a + b), drawH / (a + b), 18);
    const ox = pad.l, oy = pad.t + drawH;          // right-angle vertex
    const ax = ox + a * sc, ay = oy;               // end of side a (horizontal)
    const bx = ox, by = oy - b * sc;              // end of side b (vertical)
    const cols = { a: "#818cf8", b: "#c084fc", c: "#34d399" };
    const qm = Math.min(16, sc * 0.7, 16);

    // hypotenuse length for dasharray animation
    const hypLen = Math.round(c * sc + 10);

    // Square a² — sits below the horizontal leg
    const sqAx = ox, sqAy = oy;
    const sqASize = a * sc;

    // Square b² — sits to the right of the vertical leg
    const sqBx = ax, sqBy = by;
    const sqBSize = b * sc;

    // Label positions
    const aLabelX = ox + (a * sc) / 2;
    const aLabelY = oy + 34;
    const bLabelX = ox - 36;
    const bLabelY = oy - (b * sc) / 2;
    const cLabelX = (ax + bx) / 2 + (ax > bx ? 28 : -28);
    const cLabelY = (ay + by) / 2 - 6;

    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" overflow="visible">
<defs>
  <filter id="glow-a"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="glow-b"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="glow-c"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <linearGradient id="sqA" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${cols.a}" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="${cols.a}" stop-opacity="0.08"/>
  </linearGradient>
  <linearGradient id="sqB" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${cols.b}" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="${cols.b}" stop-opacity="0.08"/>
  </linearGradient>
  <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${cols.c}" stop-opacity="0.18"/>
    <stop offset="100%" stop-color="${cols.c}" stop-opacity="0.06"/>
  </linearGradient>
</defs>
<style>
  @keyframes sqFadeIn {
    from { opacity: 0; transform-origin: center; transform: scale(0.6); }
    to   { opacity: 1; transform-origin: center; transform: scale(1); }
  }
  @keyframes lineIn {
    from { stroke-dashoffset: 500; opacity: 0; }
    to   { stroke-dashoffset: 0;   opacity: 1; }
  }
  @keyframes hypDash {
    to { stroke-dashoffset: -20; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes triFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes dotPop {
    0%   { r: 0; }
    70%  { r: 6; }
    100% { r: 5; }
  }
  .sq-a { animation: sqFadeIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.05s both; }
  .sq-b { animation: sqFadeIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.15s both; }
  .tri  { animation: triFade  0.5s ease-out 0.3s both; }
  .leg-a { stroke-dasharray: 500; animation: lineIn 0.45s ease-out 0.1s both; }
  .leg-b { stroke-dasharray: 500; animation: lineIn 0.45s ease-out 0.2s both; }
  .hyp   { stroke-dasharray: 12 6; animation: lineIn 0.5s ease-out 0.35s both, hypDash 1.4s linear 0.85s infinite; }
  .label { animation: fadeUp 0.4s ease-out 0.45s both; }
  .dot   { animation: dotPop 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.4s both; }
  .sq-label { animation: fadeUp 0.4s ease-out 0.25s both; }
</style>

<!-- Square a² (below horizontal leg) -->
<g class="sq-a">
  <rect x="${sqAx}" y="${sqAy}" width="${sqASize}" height="${sqASize * 0.6}" fill="url(#sqA)" stroke="${cols.a}" stroke-width="1.5" rx="3" opacity="0.9"/>
  <text x="${sqAx + sqASize / 2}" y="${sqAy + sqASize * 0.35}" fill="${cols.a}" font-size="11" font-weight="700" text-anchor="middle" font-family="JetBrains Mono,monospace" class="sq-label">a²</text>
</g>

<!-- Square b² (right of vertical leg) -->
<g class="sq-b">
  <rect x="${sqBx}" y="${sqBy}" width="${sqBSize * 0.6}" height="${sqBSize}" fill="url(#sqB)" stroke="${cols.b}" stroke-width="1.5" rx="3" opacity="0.9"/>
  <text x="${sqBx + sqBSize * 0.3}" y="${sqBy + sqBSize / 2 + 4}" fill="${cols.b}" font-size="11" font-weight="700" text-anchor="middle" font-family="JetBrains Mono,monospace" class="sq-label">b²</text>
</g>

<!-- Triangle fill -->
<polygon class="tri" points="${ox},${oy} ${ax},${ay} ${bx},${by}" fill="url(#triGrad)" stroke="none"/>

<!-- Right-angle marker -->
<rect class="tri" x="${ox + 2}" y="${oy - qm - 2}" width="${qm}" height="${qm}" fill="none" stroke="#64748b88" stroke-width="1.5" rx="2"/>

<!-- Side a (horizontal) -->
<line class="leg-a" filter="url(#glow-a)" x1="${ox}" y1="${oy}" x2="${ax}" y2="${ay}" stroke="${cols.a}" stroke-width="3.5" stroke-linecap="round"/>

<!-- Side b (vertical) -->
<line class="leg-b" filter="url(#glow-b)" x1="${ox}" y1="${oy}" x2="${bx}" y2="${by}" stroke="${cols.b}" stroke-width="3.5" stroke-linecap="round"/>

<!-- Hypotenuse c (animated dashes) -->
<line class="hyp" filter="url(#glow-c)" x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${cols.c}" stroke-width="3" stroke-linecap="round"/>

<!-- Vertex dots -->
<circle class="dot" cx="${ox}" cy="${oy}" r="5" fill="#fff" stroke="${cols.a}" stroke-width="2"/>
<circle class="dot" cx="${ax}" cy="${ay}" r="5" fill="#fff" stroke="${cols.b}" stroke-width="2"/>
<circle class="dot" cx="${bx}" cy="${by}" r="5" fill="#fff" stroke="${cols.c}" stroke-width="2"/>

<!-- Labels with pill background -->
<g class="label">
  <rect x="${aLabelX - 28}" y="${aLabelY - 13}" width="56" height="20" rx="10" fill="${cols.a}22"/>
  <text x="${aLabelX}" y="${aLabelY}" fill="${cols.a}" font-size="13" font-weight="700" text-anchor="middle" font-family="Inter,sans-serif">a = ${a}</text>
</g>
<g class="label" style="animation-delay:0.5s">
  <rect x="${bLabelX - 28}" y="${bLabelY - 13}" width="56" height="20" rx="10" fill="${cols.b}22"/>
  <text x="${bLabelX}" y="${bLabelY}" fill="${cols.b}" font-size="13" font-weight="700" text-anchor="middle" font-family="Inter,sans-serif">b = ${b}</text>
</g>
<g class="label" style="animation-delay:0.55s">
  <rect x="${cLabelX - 34}" y="${cLabelY - 14}" width="68" height="22" rx="11" fill="${cols.c}22"/>
  <text x="${cLabelX}" y="${cLabelY}" fill="${cols.c}" font-size="13" font-weight="700" text-anchor="middle" font-family="Inter,sans-serif">c = ${c.toFixed(2)}</text>
</g>
</svg>`;
  },
  steps: [
    "Enter the length of side a using the slider (the horizontal leg of the right triangle).",
    "Enter the length of side b using the slider (the vertical leg of the right triangle).",
    "The visualizer instantly draws the right triangle, with coloured squares on each side showing a², b², and c².",
    "Read the hypotenuse c from the result panel — this is the longest side, opposite the right angle.",
    "Hover over the variable symbols to see full names and units. Use the Share button to save your inputs.",
  ],
  faq: [
    {
      q: "What is the Pythagorean Theorem?",
      a: "It states that in any right triangle, the square of the hypotenuse (longest side) equals the sum of the squares of the other two sides: a² + b² = c².",
    },
    {
      q: "Does it only work for right triangles?",
      a: "Yes — the theorem applies exclusively to triangles with one 90° angle. For other triangles, use the law of cosines instead.",
    },
    {
      q: "What are real-world uses of the Pythagorean Theorem?",
      a: "GPS distance calculations, construction (checking square corners), computer graphics (2D distance), and 3D game engine collision detection all use it.",
    },
  ],
  examples: [
    { title: "Classic 3-4-5 Triangle", description: "The most famous Pythagorean triple", inputs: { a: 3, b: 4 }, expected: { c: "5.0000" } },
    { title: "TV Screen Diagonal (40×30 cm)", description: "Finding the diagonal measurement of a screen", inputs: { a: 40, b: 30 }, expected: { c: "50.0000" } },
    { title: "Ship Navigation (5km × 12km)", description: "Distance a ship travels on a right-angle route", inputs: { a: 5, b: 12 }, expected: { c: "13.0000" } },
    { title: "Football Field Diagonal", description: "Corner to corner across a football pitch", inputs: { a: 100, b: 68 }, expected: { c: "121.1940" } },
    { title: "Ladder Safety Check (4m height, 1.5m from wall)", description: "Minimum ladder length for safe reach", inputs: { a: 1.5, b: 4 }, expected: { c: "4.2720" } },
  ],
  realWorld: [
    "GPS satellites use the 3D version to calculate your exact distance from each satellite.",
    "Architects check that walls are perfectly square by measuring diagonals.",
    "Game engines compute pixel-perfect collision distances 60 times per second.",
  ],
  relatedSlugs: ["circle-area-visualizer", "pythagorean-3d-theorem"],
  seo: {
    title: "Pythagorean Theorem Calculator & Visualizer — FormulaVerse",
    description:
      "Interactively visualize a² + b² = c² with animated coloured squares. Adjust sides in real time and see the hypotenuse update instantly.",
  },
};

export default pythagorean;
