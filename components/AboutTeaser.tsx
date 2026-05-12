"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const Scene3DAccent = dynamic(() => import("./Scene3DAccent"), { ssr: false });

export default function AboutTeaser({ settings }: { settings?: Settings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const heading = settings?.aboutTeaser?.heading || "We Are ZENDXB TechHub";
  const body = settings?.aboutTeaser?.body || "A small, obsessive team of designers, developers, and 3D artists. We work with brands that want to stand out — not blend in.";
  const ctaLabel = settings?.aboutTeaser?.ctaLabel || "Meet the Team →";
  const ctaLink = settings?.aboutTeaser?.ctaLink || "/about";
  const image = settings?.aboutTeaser?.image;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sceneRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.4, ease: "power4.out", scrollTrigger: { trigger: sceneRef.current, start: "top 80%" } });
      gsap.fromTo(textRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: textRef.current, start: "top 80%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pad border-t border-[var(--border)]" aria-label="About the agency">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div ref={sceneRef} className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-2)] border border-[var(--border)]" style={{ opacity: 0 }}>
            {image?.url ? (
              <Image src={image.url} alt={heading} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <Scene3DAccent />
            )}
            <div className="absolute top-4 left-4 label text-[var(--accent)] opacity-60">3D / LIVE</div>
            <div className="absolute bottom-4 right-4 label opacity-30">{settings?.siteName || "ZENDXB TECHHUB"}</div>
          </div>
          <div ref={textRef} className="flex flex-col gap-8" style={{ opacity: 0 }}>
            <span className="label text-[var(--accent)]">About Us</span>
            <h2 className="heading-lg">{heading}</h2>
            <p className="opacity-60 leading-relaxed text-base md:text-lg">{body}</p>
            <Link href={ctaLink} className="btn btn-outline self-start">{ctaLabel}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
