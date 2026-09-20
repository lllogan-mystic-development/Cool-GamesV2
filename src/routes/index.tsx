import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bot, Check, Expand, Eye, Folder, FolderOpen, Gamepad2, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BannerAd, NativeAd } from "@/components/AdUnit";
import { CLOAK_PRESETS, DEFAULT_CLOAK, useTabCloak } from "@/components/TabCloak";
import { Button } from "@/components/ui/button";
import { games, type Game } from "@/data/games";

const CATEGORY_ORDER = [
  "Action",
  "Adventure",
  "Arcade",
  "Casual",
  "Classic",
  "Horror",
  "Platformer",
  "Puzzle",
  "Racing",
  "Rhythm",
  "RPG",
  "Runner",
  "Sports",
];

function groupByCategory(list: Game[]) {
  const groups = new Map<string, Game[]>();
  for (const game of list) {
    const bucket = groups.get(game.category) ?? [];
    bucket.push(game);
    groups.set(game.category, bucket);
  }
  return [...groups.entries()].sort(
    ([a], [b]) =>
      (CATEGORY_ORDER.indexOf(a) === -1 ? 99 : CATEGORY_ORDER.indexOf(a)) -
      (CATEGORY_ORDER.indexOf(b) === -1 ? 99 : CATEGORY_ORDER.indexOf(b)),
  );
}

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
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [cloakOpen, setCloakOpen] = useState(false);
  const cloak = useTabCloak();
  const [cloakTitle, setCloakTitle] = useState(cloak.title);
  const [cloakIcon, setCloakIcon] = useState(cloak.icon);
  const filtered = useMemo(
    () => games.filter((game) => `${game.title} ${game.category}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const folders = useMemo(() => groupByCategory(filtered), [filtered]);
  const visibleFolders = useMemo(
    () => (query ? folders : folders.filter(([category]) => category === openFolder)),
    [folders, query, openFolder],
  );

  useEffect(() => {
    if (!cloakOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCloakOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [cloakOpen]);

  const openCloak = () => {
    setCloakTitle(cloak.title);
    setCloakIcon(cloak.icon);
    setCloakOpen(true);
  };

  const applyCustomCloak = () => {
    const title = cloakTitle.trim() || DEFAULT_CLOAK.title;
    const icon = cloakIcon.trim() || DEFAULT_CLOAK.icon;
    cloak.applyCloak({ title, icon });
    setCloakOpen(false);
  };

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
        <div className="topbar-actions">
          <Button variant="ghost" size="sm" className="cloak-trigger" onClick={openCloak}>
            <Eye size={15} /> TAB CLOAK
          </Button>
          <Link to="/logan" className="ai-link"><Bot size={15} /> LOGAN INTELLIGENCE</Link>
        </div>
      </header>

      <div className="ad-rail"><BannerAd /></div>


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

        {!query && !openFolder && (
          <div className="folder-icons">
            {folders.map(([category, titles]) => (
              <button className="folder-tile" key={category} onClick={() => setOpenFolder(category)}>
                <Folder size={40} />
                <strong>{category.toUpperCase()}</strong>
                <small>{titles.length.toString().padStart(2, "0")} FILES</small>
              </button>
            ))}
          </div>
        )}

        <div className="folder-list">
          {visibleFolders.map(([category, titles]) => (
            <section className="folder" key={category}>
              <header className="folder-head">
                <span className="folder-label">
                  <FolderOpen size={15} />
                  {category.toUpperCase()}
                </span>
                {openFolder === category ? (
                  <Button variant="ghost" size="sm" onClick={() => setOpenFolder(null)}>
                    CLOSE
                  </Button>
                ) : (
                  <span className="folder-count">{titles.length.toString().padStart(2, "0")} FILES</span>
                )}
              </header>
              <div className="game-grid">
                {titles.map((game, index) => (
                  <button className="game-card" key={game.file} onClick={() => setActiveGame(game)}>
                    <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className={`game-mark ${game.tone}`}>{game.mark}</span>
                    <span className="game-copy"><strong>{game.title}</strong><small>{game.category}</small></span>
                    <span className="launch-arrow">↗</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
        {filtered.length === 0 && <p className="empty-state">NO SIGNAL — TRY ANOTHER SEARCH</p>}
        <div className="ad-rail"><NativeAd /></div>
      </section>


      <footer><span>BUILT FOR THE WEB</span><span>ESC = PANIC KEY</span></footer>

      {cloakOpen && (
        <div className="cloak-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setCloakOpen(false);
        }}>
          <section className="cloak-panel" role="dialog" aria-modal="true" aria-labelledby="cloak-title">
            <header className="cloak-panel-head">
              <div>
                <p>TAB IDENTITY</p>
                <h2 id="cloak-title">CLOAK SETTINGS</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setCloakOpen(false)} aria-label="Close tab cloak settings">
                <X size={18} />
              </Button>
            </header>

            <div className="cloak-preview">
              <img src={cloakIcon || DEFAULT_CLOAK.icon} alt="" onError={(event) => { event.currentTarget.src = DEFAULT_CLOAK.icon; }} />
              <span>{cloakTitle || DEFAULT_CLOAK.title}</span>
              <X size={13} />
            </div>

            <div className="cloak-presets" aria-label="Tab cloak presets">
              {CLOAK_PRESETS.map((preset) => (
                <Button
                  key={preset.title}
                  variant="outline"
                  className="cloak-preset"
                  onClick={() => {
                    setCloakTitle(preset.title);
                    setCloakIcon(preset.icon);
                  }}
                >
                  <img src={preset.icon} alt="" />
                  <span>{preset.title}</span>
                </Button>
              ))}
            </div>

            <label className="cloak-field">
              <span>TAB TITLE</span>
              <input value={cloakTitle} maxLength={80} onChange={(event) => setCloakTitle(event.target.value)} placeholder="Cool G@mes" />
            </label>
            <label className="cloak-field">
              <span>ICON URL</span>
              <input value={cloakIcon} onChange={(event) => setCloakIcon(event.target.value)} placeholder="https://…/icon.png" />
            </label>

            <div className="cloak-panel-actions">
              <Button variant="ghost" onClick={() => {
                cloak.resetCloak();
                setCloakTitle(DEFAULT_CLOAK.title);
                setCloakIcon(DEFAULT_CLOAK.icon);
              }}>
                <RotateCcw size={15} /> RESET
              </Button>
              <Button onClick={applyCustomCloak}><Check size={15} /> APPLY CLOAK</Button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}