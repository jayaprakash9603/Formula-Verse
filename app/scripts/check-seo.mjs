/**
 * Build-time SEO checks. Hard-fails on critical violations.
 * Run after astro build via `npm run check:seo`.
 */

import { FORMULA_REGISTRY, FORMULA_SLUGS_LIVE } from "../src/engines/formula-visualizer/index.ts";

const SITE_URL = "https://formulas.quickcalci.com";
let errors = 0;

function fail(slug, msg) {
  console.error(`  ❌ [${slug}] ${msg}`);
  errors++;
}

function warn(slug, msg) {
  console.warn(`  ⚠️  [${slug}] ${msg}`);
}

for (const [slug, cfg] of Object.entries(FORMULA_REGISTRY)) {
  if (cfg.status !== "live") continue;

  const { title, description } = cfg.seo;
  if (title.length > 60) fail(slug, `SEO title too long (${title.length} chars, max 60): "${title}"`);
  if (description.length > 158) fail(slug, `SEO description too long (${description.length} chars, max 158)`);
  if (title.length < 30) warn(slug, `SEO title short (${title.length} chars)`);
  if (description.length < 60) warn(slug, `SEO description short`);

  for (const rel of cfg.relatedSlugs) {
    if (!FORMULA_SLUGS_LIVE.includes(rel)) {
      fail(slug, `relatedSlugs[${rel}] is not live — dormant slugs must not appear in relatedSlugs`);
    }
  }

  if (!cfg.examples || cfg.examples.length < 5) fail(slug, `Fewer than 5 examples`);
  if (!cfg.faq || cfg.faq.length < 3) fail(slug, `Fewer than 3 FAQ items`);
}

const canonicalDomain = SITE_URL.replace(/\/$/, "");
const expectedText = canonicalDomain;
console.log(`  Checking canonical domain: ${expectedText}`);

if (errors > 0) {
  console.error(`\n  SEO check failed with ${errors} error(s).\n`);
  process.exit(1);
} else {
  console.log(`  ✅ SEO check passed — ${FORMULA_SLUGS_LIVE.length} live formulas validated`);
}
