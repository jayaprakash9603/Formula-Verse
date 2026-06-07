import * as React from "react";
import rough from "roughjs";

export default function PythagoreanAnalogy() {
  const ref = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const svg = ref.current;
    svg.innerHTML = "";
    const rc = rough.svg(svg);
    svg.appendChild(rc.rectangle(40, 80, 120, 100, { stroke: "#6366f1", strokeWidth: 2, roughness: 1.5, fill: "#6366f155" }));
    svg.appendChild(rc.rectangle(170, 20, 80, 80, { stroke: "#8b5cf6", strokeWidth: 2, roughness: 1.5, fill: "#8b5cf655" }));
    svg.appendChild(rc.line(40, 180, 160, 180, { stroke: "#6366f1", strokeWidth: 2.5 }));
    svg.appendChild(rc.line(40, 180, 40, 80, { stroke: "#8b5cf6", strokeWidth: 2.5 }));
    svg.appendChild(rc.line(40, 80, 160, 180, { stroke: "#34d399", strokeWidth: 2.5, strokeLineDash: [6, 4] }));
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", "120");
    label.setAttribute("y", "200");
    label.setAttribute("fill", "#94a3b8");
    label.setAttribute("font-size", "11");
    label.setAttribute("text-anchor", "middle");
    label.textContent = "A playground ramp";
    svg.appendChild(label);
  }, []);
  return <svg ref={ref} width="260" height="215" className="w-full" />;
}
