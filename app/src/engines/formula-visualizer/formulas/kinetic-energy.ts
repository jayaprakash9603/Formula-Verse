import type { FormulaVisualizerConfig } from "../types";

const kineticEnergy: FormulaVisualizerConfig = {
  slug: "kinetic-energy-visualizer",
  status: "live",
  name: "Kinetic Energy",
  latex: "KE = \\frac{1}{2}mv^2",
  shortForm: "½mv²",
  category: "physics",
  difficulty: "beginner",
  emoji: "⚽",
  tagline: "The energy of motion — grows fast with speed",
  beginnerExplanation:
    "A bowling ball rolling fast is dangerous! This tells you exactly how much 'ouch' is in a moving object. Speed matters way more than mass — double your speed and you have four times the kinetic energy.",
  analogy:
    "Think of a playground swing. Pumping your legs makes it go faster, and the faster it swings, the harder it is to stop. That growing danger you feel is kinetic energy — and it grows with the square of speed.",
  vars: [
    { id: "m", symbol: "m", name: "Mass", unit: "kg", defaultValue: 70, min: 1, max: 200, step: 1, color: "#60a5fa" },
    { id: "v", symbol: "v", name: "Velocity", unit: "m/s", defaultValue: 10, min: 0.5, max: 100, step: 0.5, color: "#f59e0b" },
  ],
  outputs: [{ id: "KE", symbol: "KE", name: "Kinetic Energy", unit: "J" }],
  compute: (v) => ({ KE: (0.5 * v.m * v.v ** 2).toFixed(2) }),
  vizSurface: "canvas",
  renderCanvas: (vars, ctx, w, h) => {
    const { m, v: vel } = vars;
    const KE = 0.5 * m * vel ** 2;
    const speed = Math.min(1, vel / 100);
    const r = Math.max(18, Math.min(40, 10 + m * 0.15));

    ctx.clearRect(0, 0, w, h);

    const trailLen = Math.min(w - r - 40, 20 + vel * 2);
    const ballX = 60 + trailLen;
    const ballY = h / 2;

    const gradient = ctx.createLinearGradient(ballX - trailLen, ballY, ballX, ballY);
    gradient.addColorStop(0, "rgba(99,102,241,0)");
    gradient.addColorStop(1, `rgba(${Math.round(speed * 248 + 96)},${Math.round((1 - speed) * 165)},${Math.round((1 - speed) * 250)},0.5)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(ballX - trailLen, ballY - r / 2, trailLen, r);

    const ballColor = `hsl(${220 - speed * 180}, 80%, 60%)`;
    ctx.beginPath();
    ctx.arc(ballX, ballY, r, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${r > 25 ? 12 : 9}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(`${m}kg`, ballX, ballY + 4);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${vel} m/s →`, ballX, ballY - r - 8);

    const maxKE = 0.5 * 200 * 100 ** 2;
    const barW = Math.min(w - 80, (KE / maxKE) * (w - 80));
    const barY = h - 50;
    ctx.fillStyle = "rgba(251,191,36,0.2)";
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(40, barY, barW, 18, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 12px JetBrains Mono, monospace";
    ctx.textAlign = "left";
    ctx.fillText(`KE = ${KE.toFixed(0)} J`, 44, barY + 13);
  },
  steps: [
    "Set the mass m of the object (heavier objects store more kinetic energy at the same speed).",
    "Adjust the velocity v — notice the energy grows as the square of speed, not linearly.",
    "The ball in the visualizer changes colour from blue (slow) to red (fast) as velocity increases.",
    "The trail length behind the ball shows relative speed, and the bar at the bottom shows energy.",
    "Read the kinetic energy in Joules from the result panel.",
  ],
  faq: [
    {
      q: "Why is velocity squared in the formula?",
      a: "Kinetic energy relates to the work done to bring an object to speed. Because work = force × distance, and both force and stopping distance double when speed doubles, the result is proportional to v².",
    },
    {
      q: "What happens to kinetic energy in a collision?",
      a: "In elastic collisions, total KE is conserved. In inelastic collisions (like car crashes), KE converts to heat, sound, and deformation — which is why faster crashes are so much more destructive.",
    },
    {
      q: "How does kinetic energy relate to speed limits?",
      a: "A car at 60 mph has four times the kinetic energy of one at 30 mph. This is why stopping distance quadruples with doubled speed, making speed limits a life-safety calculation.",
    },
  ],
  examples: [
    { title: "Cyclist at 10 m/s", description: "Typical cycling speed", inputs: { m: 80, v: 10 }, expected: { KE: "4000.00" } },
    { title: "Tennis Ball Serve", description: "Fast serve at 50 m/s", inputs: { m: 0.057, v: 50 }, expected: { KE: "71.25" } },
    { title: "Car at 30 m/s (108 km/h)", description: "Highway speed kinetic energy", inputs: { m: 1400, v: 30 }, expected: { KE: "630000.00" } },
    { title: "Bullet (0.01 kg, 900 m/s)", description: "Rifle bullet in flight", inputs: { m: 0.01, v: 90 }, expected: { KE: "4050.00" } },
    { title: "Falling Skydiver", description: "Before parachute opens", inputs: { m: 80, v: 55 }, expected: { KE: "121000.00" } },
  ],
  realWorld: [
    "Vehicle crash test engineers use KE = ½mv² to design crumple zones that absorb impact energy.",
    "Wind turbine designers optimise blade mass and tip speed to maximise energy harvest from wind.",
    "Roller coaster engineers calculate the kinetic energy at each valley to ensure safe loop clearance.",
  ],
  relatedSlugs: ["newtons-second-law-visualizer", "einsteins-emc2-visualizer"],
  seo: {
    title: "Kinetic Energy KE=½mv² Visualizer — FormulaVerse",
    description:
      "Visualize KE = ½mv² with an animated rolling ball that changes colour with speed. See how velocity squared makes energy grow explosively.",
  },
};

export default kineticEnergy;
