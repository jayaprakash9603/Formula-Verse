import type { FormulaVisualizerConfig } from "../types";

const waveEquation: FormulaVisualizerConfig = {
  slug: "wave-equation-visualizer",
  status: "live",
  name: "Wave Equation",
  latex: "v = f\\lambda",
  shortForm: "v=fλ",
  category: "physics",
  difficulty: "intermediate",
  emoji: "🌊",
  tagline: "Speed, frequency, and wavelength — the rhythm of waves",
  beginnerExplanation:
    "Sound and light travel as waves — like when you shake a jump rope. This tells you how fast the wave runs! More wiggles per second (frequency) means shorter waves. Speed equals how many wiggles times how long each wiggle is.",
  analogy:
    "Picture a jump rope spinning. Spin it faster (higher frequency) and the waves get shorter (smaller wavelength) but the speed the wave travels stays the same as long as the rope material is unchanged.",
  vars: [
    { id: "f", symbol: "f", name: "Frequency", unit: "Hz", defaultValue: 440, min: 20, max: 2000, step: 10, color: "#38bdf8" },
    { id: "lam", symbol: "λ", name: "Wavelength", unit: "m", defaultValue: 0.78, min: 0.01, max: 20, step: 0.01, color: "#8b5cf6" },
  ],
  outputs: [{ id: "v", symbol: "v", name: "Wave Speed", unit: "m/s" }],
  compute: (v) => ({ v: (v.f * v.lam).toFixed(2) }),
  vizSurface: "canvas",
  renderCanvas: (vars, ctx, w, h, ) => {
    const { f, lam } = vars;
    const speed = f * lam;
    const hue = Math.max(0, Math.min(270, 270 - (f / 2000) * 270));
    const waveColor = `hsl(${hue}, 80%, 60%)`;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, h / 2);
    ctx.lineTo(w - 20, h / 2);
    ctx.stroke();

    const t = Date.now() / 1000;
    const waveLen = Math.min(w - 40, Math.max(20, (lam / 20) * (w - 40)));
    const amp = Math.min(50, h / 3);

    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 20; px <= w - 20; px++) {
      const x = px - 20;
      const y = h / 2 + amp * Math.sin((2 * Math.PI * x) / waveLen - t * f * 0.02);
      px === 20 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    const lambdaEndX = 20 + waveLen;
    if (lambdaEndX < w - 20) {
      ctx.beginPath();
      ctx.moveTo(20, h / 2 - amp - 18);
      ctx.lineTo(lambdaEndX, h / 2 - amp - 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(20, h / 2 - amp - 25);
      ctx.lineTo(20, h / 2 - amp - 11);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lambdaEndX, h / 2 - amp - 25);
      ctx.lineTo(lambdaEndX, h / 2 - amp - 11);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = "#8b5cf6";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    if (lambdaEndX < w - 20) {
      ctx.fillText(`λ = ${lam}m`, (20 + lambdaEndX) / 2, h / 2 - amp - 28);
    }

    ctx.fillStyle = waveColor;
    ctx.font = "bold 13px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`v = ${speed.toFixed(0)} m/s`, w / 2, h - 14);
    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`f = ${f} Hz  λ = ${lam} m`, w / 2, h - 0);
  },
  steps: [
    "Adjust the frequency f — higher frequency means shorter wavelength at the same wave speed.",
    "Notice the wave colour shifts from red (low frequency) to violet (high frequency), like a real spectrum.",
    "Adjust the wavelength λ directly using its slider to see how the wave stretches or compresses.",
    "Read the wave speed v = fλ from the result panel in metres per second.",
    "For sound in air (344 m/s), try f=440 Hz and λ=0.78 m — that's middle A!",
  ],
  faq: [
    {
      q: "What determines the speed of a wave?",
      a: "Wave speed is determined by the medium, not the frequency. Sound travels at ~344 m/s in air regardless of pitch. Light travels at c = 3×10⁸ m/s in vacuum.",
    },
    {
      q: "Why does higher frequency mean shorter wavelength?",
      a: "Because v = fλ and v (wave speed) is fixed for a given medium. If f increases, λ must decrease proportionally to keep v constant.",
    },
    {
      q: "Where is v = fλ used in real life?",
      a: "Radio engineers calculate antenna lengths using v = fλ. Sonar systems detect submarines using ultrasound frequencies. Medical ultrasound imaging uses very high-frequency waves with tiny wavelengths.",
    },
  ],
  examples: [
    { title: "Middle A Note (440 Hz, sound)", description: "Musical pitch A4 in air", inputs: { f: 440, lam: 0.78 }, expected: { v: "343.20" } },
    { title: "FM Radio (100 MHz → λ≈3m)", description: "Approximate FM broadcast", inputs: { f: 100, lam: 3 }, expected: { v: "300.00" } },
    { title: "Submarine Sonar (1000 Hz)", description: "Active sonar in seawater (v≈1500 m/s)", inputs: { f: 1000, lam: 1.5 }, expected: { v: "1500.00" } },
    { title: "Earthquake Wave (5 Hz)", description: "Seismic surface wave", inputs: { f: 5, lam: 500 }, expected: { v: "2500.00" } },
    { title: "Ultrasound Imaging (2 MHz)", description: "Medical diagnostic frequency", inputs: { f: 2000, lam: 0.77 }, expected: { v: "1540.00" } },
  ],
  realWorld: [
    "Radio engineers size antennas at exactly half the wavelength of their target frequency.",
    "Musicians tune instruments by adjusting string tension to produce correct frequency-wavelength ratios.",
    "Seismologists identify earthquake type by measuring the frequency and wavelength of seismic waves.",
  ],
  relatedSlugs: ["ohms-law-visualizer", "compound-interest-visualizer"],
  seo: {
    title: "Wave Equation v=fλ Calculator & Visualizer — QuickCalci",
    description:
      "Explore v = fλ with an animated sine wave that shifts colour with frequency. Adjust frequency and wavelength and see wave speed update live.",
  },
};

export default waveEquation;
