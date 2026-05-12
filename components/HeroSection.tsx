"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import type { Settings } from "@/lib/api";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function HeroSection({ settings }: { settings?: Settings }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  const headline = settings?.hero?.headline || "WE BUILD THINGS THAT MOVE";
  const headline2 = settings?.hero?.headlineLine2 || "";
  const subheadline = settings?.hero?.subheadline || "Graphic design, web development, and 3D art for brands that refuse to be ordinary.";
  const cta1Label = settings?.hero?.cta1Label || "View Our Work";
  const cta1Link = settings?.hero?.cta1Link || "/work";
  const cta2Label = settings?.hero?.cta2Label || "Get a Quote";
  const cta2Link = settings?.hero?.cta2Link || "/contact";
  const scrollText = settings?.hero?.scrollText || "Scroll";
  const siteName = settings?.siteName || "ZENDXB TechHub";
  const foundedYear = settings?.about?.foundedYear || "2021";

  useEffect(() => {
    const heading = headingRef.current;
    const sub = subRef.current;
    const cta = ctaRef.current;
    const scroll = scrollRef.current;
    const badge = badgeRef.current;
    if (!heading || !sub || !cta || !scroll) return;

    const words = heading.innerText.split(" ");
    heading.innerHTML = words
      .map(w => `<span class="overflow-clip inline-block"><span class="word-inner inline-block">${w}</span></span>`)
      .join(" ");
    const wordInners = heading.querySelectorAll(".word-inner");

    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(badge, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(wordInners, { y: "110%", rotateX: -20 }, { y: "0%", rotateX: 0, duration: 1.1, stagger: 0.07, ease: "power4.out" }, "-=0.2")
      .fromTo(sub, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
      .fromTo(scroll, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.3");

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col justify-center"
      style={{ minHeight: "100svh", paddingTop: "var(--nav-h)" }}
      aria-label="Hero section"
    >
      {/* ── Layer 1: Fluid shader background ── */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* ── Layer 2: Animated grid overlay ── */}
      <div
        className="absolute inset-0 z-[1] hero-grid pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Layer 3: Scan line ── */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="hero-scan absolute left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,77,0,0.3), transparent)" }}
        />
      </div>

      {/* ── Layer 4: Gradient overlay — lighter so fluid shows through ── */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.5) 100%)"
        }}
        aria-hidden="true"
      />

      {/* ── Layer 5: Floating accent dots ── */}
      <div className="absolute inset-0 z-[4] pointer-events-none" aria-hidden="true">
        {[
          { top: "20%", left: "8%", size: 3, delay: "0s" },
          { top: "35%", right: "12%", size: 2, delay: "1.2s" },
          { top: "65%", left: "15%", size: 4, delay: "0.6s" },
          { top: "75%", right: "20%", size: 2, delay: "2s" },
          { top: "50%", right: "5%", size: 3, delay: "1.8s" },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[var(--accent)]"
            style={{
              top: dot.top,
              left: (dot as any).left,
              right: (dot as any).right,
              width: dot.size,
              height: dot.size,
              animation: `floatDot ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div
        className="container relative z-[5] flex flex-col justify-center"
        style={{ minHeight: "calc(100svh - var(--nav-h))" }}
      >
        <div className="max-w-5xl">
          <span
            ref={badgeRef}
            className="label mb-6 block opacity-0"
            style={{ opacity: 0 }}
          >
            {siteName} — Est. {foundedYear}
          </span>

          <h1
            ref={headingRef}
            className="heading-xl mb-8"
            style={{ perspective: "800px" }}
          >
            {headline}{headline2 ? ` ${headline2}` : ""}
          </h1>

          <p
            ref={subRef}
            className="text-lg md:text-xl max-w-xl mb-12 leading-relaxed"
            style={{ opacity: 0, color: "rgba(255,255,255,0.65)" }}
          >
            {subheadline}
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4" style={{ opacity: 0 }}>
            <Link href={cta1Link} className="btn btn-primary">{cta1Label}</Link>
            <Link href={cta2Link} className="btn btn-ghost">{cta2Label}</Link>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[5]"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <span className="label text-[10px] tracking-[0.2em]">{scrollText}</span>
        <div className="w-px h-14 bg-[var(--border)] relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-[var(--accent)]"
            style={{ height: "40%", animation: "scrollLine 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  );
}
