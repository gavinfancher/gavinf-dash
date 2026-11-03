// gavinf-dash: one Worker for gavinf.com and dash.gavinf.com, one static page each.
// docs.gavinf.com is the separate gavinf-docs Worker built from ./docs, and
// homecloud.gavinf.com is in the homecloud repo.

const HOST_PAGE = {
  "dash.gavinf.com": "/dash/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // The old Clerk sign-in portal. Nothing signs in here any more; each service
    // that needs it (homecloud, easydocs, ...) has its own sign-in.
    if (url.hostname === "auth.gavinf.com") {
      return Response.redirect("https://dash.gavinf.com/", 301);
    }

    // Only the bare host path is rewritten to that host's page; /_astro/* and
    // other assets resolve by their own path.
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
