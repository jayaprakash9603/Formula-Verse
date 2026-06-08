import * as React from "react";
import rough from "roughjs";

export default function CircleAreaAnalogy() {
  const ref = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const svg = ref.current;
    svg.innerHTML = "";
    const rc = rough.svg(svg);
    svg.appendChild(rc.circle(130, 100, 140, { stroke: "#8b5cf6", strokeWidth: 2, roughness: 1.5, fill: "#8b5cf620" }));
    [100, 75, 50, 25].forEach((r, i) => {
      svg.appendChild(rc.circle(130, 100, r * 2, { stroke: `rgba(139,92,246,${0.2 + i * 0.15})`, strokeWidth: 1, roughness: 1.2, fill: "none" }));
    });
    svg.appendChild(rc.line(130, 100, 200, 100, { stroke: "#6366f1", strokeWidth: 2, strokeLineDash: [5, 3] }));
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", "130");
    label.setAttribute("y", "190");
    label.setAttribute("fill", "#94a3b8");
    label.setAttribute("font-size", "11");
    label.setAttribute("text-anchor", "middle");
    label.textContent = "A circular sprinkler zone";
    svg.appendChild(label);
  }, []);
  return <svg ref={ref} width="260" height="200" className="w-full" />;
}
