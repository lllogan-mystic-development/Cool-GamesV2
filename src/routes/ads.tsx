import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { BannerAd, NativeAd } from "@/components/AdUnit";

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
  const [seconds, setSeconds] = useState(12);

  useEffect(() => {
    const tick = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setCycle((c) => c + 1);
          return 12;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

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
          <i /> REFRESH IN {String(seconds).padStart(2, "0")}s
        </span>
      </header>

      <section className="intro">
        <p className="eyebrow">SPONSOR FEED // LIVE</p>
        <h1>
          AD
          <br />
          <span>WALL</span>
        </h1>
        <p className="lede">Fresh spots every 12 seconds. Cycle #{cycle + 1}.</p>
      </section>

      <section className="library">
        <div className="ad-rail" key={`banner-${cycle}`}>
          <BannerAd />
        </div>
        <div className="ad-rail" key={`native-${cycle}`}>
          <NativeAd />
        </div>
        <div className="ad-rail" key={`banner2-${cycle}`}>
          <BannerAd />
        </div>
      </section>

      <footer>
        <span>BUILT FOR THE WEB</span>
        <span>ESC = PANIC KEY</span>
      </footer>
    </main>
  );
}
