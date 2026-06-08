"use client";
import { useEffect, useRef, useState } from "react";
import type * as THREEType from "three";
import type { OrbitControls as OrbitControlsType } from "three/examples/jsm/controls/OrbitControls.js";

const A = 3;
const B = 4;
const C = Math.hypot(A, B);
const THICKNESS = 0.9;

const GROW_MS = 900;
const CUT_MS = 1100;
const A_MOVE_MS = 1400;
const PIECE_MS = 850;
const DONE_HOLD_MS = 2400;
const LOOP_GAP_MS = 1100;

const EXPLODE = 0.5;
const HOP = 1.5;

type Pt = [number, number];

const SQUARE_A: Pt[] = [
  [0, 0],
  [A, 0],
  [A, -A],
  [0, -A],
];
const SQUARE_C: Pt[] = [
  [3, 0],
  [0, 4],
  [4, 7],
  [7, 3],
];
const TRIANGLE: Pt[] = [
  [0, 0],
  [3, 0],
  [0, 4],
];

// Perigal's dissection for the 3-4-5 triangle: the b-square is sliced through
// its centre into four congruent pieces that — together with the whole a-square
// placed in the middle — tile the c-square exactly. Every move is a pure
// translation (verified to cover the c-square with no gaps or overlaps).
const B_PIECES: Array<{ src: Pt[]; target: Pt }> = [
  { src: [[-2, 2], [-0.5, 0], [0, 0], [0, 3.5]], target: [2, 2] },
  { src: [[-2, 2], [0, 3.5], [0, 4], [-3.5, 4]], target: [5, -2] },
  { src: [[-2, 2], [-3.5, 4], [-4, 4], [-4, 0.5]], target: [9, 1] },
  { src: [[-2, 2], [-4, 0.5], [-4, 0], [-0.5, 0]], target: [6, 5] },
];
const A_TARGET: Pt = [2, 5];

const ALL_POINTS: Pt[] = [...SQUARE_A, ...B_PIECES.flatMap((p) => p.src), ...SQUARE_C];
const CENTER_X = (Math.min(...ALL_POINTS.map((p) => p[0])) + Math.max(...ALL_POINTS.map((p) => p[0]))) / 2;
const CENTER_Y = (Math.min(...ALL_POINTS.map((p) => p[1])) + Math.max(...ALL_POINTS.map((p) => p[1]))) / 2;

const centroidCentered = (pts: Pt[]): [number, number] => {
  const sx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const sy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return [sx - CENTER_X, sy - CENTER_Y];
};

const A_CENTROID = centroidCentered(SQUARE_A);
const B_CENTROID = centroidCentered(B_PIECES.flatMap((p) => p.src));
const C_CENTROID = centroidCentered(SQUARE_C);
const B_RAW_CENTER: Pt = [-2, 2];

const EXPLODE_DIRS = B_PIECES.map(({ src }) => {
  const cx = src.reduce((s, p) => s + p[0], 0) / src.length - B_RAW_CENTER[0];
  const cy = src.reduce((s, p) => s + p[1], 0) / src.length - B_RAW_CENTER[1];
  const len = Math.hypot(cx, cy) || 1;
  return [cx / len, cy / len] as Pt;
});

const PHASE_CAPTIONS = [
  "Build a square on each side — a² = 9, b² = 16, c² = 25.",
  "Slice the b-square through its centre into 4 equal pieces.",
  "Slide the whole a-square into the middle of the c-square.",
  "Fit the 4 b-pieces around it, one by one…",
  "Filled with no gaps — so a² + b² = c².",
];

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const A_START = GROW_MS + CUT_MS;
const PIECES_START = A_START + A_MOVE_MS;
const DONE_START = PIECES_START + B_PIECES.length * PIECE_MS;
const LOOP_TOTAL = DONE_START + DONE_HOLD_MS + LOOP_GAP_MS;

