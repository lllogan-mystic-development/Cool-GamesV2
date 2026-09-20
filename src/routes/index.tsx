import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Expand, Gamepad2, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { games, type Game } from "@/data/games";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cool G@mes — Play Instantly" },
      { name: "description", content: "A fast, searchable collection of browser games." },
      { property: "og:title", content: "Cool G@mes — Play Instantly" },
      { property: "og:description", content: "A fast, searchable collection of browser games." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [query, setQuery] = useState("");
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const filtered = useMemo(
    () => games.filter((game) => `${game.title} ${game.category}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  if (activeGame) {
    return (
      <main className="game-stage">
        <header className="topbar stage-bar">
          <Button variant="outline" size="icon" className="icon-button" onClick={() => setActiveGame(null)} aria-label="Back to games" title="Back to games">
            <ArrowLeft size={19} />
          </Button>
          <div className="stage-title">
            <p>NOW PLAYING</p>
            <h1>{activeGame.title}</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="icon-button"
            onClick={() => document.querySelector("iframe")?.requestFullscreen?.()}
            aria-label="Enter fullscreen"
            title="Enter fullscreen"
          >
            <Expand size={18} />
          </Button>
        </header>
        <iframe
          src={`/games/${activeGame.file}.html`}
          title={activeGame.title}
          className="game-frame"
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
        />
      </main>
    );
  }

  return (
    <main className="launcher-shell">
      <header className="topbar">
        <a href="#games" className="brand" aria-label="Cool Games home">
          <span className="brand-mark"><Gamepad2 size={18} /></span>
          COOL G@MES
        </a>
        <span className="live-indicator"><i /> LIVE</span>
      </header>

      <section className="intro">
        <p className="eyebrow">ARCHIVE // ONLINE</p>
        <h1>COOL<br /><span>G@MES</span></h1>
        <p className="lede">Pick a game. Drop in. Stay awhile.</p>
      </section>

      <section className="library" id="games">
        <div className="library-head">
          <div>
            <p className="section-kicker">GAME DIRECTORY</p>
            <h2>{filtered.length.toString().padStart(2, "0")} TITLES</h2>
          </div>
          <label className="search-box">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SEARCH GAMES" aria-label="Search games" />
            {query && <Button variant="ghost" size="icon" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></Button>}
          </label>
        </div>

        <div className="game-grid">
          {filtered.map((game, index) => (
            <button className="game-card" key={game.file} onClick={() => setActiveGame(game)}>
              <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
              <span className={`game-mark ${game.tone}`}>{game.mark}</span>
              <span className="game-copy"><strong>{game.title}</strong><small>{game.category}</small></span>
              <span className="launch-arrow">↗</span>
            </button>
          ))}
        </div>
        {filtered.length === 0 && <p className="empty-state">NO SIGNAL — TRY ANOTHER SEARCH</p>}
      </section>

      <footer><span>BUILT FOR THE WEB</span><span>ESC = PANIC KEY</span></footer>
    </main>
  );
}