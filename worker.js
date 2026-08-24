// gavinf-dash: one Worker for the personal sites on gavinf.com.
//   proxmox.gavinf.com → portal-rail shell for navigations, passthrough
//                        (XHR, assets, WebSocket consoles) to the tunnel origin
//   everything else    → portal SPA; the app switches views for
//                        gavinf.com / auth / dash off window.location.hostname
//
// homecloud.gavinf.com and docs.gavinf.com are separate Workers in their own
// repos (gavinf-homecloud, gavinf-docs).
// The proxmox rail below mirrors homecloud's frontend/src/PortalRail.tsx —
// keep in sync.

const PROXMOX_HOST = "proxmox.gavinf.com";

// Each portal host serves a different prerendered Astro page. The SPA used to
// switch views client-side off window.location.hostname; now the split happens
// here, so gavinf.com can be a static page that ships no JavaScript.
const HOST_PAGE = {
  "auth.gavinf.com": "/auth/",
  "dash.gavinf.com": "/dash/",
};

const PROXMOX_SHELL = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>proxmox - Proxmox Virtual Environment</title>
<style>
  html, body { margin: 0; height: 100%; background: #0b0f0e; }
  .portal-rail {
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 1000;
    width: 56px; overflow: hidden;
    background: #0f1614; border-right: 1px solid #253431;
    display: flex; flex-direction: column; gap: 2px;
    padding: 10px 11px; box-sizing: border-box;
    transition: width 0.16s ease;
    font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  }
  .portal-rail.open { width: 220px; }
  .portal-rail-item {
    display: flex; align-items: center; gap: 12px; flex-shrink: 0;
    height: 38px; padding: 0 2px; border-radius: 7px;
    color: #8fa49a; text-decoration: none; white-space: nowrap;
    font-size: 13.5px; font-weight: 600;
  }
  .portal-rail-item:hover, .portal-rail-item.active { background: #141c19; color: #e6efe9; }
  .portal-rail-icon {
    width: 30px; height: 30px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .portal-rail-mark { background: #0f2a20; border-radius: 7px; }
  .portal-rail-brand { height: 42px; color: #e6efe9; font-size: 15px; margin-bottom: 6px; }
  .portal-rail-label { opacity: 0; transition: opacity 0.12s ease; }
  .portal-rail.open .portal-rail-label { opacity: 1; }
  .portal-rail-sep { height: 1px; flex-shrink: 0; background: #253431; margin: 4px 2px 8px; }
  .portal-rail-spacer { flex: 1; }
  .portal-rail-toggle { background: none; border: 0; cursor: pointer; font: inherit; width: 100%; text-align: left; }
  iframe { display: block; margin-left: 56px; width: calc(100vw - 56px); height: 100vh; border: 0; transition: margin-left 0.16s ease, width 0.16s ease; }
  body.rail-open iframe { margin-left: 220px; width: calc(100vw - 220px); }
</style>
</head>
<body>
<nav class="portal-rail">
  <a class="portal-rail-item portal-rail-brand" href="https://dash.gavinf.com" title="Dashboard">
    <span class="portal-rail-icon portal-rail-mark">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.34 9.5 4 4 0 0 0 7 19z"
          stroke="#3fd79a" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="portal-rail-label">Dashboard</span>
  </a>
  <div class="portal-rail-sep"></div>
  <a class="portal-rail-item" href="https://homecloud.gavinf.com" title="homecloud">
    <span class="portal-rail-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
    </span>
    <span class="portal-rail-label">homecloud</span>
  </a>
  <a class="portal-rail-item active" href="https://proxmox.gavinf.com" title="proxmox">
    <span class="portal-rail-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    </span>
    <span class="portal-rail-label">proxmox</span>
  </a>
  <a class="portal-rail-item" href="https://docs.gavinf.com" title="docs">
    <span class="portal-rail-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6"/>
        <path d="M9 13h6"/>
        <path d="M9 17h6"/>
      </svg>
    </span>
    <span class="portal-rail-label">docs</span>
  </a>
  <div class="portal-rail-spacer"></div>
  <button type="button" class="portal-rail-item portal-rail-toggle" id="rail-toggle" title="Expand">
    <span class="portal-rail-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 3v18"/>
      </svg>
    </span>
    <span class="portal-rail-label">Collapse</span>
  </button>
</nav>
<iframe id="pve" title="Proxmox VE"></iframe>
<script>
  document.getElementById('pve').src =
    location.pathname + location.search + location.hash;
  var rail = document.querySelector('.portal-rail');
  if (localStorage.getItem('portal-rail-open') === '1') {
    rail.classList.add('open');
    document.body.classList.add('rail-open');
  }
  document.getElementById('rail-toggle').addEventListener('click', function () {
    var open = rail.classList.toggle('open');
    document.body.classList.toggle('rail-open', open);
    localStorage.setItem('portal-rail-open', open ? '1' : '0');
  });
</script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === PROXMOX_HOST) {
      if (request.method === "GET" &&
          request.headers.get("Sec-Fetch-Dest") === "document") {
        return new Response(PROXMOX_SHELL, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
      // DNS for this host points at the tunnel; pass everything else through.
      return fetch(request);
    }

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
