"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TiltCard from "./TiltCard";
import type { Testimonial, Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials({ testimonials, settings }: { testimonials?: Testimonial[]; settings?: Settings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const heading = settings?.testimonialsSection?.heading || "What Clients Say";

  const items = testimonials?.length ? testimonials : [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".testimonial-card").forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, delay: i * 0.12, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%" } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (!items.length) return null;

  return (
    <section ref={sectionRef} className="section-pad border-t border-[var(--border)]" aria-label="Client testimonials">
      <div className="container">
        <h2 className="heading-lg mb-12 md:mb-16">{heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <TiltCard key={t._id || i} className="testimonial-card border border-[var(--border)] p-8 flex flex-col gap-8 hover:border-[var(--accent)] transition-colors duration-300" style={{ opacity: 0 }} intensity={5}>
              <p className="text-base md:text-lg leading-relaxed opacity-70">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto pt-6 border-t border-[var(--border)]">
                <p className="font-medium text-sm">{t.clientName}</p>
                <p className="label mt-1">{t.company}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
