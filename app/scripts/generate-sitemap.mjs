/**
 * Post-build script: splits Astro's dist/sitemap-*.xml parts into
 * named sitemaps and produces a final sitemap-index.xml.
 *
 * Output files in dist/:
 *   sitemap-formulas.xml  – /tools/<slug>  (index sub-pages)
 *   sitemap-guides.xml    – /tools/<slug>/guide
 *   sitemap-examples.xml  – /tools/<slug>/examples
 *   sitemap-faq.xml       – /tools/<slug>/faq
 *   sitemap-hubs.xml      – /formulas/** and /
 *   sitemap-index.xml     – index pointing to all of the above
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const DIST = join(process.cwd(), "dist");
const SITE = "https://formulaverse.tools";

const parts = readdirSync(DIST)
  .filter((f) => /^sitemap-\d+\.xml$/.test(f))
  .map((f) => readFileSync(join(DIST, f), "utf8"))
  .join("\n");

const urlMatches = [...parts.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
  (m) => m[0],
);

const buckets = {
  formulas: /** @type {string[]} */ ([]),
  guides: /** @type {string[]} */ ([]),
  examples: /** @type {string[]} */ ([]),
  faq: /** @type {string[]} */ ([]),
  hubs: /** @type {string[]} */ ([]),
};

for (const url of urlMatches) {
  const loc = url.match(/<loc>(.*?)<\/loc>/)?.[1] ?? "";
  const bare = loc.replace(/\/$/, "");
  if (bare.includes("/tools/") && bare.endsWith("/guide")) {
    buckets.guides.push(url);
  } else if (bare.includes("/tools/") && bare.endsWith("/examples")) {
    buckets.examples.push(url);
  } else if (bare.includes("/tools/") && bare.endsWith("/faq")) {
    buckets.faq.push(url);
  } else if (bare.includes("/tools/")) {
    buckets.formulas.push(url);
  } else {
    buckets.hubs.push(url);
  }
}

const toXml = (urls) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

const now = new Date().toISOString();
const sitemapFiles = Object.entries(buckets).map(([name, urls]) => {
  const filename = `sitemap-${name}.xml`;
  writeFileSync(join(DIST, filename), toXml(urls));
  console.log(`  ✅ ${filename} (${urls.length} URLs)`);
  return { filename, lastmod: now };
});

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles
  .map(
    ({ filename, lastmod }) =>
      `  <sitemap>\n    <loc>${SITE}/${filename}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>`;

writeFileSync(join(DIST, "sitemap-index.xml"), indexXml);
console.log(`  ✅ sitemap-index.xml (${sitemapFiles.length} sitemaps)`);
