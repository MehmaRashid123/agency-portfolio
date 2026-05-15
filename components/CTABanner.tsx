"use client";

/**
 * CTABanner — Full-width closing section.
 * Massive heading with word-by-word reveal.
 * Single strong CTA. No 3D — let the typography breathe.
 * Subtle ambient glow in background.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function CTABanner({ settings }: { settings?: Settings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  const heading    = settings?.ctaBanner?.heading    || "Ready to build something great?";
  const subheading = settings?.ctaBanner?.subheading || "Tell us about your project. We'll get back to you within 24 hours.";
  const btnLabel   = settings?.ctaBanner?.buttonLabel || "Start a Project";
  const btnLink    = settings?.ctaBanner?.buttonLink  || "/contact";

  useEffect(() => {
    const h = headingRef.current;
    if (!h) return;

    // Split heading into words
    const words = h.innerText.split(" ");
    h.innerHTML = words
      .map(
        (w) =>
          `<span class="cta-word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.25em"><span class="cta-word" style="display:inline-block">${w}</span></span>`
      )
      .join("");

    const ctx = gsap.context(() => {
      const wordEls = h.querySelectorAll<HTMLElement>(".cta-word");

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });

      tl.fromTo(wordEls,
        { y: "110%", rotateX: -15 },
        {
          y: "0%", rotateX: 0,
          duration: 1, stagger: 0.06, ease: "power4.out",
          transformPerspective: 600,
        }
      )
      .fromTo(subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5"
      )
      .fromTo(ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-t border-[var(--border)] relative overflow-hidden"
      style={{ padding: "clamp(6rem, 14vw, 14rem) 0" }}
      aria-label="Call to action"
    >
      {/* Ambient glow — very subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0,212,255,0.05) 0%, rgba(123,47,255,0.03) 40%, transparent 70%)",
        }}
      />

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-10">

          {/* Heading */}
          <h2
            ref={headingRef}
            className="heading-xl"
            style={{ perspective: "600px" }}
          >
            {heading}
          </h2>

          {/* Sub */}
          <p
            ref={subRef}
            className="text-base md:text-lg max-w-md leading-relaxed"
            style={{ color: "rgba(232,244,255,0.45)", opacity: 0 }}
          >
            {subheading}
          </p>

          {/* CTA */}
          <div ref={ctaRef} style={{ opacity: 0 }}>
            <Link
              href={btnLink}
              className="btn btn-primary text-sm px-10 py-5 relative overflow-hidden group"
            >
              <span className="relative z-10">{btnLabel}</span>
              {/* Shimmer sweep on hover */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmerSweep 0.6s ease forwards",
                }}
              />
            </Link>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes shimmerSweep {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
