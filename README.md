# gavinf-dash

The personal sites on `gavinf.com` — landing page, Clerk auth portal, and
dashboard — plus the shell that wraps the Proxmox UI. One React SPA and one
Cloudflare Worker, deployed as **`gavinf-dash`**.

Split out of the homecloud repo, where this lived under `frontend/dashboard`
and shared a Worker with homecloud's console. They were always two independent
apps with no shared code; now they have separate repos and separate deploys.

## Hosts

| Host | Serves |
|---|---|
| `gavinf.com` | landing page |
| `auth.gavinf.com` | Clerk sign-in portal |
| `dash.gavinf.com` | dashboard (signed-in only) |
| `proxmox.gavinf.com` | nav-rail shell around the Proxmox VE UI |

The SPA picks its view from `window.location.hostname`, so all three portal
hosts serve one bundle. Locally, use `?view=auth` / `?view=dash` to switch.

`proxmox.gavinf.com` works differently: DNS points at the Cloudflare Tunnel, and
a Worker route intercepts. Document navigations get a shell page with the nav
rail and an iframe; everything else — XHR, assets, WebSocket consoles — passes
straight through to the tunnel origin. The check is `Sec-Fetch-Dest: document`.

## Neighbours

| Worker | Repo | Host |
|---|---|---|
| `gavinf-dash` | this one | `gavinf.com`, `auth`, `dash`, `proxmox` |
| `gavinf-homecloud` | `homecloud` | `homecloud.gavinf.com` |
| `gavinf-docs` | `mydocs` | `docs.gavinf.com` |

## Local development

```bash
npm install
cp .env.example .env.local   # VITE_CLERK_PUBLISHABLE_KEY
npm run dev                  # http://localhost:5173
```

## Deploy

```bash
npm run deploy               # build + wrangler deploy
```

Or connect the repo under Workers & Pages → gavinf-dash → Settings → Builds
with build `npm run build`, deploy `npx wrangler deploy`, path `/`.

## Keeping the rail in sync

The nav rail exists twice: as `PROXMOX_SHELL` markup inside `worker.js`, and as
`frontend/src/PortalRail.tsx` in the homecloud repo. They must look identical
because a user crosses between them without a page-level cue. It's ~40 lines of
markup that changes rarely — duplicated deliberately rather than packaged.
