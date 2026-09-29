---
title: "Cloudflare"
description: "Zones, tunnels, and the Workers that serve every gavinf.com site."
sidebar:
  label: Overview
  order: 0
---

Zones, tunnels, and the Workers that front every `gavinf.com` site.

## In this section

- [Deploying this site](/cloudflare/docs-site) — the `gavinf-docs` Worker, custom domains, Git builds
- [Tunnel & DNS](/cloudflare/tunnel) — zone setup, the tunnel ingress, and Caddy routing

## Sites

Two Workers from the `gavinf-dash` repo serve the `gavinf.com` zone (`homecloud.gavinf.com` is `gavinf-homecloud`, in its own repo).

`gavinf-dash` is one Worker + one Workers Assets bundle, routed by hostname in
`worker.js`:

| Host | Serves |
|---|---|
| `gavinf.com`, `auth.gavinf.com`, `dash.gavinf.com` | portal pages |

Proxmox is no longer fronted by Cloudflare — the dashboard links straight to
the node's Tailscale address, so it is reachable only from the tailnet.

`gavinf-docs` is a static assets Worker with no script at all, built from the
`docs/` directory of the same `gavinf-dash` repo:

| Host | Serves |
|---|---|
| `docs.gavinf.com` | this site — see [Deploying this site](/cloudflare/docs-site) |

Docs used to live inside `gavinf-prod` too, built from `homecloud/frontend/docs`.
Splitting them out means the docs deploy on their own and can cover projects
beyond homecloud.
