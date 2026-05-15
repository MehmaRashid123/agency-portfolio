"use client";

/**
 * ScrollScene3D — A full-viewport 3D canvas that reacts to scroll.
 * Renders floating geometric shapes that parallax, rotate, and morph
 * as the user scrolls through the page.
 *
 * Used as a fixed background layer behind all page content.
 */

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── Scroll state shared across meshes ─────────────────────────────────── */
const scrollState = { y: 0, velocity: 0, prev: 0 };

function useScrollSync() {
  useEffect(() => {
    let raf: number;
    const onScroll = () => {
      const raw = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      scrollState.velocity = raw - scrollState.prev;
      scrollState.prev = raw;
      scrollState.y = raw;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}

/* ── Floating torus knot ────────────────────────────────────────────────── */
function TorusKnot({ position, speed, scrollFactor }: {
  position: [number, number, number];
  speed: number;
  scrollFactor: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.rotation.x = t * speed * 0.4;
    ref.current.rotation.y = t * speed * 0.6;
    ref.current.position.y = baseY - scrollState.y * scrollFactor * 8;
    // Velocity-based warp
    ref.current.scale.setScalar(1 + Math.abs(scrollState.velocity) * 12);
  });

  return (
    <mesh ref={ref} position={position}>
      <torusKnotGeometry args={[0.35, 0.1, 128, 16, 2, 3]} />
      <meshStandardMaterial
        color="#00d4ff"
        emissive="#00d4ff"
        emissiveIntensity={0.4}
        roughness={0.1}
        metalness={0.9}
        wireframe={false}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

/* ── Icosahedron ────────────────────────────────────────────────────────── */
function Icosa({ position, speed, scrollFactor, color }: {
  position: [number, number, number];
  speed: number;
  scrollFactor: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  useFrame((s) => {
    if (!ref.current || !wireRef.current) return;
    const t = s.clock.elapsedTime;
    ref.current.rotation.x = t * speed * 0.3;
    ref.current.rotation.y = t * speed * 0.5;
    ref.current.position.y = baseY - scrollState.y * scrollFactor * 6;
    wireRef.current.rotation.copy(ref.current.rotation);
    wireRef.current.position.copy(ref.current.position);
    const pulse = 1 + Math.sin(t * 1.5 + scrollFactor) * 0.06;
    wireRef.current.scale.setScalar(pulse * 1.15);
  });

  return (
    <>
      <mesh ref={ref} position={position}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35}
          roughness={0.2} metalness={0.8} transparent opacity={0.45} />
      </mesh>
      <mesh ref={wireRef} position={position}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
      </mesh>
    </>
  );
}

/* ── Octahedron ─────────────────────────────────────────────────────────── */
function Octa({ position, speed, scrollFactor }: {
  position: [number, number, number];
  speed: number;
  scrollFactor: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.rotation.x = t * speed * 0.5;
    ref.current.rotation.z = t * speed * 0.3;
    ref.current.position.y = baseY - scrollState.y * scrollFactor * 7;
    ref.current.position.x = position[0] + Math.sin(t * 0.4 + scrollFactor) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#7b2fff" emissive="#7b2fff" emissiveIntensity={0.5}
        roughness={0.05} metalness={0.95} transparent opacity={0.6} />
    </mesh>
  );
}

/* ── Ring ───────────────────────────────────────────────────────────────── */
function Ring({ position, scrollFactor }: {
  position: [number, number, number];
  scrollFactor: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.rotation.x = t * 0.3 + scrollState.y * 3;
    ref.current.rotation.y = t * 0.2;
    ref.current.position.y = baseY - scrollState.y * scrollFactor * 5;
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.5, 0.04, 16, 80]} />
      <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6}
        roughness={0.0} metalness={1.0} transparent opacity={0.5} />
    </mesh>
  );
}

/* ── Floating particles ─────────────────────────────────────────────────── */
function FloatParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 300;

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      speeds[i] = 0.2 + Math.random() * 0.8;
    }
    return { positions, speeds };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    return g;
  }, [positions]);

  useFrame((s) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const baseY = positions[i * 3 + 1];
      (pos.array as Float32Array)[i * 3 + 1] =
        baseY + Math.sin(t * speeds[i] * 0.5 + i) * 0.3
        - scrollState.y * speeds[i] * 15;
    }
    pos.needsUpdate = true;
    ref.current.rotation.y = t * 0.01;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#00d4ff" size={0.03} sizeAttenuation transparent opacity={0.35} depthWrite={false} />
    </points>
  );
}

/* ── Camera reacts to scroll ────────────────────────────────────────────── */
function ScrollCamera() {
  const { camera } = useThree();
  useScrollSync();

  useFrame(() => {
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -scrollState.y * 4, 0.05);
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, scrollState.velocity * 2, 0.08);
  });

  return null;
}

/* ── Scene root ─────────────────────────────────────────────────────────── */
export default function ScrollScene3D() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ScrollCamera />

        <ambientLight intensity={0.1} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#00d4ff" />
        <pointLight position={[-5, -5, 3]} intensity={1.5} color="#7b2fff" />
        <pointLight position={[0, 0, 6]} intensity={0.8} color="#ffffff" />

        <FloatParticles />

        {/* Left side shapes */}
        <TorusKnot position={[-5.5, 2, -2]} speed={0.4} scrollFactor={1.2} />
        <Icosa position={[-4, -3, -1]} speed={0.5} scrollFactor={0.8} color="#00d4ff" />
        <Ring position={[-5, 6, -3]} scrollFactor={1.5} />
        <Octa position={[-3.5, 10, -2]} speed={0.6} scrollFactor={2.0} />

        {/* Right side shapes */}
        <Icosa position={[5, 1, -2]} speed={0.35} scrollFactor={1.0} color="#7b2fff" />
        <Octa position={[4.5, -4, -1]} speed={0.7} scrollFactor={0.9} />
        <TorusKnot position={[5.5, 7, -3]} speed={0.3} scrollFactor={1.8} />
        <Ring position={[4, 12, -2]} scrollFactor={2.2} />

        {/* Center depth shapes */}
        <Icosa position={[1, 5, -4]} speed={0.25} scrollFactor={1.4} color="#00d4ff" />
        <Octa position={[-1.5, 9, -3]} speed={0.45} scrollFactor={1.6} />
      </Canvas>
    </div>
  );
}
