import * as React from "react";

interface HighlightTextProps {
  text: string;
  indices: number[];
}

export function HighlightText({ text, indices }: HighlightTextProps) {
  if (!indices.length) return <>{text}</>;
  const set = new Set(indices);
  return (
    <>
      {text.split("").map((ch, i) =>
        set.has(i) ? (
          <span key={i} style={{ color: "var(--primary)", fontWeight: 700 }}>
            {ch}
          </span>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </>
  );
}
