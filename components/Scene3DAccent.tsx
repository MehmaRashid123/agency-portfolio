"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ─── Crystal fragment ──────────────────────────────────────────────────── */
function Fragment({ index, total }: { index: number; total: number }) {
  const ref = useRef<THREE.Mesh>(null);

  const { basePos, rotSpeed, size, delay, color } = useMemo(() => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    const r = 1.2 + Math.random() * 0.8;
    return {
      basePos: new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      ),
      rotSpeed: (Math.random() - 0.5) * 2,
      size: 0.08 + Math.random() * 0.14,
      delay: Math.random() * Math.PI * 2,
      color: index % 2 === 0 ? "#00d4ff" : "#7b2fff",
    };
  }, [index, total]);

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    const breathe = 1 + Math.sin(t * 0.9 + delay) * 0.18;
    ref.current.position.set(basePos.x * breathe, basePos.y * breathe, basePos.z * breathe);
    ref.current.rotation.x = t * rotSpeed * 0.6;
    ref.current.rotation.y = t * rotSpeed * 0.4;
  });

  return (
    <mesh ref={ref}>
      <tetrahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6}
        roughness={0.1} metalness={0.95} transparent opacity={0.8} />
    </mesh>
  );
}

/* ─── Inner pulsing core ────────────────────────────────────────────────── */
function Core() {
  const ref = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.x = t * 0.18;
      ref.current.rotation.y = t * 0.24;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.12;
      wireRef.current.rotation.y = t * 0.16;
      wireRef.current.scale.setScalar(1 + Math.sin(t * 1.8) * 0.05);
    }
  });

  return (
    <>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.55, 3]} />
        <MeshDistortMaterial color="#00d4ff" distort={0.4} speed={3}
          roughness={0.6} metalness={0.4} emissive="#00d4ff" emissiveIntensity={0.4}
          opacity={0.35} transparent />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshBasicMaterial color="#7b2fff" wireframe opacity={0.25} transparent />
      </mesh>
    </>
  );
}

/* ─── Connection lines ──────────────────────────────────────────────────── */
function ConnectionLines({ total }: { total: number }) {
  const ref = useRef<THREE.LineSegments>(null);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.08 }), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(total * 6);
    for (let i = 0; i < total; i++) {
      const phi = Math.acos(-1 + (2 * i) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;
      const r = 1.5;
      arr[i * 6] = 0; arr[i * 6 + 1] = 0; arr[i * 6 + 2] = 0;
      arr[i * 6 + 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 6 + 4] = r * Math.cos(phi);
      arr[i * 6 + 5] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [total]);

  useFrame((s) => { mat.opacity = 0.05 + Math.sin(s.clock.elapsedTime * 1.2) * 0.04; });

  return (
    <lineSegments ref={ref} material={mat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </lineSegments>
  );
}

/* ─── Ambient particles ─────────────────────────────────────────────────── */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.015;
    ref.current.rotation.x = s.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00d4ff" size={0.022} sizeAttenuation transparent opacity={0.3} depthWrite={false} />
    </points>
  );
}

/* ─── Scene root ─────────────────────────────────────────────────────────── */
export default function Scene3DAccent() {
  const TOTAL = 32;
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 48 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }} aria-hidden="true">
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 4]} intensity={3} color="#00d4ff" />
      <pointLight position={[4, 3, 2]} intensity={0.8} color="#7b2fff" />
      <pointLight position={[-4, -3, -2]} intensity={0.4} color="#00d4ff" />
      <Particles />
      <ConnectionLines total={TOTAL} />
      {Array.from({ length: TOTAL }, (_, i) => <Fragment key={i} index={i} total={TOTAL} />)}
      <Core />
    </Canvas>
  );
}
