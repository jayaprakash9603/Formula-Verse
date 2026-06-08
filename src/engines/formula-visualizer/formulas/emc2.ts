import type { FormulaVisualizerConfig } from "../types";

const C_SQUARED = 89875517873681764;

const emc2: FormulaVisualizerConfig = {
  slug: "einsteins-emc2-visualizer",
  status: "live",
  featured: true,
  name: "Einstein's E=mc²",
  latex: "E = mc^2",
  shortForm: "E=mc²",
  category: "physics",
  difficulty: "beginner",
  emoji: "⚡",
  tagline: "Mass and energy are the same thing in disguise",
  beginnerExplanation:
    "Even a tiny piece of chocolate holds as much energy as a huge bomb — Einstein proved that mass and energy are the same thing in disguise! A single gram of anything contains enough energy to power a city for hours.",
  analogy:
    "Imagine a tiny compressed spring. The spring looks small but when you release it, it shoots across the room with enormous force. Mass is like the compressed spring — it holds unimaginable energy just waiting to be released.",
  vars: [
    {
      id: "m",
      symbol: "m",
      name: "Mass",
      unit: "kg",
      defaultValue: 0.001,
      min: 0.0001,
      max: 0.1,
      step: 0.0001,
      color: "#60a5fa",
    },
  ],
  outputs: [{ id: "E", symbol: "E", name: "Energy", unit: "J" }],
  compute: (v) => ({ E: (v.m * C_SQUARED).toExponential(4) }),
  vizSurface: "canvas",
  renderCanvas: (vars, ctx, w, h) => {
    const { m } = vars;
    const E = m * C_SQUARED;
    const logRatio = Math.log10(E / m);

    ctx.clearRect(0, 0, w, h);

    const massH = Math.min(80, m * 800000);
    const massX = 60, massY = h - 60;
    ctx.fillStyle = "rgba(96,165,250,0.25)";
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(massX, massY - massH, 50, massH, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("m", massX + 25, massY - massH - 8);
    ctx.font = "10px JetBrains Mono, monospace";
    ctx.fillText(`${m.toFixed(4)} kg`, massX + 25, massY + 16);

    const energyH = Math.min(160, 20 + logRatio * 8);
    const energyX = 180;
    const gradient = ctx.createLinearGradient(energyX, massY - energyH, energyX, massY);
    gradient.addColorStop(0, "rgba(251,191,36,0.8)");
    gradient.addColorStop(1, "rgba(251,191,36,0.15)");
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(energyX, massY - energyH, 80, energyH, 4);
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const len = 12 + Math.random() * 8;
      const rx = energyX + 40 + Math.cos(angle) * (40 + len);
      const ry = massY - energyH / 2 + Math.sin(angle) * (energyH / 2 + len);
      ctx.strokeStyle = `rgba(251,191,36,${0.3 + Math.random() * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(energyX + 40 + Math.cos(angle) * 40, massY - energyH / 2 + Math.sin(angle) * energyH / 2);
      ctx.lineTo(rx, ry);
      ctx.stroke();
    }

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("E = mc²", energyX + 40, massY - energyH - 8);
    ctx.font = "10px JetBrains Mono, monospace";
    ctx.fillText(E.toExponential(2) + " J", energyX + 40, massY + 16);

    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(massX + 50, massY - massH / 2);
    ctx.lineTo(energyX, massY - energyH / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#64748b";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`× ${(logRatio).toFixed(0)} orders`, (massX + 50 + energyX) / 2, massY - Math.max(massH, energyH) / 2 - 12);
  },
  steps: [
    "Adjust the mass m slider to set the amount of material (in kilograms).",
    "The left bar shows the relative mass — even at maximum it appears tiny.",
    "The right glowing bar shows the resulting energy, on a logarithmic scale.",
    "Read the exact energy value in Joules (exponential notation) from the result panel.",
    "Compare the two bars to feel the incredible conversion ratio of c² ≈ 9×10¹⁶.",
  ],
  faq: [
    {
      q: "What does c represent in E=mc²?",
      a: "c is the speed of light: approximately 299,792,458 metres per second. Squaring it gives an enormous multiplier (~9×10¹⁶), which is why even tiny masses contain colossal energy.",
    },
    {
      q: "Where is E=mc² applied in real life?",
      a: "Nuclear power plants, atomic weapons, PET scan machines (medical imaging), and the fusion reactions powering the Sun all convert mass directly into energy.",
    },
    {
      q: "Can we actually convert mass to energy completely?",
      a: "Matter-antimatter annihilation achieves 100% conversion. Nuclear fission and fusion convert only a small fraction (~0.1%) of mass, but that fraction is already enormous.",
    },
  ],
  examples: [
    { title: "A Paper Clip (1 g)", description: "Energy locked in a tiny mass", inputs: { m: 0.001 }, expected: { E: "8.9876e+13" } },
    { title: "A Grain of Rice (30 mg)", description: "Even microscopic amounts pack a punch", inputs: { m: 0.00003 }, expected: { E: "2.6963e+12" } },
    { title: "A Drop of Water (0.05 g)", description: "Water droplet energy content", inputs: { m: 0.00005 }, expected: { E: "4.4938e+12" } },
    { title: "A Coin (10 g)", description: "Energy in a standard coin", inputs: { m: 0.01 }, expected: { E: "8.9876e+14" } },
    { title: "Maximum slider (100 g)", description: "Energy in 100 grams", inputs: { m: 0.1 }, expected: { E: "8.9876e+15" } },
  ],
  realWorld: [
    "Nuclear reactors convert about 0.1% of uranium mass into usable electricity using E=mc².",
    "PET scanners detect cancer by tracking positron-electron annihilation — pure mass-to-energy conversion.",
    "The Sun fuses 600 million tonnes of hydrogen per second, with 4 million tonnes converted to pure energy.",
  ],
  relatedSlugs: ["newtons-second-law-visualizer", "kinetic-energy-visualizer"],
  seo: {
    title: "Einstein's E=mc² Calculator & Visualizer — QuickCalci",
    description:
      "Explore mass-energy equivalence with a live animated visualizer. Adjust mass and see the energy output on a logarithmic scale with glowing rays.",
  },
};

export default emc2;
