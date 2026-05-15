"use client";

/**
 * StatsSection — Editorial counter section.
 * Numbers count up on scroll. Clean horizontal layout.
 * Subtle gradient on numbers. No 3D objects.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "3+",  label: "Years in Business"  },
  { value: "20+", label: "Happy Clients"       },
  { value: "3",   label: "Core Services"       },
];

function parseStatValue(val: string): { num: number; suffix: string } {
  const match = val.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: val };
  return { num: parseInt(match[1]), suffix: match[2] };
}

export default function StatsSection({ settings }: { settings?: Settings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stats = settings?.stats?.length ? settings.stats : DEFAULT_STATS;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Divider line draws across
      gsap.fromTo(".stats-line",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.4, ease: "power3.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );

      // Each stat block
      gsap.utils.toArray<HTMLElement>(".stat-item").forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
          }
        );
      });

      // Count-up
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = parseInt(el.dataset.target || "0", 10);
        if (!target) return;
        gsap.fromTo(el,
          { innerText: 0 },
          {
            innerText: target, duration: 2, ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
            onUpdate() {
              el.innerText = Math.round(parseFloat(el.innerText)).toString();
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 relative overflow-hidden"
      aria-label="Agency statistics"
    >
      {/* Subtle radial glow — very restrained */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10">
        {/* Top rule */}
        <div
          className="stats-line h-px w-full mb-16 md:mb-20 origin-left"
          style={{ background: "var(--border)" }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-14 gap-x-8">
          {stats.map((s, i) => {
            const { num, suffix } = parseStatValue(s.value);
            return (
              <div key={i} className="stat-item flex flex-col gap-3" style={{ opacity: 0 }}>
                {/* Number */}
                <div className="flex items-end leading-none gap-0.5">
                  <span
                    className="stat-num"
                    data-target={num}
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(3rem, 5.5vw, 5rem)",
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      background: "linear-gradient(135deg, var(--fg) 0%, rgba(232,244,255,0.5) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {num}
                  </span>
                  {suffix && (
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                        marginBottom: "0.15em",
                        color: "var(--accent)",
                      }}
                    >
                      {suffix}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className="text-xs font-medium uppercase tracking-[0.14em]"
                  style={{ color: "rgba(232,244,255,0.35)" }}
                >
                  {s.label}
                </span>

                {/* Accent dot */}
                <div
                  className="w-1 h-1 rounded-full mt-1"
                  style={{ background: i % 2 === 0 ? "var(--accent)" : "var(--accent-2)" }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom rule */}
        <div
          className="stats-line h-px w-full mt-16 md:mt-20 origin-left"
          style={{ background: "var(--border)" }}
        />
      </div>
    </section>
  );
}
