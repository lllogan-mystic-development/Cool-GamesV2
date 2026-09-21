import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Cloud, Copy, FileCode2, Rocket, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const UPSTREAM = "https://cg.ah.football";

const WORKER_CODE = `// Cool G@mes mirror — Cloudflare Worker
const UPSTREAM = "${UPSTREAM}";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Proxy everything to Cool G@mes
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
};`;

export const Route = createFileRoute("/lllogan")({
  head: () => ({
    meta: [
      { title: "LLLOGAN — Cool G@mes Mirror Tutorial" },
      {
        name: "description",
        content:
          "Step-by-step tutorial: deploy a free Cloudflare Worker that mirrors Cool G@mes (cg.ah.football) on your own URL.",
      },
      { property: "og:title", content: "LLLOGAN — Cool G@mes Mirror Tutorial" },
      {
        property: "og:description",
        content: "Deploy a free Cloudflare Worker that mirrors Cool G@mes on your own URL.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Lllogan,
});

function Lllogan() {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(WORKER_CODE);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = WORKER_CODE;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="launcher-shell tutorial-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <ArrowLeft size={16} />
          </span>
          COOL G@MES
        </Link>
        <div className="live-indicator">
          <i /> TUTORIAL
        </div>
      </header>

      <section className="tutorial-hero">
        <p className="eyebrow">LLLOGAN // DEPLOYMENT GUIDE</p>
        <h1>
          MIRROR<span> THE GRID</span>
        </h1>
        <p className="lede">
          Run your own copy of Cool G@mes on any URL with a free Cloudflare Worker. Three steps, zero servers.
        </p>
      </section>

      <section className="tutorial-body">
        <ol className="step-list">
          <li className="step-card">
            <div className="step-index">01</div>
            <div className="step-content">
              <div className="step-title">
                <UserPlus size={17} />
                <h2>Create a Worker</h2>
              </div>
              <p>
                Go to{" "}
                <a
                  href="https://www.cloudflare.com/developer-platform/products/workers/"
                  target="_blank"
                  rel="noreferrer"
                >
                  cloudflare.com → Workers
                </a>{" "}
                and make a free account. Choose the <strong>"Hello World"</strong> starter and give your worker a name.
              </p>
            </div>
          </li>

          <li className="step-card">
            <div className="step-index">02</div>
            <div className="step-content">
              <div className="step-title">
                <FileCode2 size={17} />
                <h2>Open the editor</h2>
              </div>
              <p>
                Once created you'll land on the worker's overview page. Hit <strong>"Edit Code"</strong> in the top
                right corner.
              </p>
            </div>
          </li>

          <li className="step-card">
            <div className="step-index">03</div>
            <div className="step-content">
              <div className="step-title">
                <Rocket size={17} />
                <h2>Paste &amp; deploy</h2>
              </div>
              <p>
                Delete everything in the editor and paste the code below. It's already wired to{" "}
                <strong>{UPSTREAM.replace("https://", "")}</strong> — just hit <strong>Deploy</strong> and your mirror
                is live.
              </p>

              <div className="code-block">
                <div className="code-head">
                  <span className="code-label">
                    <Cloud size={13} /> worker.js
                  </span>
                  <span className="code-actions">
                    <a className="copy-button" href="/cool-games-worker.js" download="worker.js">
                      DOWNLOAD
                    </a>
                    <Button variant="outline" size="sm" className="copy-button" onClick={copyCode}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "COPIED" : "COPY"}
                    </Button>
                  </span>
                </div>
                <pre>
                  <code>{WORKER_CODE}</code>
                </pre>
              </div>
            </div>
          </li>
        </ol>

        <div className="tutorial-note">
          <p>
            // Every request to your worker URL gets proxied to Cool G@mes — games, pages, everything. Share your
            worker link and enjoy.
          </p>
        </div>
      </section>

      <footer>
        <span>COOL G@MES // LLLOGAN PROTOCOL</span>
        <span>CG.AH.FOOTBALL</span>
      </footer>
    </main>
  );
}
