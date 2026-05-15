"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  varying vec2  vUv;

  vec3 mod289(vec3 x) { return x - floor(x*(1./289.))*289.; }
  vec4 mod289(vec4 x) { return x - floor(x*(1./289.))*289.; }
  vec4 permute(vec4 x) { return mod289(((x*34.)+1.)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1./6., 1./3.);
    const vec4 D = vec4(0., 0.5, 1., 2.);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1. - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z+vec4(0.,i1.z,i2.z,1.))
      +i.y+vec4(0.,i1.y,i2.y,1.))
      +i.x+vec4(0.,i1.x,i2.x,1.));
    float n_ = 0.142857142857;
    vec3  ns = n_*D.wyz - D.xzx;
    vec4 j  = p - 49.*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j*ns.z);
    vec4 y_ = floor(j - 7.*x_);
    vec4 x  = x_*ns.x + ns.yyyy;
    vec4 y  = y_*ns.x + ns.yyyy;
    vec4 h  = 1. - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.+1.;
    vec4 s1 = floor(b1)*2.+1.;
    vec4 sh = -step(h, vec4(0.));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m = max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m = m*m;
    return 42.*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  float fbm(vec3 p){
    float v=0., a=0.5;
    for(int i=0;i<5;i++){ v+=a*snoise(p); p*=2.1; a*=0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    float t  = uTime * 0.12;

    // Gentle mouse warp
    vec2 m = uMouse * 0.5 + 0.5;
    float md = length(uv - m);
    float mi = smoothstep(0.5, 0., md) * 0.25;

    // Domain warp — two layers
    vec3 p = vec3(uv * 2., t);
    vec3 q = vec3(
      fbm(p + vec3(0., 0., t)),
      fbm(p + vec3(5.2, 1.3, t*0.9)),
      fbm(p + vec3(1.7, 9.2, t*1.1))
    );
    vec3 r = vec3(
      fbm(p + 3.5*q + vec3(1.7, 9.2, t*0.7) + mi),
      fbm(p + 3.5*q + vec3(8.3, 2.8, t*0.8) + mi),
      fbm(p + 3.5*q + vec3(0.0, 0.0, t*1.0))
    );

    float f = fbm(p + 3.5*r) * 0.5 + 0.5;

    // ── Colour palette ──────────────────────────────────────────────────
    // Very dark navy base → subtle teal glow → deep purple accent
    // Kept dark so white text pops cleanly
    vec3 c0 = vec3(0.04, 0.09, 0.15);   // #0a1726  near-black navy
    vec3 c1 = vec3(0.05, 0.16, 0.28);   // #0d2847  dark teal
    vec3 c2 = vec3(0.0,  0.28, 0.42);   // #004870  teal
    vec3 c3 = vec3(0.18, 0.10, 0.40);   // #2e1966  deep purple
    vec3 c4 = vec3(0.0,  0.42, 0.58);   // #006b94  bright teal accent

    vec3 col;
    if      (f < 0.3)  col = mix(c0, c1, f/0.3);
    else if (f < 0.55) col = mix(c1, c2, (f-0.3)/0.25);
    else if (f < 0.78) col = mix(c2, c3, (f-0.55)/0.23);
    else               col = mix(c3, c4, (f-0.78)/0.22);

    // Strong vignette — darkens edges, keeps centre readable
    float vig = 1. - smoothstep(0.25, 1.1, length(uv - 0.5) * 2.0);
    col *= vig;

    // Overall brightness cap — stays dark, text always readable
    col *= 0.88;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function FluidMesh() {
  const { size } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  useMemo(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((s) => {
    uniforms.uTime.value = s.clock.elapsedTime;
    uniforms.uMouse.value.lerp(mouse.current, 0.03);
  });

  return (
    <mesh>
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

function OrthoSetup() {
  const { camera } = useThree();
  useMemo(() => { camera.position.z = 1; }, [camera]);
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
      aria-hidden="true"
    >
      <OrthoSetup />
      <FluidMesh />
    </Canvas>
  );
}
