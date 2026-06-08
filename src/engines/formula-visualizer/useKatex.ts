import { useEffect, useRef } from "react";

let injected = false;

export function useKatex() {
  const ready = useRef(false);

  useEffect(() => {
    if (injected) { ready.current = true; return; }
    injected = true;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
    script.defer = true;
    script.onload = () => { ready.current = true; };
    document.head.appendChild(script);
  }, []);
}

export function renderKatex(latex: string, element: HTMLElement, displayMode = false) {
  if (typeof window === "undefined") return;
  const katex = (window as unknown as { katex?: { render: (s: string, el: HTMLElement, opts: object) => void } }).katex;
  if (!katex) return;
  try {
    katex.render(latex, element, { throwOnError: false, displayMode });
  } catch {
    element.textContent = latex;
  }
}
