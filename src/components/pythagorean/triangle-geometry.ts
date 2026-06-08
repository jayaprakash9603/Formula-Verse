export interface Point {
  x: number;
  y: number;
}

export interface TriangleState {
  a: number;
  b: number;
  c: number;
  A: Point;
  B: Point;
  C: Point;
}

const UNIT = 40;
const ORIGIN = { x: 120, y: 280 };

export function createTriangle(aUnits: number, bUnits: number): TriangleState {
  const a = aUnits;
  const b = bUnits;
  const c = Math.sqrt(a * a + b * b);
  const C = { ...ORIGIN };
  const A = { x: ORIGIN.x, y: ORIGIN.y - b * UNIT };
  const B = { x: ORIGIN.x + a * UNIT, y: ORIGIN.y };
  return { a, b, c, A, B, C };
}

export function hypotenuseSquarePoints(A: Point, B: Point): Point[] {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const perp = { x: -dy, y: dx };
  return [
    A,
    B,
    { x: B.x + perp.x, y: B.y + perp.y },
    { x: A.x + perp.x, y: A.y + perp.y },
  ];
}

export function pointsToString(points: Point[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

export function snapUnits(value: number, min: number, max: number): number {
  const snapped = Math.round(value * 2) / 2;
  return Math.min(max, Math.max(min, snapped));
}

export function gridLines(count: number, size: number): number[] {
  return Array.from({ length: count + 1 }, (_, i) => i * size);
}
