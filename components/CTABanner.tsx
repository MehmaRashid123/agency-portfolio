"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

function CTAParticles() {
  const mesh = useRef<THREE.Points>(null);
  const count = 120;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  useFrame((s) => { if (mesh.current) mesh.current.rotation.y = s.clock.elapsedTime * 0.03; });
  return (
    <points ref={mesh}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#FF4D00" size={0.05} sizeAttenuation transparent opacity={0.4} depthWrite={false} />
    </points>
  );
}

export default function CTABanner({ settings }: { settings?: Settings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const heading = settings?.ctaBanner?.heading || "Ready to build something great?";
  const subheading = settings?.ctaBanner?.subheading || "Tell us about your project. We'll get back to you within 24 hours.";
  const btnLabel = settings?.ctaBanner?.buttonLabel || "Start a Project";
  const btnLink = settings?.ctaBanner?.buttonLink || "/contact";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: textRef.current, start: "top 80%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-[var(--border)] py-24 md:py-36 relative overflow-hidden" aria-label="Call to action">
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }} style={{ position: "absolute", inset: 0 }} gl={{ alpha: true }} aria-hidden="true">
          <CTAParticles />
        </Canvas>
      </div>
      <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "256px" }} aria-hidden="true" />
      <div className="container relative z-10">
        <div ref={textRef} className="flex flex-col items-center text-center gap-10" style={{ opacity: 0 }}>
          <h2 className="heading-xl max-w-3xl">{heading}</h2>
          <p className="opacity-50 text-lg max-w-md">{subheading}</p>
          <Link href={btnLink} className="btn btn-primary text-base px-10 py-5">{btnLabel}</Link>
        </div>
      </div>
    </section>
  );
}
