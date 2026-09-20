import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Expand, Gamepad2, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

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

const games = [
  { title: "Drive Mad", file: "drive-mad", mark: "DM", tone: "signal", category: "Racing" },
  { title: "Slope", file: "slope", mark: "S/", tone: "acid", category: "Arcade" },
  { title: "Subway Surfers", file: "subway-surfers", mark: "SS", tone: "sky", category: "Runner" },
  { title: "Block Blast", file: "block-blast", mark: "BB", tone: "violet", category: "Puzzle" },
  { title: "Run 3", file: "run-3", mark: "R3", tone: "mono", category: "Runner" },
  { title: "Cookie Clicker", file: "cookie-clicker", mark: "CC", tone: "amber", category: "Idle" },
  { title: "Among Us", file: "among-us", mark: "AU", tone: "danger", category: "Action" },
  { title: "1v1.LOL", file: "1v1-lol", mark: "1V1", tone: "sky", category: "Action" },
  { title: "Pac-Man", file: "pac-man", mark: "PM", tone: "amber", category: "Classic" },
  { title: "BitLife", file: "bitlife", mark: "BL", tone: "acid", category: "Simulation" },
  { title: "Temple Run 2", file: "temple-run-2", mark: "TR", tone: "signal", category: "Runner" },
  { title: "Tiny Fishing", file: "tiny-fishing", mark: "TF", tone: "violet", category: "Casual" },
];

type Game = (typeof games)[number];

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
        <header className="stage-bar">
          <button className="icon-button" onClick={() => setActiveGame(null)} aria-label="Back to games" title="Back to games">
            <ArrowLeft size={19} />
          </button>
          <div>
            <p>NOW PLAYING</p>
            <h1>{activeGame.title}</h1>
          </div>
          <button
            className="icon-button"
            onClick={() => document.querySelector("iframe")?.requestFullscreen?.()}
            aria-label="Enter fullscreen"
            title="Enter fullscreen"
          >
            <Expand size={18} />
          </button>
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
            {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
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