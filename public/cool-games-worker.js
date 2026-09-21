// Cool G@mes mirror — Cloudflare Worker
// Paste this whole file into your Worker's "Edit Code" editor and hit Deploy.
// Every request to your worker URL is proxied straight to Cool G@mes.

const UPSTREAM = "https://cg.ah.football";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const upstreamUrl = new URL(url.pathname + url.search, UPSTREAM);

    const headers = new Headers(request.headers);
    headers.set("Host", upstreamUrl.host);
    headers.set("X-Forwarded-Host", url.host);

    const upstreamRequest = new Request(upstreamUrl.toString(), {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      redirect: "manual",
    });

    const response = await fetch(upstreamRequest);
    const out = new Response(response.body, response);
    out.headers.delete("content-security-policy");
    out.headers.delete("x-frame-options");
    return out;
  },
};
