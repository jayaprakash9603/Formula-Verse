import * as React from "react";
import { renderKatex, useKatex } from "@/engines/formula-visualizer/useKatex";

interface Props {
  latex: string;
  displayMode?: boolean;
}

export default function KatexBlock({ latex, displayMode = false }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  useKatex();

  React.useEffect(() => {
    if (ref.current) renderKatex(latex, ref.current, displayMode);
  }, [latex, displayMode]);

  return <div ref={ref} className={displayMode ? "katex-display" : "inline"} />;
}
