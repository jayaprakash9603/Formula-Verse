import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionShell from "./SectionShell";
import {
  createTriangle,
  gridLines,
  hypotenuseSquarePoints,
  pointsToString,
  snapUnits,
} from "./triangle-geometry";

const UNIT = 40;
const MIN = 2;
const MAX = 6;

function SquareGrid({ x, y, size, count, color }: {
  x: number; y: number; size: number; count: number; color: string;
}) {
  const lines = gridLines(count, size);
  return (
    <g>
      <rect x={x} y={y} width={count * size} height={count * size} fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
      {lines.map((pos) => (
        <g key={`${x}-${y}-${pos}`}>
          <line x1={x + pos} y1={y} x2={x + pos} y2={y + count * size} stroke={color} strokeOpacity="0.3" />
          <line x1={x} y1={y + pos} x2={x + count * size} y2={y + pos} stroke={color} strokeOpacity="0.3" />
        </g>
      ))}
    </g>
  );
}

export default function InteractiveTriangle() {
  const [aUnits, setAUnits] = useState(3);
  const [bUnits, setBUnits] = useState(4);
  const triangle = useMemo(() => createTriangle(aUnits, bUnits), [aUnits, bUnits]);
  const cSquare = hypotenuseSquarePoints(triangle.A, triangle.B);

  const VIEW_PAD = 28;
  const viewMinX = triangle.C.x - triangle.b * UNIT;
  const viewMinY = triangle.A.y;
  const viewSpan = (triangle.a + triangle.b) * UNIT;
  const viewBox = `${viewMinX - VIEW_PAD} ${viewMinY - VIEW_PAD} ${viewSpan + VIEW_PAD * 2} ${viewSpan + VIEW_PAD * 2}`;

  const handleDragA = useCallback((_: unknown, info: { delta: { y: number } }) => {
    setBUnits((prev) => snapUnits(prev - info.delta.y / UNIT, MIN, MAX));
  }, []);

  const handleDragB = useCallback((_: unknown, info: { delta: { x: number } }) => {
    setAUnits((prev) => snapUnits(prev + info.delta.x / UNIT, MIN, MAX));
  }, []);

  return (
    <SectionShell
      id="playground"
      title="Interactive Triangle Playground"
      subtitle="Drag the corner points to resize the triangle. Watch the squares and formula update in real time."
      centered
      contentClassName="max-w-[1174px] mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 items-start">
        <div className="neu-flat rounded-2xl p-4 sm:p-6 bg-card overflow-hidden">
          <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="w-full touch-none" aria-label="Interactive draggable right triangle">
            <SquareGrid x={triangle.C.x} y={triangle.C.y} size={UNIT} count={triangle.a} color="var(--warning)" />
            <SquareGrid x={triangle.A.x - triangle.b * UNIT} y={triangle.A.y} size={UNIT} count={triangle.b} color="var(--primary)" />
            <polygon points={pointsToString(cSquare)} fill="var(--success)" fillOpacity="0.15" stroke="var(--success)" strokeWidth="1.5" />
            <polygon
              points={`${triangle.C.x},${triangle.C.y} ${triangle.A.x},${triangle.A.y} ${triangle.B.x},${triangle.B.y}`}
              fill="var(--brand-soft)" stroke="var(--primary)" strokeWidth="2"
            />
            <motion.circle
              cx={triangle.A.x} cy={triangle.A.y} r="10"
              className="fill-primary cursor-grab active:cursor-grabbing"
              drag dragMomentum={false} onDrag={handleDragA}
              whileHover={{ scale: 1.2 }} aria-label="Drag to change side b"
            />
            <motion.circle
              cx={triangle.B.x} cy={triangle.B.y} r="10"
              className="fill-warning cursor-grab active:cursor-grabbing"
              drag dragMomentum={false} onDrag={handleDragB}
              whileHover={{ scale: 1.2 }} aria-label="Drag to change side a"
            />
          </svg>
        </div>

        <div className="space-y-4">
          <div className="neu-inset rounded-xl p-4 space-y-4">
            <label className="block text-xs text-muted-foreground">
              Side a ({aUnits})
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={0.5}
                value={aUnits}
                onChange={(e) => setAUnits(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
                aria-label="Adjust side a"
              />
            </label>
            <label className="block text-xs text-muted-foreground">
              Side b ({bUnits})
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={0.5}
                value={bUnits}
                onChange={(e) => setBUnits(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
                aria-label="Adjust side b"
              />
            </label>
          </div>
          {[
            { label: "Side a", value: triangle.a, area: triangle.a ** 2, color: "var(--warning)" },
            { label: "Side b", value: triangle.b, area: triangle.b ** 2, color: "var(--primary)" },
            { label: "Hypotenuse c", value: triangle.c.toFixed(2), area: (triangle.c ** 2).toFixed(2), color: "var(--success)" },
          ].map((item) => (
            <div key={item.label} className="neu-flat rounded-xl p-4 bg-card">
              <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
              <div className="font-mono text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
              <div className="text-xs text-muted-foreground mt-1">Area = {item.area}</div>
            </div>
          ))}
          <div className="neu-inset rounded-xl p-4 text-center font-mono text-lg font-bold text-foreground">
            {triangle.a}² + {triangle.b}² = {triangle.c.toFixed(2)}²
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {Math.round(triangle.a ** 2)} + {Math.round(triangle.b ** 2)} = {Math.round(triangle.c ** 2)}
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
