# FormulaVerse

Interactive formula visualizers for math, physics, finance, chemistry, and engineering.

**Live site:** https://formulaverse.tools

## Repository layout

```
formulaverse/
├── app/          Astro + React application (source code)
├── README.md     This file
└── .github/      Cloudflare Pages CI/CD workflow
```

All development, build, and deploy commands run from the `app/` directory.

## Quick start

```bash
cd app
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:4321

## Build & deploy

```bash
cd app
npm run build
npm run deploy
```

## Cloudflare Pages

### Option A — GitHub integration (recommended)

1. Push this repo to GitHub.
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select `jayaprakash9603/Formula-Verse`.
4. Configure:

| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Root directory | `app` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` |

5. Deploy. Cloudflare reads `app/wrangler.jsonc` for asset handling.

### Option B — GitHub Actions

The workflow in `.github/workflows/cloudflare-pages.yml` deploys on every push to `main`.

Add these repository secrets in GitHub → **Settings** → **Secrets and variables** → **Actions**:

- `CLOUDFLARE_API_TOKEN` — token with **Cloudflare Pages Edit** permission
- `CLOUDFLARE_ACCOUNT_ID` — from Cloudflare dashboard → **Workers & Pages** → right sidebar

## Documentation

See [app/README.md](app/README.md) for project structure, formula catalog, and SEO details.
