import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Bot, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BannerAd, NativeAd } from "@/components/AdUnit";
import { Button } from "@/components/ui/button";
import { askLogan } from "@/lib/logan.functions";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/logan")({
  head: () => ({
    meta: [
      { title: "Logan Intelligence — Cool G@mes AI" },
      { name: "description", content: "Chat with Logan Intelligence, the built-in AI assistant on Cool G@mes." },
      { property: "og:title", content: "Logan Intelligence — Cool G@mes AI" },
      {
        property: "og:description",
        content: "Chat with Logan Intelligence, the built-in AI assistant on Cool G@mes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoganPage,
});

function LoganPage() {
  const send = useServerFn(askLogan);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adOpen, setAdOpen] = useState(false);
  const sentCount = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError(null);

    sentCount.current += 1;
    const showAd = sentCount.current % 3 === 0;

    try {
      const result = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: result.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logan Intelligence is offline right now.");
    } finally {
      setBusy(false);
      if (showAd) setAdOpen(true);
    }
  };

  return (
    <main className="launcher-shell chat-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <ArrowLeft size={16} />
          </span>
          COOL G@MES
        </Link>
        <span className="live-indicator">
          <i /> LOGAN INTELLIGENCE
        </span>
      </header>

      <section className="chat-body">
        <div className="chat-log" ref={scroller}>
          {messages.length === 0 && (
            <div className="chat-empty">
              <Bot size={30} />
              <h1>LOGAN INTELLIGENCE</h1>
              <p>Ask anything — homework, game tips, random questions.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div className={`chat-msg ${msg.role}`} key={i}>
              <span className="chat-who">{msg.role === "user" ? "YOU" : "LOGAN"}</span>
              <p>{msg.content}</p>
            </div>
          ))}
          {busy && (
            <div className="chat-msg assistant">
              <span className="chat-who">LOGAN</span>
              <p className="chat-typing">thinking…</p>
            </div>
          )}
          {error && <p className="chat-error">{error}</p>}
        </div>

        <form className="chat-input" onSubmit={submit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="MESSAGE LOGAN"
            aria-label="Message Logan Intelligence"
          />
          <Button type="submit" variant="outline" size="icon" className="icon-button" disabled={busy} aria-label="Send">
            <Send size={17} />
          </Button>
        </form>
      </section>

      {adOpen && (
        <div className="ad-overlay" role="dialog" aria-label="Advertisement">
          <div className="ad-modal">
            <div className="ad-modal-head">
              <span>SPONSORED BREAK</span>
              <Button variant="ghost" size="icon" onClick={() => setAdOpen(false)} aria-label="Close ad">
                <X size={16} />
              </Button>
            </div>
            <BannerAd />
            <NativeAd />
          </div>
        </div>
      )}
    </main>
  );
}
