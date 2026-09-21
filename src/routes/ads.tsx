import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Pause, Play, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { BannerAd, NativeAd } from "@/components/AdUnit";
import { Button } from "@/components/ui/button";

const CYCLE_SECONDS = 12;

const SLOTS = [
  { kind: "banner", label: "SLOT 01 // LEADERBOARD" },
  { kind: "native", label: "SLOT 02 // NATIVE FEED" },
  { kind: "banner", label: "SLOT 03 // LEADERBOARD" },
  { kind: "native", label: "SLOT 04 // NATIVE FEED" },
  { kind: "banner", label: "SLOT 05 // LEADERBOARD" },
  { kind: "native", label: "SLOT 06 // NATIVE FEED" },
] as const;

export const Route = createFileRoute("/ads")({
  head: () => ({
    meta: [
      { title: "Ad Wall — Cool G@mes" },
      { name: "description", content: "A rotating wall of sponsor spots that refreshes every 12 seconds." },
      { property: "og:title", content: "Ad Wall — Cool G@mes" },
      {
        property: "og:description",
        content: "A rotating wall of sponsor spots that refreshes every 12 seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdsPage,
});

function AdsPage() {
  const [cycle, setCycle] = useState(0);
  const [seconds, setSeconds] = useState(CYCLE_SECONDS);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setCycle((c) => c + 1);
          return CYCLE_SECONDS;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [running]);

  const refreshNow = () => {
    setCycle((c) => c + 1);
    setSeconds(CYCLE_SECONDS);
  };

  const progress = ((CYCLE_SECONDS - seconds) / CYCLE_SECONDS) * 100;

  return (
    <main className="launcher-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <ArrowLeft size={16} />
          </span>
          COOL G@MES
        </Link>
        <span className="live-indicator">
          <i /> {running ? `REFRESH IN ${String(seconds).padStart(2, "0")}s` : "PAUSED"}
        </span>
      </header>

      <section className="intro">
        <p className="eyebrow">SPONSOR FEED // LIVE</p>
        <h1>
          AD
          <br />
          <span>WALL</span>
        </h1>
        <p className="lede">
          Six live sponsor spots. Everything reloads every {CYCLE_SECONDS} seconds. Cycle #{cycle + 1}.
        </p>
      </section>

      <section className="library">
        <div className="library-head">
          <div>
            <p className="section-kicker">ROTATION CONTROL</p>
            <h2>{SLOTS.length.toString().padStart(2, "0")} SLOTS</h2>
          </div>
          <div className="adwall-controls">
            <Button variant="outline" size="sm" onClick={() => setRunning((r) => !r)}>
              {running ? <Pause size={14} /> : <Play size={14} />}
              {running ? "PAUSE" : "RESUME"}
            </Button>
            <Button variant="outline" size="sm" onClick={refreshNow}>
              <RefreshCw size={14} /> REFRESH
            </Button>
          </div>
        </div>

        <div className="adwall-progress" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
        </div>

        <div className="adwall-grid">
          {SLOTS.map((slot, index) => (
            <article className="adwall-card" key={`${index}-${cycle}`}>
              <header className="adwall-card-head">
                <span>{slot.label}</span>
                <small>#{cycle + 1}</small>
              </header>
              <div className="ad-rail">{slot.kind === "banner" ? <BannerAd /> : <NativeAd />}</div>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <span>BUILT FOR THE WEB</span>
        <span>ESC = PANIC KEY</span>
      </footer>
    </main>
  );
}
