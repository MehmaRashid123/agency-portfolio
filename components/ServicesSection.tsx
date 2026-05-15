"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Service, Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  num: string;
  title: string;
  desc: string;
  tags: string[];
}

export default function ServicesSection({ services = [], settings }: { services?: Service[]; settings?: Settings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const heading = settings?.servicesSection?.heading || "What We Do";

  const items: ServiceItem[] = services.map((s, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: s.name,
    desc: s.description || "",
    tags: s.features?.slice(0, 4) ?? [],
  }));

  useEffect(() => {
    if (!items.length) return;
    const ctx = gsap.context(() => {
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

      document.querySelectorAll<HTMLElement>(".srv-row").forEach((row) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 84%", once: true },
        });
        tl.fromTo(row.querySelector(".srv-border"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out" })
          .fromTo(row.querySelector(".srv-num"),   { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.5")
          .fromTo(row.querySelector(".srv-title"), { clipPath: "inset(100% 0 0 0)", y: 20 }, { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.75, ease: "power3.out" }, "-=0.4")
          .fromTo(row.querySelector(".srv-desc"),  { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
          .fromTo(row.querySelectorAll(".srv-tag"), { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }, "-=0.4");
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section ref={sectionRef} className="section-pad" aria-label="Services">
      <div className="container">
        <div className="flex items-end justify-between mb-20 md:mb-28">
          <div>
            <p className="srv-label label mb-4" style={{ color: "var(--accent)", opacity: 0 }}>
              Our Services
            </p>
            <h2 className="srv-heading heading-lg" style={{ clipPath: "inset(100% 0 0 0)" }}>
              {heading}
            </h2>
          </div>
        </div>

        <div>
          {items.map((s, idx) => (
            <div key={s.num} className="srv-row group relative">
              <div className="srv-border absolute top-0 left-0 right-0 h-px origin-left"
                style={{ background: "var(--border)" }} />

              <div className="grid grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 items-start">
                {/* Number */}
                <div className="col-span-2 md:col-span-1 pt-1">
                  <span className="srv-num font-mono text-xs tracking-widest"
                    style={{ color: "rgba(232,244,255,0.25)", opacity: 0 }}>
                    {s.num}
                  </span>
                </div>

                {/* Title */}
                <div className="col-span-10 md:col-span-4 overflow-hidden">
                  <h3 className="srv-title heading-md transition-colors duration-500 group-hover:text-[var(--accent)]"
                    style={{ clipPath: "inset(100% 0 0 0)" }}>
                    {s.title}
                  </h3>
                </div>

                {/* Desc + tags */}
                <div className="col-span-12 md:col-span-7 flex flex-col gap-5 md:pt-1">
                  {s.desc && (
                    <p className="srv-desc text-sm md:text-base leading-relaxed"
                      style={{ color: "rgba(232,244,255,0.45)", opacity: 0 }}>
                      {s.desc}
                    </p>
                  )}
                  {s.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map((tag) => (
                        <span key={tag} className="srv-tag text-[10px] font-medium tracking-widest uppercase px-3 py-1.5 border"
                          style={{ borderColor: "var(--border)", color: "rgba(232,244,255,0.35)", opacity: 0 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom border on last item */}
              {idx === items.length - 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--border)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
