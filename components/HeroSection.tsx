"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import type { Settings } from "@/lib/api";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function HeroSection({ settings }: { settings?: Settings }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const metaRef    = useRef<HTMLDivElement>(null);

  const headline    = settings?.hero?.headline    || "We Build Things\nThat Move";
  const subheadline = settings?.hero?.subheadline || "A creative studio specializing in design, development, and digital experiences.";
  const cta1Label   = settings?.hero?.cta1Label   || "View Our Work";
  const cta1Link    = settings?.hero?.cta1Link    || "/work";
  const siteName    = settings?.siteName          || "ZENDXB TechHub";
  const foundedYear = settings?.about?.foundedYear || "2021";

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    // Split into lines then words — preserves line breaks
    const lines = heading.getAttribute("data-text")?.split("\n") || [heading.innerText];
    heading.innerHTML = lines
      .map(
        (line) =>
          `<span class="hero-line" style="display:block;overflow:hidden">${line
            .split(" ")
            .map(
              (w) =>
                `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="hero-word" style="display:inline-block">${w}</span></span>`
            )
            .join('<span style="display:inline-block;width:0.25em"></span>')}</span>`
      )
      .join("");

    const words = heading.querySelectorAll<HTMLElement>(".hero-word");

    const tl = gsap.timeline({ delay: 0.15 });

    tl
      // Eyebrow tag
      .fromTo(eyebrowRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      )
      // Heading words flip up
      .fromTo(words,
        { y: "105%", rotateX: -12 },
        { y: "0%", rotateX: 0, duration: 1.0, stagger: 0.055, ease: "power4.out",
          transformPerspective: 700 },
        "-=0.35"
      )
      // Subheadline
      .fromTo(subRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
        "-=0.55"
      )
      // CTAs
      .fromTo(ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        "-=0.5"
      )
      // Bottom meta row
      .fromTo(metaRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      // Scroll indicator
      .fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.4"
      );

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh" }}
      aria-label="Hero section"
    >
      {/* ── Background: fluid WebGL shader ── */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* ── Gradient: strong at top/bottom, clear in middle ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background: [
            "linear-gradient(to bottom,",
            "  rgba(13,27,42,0.92) 0%,",
            "  rgba(13,27,42,0.50) 20%,",
            "  rgba(13,27,42,0.20) 50%,",
            "  rgba(13,27,42,0.55) 80%,",
            "  rgba(13,27,42,0.95) 100%",
            ")",
          ].join(""),
        }}
      />

      {/* ── Noise grain ── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
          opacity: 0.4,
        }}
      />

      {/* ── Main content ── */}
      <div
        className="relative z-[3] flex flex-col"
        style={{ minHeight: "100svh", paddingTop: "var(--nav-h)" }}
      >
        {/* Centre block — takes remaining height */}
        <div className="flex-1 flex items-center">
          <div className="container">
            <div className="max-w-[900px]">

              {/* Eyebrow */}
              <div
                ref={eyebrowRef}
                className="flex items-center gap-3 mb-8"
                style={{ opacity: 0 }}
              >
                <span
                  className="inline-block w-5 h-px"
                  style={{ background: "var(--accent)" }}
                />
                <span
                  className="label"
                  style={{ color: "var(--accent)", letterSpacing: "0.18em" }}
                >
                  {siteName}
                </span>
              </div>

              {/* Heading */}
              <h1
                ref={headingRef}
                data-text={headline}
                className="mb-8 md:mb-10"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(3.2rem, 8.5vw, 9.5rem)",
                  fontWeight: 600,
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "var(--fg)",
                }}
              >
                {headline}
              </h1>

              {/* Sub + CTA row */}
              <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
                <p
                  ref={subRef}
                  className="text-base md:text-lg leading-relaxed max-w-sm"
                  style={{ opacity: 0, color: "rgba(232,244,255,0.55)" }}
                >
                  {subheadline}
                </p>

                <div
                  ref={ctaRef}
                  className="flex flex-wrap items-center gap-4 shrink-0"
                >
                  <Link href={cta1Link} className="btn btn-primary">
                    {cta1Label}
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom meta bar */}
        <div
          ref={metaRef}
          className="container pb-8 md:pb-10"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between">
            <span className="label" style={{ color: "rgba(232,244,255,0.2)" }}>
              Est. {foundedYear}
            </span>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 right-8 md:right-12 flex flex-col items-center gap-3 z-[3]"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <span
          className="label"
          style={{
            color: "rgba(232,244,255,0.25)",
            writingMode: "vertical-rl",
            letterSpacing: "0.2em",
            fontSize: "0.65rem",
          }}
        >
          scroll
        </span>
        <div
          className="w-px h-16 relative overflow-hidden"
          style={{ background: "rgba(232,244,255,0.08)" }}
        >
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: "35%",
              background: "var(--accent)",
              animation: "heroScroll 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes heroScroll {
          0%   { transform: translateY(-100%); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(350%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
