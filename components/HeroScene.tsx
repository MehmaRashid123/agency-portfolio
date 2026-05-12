"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ─── GLSL Fluid Shader ─────────────────────────────────────────────────── */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Smooth noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // FBM — layered noise for fluid look
  float fbm(vec3 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 6; i++) {
      val += amp * snoise(p * freq);
      freq *= 2.1;
      amp *= 0.48;
    }
    return val;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.18;

    // Mouse influence — fluid reacts to cursor
    vec2 mouse = uMouse * 0.5 + 0.5;
    float mouseDist = length(uv - mouse);
    float mouseInfluence = smoothstep(0.4, 0.0, mouseDist) * 0.35;

    // Domain warping — fluid distortion
    vec3 p = vec3(uv * 2.5, t);
    vec3 q = vec3(
      fbm(p + vec3(0.0, 0.0, t)),
      fbm(p + vec3(5.2, 1.3, t * 0.8)),
      fbm(p + vec3(1.7, 9.2, t * 1.2))
    );
    vec3 r = vec3(
      fbm(p + 4.0 * q + vec3(1.7, 9.2, t * 0.6) + mouseInfluence),
      fbm(p + 4.0 * q + vec3(8.3, 2.8, t * 0.9) + mouseInfluence),
      fbm(p + 4.0 * q + vec3(0.0, 0.0, t * 1.1))
    );

    float f = fbm(p + 4.0 * r);
    f = f * 0.5 + 0.5;

    // Color palette — black to deep orange to bright orange to white
    vec3 col1 = vec3(0.04, 0.02, 0.01);         // near black
    vec3 col2 = vec3(0.25, 0.08, 0.0);          // deep burnt orange
    vec3 col3 = vec3(1.0, 0.3, 0.0);            // orange #FF4D00
    vec3 col4 = vec3(1.0, 0.55, 0.15);          // bright orange
    vec3 col5 = vec3(1.0, 0.85, 0.6);           // warm white highlight

    vec3 color;
    if (f < 0.25) {
      color = mix(col1, col2, f / 0.25);
    } else if (f < 0.5) {
      color = mix(col2, col3, (f - 0.25) / 0.25);
    } else if (f < 0.75) {
      color = mix(col3, col4, (f - 0.5) / 0.25);
    } else {
      color = mix(col4, col5, (f - 0.75) / 0.25);
    }

    // Vignette — dark edges
    float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.8);
    color *= vignette * 0.85;

    // Overall darkness — keep it subtle so text is readable
    color *= 0.75;

    gl_FragColor = vec4(color, 1.0);
  }
`;

/* ─── Fluid mesh ────────────────────────────────────────────────────────── */
function FluidMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useMemo(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.lerp(mouse.current, 0.04);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─── Floating blue orbs ────────────────────────────────────────────────── */
function FloatingOrbs() {
  const orbs = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      x: (Math.random() - 0.5) * 1.6,
      y: (Math.random() - 0.5) * 1.2,
      z: Math.random() * 0.3 + 0.01,
      size: 0.015 + Math.random() * 0.04,
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    })), []
  );

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((s) => {
    orbs.forEach((orb, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const t = s.clock.elapsedTime * orb.speed + orb.phase;
      mesh.position.x = orb.x + Math.sin(t * 0.7) * 0.08;
      mesh.position.y = orb.y + Math.cos(t * 0.5) * 0.06;
      const pulse = 1 + Math.sin(t * 2) * 0.15;
      mesh.scale.setScalar(pulse);
    });
  });

  return (
    <>
      {orbs.map((orb, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          position={[orb.x, orb.y, orb.z]}
        >
          <sphereGeometry args={[orb.size, 12, 12]} />
          <meshBasicMaterial color="#FF4D00" transparent opacity={0.6} />
        </mesh>
      ))}
    </>
  );
}

/* ─── Fullscreen camera ─────────────────────────────────────────────────── */
function OrthoSetup() {
  const { camera } = useThree();
  useMemo(() => {
    camera.position.z = 1;
  }, [camera]);
  return null;
}

/* ─── Scene root ─────────────────────────────────────────────────────────── */
export default function HeroScene() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: false }}
      aria-hidden="true"
    >
      <OrthoSetup />
      <FluidMesh />
      <FloatingOrbs />
    </Canvas>
  );
}
