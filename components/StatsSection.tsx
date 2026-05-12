"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "3+", label: "Years in Business" },
  { value: "20+", label: "Happy Clients" },
  { value: "3", label: "Core Services" },
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
      // Fade in items
      gsap.utils.toArray<HTMLElement>(".stat-item").forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%", once: true } }
        );
      });

      // Count-up for each stat number
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = parseInt(el.dataset.target || "0", 10);
        if (!target) return;
        gsap.fromTo(el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate() { el.innerText = Math.round(parseFloat(el.innerText)).toString(); },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-y border-[var(--border)] py-16 md:py-24 relative overflow-hidden"
      aria-label="Agency statistics"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,77,0,0.05) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 md:gap-8">
          {stats.map((s, i) => {
            const { num, suffix } = parseStatValue(s.value);
            return (
              <div key={i} className="stat-item flex flex-col gap-2" style={{ opacity: 0 }}>
                {/* Number row — number + suffix on same baseline */}
                <div className="flex items-end leading-none">
                  <span
                    className="stat-num font-clash font-semibold text-[var(--accent)]"
                    style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)", letterSpacing: "-0.03em", lineHeight: 1 }}
                    data-target={num}
                  >
                    {num}
                  </span>
                  {suffix && (
                    <span
                      className="font-clash font-semibold text-[var(--accent)] mb-1"
                      style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)", letterSpacing: "-0.02em", lineHeight: 1 }}
                    >
                      {suffix}
                    </span>
                  )}
                </div>
                {/* Label */}
                <span
                  className="text-xs font-medium uppercase tracking-[0.14em]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
