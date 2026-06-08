/**
 * Build-time catalog validation. Fails with non-zero exit code on any violation.
 * Run before astro build via `npm run validate:catalog`.
 */

import { FORMULA_REGISTRY } from "../src/engines/formula-visualizer/index.ts";

const VALID_STATUSES = ["live", "dormant", "retired"];
const VALID_SURFACES = ["svg", "canvas", "three"];
const REQUIRED_EXAMPLES = 5;
const MIN_FAQ = 3;
const MIN_RELATED = 2;
const MIN_VARS = 1;

let errors = 0;

function fail(slug, msg) {
  console.error(`  ❌ [${slug}] ${msg}`);
  errors++;
}

for (const [slug, cfg] of Object.entries(FORMULA_REGISTRY)) {
  if (!VALID_STATUSES.includes(cfg.status)) fail(slug, `Invalid status: ${cfg.status}`);
  if (!VALID_SURFACES.includes(cfg.vizSurface)) fail(slug, `Invalid vizSurface: ${cfg.vizSurface}`);
  if (!cfg.vars || cfg.vars.length < MIN_VARS) fail(slug, `Needs at least ${MIN_VARS} var`);
  if (!cfg.examples || cfg.examples.length < REQUIRED_EXAMPLES) fail(slug, `Needs ${REQUIRED_EXAMPLES} examples, has ${cfg.examples?.length ?? 0}`);
  if (!cfg.faq || cfg.faq.length < MIN_FAQ) fail(slug, `Needs ${MIN_FAQ} FAQ items, has ${cfg.faq?.length ?? 0}`);
  if (!cfg.relatedSlugs || cfg.relatedSlugs.length < MIN_RELATED) fail(slug, `Needs ${MIN_RELATED} relatedSlugs, has ${cfg.relatedSlugs?.length ?? 0}`);
  if (cfg.vizSurface === "svg" && !cfg.renderSVG) fail(slug, `vizSurface=svg but no renderSVG`);
  if (cfg.vizSurface === "canvas" && !cfg.renderCanvas) fail(slug, `vizSurface=canvas but no renderCanvas`);
  if (!cfg.seo?.title) fail(slug, `Missing seo.title`);
  if (!cfg.seo?.description) fail(slug, `Missing seo.description`);

  for (const relSlug of cfg.relatedSlugs) {
    if (!FORMULA_REGISTRY[relSlug]) fail(slug, `relatedSlugs contains unknown slug: ${relSlug}`);
    if (FORMULA_REGISTRY[relSlug]?.status !== "live") fail(slug, `relatedSlugs contains non-live slug: ${relSlug}`);
  }
}

if (errors > 0) {
  console.error(`\n  Catalog validation failed with ${errors} error(s).\n`);
  process.exit(1);
} else {
  console.log(`  ✅ Catalog validated — ${Object.keys(FORMULA_REGISTRY).length} formulas OK`);
}
