import type { FormulaVisualizerConfig } from "../types";

const compoundInterest: FormulaVisualizerConfig = {
  slug: "compound-interest-visualizer",
  status: "live",
  name: "Compound Interest",
  latex: "A = P\\left(1+\\frac{r}{n}\\right)^{nt}",
  shortForm: "P(1+r/n)^nt",
  category: "finance",
  difficulty: "intermediate",
  emoji: "💰",
  tagline: "Money that makes money on its money",
  beginnerExplanation:
    "If you put money in a bank and the bank gives you free money every year on top of previous free money — it snowballs! After many years, the extra growth is enormous compared to if you only earned interest on the original amount.",
  analogy:
    "Imagine a snowball rolling down a hill. Simple interest is adding a handful of snow each year from the bottom. Compound interest is the snowball rolling — it picks up snow faster and faster because the ball itself gets bigger.",
  vars: [
    { id: "P", symbol: "P", name: "Principal", unit: "$", defaultValue: 10000, min: 100, max: 100000, step: 100, color: "#6366f1" },
    { id: "r", symbol: "r", name: "Annual Rate (%)", unit: "%", defaultValue: 8, min: 0.1, max: 30, step: 0.1, color: "#34d399" },
    { id: "n", symbol: "n", name: "Compounds/Year", unit: "", defaultValue: 12, min: 1, max: 365, step: 1, color: "#f59e0b" },
    { id: "t", symbol: "t", name: "Time (Years)", unit: "yr", defaultValue: 10, min: 1, max: 40, step: 1, color: "#8b5cf6" },
  ],
  outputs: [{ id: "A", symbol: "A", name: "Final Amount", unit: "$" }],
  compute: (v) => {
    const A = v.P * (1 + v.r / 100 / v.n) ** (v.n * v.t);
    const simple = v.P * (1 + v.r / 100 * v.t);
    return {
      A: A.toFixed(2),
      gain: (A - v.P).toFixed(2),
      extra: (A - simple).toFixed(2),
    };
  },
  vizSurface: "canvas",
  renderCanvas: (vars, ctx, w, h) => {
    const { P, r, n, t } = vars;
    const maxA = P * (1 + r / 100 / n) ** (n * t);
    const padL = 50, padR = 20, padT = 20, padB = 40;
    const chartW = w - padL - padR;
    const chartH = h - padT - padB;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + chartH);
    ctx.lineTo(padL + chartW, padT + chartH);
    ctx.stroke();

    const step = Math.max(1, Math.floor(t / 10));
    for (let yr = 0; yr <= t; yr += step) {
      const compound = P * (1 + r / 100 / n) ** (n * yr);
      const simple = P * (1 + r / 100 * yr);
      const x = padL + (yr / t) * chartW;
      const cH = (compound / maxA) * chartH;
      const sH = (simple / maxA) * chartH;
      const barW = Math.max(3, (chartW / t) * step * 0.6);

      ctx.fillStyle = "rgba(99,102,241,0.5)";
      ctx.beginPath();
      ctx.roundRect(x - barW / 2, padT + chartH - sH, barW, sH, 2);
      ctx.fill();

      ctx.fillStyle = "rgba(52,211,153,0.8)";
      ctx.beginPath();
      ctx.roundRect(x - barW / 2 + 2, padT + chartH - cH, barW - 4, cH, 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(52,211,153,0.8)";
    ctx.fillRect(padL + 5, padT + 5, 10, 10);
    ctx.fillStyle = "#34d399";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Compound", padL + 18, padT + 14);

    ctx.fillStyle = "rgba(99,102,241,0.5)";
    ctx.fillRect(padL + 90, padT + 5, 10, 10);
    ctx.fillStyle = "#6366f1";
    ctx.fillText("Simple", padL + 103, padT + 14);

    ctx.fillStyle = "#64748b";
    ctx.font = "10px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`$${P.toLocaleString()} → $${maxA.toFixed(0)} in ${t}yr`, padL + chartW / 2, h - 6);
  },
  steps: [
    "Set the principal P — the starting amount you invest or deposit.",
    "Set the annual interest rate r as a percentage.",
    "Choose how many times per year interest compounds (n=12 for monthly, 365 for daily).",
    "Set the number of years t and watch the compound growth bars (green) tower over simple interest bars (indigo).",
    "The 'extra' field in the result shows how much MORE you earn vs simple interest.",
  ],
  faq: [
    {
      q: "What is the difference between compound and simple interest?",
      a: "Simple interest is calculated only on the principal. Compound interest is calculated on the principal plus all previously earned interest, so it grows exponentially over time.",
    },
    {
      q: "What does compounding frequency n affect?",
      a: "The more frequently interest compounds, the faster your money grows. Daily compounding (n=365) gives slightly more than annual (n=1), but the rate r has a much bigger impact than n.",
    },
    {
      q: "What is the Rule of 72?",
      a: "Dividing 72 by the annual interest rate gives the approximate years to double your money. At 8% annual, 72÷8 = 9 years to double — a quick mental shortcut for compound interest.",
    },
  ],
  examples: [
    { title: "Retirement Savings (30 years)", description: "$10,000 at 7% monthly compound", inputs: { P: 10000, r: 7, n: 12, t: 30 }, expected: { A: "81164.93" } },
    { title: "Short-term (5 years, 5%)", description: "Conservative savings account", inputs: { P: 5000, r: 5, n: 12, t: 5 }, expected: { A: "6416.79" } },
    { title: "High-rate (10 years, 12%)", description: "Aggressive investment scenario", inputs: { P: 10000, r: 12, n: 12, t: 10 }, expected: { A: "33003.87" } },
    { title: "Daily Compounding", description: "Maximum compounding frequency", inputs: { P: 10000, r: 8, n: 365, t: 10 }, expected: { A: "22253.46" } },
    { title: "Annual Compounding", description: "Simple annual compound", inputs: { P: 10000, r: 8, n: 1, t: 10 }, expected: { A: "21589.25" } },
  ],
  realWorld: [
    "Retirement funds use compound interest to project 40-year growth forecasts for pension planning.",
    "Credit card debt compounds monthly — a $5,000 balance at 20% APR doubles in under 4 years.",
    "Warren Buffett's wealth is almost entirely the result of compound interest applied over 60+ years.",
  ],
  relatedSlugs: ["wave-equation-visualizer", "sphere-volume-visualizer"],
  seo: {
    title: "Compound Interest Calculator & Visualizer — FormulaVerse",
    description:
      "Visualize A = P(1+r/n)^(nt) with an animated bar chart. Compare compound vs simple interest growth year by year.",
  },
};

export default compoundInterest;
