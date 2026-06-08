import type { FormulaVisualizerConfig } from "../types";

const quadratic: FormulaVisualizerConfig = {
  slug: "quadratic-formula-visualizer",
  status: "live",
  name: "Quadratic Formula",
  latex: "x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  shortForm: "(-b±√Δ)/2a",
  category: "math",
  difficulty: "intermediate",
  emoji: "📈",
  tagline: "Find where the parabola meets the ground",
  beginnerExplanation:
    "This finds where a U-shaped curve crosses the ground — like where a thrown ball lands! Put in three numbers and it tells you exactly where the curve touches zero. When there are no real crossings, the ball never lands.",
  analogy:
    "Picture throwing a ball in the air. The path it takes is a parabola. This formula tells you exactly where the ball will land on both sides of the throw — the two roots are the two landing spots.",
  vars: [
    { id: "a", symbol: "a", name: "a (x² coefficient)", unit: "", defaultValue: 1, min: -5, max: 5, step: 0.5, color: "#6366f1" },
    { id: "b", symbol: "b", name: "b (x coefficient)", unit: "", defaultValue: -3, min: -10, max: 10, step: 0.5, color: "#8b5cf6" },
    { id: "c", symbol: "c", name: "c (constant)", unit: "", defaultValue: 2, min: -10, max: 10, step: 0.5, color: "#34d399" },
  ],
  outputs: [{ id: "x", symbol: "x", name: "Roots", unit: "" }],
  compute: (v) => {
    const d = v.b ** 2 - 4 * v.a * v.c;
    if (v.a === 0) return { x: "a cannot be zero", discriminant: "undefined" };
    if (d < 0) return { x: "No real roots", discriminant: d.toFixed(2) };
    const sq = Math.sqrt(d);
    const x1 = (-v.b + sq) / (2 * v.a);
    const x2 = (-v.b - sq) / (2 * v.a);
    return { x: `${x1.toFixed(3)}, ${x2.toFixed(3)}`, discriminant: d.toFixed(2) };
  },
  vizSurface: "canvas",
  renderCanvas: (vars, ctx, w, h) => {
    const { a, b, c } = vars;
    const ox = w / 2, oy = h / 2;
    const sx = 18, sy = 10;

    // Detect dark/light mode from document
    const isDark = typeof document !== "undefined"
      && document.documentElement.classList.contains("dark");
    const axisColor  = isDark ? "#334155" : "#cbd5e1";
    const labelColor = isDark ? "#64748b" : "#94a3b8";
    const gridColor  = isDark ? "#1e293b" : "#f1f5f9";

    ctx.clearRect(0, 0, w, h);

    // Subtle grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let gx = ox % sx; gx < w; gx += sx) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
    }
    for (let gy = oy % sy * 2; gy < h; gy += sy * 2) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(20, oy); ctx.lineTo(w - 20, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 10); ctx.lineTo(ox, h - 10); ctx.stroke();

    // Axis arrow heads
    ctx.fillStyle = axisColor;
    ctx.beginPath(); ctx.moveTo(w - 20, oy); ctx.lineTo(w - 28, oy - 4); ctx.lineTo(w - 28, oy + 4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox, 10); ctx.lineTo(ox - 4, 18); ctx.lineTo(ox + 4, 18); ctx.fill();

    // Parabola with glow
    ctx.save();
    ctx.shadowColor = "#818cf855";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.beginPath();
    let first = true;
    for (let px = 20; px <= w - 20; px++) {
      const xv = (px - ox) / sx;
      const yv = a * xv ** 2 + b * xv + c;
      const py = oy - yv * sy;
      if (py < 4 || py > h - 4) { first = true; continue; }
      first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      first = false;
    }
    ctx.stroke();
    ctx.restore();

    const d = b ** 2 - 4 * a * c;
    if (d >= 0 && a !== 0) {
      const sq = Math.sqrt(d);
      const r1 = (-b + sq) / (2 * a);
      const r2 = (-b - sq) / (2 * a);
      [r1, r2].forEach((rx) => {
        const px = ox + rx * sx;
        ctx.save();
        ctx.shadowColor = "#34d39966";
        ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(px, oy, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#34d399"; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();
        ctx.fillStyle = "#34d399";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(rx.toFixed(1), px, oy + 20);
      });

      const vx = -b / (2 * a);
      const vy = a * vx ** 2 + b * vx + c;
      const vpx = ox + vx * sx, vpy = oy - vy * sy;
      if (vpy > 10 && vpy < h - 10) {
        ctx.save();
        ctx.shadowColor = "#f59e0b88";
        ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(vpx, vpy, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = "#f59e0b"; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();
        ctx.strokeStyle = "#f59e0b55";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(vpx, vpy); ctx.lineTo(vpx, oy); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#f59e0b";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`vertex (${vx.toFixed(1)}, ${vy.toFixed(1)})`, vpx, vpy > oy ? vpy + 16 : vpy - 10);
      }
    } else if (a !== 0) {
      ctx.fillStyle = "#f87171";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("No real roots (Δ < 0)", ox, h - 18);
    }

    ctx.fillStyle = labelColor;
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("x", w - 14, oy - 6);
    ctx.textAlign = "left";
    ctx.fillText("y", ox + 7, 20);
  },
  steps: [
    "Enter coefficient a (controls the width and direction of the parabola) using the slider.",
    "Enter coefficient b (shifts the parabola left or right) using the slider.",
    "Enter constant c (raises or lowers the parabola) using the slider.",
    "Green dots appear where the parabola crosses x = 0 (the roots). If no dots appear, there are no real solutions.",
    "The orange dot marks the vertex — the highest or lowest point of the parabola.",
  ],
  faq: [
    {
      q: "What does the discriminant (b²−4ac) tell me?",
      a: "If it's positive, there are two real roots. If it equals zero, there's exactly one root (the vertex touches zero). If negative, there are no real roots — the parabola doesn't cross the x-axis.",
    },
    {
      q: "Why does the parabola flip when a is negative?",
      a: "A negative coefficient a means the parabola opens downward (like a frown). Positive a opens it upward (like a smile). This is why the sign of a determines whether the vertex is a minimum or maximum.",
    },
    {
      q: "Where is the quadratic formula used in real life?",
      a: "Projectile motion in physics, profit maximization in economics, signal processing in engineering, and lens curvature in optics all rely on solving quadratic equations.",
    },
  ],
  examples: [
    { title: "Two Real Roots", description: "Classic case with two solutions", inputs: { a: 1, b: -3, c: 2 }, expected: { x: "2.000, 1.000" } },
    { title: "One Root (Perfect Square)", description: "Parabola just touches the axis", inputs: { a: 1, b: -4, c: 4 }, expected: { x: "2.000, 2.000" } },
    { title: "No Real Roots", description: "Parabola above x-axis entirely", inputs: { a: 1, b: 0, c: 1 }, expected: { x: "No real roots" } },
    { title: "Projectile Landing", description: "Ball thrown at 20m/s from height 5m", inputs: { a: -4.9, b: 20, c: 5 }, expected: { x: "4.318, -0.236" } },
    { title: "Profit Maximization", description: "Finding breakeven points", inputs: { a: -2, b: 10, c: -8 }, expected: { x: "4.000, 1.000" } },
  ],
  realWorld: [
    "Physics teachers use it to find when a projectile hits the ground.",
    "Economists solve quadratic profit functions to find breakeven prices.",
    "Structural engineers model cable sag in suspension bridges as parabolas.",
  ],
  relatedSlugs: ["pythagorean-theorem-visualizer", "wave-equation-visualizer"],
  seo: {
    title: "Quadratic Formula Calculator & Visualizer — QuickCalci",
    description:
      "Visualize x = (−b ± √(b²−4ac)) / 2a with an animated interactive parabola. See roots as glowing dots and the vertex in real time.",
  },
};

export default quadratic;
