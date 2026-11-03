# gavinf-dash

The personal sites on `gavinf.com`: the landing page, the dashboard, and the docs site. Two
Cloudflare Workers from one repo:

| Worker | Source | Hosts |
|---|---|---|
| `gavinf-dash` | repo root (`src/`, `worker.js`) | `gavinf.com`, `dash`, `auth` (redirect) |
| `gavinf-docs` | `docs/` (Astro + Starlight) | `docs.gavinf.com` |

The docs were a separate `gavinf-docs` repo; they were merged in with `git subtree`, so their
history is preserved under `docs/`. They keep their own `package.json` and `wrangler.json` and
deploy independently.

## Hosts

| Host | Serves |
|---|---|
| `gavinf.com` | landing page |
| `dash.gavinf.com` | bookmarks to every service; static, no sign-in |
| `auth.gavinf.com` | 301 to `dash.gavinf.com` (it was the Clerk sign-in portal) |
| `docs.gavinf.com` | docs — see `docs/README.md` |

Both pages are static and ship no JavaScript. There's no sign-in here: each service behind a
dashboard card does its own (homecloud, easydocs, ...). To add a service, add it to `GROUPS`
in `src/pages/dash.astro`. Cards marked `tailnet` (Proxmox, Argo CD) only open from a device
on the tailnet.

## Local development

```bash
npm install
npm run dev                  # http://localhost:4321 (and /dash/)

npm --prefix docs install
npm run docs:dev             # http://localhost:4322
```

## Deploy

```bash
npm run deploy               # gavinf-dash: build + wrangler deploy
npm run docs:deploy          # gavinf-docs
```

Or connect the repo under Workers & Pages → gavinf-dash → Settings → Builds
with build `npm run build`, deploy `npx wrangler deploy`, path `/`. Do the same
for gavinf-docs with path `/docs`.
