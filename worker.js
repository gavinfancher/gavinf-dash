// gavinf-dash: one Worker for the portal pages on gavinf.com, one per
// hostname. homecloud.gavinf.com is a separate Worker in its own repo;
// docs.gavinf.com is the separate gavinf-docs Worker built from ./docs.
// Proxmox is no longer proxied — the dashboard links to it over Tailscale.

// Each portal host serves a different prerendered Astro page. The SPA used to
// switch views client-side off window.location.hostname; now the split happens
// here, so gavinf.com can be a static page that ships no JavaScript.
const HOST_PAGE = {
  "auth.gavinf.com": "/auth/",
  "dash.gavinf.com": "/dash/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Portal. Only the bare host path is rewritten to that host's page —
    // /_astro/* and other asset requests resolve by their own path.
    const page = HOST_PAGE[url.hostname] ?? "/";
    const assetUrl = new URL(url);
    if (url.pathname === "/" || url.pathname === "") {
      assetUrl.pathname = page;
    }

    let resp = await env.ASSETS.fetch(new Request(assetUrl, request));
    if (resp.status === 404) {
      assetUrl.pathname = page;
      resp = await env.ASSETS.fetch(new Request(assetUrl, request));
    }
    return resp;
  },
};
