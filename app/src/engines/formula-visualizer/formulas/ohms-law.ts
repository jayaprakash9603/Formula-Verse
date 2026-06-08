import type { FormulaVisualizerConfig } from "../types";

const ohmsLaw: FormulaVisualizerConfig = {
  slug: "ohms-law-visualizer",
  status: "live",
  name: "Ohm's Law",
  latex: "V = IR",
  shortForm: "V=IR",
  category: "engineering",
  difficulty: "beginner",
  emoji: "⚡",
  tagline: "Voltage, current, and resistance — the water pipe of electricity",
  beginnerExplanation:
    "Think of electricity like water in a pipe — voltage is the water pressure, current is how fast the water flows, and resistance is how narrow the pipe is. Increase pressure or widen the pipe and more water flows.",
  analogy:
    "Picture a garden hose. Voltage is how hard you squeeze the tap, current is how much water comes out, and resistance is the hose diameter. A narrow kinked hose resists water flow — just like a resistor resists current.",
  vars: [
    { id: "I", symbol: "I", name: "Current", unit: "A", defaultValue: 2, min: 0.1, max: 20, step: 0.1, color: "#60a5fa" },
    { id: "R", symbol: "R", name: "Resistance", unit: "Ω", defaultValue: 5, min: 0.1, max: 100, step: 0.1, color: "#fb923c" },
  ],
  outputs: [{ id: "V", symbol: "V", name: "Voltage", unit: "V" }],
  compute: (v) => ({
    V: (v.I * v.R).toFixed(2),
    P: (v.I ** 2 * v.R).toFixed(2),
  }),
  vizSurface: "svg",
  renderSVG: (vars, w, h) => {
    const { I, R } = vars;
    const V = I * R;
    const P = I ** 2 * R;
    const dotX = 60 + (I / 20) * (w - 200);
    const glowOpacity = Math.min(0.9, 0.2 + R / 100);
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="30" width="${w - 80}" height="${h - 80}" fill="none" stroke="#1e293b" stroke-width="1.5" rx="10"/>
      <line x1="40" y1="${h / 2}" x2="${w / 2 - 40}" y2="${h / 2}" stroke="#60a5fa" stroke-width="2.5"/>
      <rect x="${w / 2 - 40}" y="${h / 2 - 16}" width="80" height="32" fill="rgba(251,146,60,${glowOpacity * 0.3})" stroke="#fb923c" stroke-width="2" rx="4">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite"/>
      </rect>
      <text x="${w / 2}" y="${h / 2 + 5}" fill="#fb923c" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">R=${R}Ω</text>
      <line x1="${w / 2 + 40}" y1="${h / 2}" x2="${w - 80}" y2="${h / 2}" stroke="#60a5fa" stroke-width="2.5"/>
      <rect x="${w - 80}" y="${h / 2 - 25}" width="20" height="50" fill="rgba(96,165,250,0.25)" stroke="#60a5fa" stroke-width="2" rx="2"/>
      <text x="${w - 70}" y="${h / 2 + 5}" fill="#60a5fa" font-size="10" text-anchor="middle" font-family="JetBrains Mono, monospace">V</text>
      <line x1="${w - 60}" y1="${h / 2}" x2="${w - 40}" y2="${h / 2}" stroke="#60a5fa" stroke-width="2.5"/>
      <line x1="${w - 40}" y1="${h / 2}" x2="${w - 40}" y2="${h - 30}" stroke="#60a5fa" stroke-width="2.5"/>
      <line x1="40" y1="${h / 2}" x2="40" y2="${h - 30}" stroke="#60a5fa" stroke-width="2.5"/>
      <line x1="40" y1="${h - 30}" x2="${w - 40}" y2="${h - 30}" stroke="#60a5fa" stroke-width="2.5"/>
      <circle cx="${dotX}" cy="${h / 2}" r="5" fill="#fbbf24">
        <animateMotion path="M0,0 L${(w - 200) * (I / 20)},0 L${(w - 200) * (I / 20)},${(h - 30) - h / 2} L${-(dotX - 60)},${(h - 30) - h / 2} L${-(dotX - 60)},0" dur="${Math.max(0.5, 2 - I * 0.08)}s" repeatCount="indefinite"/>
      </circle>
      <text x="${w / 2}" y="${h - 10}" fill="#94a3b8" font-size="11" text-anchor="middle" font-family="JetBrains Mono, monospace">V=${V.toFixed(1)}V  I=${I}A  R=${R}Ω  P=${P.toFixed(1)}W</text>
    </svg>`;
  },
  steps: [
    "Set the current I (how many amperes flow through the circuit) using the slider.",
    "Set the resistance R of the resistor using its slider — the resistor symbol glows more intensely with higher resistance.",
    "The circuit diagram animates current-dot speed proportional to I.",
    "Read the voltage V = IR from the result panel. Power P = IV is also calculated.",
    "Use the Share button to encode your circuit values into the URL for sharing.",
  ],
  faq: [
    {
      q: "What is the difference between voltage and current?",
      a: "Voltage (V) is the electrical pressure or potential difference that drives current. Current (I) is the actual flow of charge. You need both — voltage drives current, and resistance limits it.",
    },
    {
      q: "What is Ohm's Law used for?",
      a: "Designing resistor networks, calculating safe fuse ratings, troubleshooting circuits, and sizing wires for electrical installations all rely on V = IR.",
    },
    {
      q: "Does Ohm's Law apply to all materials?",
      a: "Only to 'ohmic' materials where resistance stays constant regardless of voltage. Semiconductors, diodes, and LEDs are non-ohmic — their resistance changes with voltage.",
    },
  ],
  examples: [
    { title: "LED Circuit (20 mA, 100Ω)", description: "Calculating voltage across an LED resistor", inputs: { I: 0.02, R: 100 }, expected: { V: "2.00" } },
    { title: "Car Headlight (5A, 2.4Ω)", description: "12V car electrical system", inputs: { I: 5, R: 2.4 }, expected: { V: "12.00" } },
    { title: "Household Appliance (10A, 23Ω)", description: "230V mains calculation", inputs: { I: 10, R: 23 }, expected: { V: "230.00" } },
    { title: "Arduino Pin (0.02A, 250Ω)", description: "Microcontroller GPIO current limiting", inputs: { I: 0.02, R: 250 }, expected: { V: "5.00" } },
    { title: "High Resistance (1A, 100Ω)", description: "Measuring across a 100Ω resistor", inputs: { I: 1, R: 100 }, expected: { V: "100.00" } },
  ],
  realWorld: [
    "Electricians size wires and fuses using Ohm's Law to prevent overheating and fires.",
    "PCB designers route traces with specific widths to manage current without excessive voltage drop.",
    "Battery engineers calculate internal resistance to maximise energy delivery efficiency.",
  ],
  relatedSlugs: ["wave-equation-visualizer", "newtons-second-law-visualizer"],
  seo: {
    title: "Ohm's Law V=IR Calculator & Visualizer — QuickCalci Formulas",
    description:
      "Explore V = IR with an animated circuit diagram. Current dots flow around the loop, the resistor glows with R, and voltage updates live.",
  },
};

export default ohmsLaw;
