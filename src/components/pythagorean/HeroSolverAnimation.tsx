"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { createTriangle, hypotenuseSquarePoints, pointsToString } from "./triangle-geometry";

const UNIT = 40;
const MID = 4;
const AMP = 1.2;
const VIEW_PAD = 40;
const SPEED_A = 0.00045;
const SPEED_B = 0.00032;
const PHASE = Math.PI / 2;
const DISPLAY_INTERVAL = 90;
const MARKER = 14;

const { x: ORIGIN_X, y: ORIGIN_Y } = createTriangle(1, 1).C;

const waveA = (t: number) => MID + AMP * Math.sin(t * SPEED_A);
const waveB = (t: number) => MID + AMP * Math.sin(t * SPEED_B + PHASE);

const round1 = (n: number) => Math.round(n * 10) / 10;
const format = (n: number) => n.toFixed(1);

function Chip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="neu-flat rounded-xl bg-card px-3 py-2.5 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-mono text-lg font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function Readout({ a, b, live }: { a: number; b: number; live: boolean }) {
  const ra = round1(a);
  const rb = round1(b);
  const aSquared = ra * ra;
  const bSquared = rb * rb;
  const cSquared = aSquared + bSquared;

  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
        <span className="relative flex h-2 w-2">
          {live && (
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping"
              style={{ backgroundColor: "var(--success)" }}
            />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: "var(--success)" }} />
        </span>
        <span>{live ? "Live · auto-solving" : "Pythagorean triple · 3 · 4 · 5"}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Chip label="a" value={format(ra)} color="var(--warning)" />
        <Chip label="b" value={format(rb)} color="var(--primary)" />
        <Chip label="c" value={format(Math.sqrt(cSquared))} color="var(--success)" />
      </div>

      <div className="neu-inset rounded-xl px-4 py-3 text-center">
        <div className="font-mono text-sm font-bold text-foreground">a² + b² = c²</div>
        <div className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
          {format(aSquared)} + {format(bSquared)} = {format(cSquared)}
        </div>
      </div>
    </div>
  );
}

export default function HeroSolverAnimation() {
  const reduced = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const startRef = useRef<number | null>(null);
  const lastDisplayRef = useRef(0);

  const aMV = useMotionValue(reduced ? 3 : waveA(0));
  const bMV = useMotionValue(reduced ? 4 : waveB(0));

  const [display, setDisplay] = useState(() => ({
    a: reduced ? 3 : waveA(0),
    b: reduced ? 4 : waveB(0),
  }));

  const trianglePoints = useTransform(() => {
    const t = createTriangle(aMV.get(), bMV.get());
    return `${t.C.x},${t.C.y} ${t.A.x},${t.A.y} ${t.B.x},${t.B.y}`;
  });
  const squareCPoints = useTransform(() => {
    const t = createTriangle(aMV.get(), bMV.get());
    return pointsToString(hypotenuseSquarePoints(t.A, t.B));
  });
  const sqASize = useTransform(() => aMV.get() * UNIT);
  const sqBSize = useTransform(() => bMV.get() * UNIT);
  const sqBX = useTransform(() => ORIGIN_X - bMV.get() * UNIT);
  const sqBY = useTransform(() => ORIGIN_Y - bMV.get() * UNIT);
  const viewBox = useTransform(() => {
    const a = aMV.get();
    const b = bMV.get();
    const minX = ORIGIN_X - b * UNIT;
    const minY = ORIGIN_Y - b * UNIT;
    const span = (a + b) * UNIT;
    return `${minX - VIEW_PAD} ${minY - VIEW_PAD} ${span + VIEW_PAD * 2} ${span + VIEW_PAD * 2}`;
  });

  useAnimationFrame((t) => {
    if (reduced || !visibleRef.current) return;
    if (startRef.current === null) startRef.current = t;
    const elapsed = t - startRef.current;
    const a = waveA(elapsed);
    const b = waveB(elapsed);
    aMV.set(a);
    bMV.set(b);
    if (elapsed - lastDisplayRef.current >= DISPLAY_INTERVAL) {
      lastDisplayRef.current = elapsed;
      setDisplay({ a, b });
    }
  });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full max-w-md mx-auto">
      <motion.svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        role="img"
        aria-label="A right triangle continuously changing shape while the squares on its three sides and the values of a, b, and c update in real time to satisfy a squared plus b squared equals c squared."
      >
        <motion.polygon
          points={squareCPoints}
          fill="var(--success)"
          fillOpacity="0.18"
          stroke="var(--success)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <motion.rect
          x={ORIGIN_X}
          y={ORIGIN_Y}
          width={sqASize}
          height={sqASize}
          fill="var(--warning)"
          fillOpacity="0.22"
          stroke="var(--warning)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <motion.rect
          x={sqBX}
          y={sqBY}
          width={sqBSize}
          height={sqBSize}
          fill="var(--primary)"
          fillOpacity="0.18"
          stroke="var(--primary)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <motion.polygon
          points={trianglePoints}
          fill="var(--brand-soft)"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M ${ORIGIN_X + MARKER} ${ORIGIN_Y} L ${ORIGIN_X + MARKER} ${ORIGIN_Y - MARKER} L ${ORIGIN_X} ${ORIGIN_Y - MARKER}`}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>

      <Readout a={display.a} b={display.b} live={!reduced} />
    </div>
  );
}
