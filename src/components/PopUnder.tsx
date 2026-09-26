import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

const SCRIPT_SRC = "https://discussionanymore.com/a2/a2/66/a2a266175c782699837956245e5fbb8a.js";
const COOKIE_NAME = "cg_popunder_taps";
const MAX_TAPS = 10;
const SCRIPT_ID = "cg-popunder-script";

function getTapCount(): number {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=(\\d+)`));
  return match?.[1] ? parseInt(match[1], 10) : 0;
}

function setTapCount(value: number) {
  // Persist for a year.
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

/** Site-wide popunder: active until the visitor has tapped 10 times (tracked by cookie). Disabled on /ads. */
export function PopUnder() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (pathname.startsWith("/ads")) return;
    if (getTapCount() >= MAX_TAPS) return;

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      document.head.appendChild(script);
    }

    const onTap = () => {
      const next = getTapCount() + 1;
      setTapCount(next);
      if (next >= MAX_TAPS) {
        document.getElementById(SCRIPT_ID)?.remove();
        document.removeEventListener("pointerdown", onTap, true);
      }
    };
    // Capture phase so taps on buttons/cards still count.
    document.addEventListener("pointerdown", onTap, true);
    return () => document.removeEventListener("pointerdown", onTap, true);
  }, [pathname]);

  return null;
}
