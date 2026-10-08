# gavinf-dash

The personal sites on `gavinf.com` — landing page, Clerk auth portal,
dashboard, and the docs site. Two Cloudflare Workers from one repo:

| Worker | Source | Hosts |
|---|---|---|
| `gavinf-dash` | repo root (`src/`, `worker.js`) | `gavinf.com`, `auth`, `dash` |
| `gavinf-docs` | `docs/` (Astro + Starlight) | `docs.gavinf.com` |

`homecloud.gavinf.com` is `gavinf-homecloud`, in the `homecloud` repo.

The docs were a separate `gavinf-docs` repo; they were merged in with
`git subtree`, so their history is preserved under `docs/`. They keep their
own `package.json` and `wrangler.json` and deploy independently.

## Hosts

| Host | Serves |
|---|---|
| `gavinf.com` | landing page |
| `auth.gavinf.com` | Clerk sign-in portal |
| `dash.gavinf.com` | dashboard (signed-in only) |
| `docs.gavinf.com` | docs — see `docs/README.md` |

`worker.js` maps each portal hostname to its prerendered Astro page. Locally,
visit `/auth/` or `/dash/` directly.

Proxmox is not served through Cloudflare. The dashboard card and the docs rail
link to `https://pve.dns.gavinf.com:8006`, a name homecloud's CoreDNS serves to
the tailnet (split DNS), so it only works from a device on the tailnet.

## Local development

```bash
npm install
cp .env.example .env.local   # PUBLIC_CLERK_PUBLISHABLE_KEY
npm run dev                  # http://localhost:4321

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

## Keeping the rail in sync

The cross-site nav rail exists twice: `docs/src/components/Rail.astro` and
`frontend/src/PortalRail.tsx` in the homecloud repo. They must look identical
because a user crosses between them without a page-level cue.
