import * as React from "react";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

const COLORS = { a: "#818cf8", b: "#c084fc", c: "#34d399" };
const UNIT = 0.28;

function SideSquare({
  width,
  depth,
  position,
  rotation,
  color,
  label,
}: {
  width: number;
  depth: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  label: string;
}) {
  return (
    <group position={position} rotation={rotation ?? [0, 0, 0]}>
      <mesh>
        <boxGeometry args={[width, depth, 0.06]} />
        <meshPhysicalMaterial color={color} transparent opacity={0.35} roughness={0.3} metalness={0.1} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, depth, 0.06)]} />
        <lineBasicMaterial color={color} />
      </lineSegments>
      <Text position={[0, 0, 0.08]} fontSize={0.14} color={color} anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

export default function PythagoreanTheoremScene({ values }: { values: Record<string, number> }) {
  const sideA = values.a ?? 3;
  const sideB = values.b ?? 4;
  const a = sideA * UNIT;
  const b = sideB * UNIT;
  const c = Math.hypot(a, b);
  const hypAngle = Math.atan2(b, a);
  const cx = a / 2;
  const cy = b / 2;
  const hypLen = Math.hypot(sideA, sideB);

  const triShape = React.useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(a, 0);
    shape.lineTo(0, b);
    shape.closePath();
    return shape;
  }, [a, b]);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} />

      <group position={[-cx, -cy, 0]}>
        <mesh>
          <shapeGeometry args={[triShape]} />
          <meshPhysicalMaterial
            color={COLORS.c}
            transparent
            opacity={0.18}
            roughness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        <line>
          <bufferGeometry
            setFromPoints={[
              new THREE.Vector3(0, 0, 0.02),
              new THREE.Vector3(a, 0, 0.02),
              new THREE.Vector3(0, b, 0.02),
              new THREE.Vector3(0, 0, 0.02),
            ]}
          />
          <lineBasicMaterial color={COLORS.c} />
        </line>
        <line>
          <bufferGeometry
            setFromPoints={[new THREE.Vector3(0, 0, 0.03), new THREE.Vector3(a, 0, 0.03)]}
          />
          <lineBasicMaterial color={COLORS.a} />
        </line>
        <line>
          <bufferGeometry
            setFromPoints={[new THREE.Vector3(0, 0, 0.03), new THREE.Vector3(0, b, 0.03)]}
          />
          <lineBasicMaterial color={COLORS.b} />
        </line>
        <line>
          <bufferGeometry
            setFromPoints={[new THREE.Vector3(a, 0, 0.03), new THREE.Vector3(0, b, 0.03)]}
          />
          <lineBasicMaterial color={COLORS.c} />
        </line>

        <SideSquare width={a} depth={a * 0.55} position={[a / 2, -a * 0.28, 0]} color={COLORS.a} label="a²" />
        <SideSquare width={b * 0.55} depth={b} position={[-b * 0.28, b / 2, 0]} color={COLORS.b} label="b²" />
        <SideSquare
          width={c}
          depth={c * 0.55}
          position={[a / 2, b / 2, 0.04]}
          rotation={[0, 0, hypAngle]}
          color={COLORS.c}
          label="c²"
        />

        <Text position={[a / 2, -0.22, 0.1]} fontSize={0.12} color={COLORS.a} anchorX="center">
          {`a = ${sideA}`}
        </Text>
        <Text position={[-0.22, b / 2, 0.1]} fontSize={0.12} color={COLORS.b} anchorY="middle">
          {`b = ${sideB}`}
        </Text>
        <Text position={[a * 0.55, b * 0.55, 0.12]} fontSize={0.12} color={COLORS.c} rotation={[0, 0, hypAngle]}>
          {`c = ${hypLen.toFixed(2)}`}
        </Text>
      </group>

      <OrbitControls enablePan={false} minDistance={2.5} maxDistance={9} autoRotate autoRotateSpeed={0.6} />
    </>
  );
}
