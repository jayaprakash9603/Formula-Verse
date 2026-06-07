import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { FormulaVisualizerConfig } from "./types";

interface SceneProps {
  config: FormulaVisualizerConfig;
  values: Record<string, number>;
  height: number;
}

function IdealGasScene({ values }: { values: Record<string, number> }) {
  const { T = 300, V = 24.6 } = values;
  const speed = Math.sqrt(T / 300);
  const scale = (V / 24.6) ** (1 / 3);
  const count = 20;

  const positions = React.useRef(
    Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 1.6,
      (Math.random() - 0.5) * 1.6,
      (Math.random() - 0.5) * 1.6,
    ]),
  );
  const velocities = React.useRef(
    Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 0.04,
      (Math.random() - 0.5) * 0.04,
      (Math.random() - 0.5) * 0.04,
    ]),
  );
  const meshRefs = React.useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const half = scale * 1.0;
    positions.current.forEach((pos, i) => {
      const vel = velocities.current[i];
      for (let ax = 0; ax < 3; ax++) {
        pos[ax] += vel[ax] * speed;
        if (pos[ax] > half || pos[ax] < -half) {
          vel[ax] *= -1;
          pos[ax] = Math.max(-half, Math.min(half, pos[ax]));
        }
      }
      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.set(pos[0], pos[1], pos[2]);
      }
    });
  });

  const heatColor = new THREE.Color().setHSL(0.6 - (T / 1000) * 0.5, 0.8, 0.5 + (T / 1000) * 0.2);

  return (
    <>
      <mesh>
        <boxGeometry args={[scale * 2, scale * 2, scale * 2]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transparent
          opacity={0.08}
          roughness={0.1}
          metalness={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(scale * 2, scale * 2, scale * 2)]} />
        <lineBasicMaterial color="#38bdf8" opacity={0.4} transparent />
      </lineSegments>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          position={positions.current[i] as [number, number, number]}
        >
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={heatColor} emissive={heatColor} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </>
  );
}

function Pythagoras3DScene({ values }: { values: Record<string, number> }) {
  const { a = 3, b = 4, c = 5 } = values;
  const scale = 0.3;
  const w = a * scale, d = b * scale, h = c * scale;

  return (
    <>
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshPhysicalMaterial color="#6366f1" transparent opacity={0.1} roughness={0.2} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color="#8b5cf6" />
      </lineSegments>
      <line>
        <bufferGeometry
          setFromPoints={[
            new THREE.Vector3(-w / 2, -h / 2, -d / 2),
            new THREE.Vector3(w / 2, h / 2, d / 2),
          ]}
        />
        <lineBasicMaterial color="#fbbf24" linewidth={3} />
      </line>
      <Text position={[0, h / 2 + 0.15, 0]} fontSize={0.15} color="#fbbf24">
        {`d = ${Math.sqrt(a ** 2 + b ** 2 + c ** 2).toFixed(2)}`}
      </Text>
      <Text position={[0, -h / 2 - 0.15, 0]} fontSize={0.12} color="#6366f1">
        {`a=${a} b=${b} c=${c}`}
      </Text>
      <OrbitControls autoRotate autoRotateSpeed={0.8} enableZoom={true} />
    </>
  );
}

function SphereVolumeScene({ values }: { values: Record<string, number> }) {
  const { r = 3 } = values;
  const scale = Math.min(1.2, 2 / r);
  const sr = r * scale;
  const V = (4 / 3) * Math.PI * r ** 3;
  const cubeS = V ** (1 / 3) * scale;

  const discRef = React.useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (discRef.current) {
      discRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * sr * 0.8;
    }
  });

  return (
    <>
      <mesh position={[-sr * 0.8, 0, 0]}>
        <sphereGeometry args={[sr, 48, 48]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.2}
          transmission={0.6}
        />
      </mesh>
      <mesh ref={discRef} position={[-sr * 0.8, 0, 0]}>
        <cylinderGeometry args={[sr * 0.99, sr * 0.99, 0.02, 48]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.5} />
      </mesh>
      <mesh position={[cubeS * 0.8 + 0.3, 0, 0]}>
        <boxGeometry args={[cubeS, cubeS, cubeS]} />
        <meshStandardMaterial color="#fbbf24" transparent opacity={0.3} wireframe={false} />
      </mesh>
      <lineSegments position={[cubeS * 0.8 + 0.3, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(cubeS, cubeS, cubeS)]} />
        <lineBasicMaterial color="#fbbf24" />
      </lineSegments>
      <Text position={[-sr * 0.8, -sr - 0.2, 0]} fontSize={0.18} color="#38bdf8">
        {`V = ${((4 / 3) * Math.PI * r ** 3).toFixed(2)} m³`}
      </Text>
      <OrbitControls enableZoom={true} />
    </>
  );
}

export default function FormulaThreeScene({ config, values, height }: SceneProps) {
  return (
    <div
      className="w-full rounded-lg overflow-hidden border border-border"
      style={{ height, background: "var(--formula-viz-bg)" }}
    >
      <Canvas camera={{ position: [3, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        {config.slug === "ideal-gas-law-visualizer" && <IdealGasScene values={values} />}
        {config.slug === "pythagorean-3d-theorem" && <Pythagoras3DScene values={values} />}
        {config.slug === "sphere-volume-visualizer" && <SphereVolumeScene values={values} />}
        {config.slug !== "pythagorean-3d-theorem" && (
          <OrbitControls autoRotate={false} enableZoom={true} />
        )}
      </Canvas>
    </div>
  );
}
