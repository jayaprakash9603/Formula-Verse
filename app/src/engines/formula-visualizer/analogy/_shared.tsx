import * as React from "react";
import rough from "roughjs";

function makeAnalogy(draw: (rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement) => void, caption: string) {
  return function AnalogyComponent() {
    const ref = React.useRef<SVGSVGElement>(null);
    React.useEffect(() => {
      if (!ref.current) return;
      ref.current.innerHTML = "";
      const rc = rough.svg(ref.current);
      draw(rc, ref.current);
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", "130");
      label.setAttribute("y", "195");
      label.setAttribute("fill", "#94a3b8");
      label.setAttribute("font-size", "11");
      label.setAttribute("text-anchor", "middle");
      label.textContent = caption;
      ref.current.appendChild(label);
    }, []);
    return <svg ref={ref} width="260" height="210" className="w-full" />;
  };
}

export const QuadraticAnalogy = makeAnalogy((rc, svg) => {
  const pts: [number, number][] = [];
  for (let x = 0; x <= 240; x += 5) {
    const xv = (x - 120) / 15;
    const yv = 0.5 * xv ** 2 - 2 * xv - 1;
    pts.push([10 + x, 100 - yv * 10]);
  }
  svg.appendChild(rc.linearPath(pts, { stroke: "#6366f1", strokeWidth: 2, roughness: 1.2 }));
  svg.appendChild(rc.circle(60, 155, 14, { fill: "#34d399", stroke: "#34d399", roughness: 1 }));
  svg.appendChild(rc.circle(205, 155, 14, { fill: "#34d399", stroke: "#34d399", roughness: 1 }));
}, "Ball landing spots = roots");

export const Emc2Analogy = makeAnalogy((rc, svg) => {
  svg.appendChild(rc.circle(40, 100, 20, { fill: "#60a5fa", stroke: "#60a5fa", roughness: 1 }));
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    svg.appendChild(rc.line(160, 100, 160 + Math.cos(a) * 80, 100 + Math.sin(a) * 80, { stroke: "#fbbf24", strokeWidth: 2, roughness: 1.5 }));
  }
  svg.appendChild(rc.circle(160, 100, 40, { fill: "#fbbf2444", stroke: "#fbbf24", roughness: 1.2 }));
}, "Tiny mass → giant energy");

export const NewtonAnalogy = makeAnalogy((rc, svg) => {
  svg.appendChild(rc.rectangle(80, 80, 100, 60, { stroke: "#60a5fa", strokeWidth: 2, roughness: 1.5, fill: "#60a5fa22" }));
  svg.appendChild(rc.line(10, 110, 75, 110, { stroke: "#6366f1", strokeWidth: 3 }));
  svg.appendChild(rc.line(180, 80, 240, 80, { stroke: "#1e293b", strokeWidth: 2 }));
  svg.appendChild(rc.line(10, 140, 250, 140, { stroke: "#475569", strokeWidth: 2 }));
}, "Shopping cart: push harder = faster");

export const KineticAnalogy = makeAnalogy((rc, svg) => {
  svg.appendChild(rc.rectangle(10, 130, 230, 10, { stroke: "#475569", fill: "#1e293b" }));
  svg.appendChild(rc.circle(120, 115, 40, { stroke: "#60a5fa", fill: "#60a5fa22", roughness: 1.5 }));
  const trail: [number, number][] = Array.from({ length: 12 }, (_, i) => [10 + i * 9, 115 + (Math.random() - 0.5) * 4]);
  svg.appendChild(rc.linearPath(trail, { stroke: "#6366f1", strokeWidth: 1.5, roughness: 0.8 }));
}, "Ball rolling = stored motion energy");

export const OhmsAnalogy = makeAnalogy((rc, svg) => {
  svg.appendChild(rc.rectangle(10, 85, 240, 30, { stroke: "#60a5fa", fill: "#60a5fa11", roughness: 1.2 }));
  svg.appendChild(rc.rectangle(90, 70, 60, 60, { stroke: "#fb923c", fill: "#fb923c22", roughness: 1.5 }));
  for (let i = 0; i < 5; i++) {
    svg.appendChild(rc.circle(20 + i * 45, 100, 8, { fill: "#fbbf24", stroke: "#fbbf24", roughness: 1 }));
  }
}, "Water pipe: pressure drives flow");

export const WaveAnalogy = makeAnalogy((rc, svg) => {
  const pts: [number, number][] = Array.from({ length: 25 }, (_, i) => [10 + i * 10, 100 + Math.sin(i * 0.8) * 40]);
  svg.appendChild(rc.linearPath(pts, { stroke: "#38bdf8", strokeWidth: 2.5, roughness: 1.2 }));
  svg.appendChild(rc.line(10, 100, 250, 100, { stroke: "#1e293b", strokeWidth: 1 }));
}, "Shake a rope: that is a wave!");

export const CompoundAnalogy = makeAnalogy((rc, svg) => {
  [40, 70, 110, 160, 80].forEach((h, i) => {
    const x = 20 + i * 46;
    svg.appendChild(rc.rectangle(x, 150 - h, 30, h, { stroke: "#34d399", fill: "#34d39933", roughness: 1.5 }));
  });
}, "Money snowball growing each year");

export const IdealGasAnalogy = makeAnalogy((rc, svg) => {
  svg.appendChild(rc.rectangle(60, 50, 140, 110, { stroke: "#fb923c", fill: "#fb923c11", roughness: 1.5 }));
  for (let i = 0; i < 10; i++) {
    svg.appendChild(rc.circle(80 + (i % 5) * 24, 70 + Math.floor(i / 5) * 50, 14, { fill: "#fb923c44", stroke: "#fb923c", roughness: 1 }));
  }
}, "Bouncing molecules = gas pressure");

export const Pythagorean3DAnalogy = makeAnalogy((rc, svg) => {
  svg.appendChild(rc.rectangle(30, 80, 120, 80, { stroke: "#6366f1", fill: "#6366f122", roughness: 1.5 }));
  svg.appendChild(rc.rectangle(70, 40, 120, 80, { stroke: "#8b5cf6", fill: "#8b5cf622", roughness: 1.5 }));
  svg.appendChild(rc.line(30, 160, 70, 120, { stroke: "#34d399", strokeWidth: 1.5 }));
  svg.appendChild(rc.line(150, 80, 190, 40, { stroke: "#34d399", strokeWidth: 1.5 }));
  svg.appendChild(rc.line(30, 80, 70, 40, { stroke: "#fbbf24", strokeWidth: 2, strokeLineDash: [6, 3] }));
}, "Room diagonal: 3D Pythagoras");

export const SphereVolumeAnalogy = makeAnalogy((rc, svg) => {
  svg.appendChild(rc.circle(80, 100, 80, { stroke: "#38bdf8", fill: "#38bdf822", roughness: 1.5 }));
  svg.appendChild(rc.circle(200, 100, 50, { stroke: "#38bdf8", fill: "#38bdf822", roughness: 1.5 }));
  const l1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
  l1.setAttribute("x", "80"); l1.setAttribute("y", "175"); l1.setAttribute("fill", "#38bdf8");
  l1.setAttribute("font-size", "10"); l1.setAttribute("text-anchor", "middle");
  l1.textContent = "Large orange";
  const l2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
  l2.setAttribute("x", "200"); l2.setAttribute("y", "160"); l2.setAttribute("fill", "#38bdf8");
  l2.setAttribute("font-size", "10"); l2.setAttribute("text-anchor", "middle");
  l2.textContent = "Small";
  svg.appendChild(l1); svg.appendChild(l2);
}, "Bigger orange = 8× the juice");
