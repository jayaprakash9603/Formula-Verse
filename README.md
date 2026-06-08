# QuickCalci Formulas

Interactive formula visualizers for math, physics, finance, chemistry, and engineering.

**Live site:** https://formulas.quickcalci.com

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
3. Select your repository.
4. Configure:

| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Root directory | `app` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` |

5. Add custom domain: `formulas.quickcalci.com`

### Option B — GitHub Actions

The workflow in `.github/workflows/cloudflare-pages.yml` deploys on every push to `main`.

Add these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Documentation

See [app/README.md](app/README.md) for project structure, formula catalog, and SEO details.
