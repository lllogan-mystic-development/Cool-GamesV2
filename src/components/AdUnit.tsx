import { useEffect, useRef } from "react";

/** 728x90 banner ad. Scripts are injected client-side only. */
export function BannerAd() {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !ref.current) return;
    done.current = true;

    const options = document.createElement("script");
    options.type = "text/javascript";
    options.text = `atOptions = { 'key' : '4e03b9fec0962099af58ad914579b156', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };`;
    const invoke = document.createElement("script");
    invoke.type = "text/javascript";
    invoke.src = "https://discussionanymore.com/4e03b9fec0962099af58ad914579b156/invoke.js";

    ref.current.appendChild(options);
    ref.current.appendChild(invoke);
  }, []);

  return <div className="ad-slot ad-banner" ref={ref} aria-label="Advertisement" />;
}

/** Native banner ad. */
export function NativeAd() {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !ref.current) return;
    done.current = true;

    const container = document.createElement("div");
    container.id = "container-3b79735e277ce6878f17ef2063c71a22";
    const invoke = document.createElement("script");
    invoke.async = true;
    invoke.setAttribute("data-cfasync", "false");
    invoke.src = "https://discussionanymore.com/3b79735e277ce6878f17ef2063c71a22/invoke.js";

    ref.current.appendChild(invoke);
    ref.current.appendChild(container);
  }, []);

  return <div className="ad-slot ad-native" ref={ref} aria-label="Advertisement" />;
}
