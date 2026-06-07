/**
 * Generates 1200×630 OG images for each live formula using sharp.
 * Output: public/og/<slug>.png
 * Skips dormant/retired formulas.
 */

import sharp from "sharp";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";
import { FORMULA_REGISTRY, FORMULA_SLUGS_LIVE } from "../src/engines/formula-visualizer/index.ts";

const OUT_DIR = join(process.cwd(), "public", "og");
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const CATEGORY_COLORS = {
  math: "#a78bfa",
  physics: "#60a5fa",
  finance: "#34d399",
  chemistry: "#fb923c",
  engineering: "#38bdf8",
};

async function generateOg(config) {
  const color = CATEGORY_COLORS[config.category] ?? "#8b5cf6";
  const bgColor = "#0a0a14";
  const w = 1200, h = 630;

  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${w}" height="${h}" fill="${bgColor}"/>
      <rect x="0" y="0" width="6" height="${h}" fill="${color}"/>
      <rect x="0" y="${h - 4}" width="${w}" height="4" fill="${color}20"/>
      <text x="60" y="100" fill="${color}" font-size="48" font-family="system-ui" font-weight="bold">${config.emoji}</text>
      <text x="120" y="100" fill="white" font-size="44" font-family="system-ui" font-weight="bold">${escapeXml(config.name)}</text>
      <text x="60" y="160" fill="${color}cc" font-size="32" font-family="ui-monospace, monospace">${escapeXml(config.shortForm)}</text>
      <text x="60" y="240" fill="#94a3b8" font-size="28" font-family="system-ui">${escapeXml(config.tagline.slice(0, 60))}</text>
      <rect x="60" y="380" width="${w - 120}" height="2" fill="${color}30"/>
      <text x="60" y="440" fill="#94a3b8" font-size="22" font-family="system-ui">formulaverse.tools</text>
      <text x="${w - 60}" y="440" fill="${color}" font-size="22" font-family="system-ui" text-anchor="end">FormulaVerse</text>
    </svg>
  `;

  const outPath = join(OUT_DIR, `${config.slug}.png`);
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`  ✅ ${config.slug}.png`);
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Also generate a default OG
const defaultSvg = `
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#0a0a14"/>
    <text x="600" y="280" fill="white" font-size="72" font-family="system-ui" font-weight="bold" text-anchor="middle">🌐 FormulaVerse</text>
    <text x="600" y="360" fill="#94a3b8" font-size="32" font-family="system-ui" text-anchor="middle">Interactive Formula Visualizers</text>
    <text x="600" y="430" fill="#8b5cf6" font-size="24" font-family="system-ui" text-anchor="middle">formulaverse.tools</text>
  </svg>
`;
await sharp(Buffer.from(defaultSvg)).png().toFile(join(OUT_DIR, "default.png"));
console.log("  ✅ default.png");

for (const slug of FORMULA_SLUGS_LIVE) {
  await generateOg(FORMULA_REGISTRY[slug]);
}

console.log(`\n  Generated ${FORMULA_SLUGS_LIVE.length + 1} OG images in public/og/`);