function readToken(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw || fallback;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface FrameState {
  growScale: number;
  exFactor: number;
  aProgress: number;
  pieceProgress: number[];
  glow: number;
  phase: number;
}

function computeFrame(elapsed: number): FrameState {
  const growScale = easeOutCubic(Math.min(1, elapsed / GROW_MS));
  const exFactor = elapsed > GROW_MS ? easeInOut(Math.min(1, (elapsed - GROW_MS) / CUT_MS)) : 0;
  const aProgress = elapsed > A_START ? easeInOut(Math.min(1, (elapsed - A_START) / A_MOVE_MS)) : 0;
  const pieceProgress = B_PIECES.map((_, i) => {
    const start = PIECES_START + i * PIECE_MS;
    return elapsed > start ? easeInOut(Math.min(1, (elapsed - start) / PIECE_MS)) : 0;
  });
  const glow = elapsed > DONE_START ? Math.min(1, (elapsed - DONE_START) / 600) : 0;

  let phase = 0;
  if (elapsed >= DONE_START) phase = 4;
  else if (elapsed >= PIECES_START) phase = 3;
  else if (elapsed >= A_START) phase = 2;
  else if (elapsed >= GROW_MS) phase = 1;

  return { growScale, exFactor, aProgress, pieceProgress, glow, phase };
}

interface SceneApi {
  setAutoRotate: (on: boolean) => void;
  replay: () => void;
}

export default function Derivation3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<SceneApi | null>(null);
  const labelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reduced = useRef<boolean>(prefersReducedMotion());

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [autoRotate, setAutoRotate] = useState(!prefersReducedMotion());
  const [phase, setPhase] = useState(reduced.current ? 4 : 0);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      let THREE: typeof THREEType;
      let OrbitControls: typeof OrbitControlsType;
      try {
        THREE = await import("three");
        ({ OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js"));
      } catch {
        if (!disposed) setFailed(true);
        return;
      }
      const container = containerRef.current;
      if (disposed || !container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
      const CAMERA_HOME = new THREE.Vector3(2, 11, 16);
      camera.position.copy(CAMERA_HOME);

      let renderer: THREEType.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        if (!disposed) setFailed(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.touchAction = "pan-y";

      const ambient = new THREE.AmbientLight(0xffffff, 0.78);
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(6, 12, 8);
      const fill = new THREE.DirectionalLight(0xffffff, 0.4);
      fill.position.set(-8, 4, -6);
      scene.add(ambient, key, fill);

      const root = new THREE.Group();
      root.rotation.x = -Math.PI / 2;
      scene.add(root);

      const figure = new THREE.Group();
      root.add(figure);

      const disposables: Array<{ dispose: () => void }> = [];
      const faceMaterials: THREEType.MeshStandardMaterial[] = [];
      const edgeMaterials: THREEType.LineBasicMaterial[] = [];

      const makeShape = (pts: Pt[]) => {
        const shape = new THREE.Shape();
        pts.forEach(([x, y], i) => {
          const sx = x - CENTER_X;
          const sy = y - CENTER_Y;
          if (i === 0) shape.moveTo(sx, sy);
          else shape.lineTo(sx, sy);
        });
        shape.closePath();
        return shape;
      };

      const brand = new THREE.Color(readToken("--brand", "#006666"));

      const addSlab = (
        pts: Pt[],
        color: THREEType.Color,
        token: string | null,
        fallback: string,
        opacity: number,
        depth: number,
        parent: THREEType.Group,
        edgeOpacity = 0.55,
      ) => {
        const group = new THREE.Group();
        const geom = new THREE.ExtrudeGeometry(makeShape(pts), { depth, bevelEnabled: false });
        disposables.push(geom);
        const faceMat = new THREE.MeshStandardMaterial({
          color: color.clone(),
          transparent: true,
          opacity,
          roughness: 0.45,
          metalness: 0.05,
          side: THREE.DoubleSide,
        });
        if (token) {
          faceMat.userData.token = token;
          faceMat.userData.fallback = fallback;
          faceMaterials.push(faceMat);
        }
        disposables.push(faceMat);
        group.add(new THREE.Mesh(geom, faceMat));

        const edgeGeom = new THREE.EdgesGeometry(geom);
        disposables.push(edgeGeom);
        const edgeMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(readToken("--foreground", fallback)),
          transparent: true,
          opacity: edgeOpacity,
        });
        edgeMaterials.push(edgeMat);
        disposables.push(edgeMat);
        group.add(new THREE.LineSegments(edgeGeom, edgeMat));

        parent.add(group);
        return { group, faceMat, edgeMat };
      };

      addSlab(TRIANGLE, new THREE.Color(readToken("--foreground", "#1E2938")), "--foreground", "#1E2938", 0.16, 0.08, root);

      // c-square frame: the goal outline the pieces will fill, drawn at its final spot.
      const cFrame = addSlab(
        SQUARE_C,
        new THREE.Color(readToken("--success", "#00A63D")),
        "--success",
        "#00A63D",
        0.1,
        0.04,
        figure,
        0.85,
      );

      const aSlab = addSlab(SQUARE_A, new THREE.Color(readToken("--warning", "#FE9900")), "--warning", "#FE9900", 0.92, THICKNESS, figure);

      const pieceSlabs = B_PIECES.map(({ src }, i) => {
        const shade = i % 2 === 0 ? 1 : 0.78;
        const color = brand.clone().multiplyScalar(shade);
        return addSlab(src, color, null, "#006666", 0.9, THICKNESS, figure, 0.7);
      });

      const labelAnchors = [
        (() => {
          const a = new THREE.Object3D();
          a.position.set(A_CENTROID[0], A_CENTROID[1], THICKNESS + 0.3);
          aSlab.group.add(a);
          return a;
        })(),
        (() => {
          const a = new THREE.Object3D();
          a.position.set(B_CENTROID[0], B_CENTROID[1], THICKNESS + 0.3);
          figure.add(a);
          return a;
        })(),
        (() => {
          const a = new THREE.Object3D();
          a.position.set(C_CENTROID[0], C_CENTROID[1], THICKNESS + 0.3);
          figure.add(a);
          return a;
        })(),
      ];
      const labelVec = new THREE.Vector3();
      const labelOpacity = [1, 1, 0];
      const updateLabels = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        labelAnchors.forEach((anchor, i) => {
          const el = labelRefs.current[i];
          if (!el) return;
          anchor.getWorldPosition(labelVec);
          labelVec.project(camera);
          const inFront = labelVec.z < 1;
          const px = (labelVec.x * 0.5 + 0.5) * w;
          const py = (-labelVec.y * 0.5 + 0.5) * h;
          el.style.transform = `translate(-50%, -50%) translate(${px}px, ${py}px)`;
          el.style.opacity = inFront ? String(labelOpacity[i]) : "0";
        });
      };

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.minDistance = 9;
      controls.maxDistance = 34;
      controls.autoRotateSpeed = 0.7;
      controls.target.set(0, THICKNESS * 0.4, 0);
      controls.autoRotate = !reduced.current;

      const applyFrame = (f: FrameState) => {
        figure.scale.z = Math.max(0.0001, f.growScale);

        const ax = lerp(0, A_TARGET[0], f.aProgress);
        const ay = lerp(0, A_TARGET[1], f.aProgress);
        const aHop = HOP * Math.sin(Math.PI * f.aProgress);
        aSlab.group.position.set(ax, ay, aHop);

        pieceSlabs.forEach((slab, i) => {
          const exX = EXPLODE_DIRS[i][0] * EXPLODE * f.exFactor;
          const exY = EXPLODE_DIRS[i][1] * EXPLODE * f.exFactor;
          const p = f.pieceProgress[i];
          const px = lerp(exX, B_PIECES[i].target[0], p);
          const py = lerp(exY, B_PIECES[i].target[1], p);
          const hop = HOP * Math.sin(Math.PI * p);
          slab.group.position.set(px, py, hop);
          slab.faceMat.opacity = 0.9 + 0.08 * f.glow;
        });

        const pulse = f.glow > 0 ? 1 + 0.04 * Math.sin(Date.now() * 0.006) * f.glow : 1;
        cFrame.faceMat.opacity = 0.1 + 0.35 * f.glow;
        cFrame.edgeMat.opacity = 0.85;
        cFrame.group.scale.setScalar(pulse);

        labelOpacity[0] = 1;
        labelOpacity[1] = 1 - f.aProgress;
        labelOpacity[2] = f.glow;
      };

      let startTime = -1;
      let looping = !reduced.current;
      let visible = true;
      let raf = 0;
      let lastPhase = -1;

      if (reduced.current) {
        applyFrame(computeFrame(LOOP_TOTAL));
      }

      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        if (looping) {
          if (startTime < 0) startTime = now;
          let elapsed = now - startTime;
          if (elapsed > LOOP_TOTAL) {
            startTime = now;
            elapsed = 0;
          }
          const f = computeFrame(elapsed);
          applyFrame(f);
          if (f.phase !== lastPhase) {
            lastPhase = f.phase;
            setPhase(f.phase);
          }
        }
        controls.update();
        renderer.render(scene, camera);
        updateLabels();
      };
      raf = requestAnimationFrame(tick);

      const resize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      intersectionObserver.observe(container);

      const applyThemeColors = () => {
        brand.set(readToken("--brand", "#006666"));
        pieceSlabs.forEach((slab, i) => {
          const shade = i % 2 === 0 ? 1 : 0.78;
          slab.faceMat.color.copy(brand).multiplyScalar(shade);
        });
        faceMaterials.forEach((m) => {
          if (m.userData.token) m.color.set(readToken(m.userData.token as string, m.userData.fallback as string));
        });
        const edgeColor = readToken("--foreground", "#1E2938");
        edgeMaterials.forEach((m) => m.color.set(edgeColor));
      };
      const themeObserver = new MutationObserver(applyThemeColors);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

      apiRef.current = {
        setAutoRotate: (on: boolean) => {
          controls.autoRotate = on;
        },
        replay: () => {
          camera.position.copy(CAMERA_HOME);
          controls.target.set(0, THICKNESS * 0.4, 0);
          controls.update();
          if (reduced.current) {
            applyFrame(computeFrame(LOOP_TOTAL));
            return;
          }
          startTime = -1;
          looping = true;
          lastPhase = -1;
        },
      };

      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        themeObserver.disconnect();
        controls.dispose();
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.forceContextLoss();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      disposed = true;
      apiRef.current = null;
      cleanup();
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate, ready]);

  if (failed) {
    return (
      <div className="flex h-full min-h-[360px] items-center justify-center rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground">
        3D view is unavailable on this device. Cutting the two smaller squares apart and sliding the
        pieces into the largest square fills it exactly — that is why a² + b² = c².
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="relative h-[380px] w-full overflow-hidden rounded-xl sm:h-[440px]"
        aria-label="Rotatable 3D dissection: the square on side a slides into the centre of the square on the hypotenuse, and the square on side b is cut into four pieces that slide in around it, filling the largest square exactly."
        role="img"
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { side: `a = ${A}`, area: `a² = ${A * A}`, color: "var(--warning)" },
          { side: `b = ${B}`, area: `b² = ${B * B}`, color: "var(--brand)" },
          { side: `c = ${C}`, area: `c² = ${C * C}`, color: "var(--success)" },
        ].map((l, i) => (
          <div
            key={l.side}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{ opacity: 0, transition: "opacity 200ms ease" }}
          >
            <div className="neu-flat rounded-md bg-card/90 px-2 py-1 text-center font-mono leading-tight backdrop-blur-sm">
              <div className="text-[11px] font-bold" style={{ color: l.color }}>
                {l.side}
              </div>
              <div className="text-[9px] text-muted-foreground">{l.area}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
        {[
          { label: "side a", color: "var(--warning)" },
          { label: "side b", color: "var(--brand)" },
          { label: "side c", color: "var(--success)" },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 w-[88%] max-w-[420px] -translate-x-1/2">
        <div className="neu-inset rounded-xl bg-card/85 px-4 py-2 text-center backdrop-blur-sm">
          <div className="font-mono text-sm font-bold tabular-nums text-foreground">
            <span style={{ color: "var(--warning)" }}>9</span>
            {" + "}
            <span style={{ color: "var(--brand)" }}>16</span>
            {" = "}
            <span style={{ color: "var(--success)" }}>25</span>
          </div>
          <div className="mt-0.5 min-h-[14px] font-mono text-[10px] leading-tight text-muted-foreground">
            {PHASE_CAPTIONS[phase]}
          </div>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex gap-2">
        <button
          type="button"
          onClick={() => setAutoRotate((v) => !v)}
          aria-pressed={autoRotate}
          className="neu-flat neu-interactive rounded-lg bg-card px-3 py-1.5 text-xs font-semibold text-foreground"
        >
          {autoRotate ? "Pause spin" : "Spin"}
        </button>
        <button
          type="button"
          onClick={() => apiRef.current?.replay()}
          className="neu-flat neu-interactive rounded-lg bg-card px-3 py-1.5 text-xs font-semibold text-foreground"
        >
          Replay
        </button>
      </div>

      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          Loading 3D model…
        </div>
      )}
    </div>
  );
}
