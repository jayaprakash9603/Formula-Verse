# QuickCalci Formulas

Interactive formula visualizers for math, physics, finance, chemistry, and engineering.

**Live site:** https://formulas.quickcalci.com

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5.7 (static output) |
| UI | React 19 islands |
| Styling | Tailwind CSS v4 |
| 3D | Three.js · @react-three/fiber · @react-three/drei |
| Math render | KaTeX (CDN) |
| Drawing | rough.js |
| Icons | Lucide React |
| UI primitives | shadcn/ui (Radix UI) |
| Hosting | Cloudflare Pages |

---

## Project Structure

```
src/
  engines/
    formula-visualizer/
      formulas/         ← 12 FormulaVisualizerConfig files
      analogy/          ← roughjs cartoon analogy components
      types.ts          ← FormulaVisualizerConfig type definitions
      index.ts          ← FORMULA_REGISTRY + FORMULA_SLUGS_LIVE
      FormulaVisualizerEngine.tsx   ← main interactive island
      FormulaThreeScene.tsx         ← lazy-loaded 3D scene
      FormulaVisualizationPanel.tsx ← routes to svg/canvas/three
      FormulaVarSliders.tsx         ← slider controls
      FormulaResultCard.tsx         ← animated result display
  components/
    ui/                 ← shadcn primitives
    ads/                ← AdSlot component
    seo/                ← JsonLd.astro
    layout/             ← SiteHeader, SiteFooter, Breadcrumbs
    tool/               ← SubPageNav
  layouts/
    BaseLayout.astro    ← html shell, KaTeX, fonts, meta
    ToolLayout.astro    ← per-tool layout with JSON-LD
  lib/
    formulas.ts         ← getLiveFormulas, getBySlug, etc.
    seo.ts              ← buildBreadcrumbJsonLd, etc.
    site.ts             ← SITE_URL, SITE_NAME constants
  pages/
    index.astro
    about.astro
    privacy.astro
    404.astro
    formulas/
      index.astro       ← formula hub with CollectionPage JSON-LD
      [category].astro  ← math/physics/finance/chemistry/engineering
    tools/
      [slug]/
        index.astro     ← calculator island + SoftwareApplication JSON-LD
        guide.astro     ← HowTo JSON-LD
        examples.astro  ← 5 worked examples
        faq.astro       ← FAQPage JSON-LD
  styles/
    globals.css         ← Tailwind v4 @theme tokens
scripts/
  validate-catalog.mjs  ← pre-build formula catalog validation
  check-seo.mjs         ← pre-build SEO validation
  generate-formula-og.mjs ← OG image generation
  generate-sitemap.mjs  ← post-build sitemap splitting
public/
  _headers    ← Cloudflare security + cache headers
  _redirects  ← /formula/:slug → /tools/:slug aliases
  robots.txt
  manifest.webmanifest
  favicon.svg
  og/         ← generated OG images (1200×630)
```

---

## Development

```bash
# Install
npm install --legacy-peer-deps

# Dev server
npm run dev

# Type check
npm run typecheck

# Validate formula catalog (run before build)
npm run validate:catalog

# Generate OG images
npm run og

# Build (runs validate:catalog + check:seo + og + astro build + sitemap)
npm run build

# Preview build
npm run preview

# Deploy to Cloudflare Pages
npm run deploy
```

---

## Formula Dormancy

Each formula has a `status` field in its config:

```ts
type FormulaStatus = "live" | "dormant" | "retired";
```

- **`live`** — fully visible: routable pages, hub cards, sitemap, search suggestions
- **`dormant`** — hidden: no route generated, excluded from hub, sitemap, and search
- **`retired`** — same as dormant but signals intentional deprecation

To toggle a formula off, change its `status` to `"dormant"` in:
```
src/engines/formula-visualizer/formulas/<slug>.ts
```

The dormancy is enforced at:
1. `getStaticPaths()` — uses `FORMULA_SLUGS_LIVE` → no route generated
2. `getLiveFormulas()` — hub/category pages skip dormant formulas
3. `astro.config.mjs` sitemap filter — dormant slugs excluded from sitemap
4. `validate-catalog.mjs` — blocks dormant slugs from `relatedSlugs`

---

## Adding a New Formula

1. Create `src/engines/formula-visualizer/formulas/<slug>.ts` implementing `FormulaVisualizerConfig`
2. Add it to the registry in `src/engines/formula-visualizer/index.ts`
3. Run `npm run validate:catalog` to verify it passes all checks
4. Set `status: 'live'` when ready to publish

---

## Cloudflare Deployment

```bash
# First deploy (creates the project)
npx wrangler pages project create quickcalci-formulas

# Deploy after build
npm run deploy
```

### GitHub → Cloudflare Pages

Connect your GitHub repository in the Cloudflare dashboard and add custom domain `formulas.quickcalci.com`:

| Setting | Value |
|---------|-------|
| Root directory | `/` (repository root) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` |

Or use the GitHub Actions workflow (`.github/workflows/cloudflare-pages.yml`) with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.

---

## SEO

Each live formula generates 5 routes:
- `/tools/<slug>` — visualizer + SoftwareApplication JSON-LD
- `/tools/<slug>/explain` — full explanation page
- `/tools/<slug>/guide` — HowTo JSON-LD
- `/tools/<slug>/examples` — 5 worked examples
- `/tools/<slug>/faq` — FAQPage JSON-LD

Sitemap is split into named files:
- `sitemap-formulas.xml` · `sitemap-guides.xml` · `sitemap-examples.xml`
- `sitemap-faq.xml` · `sitemap-hubs.xml` · `sitemap-index.xml`

### AdSense Integration

Set this before the `<head>` closes on pages where ads should show:
```html
<script>window.__fvAdsenseClient = "ca-pub-XXXXXXXXXXXXXXXX";</script>
```

Then pass `slotId` to each `<AdSlot>` component.
