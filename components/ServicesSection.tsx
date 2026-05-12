"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_SERVICES = [
  { num: "01", title: "Graphic Design", desc: "Brand identity, print, packaging, and social media. We craft visual systems that are precise, memorable, and built to last.", href: "/services#graphic" },
  { num: "02", title: "Web Development", desc: "Next.js, React, custom CMS, and e-commerce. We build fast, accessible, and beautifully animated digital experiences.", href: "/services#web" },
  { num: "03", title: "3D Art & Animation", desc: "Product visualization, motion graphics, and real-time 3D. We make the impossible look inevitable.", href: "/services#3d" },
];

export default function ServicesSection({ settings }: { settings?: Settings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const heading = settings?.servicesSection?.heading || "What We Do";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".service-block").forEach((block, i) => {
        gsap.fromTo(block,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          { opacity: 1, x: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: block, start: "top 82%" } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pad border-t border-[var(--border)]" aria-label="Services">
      <div className="container">
        <div className="flex items-end justify-between mb-16 md:mb-20">
          <h2 className="heading-lg">{heading}</h2>
        </div>
        <div className="flex flex-col">
          {DEFAULT_SERVICES.map((s, i) => (
            <div
              key={s.num}
              className="service-block group border-t border-[var(--border)] last:border-b py-10 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start hover:bg-[var(--bg-2)] transition-all duration-300 px-0 md:px-6 -mx-0 md:-mx-6 cursor-none"
              style={{ opacity: 0 }}
            >
              <span className="label text-[var(--accent)] md:col-span-1">{s.num}</span>
              <h3 className="heading-md md:col-span-4 group-hover:text-[var(--accent)] transition-colors duration-300">{s.title}</h3>
              <p className="opacity-50 leading-relaxed md:col-span-5 text-sm md:text-base">{s.desc}</p>
              <div className="md:col-span-2 flex justify-start md:justify-end items-center">
                <Link href={s.href} className="label text-[var(--accent)] flex items-center gap-2 hover:gap-4 transition-all duration-300" aria-label={`Explore ${s.title}`}>
                  Explore <span className="text-base leading-none">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
