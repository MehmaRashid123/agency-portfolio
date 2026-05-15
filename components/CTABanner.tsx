"use client";

/**
 * CTABanner — Simple closing section.
 * No "order / hire / start a project" — just a soft contact nudge.
 * Heading reveals word by word. Clean, portfolio-style.
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

  const heading    = settings?.ctaBanner?.heading    || "Let's Connect";
  const subheading = settings?.ctaBanner?.subheading || "Have a project in mind or just want to say hello? We'd love to hear from you.";
  const btnLabel   = settings?.ctaBanner?.buttonLabel || "Get in Touch";
  const btnLink    = settings?.ctaBanner?.buttonLink  || "/contact";

  useEffect(() => {
    const h = headingRef.current;
    if (!h) return;

    const words = h.innerText.split(" ");
    h.innerHTML = words
      .map(w => `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.25em"><span class="cta-word" style="display:inline-block">${w}</span></span>`)
      .join("");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
      tl.fromTo(".cta-word",
        { y: "110%", rotateX: -15 },
        { y: "0%", rotateX: 0, duration: 1, stagger: 0.06, ease: "power4.out", transformPerspective: 600 }
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
      aria-label="Contact"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0,212,255,0.05) 0%, rgba(123,47,255,0.03) 40%, transparent 70%)" }} />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-10">
          <h2 ref={headingRef} className="heading-xl" style={{ perspective: "600px" }}>
            {heading}
          </h2>
          <p ref={subRef} className="text-base md:text-lg max-w-md leading-relaxed"
            style={{ color: "rgba(232,244,255,0.45)", opacity: 0 }}>
            {subheading}
          </p>
          <div ref={ctaRef} style={{ opacity: 0 }}>
            <Link href={btnLink} className="btn btn-outline text-sm px-10 py-4">
              {btnLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
