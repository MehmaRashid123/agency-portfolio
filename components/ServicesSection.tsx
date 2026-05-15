"use client";

/**
 * ServicesSection — Production-grade scroll animations.
 * Each row reveals with a precise clip-path + translate.
 * The number counter draws a line on scroll.
 * Hover state is intentional: only the title shifts color.
 * No 3D objects — clean, editorial, Awwwards-level.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_SERVICES = [
  {
    num: "01",
    title: "Graphic Design",
    desc: "Brand identity, print, packaging, and social media. Visual systems that are precise, memorable, and built to last.",
    href: "/services#graphic",
    tags: ["Branding", "Identity", "Print"],
  },
  {
    num: "02",
    title: "Web Development",
    desc: "Next.js, React, custom CMS, and e-commerce. Fast, accessible, and beautifully animated digital experiences.",
    href: "/services#web",
    tags: ["Next.js", "React", "CMS"],
  },
  {
    num: "03",
    title: "3D Art & Animation",
    desc: "Product visualization, motion graphics, and real-time 3D. We make the impossible look inevitable.",
    href: "/services#3d",
    tags: ["Three.js", "Motion", "WebGL"],
  },
];

export default function ServicesSection({ settings }: { settings?: Settings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const heading = settings?.servicesSection?.heading || "What We Do";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section label + heading — staggered word reveal
      gsap.fromTo(".srv-label",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".srv-label", start: "top 88%", once: true } }
      );

      gsap.fromTo(".srv-heading",
        { clipPath: "inset(100% 0 0 0)", y: 30 },
        { clipPath: "inset(0% 0 0 0)", y: 0, duration: 1, ease: "power4.out",
          scrollTrigger: { trigger: ".srv-heading", start: "top 88%", once: true } }
      );

      // Each service row
      document.querySelectorAll<HTMLElement>(".srv-row").forEach((row, i) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 84%", once: true },
        });

        // Border top line draws in
        tl.fromTo(row.querySelector(".srv-border"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power3.out" }
        )
        // Number fades up
        .fromTo(row.querySelector(".srv-num"),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.5"
        )
        // Title clips up
        .fromTo(row.querySelector(".srv-title"),
          { clipPath: "inset(100% 0 0 0)", y: 20 },
          { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.75, ease: "power3.out" }, "-=0.4"
        )
        // Desc fades
        .fromTo(row.querySelector(".srv-desc"),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.5"
        )
        // Tags stagger
        .fromTo(row.querySelectorAll(".srv-tag"),
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }, "-=0.4"
        )
        // Arrow
        .fromTo(row.querySelector(".srv-arrow"),
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "-=0.3"
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pad"
      aria-label="Services"
    >
      <div className="container">
        {/* Header */}
        <div className="flex items-end justify-between mb-20 md:mb-28">
          <div>
            <p className="srv-label label mb-4" style={{ color: "var(--accent)", opacity: 0 }}>
              Our Services
            </p>
            <h2
              className="srv-heading heading-lg"
              style={{ clipPath: "inset(100% 0 0 0)" }}
            >
              {heading}
            </h2>
          </div>
        </div>

        {/* Rows */}
        <div>
          {DEFAULT_SERVICES.map((s) => (
            <div key={s.num} className="srv-row group relative">
              {/* Top border — animates in */}
              <div
                className="srv-border absolute top-0 left-0 right-0 h-px origin-left"
                style={{ background: "var(--border)" }}
              />

              <div className="grid grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 items-start">
                {/* Number */}
                <div className="col-span-2 md:col-span-1 pt-1">
                  <span
                    className="srv-num font-mono text-xs tracking-widest"
                    style={{ color: "rgba(232,244,255,0.25)", opacity: 0 }}
                  >
                    {s.num}
                  </span>
                </div>

                {/* Title */}
                <div className="col-span-10 md:col-span-4 overflow-hidden">
                  <h3
                    className="srv-title heading-md transition-colors duration-500 group-hover:text-[var(--accent)]"
                    style={{ clipPath: "inset(100% 0 0 0)" }}
                  >
                    {s.title}
                  </h3>
                </div>

                {/* Desc + tags */}
                <div className="col-span-12 md:col-span-5 flex flex-col gap-5 md:pt-1">
                  <p
                    className="srv-desc text-sm md:text-base leading-relaxed"
                    style={{ color: "rgba(232,244,255,0.45)", opacity: 0 }}
                  >
                    {s.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="srv-tag text-[10px] font-medium tracking-widest uppercase px-3 py-1.5 border"
                        style={{
                          borderColor: "var(--border)",
                          color: "rgba(232,244,255,0.35)",
                          opacity: 0,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow CTA */}
                <div className="col-span-12 md:col-span-2 flex md:justify-end items-start md:pt-1">
                  <Link
                    href={s.href}
                    className="srv-arrow inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase transition-all duration-300 group-hover:gap-4"
                    style={{ color: "var(--accent)", opacity: 0 }}
                    aria-label={`Explore ${s.title}`}
                  >
                    Explore
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Last row bottom border */}
              {s.num === "03" && (
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--border)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
