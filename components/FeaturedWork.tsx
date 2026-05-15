"use client";

/**
 * FeaturedWork — Masonry-style project grid.
 * Cards reveal with a precise clip-path from bottom.
 * Image parallax on scroll — subtle, not distracting.
 * Hover: image scales, overlay fades in cleanly.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project, Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({
  project,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);
  const thumbnailUrl = project.thumbnail?.url || "";

  useEffect(() => {
    if (!wrapRef.current || !imgRef.current) return;

    // Subtle image parallax — moves 30px over the card's scroll range
    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        gsap.set(imgRef.current, {
          y: (self.progress - 0.5) * 40,
          ease: "none",
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`project-card block ${large ? "aspect-[16/9]" : "aspect-[4/3]"}`}
      aria-label={`View project: ${project.title}`}
    >
      <div ref={wrapRef} className="relative w-full h-full overflow-hidden bg-[var(--bg-2)]">
        {/* Image with parallax wrapper */}
        <div
          ref={imgRef}
          className="absolute inset-[-10%] w-[120%] h-[120%]"
          style={{ willChange: "transform" }}
        >
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={project.title}
              fill
              className="card-img object-cover"
              sizes={large ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 40vw"}
            />
          )}
        </div>

        {/* Overlay */}
        <div className="card-overlay">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium tracking-widest uppercase px-2 py-1 border"
                style={{ borderColor: "rgba(232,244,255,0.2)", color: "rgba(232,244,255,0.6)" }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {project.title}
          </h3>
          <div
            className="mt-3 flex items-center gap-2 text-xs font-medium tracking-widest uppercase"
            style={{ color: "var(--accent)" }}
          >
            View Project
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedWork({
  projects,
  settings,
}: {
  projects: Project[];
  settings?: Settings;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  const heading  = settings?.featuredWork?.heading  || "Selected Work";
  const ctaLabel = settings?.featuredWork?.ctaLabel || "View All Work";
  const ctaLink  = settings?.featuredWork?.ctaLink  || "/work";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading clip reveal
      gsap.fromTo(".fw-heading",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "power4.out",
          scrollTrigger: { trigger: ".fw-heading", start: "top 88%", once: true },
        }
      );

      // CTA link
      gsap.fromTo(".fw-cta",
        { opacity: 0, x: 20 },
        {
          opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".fw-heading", start: "top 88%", once: true },
        }
      );

      // Cards — clip from bottom, staggered
      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card, i) => {
        gsap.fromTo(card,
          { clipPath: "inset(100% 0 0 0)", y: 20 },
          {
            clipPath: "inset(0% 0 0 0)", y: 0,
            duration: 1, delay: i * 0.05, ease: "power4.out",
            scrollTrigger: { trigger: card, start: "top 92%", once: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [p1, p2, p3, p4, p5, p6] = projects;
  if (!p1) return null;

  return (
    <section ref={sectionRef} className="section-pad" aria-label="Featured work">
      <div className="container">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div className="overflow-hidden">
            <h2
              className="fw-heading heading-lg"
              style={{ clipPath: "inset(100% 0 0 0)" }}
            >
              {heading}
            </h2>
          </div>
          <Link
            href={ctaLink}
            className="fw-cta hidden md:inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase transition-all duration-300 hover:gap-4"
            style={{ color: "var(--accent)", opacity: 0 }}
          >
            {ctaLabel}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
          <div className="work-card md:col-span-3" style={{ clipPath: "inset(100% 0 0 0)" }}>
            <ProjectCard project={p1} large />
          </div>
          {p2 && (
            <div className="work-card md:col-span-2" style={{ clipPath: "inset(100% 0 0 0)" }}>
              <ProjectCard project={p2} />
            </div>
          )}
          {p3 && (
            <div className="work-card md:col-span-2" style={{ clipPath: "inset(100% 0 0 0)" }}>
              <ProjectCard project={p3} />
            </div>
          )}
          {p4 && (
            <div className="work-card md:col-span-3" style={{ clipPath: "inset(100% 0 0 0)" }}>
              <ProjectCard project={p4} large />
            </div>
          )}
          {p5 && (
            <div className="work-card md:col-span-2" style={{ clipPath: "inset(100% 0 0 0)" }}>
              <ProjectCard project={p5} />
            </div>
          )}
          {p6 && (
            <div className="work-card md:col-span-3" style={{ clipPath: "inset(100% 0 0 0)" }}>
              <ProjectCard project={p6} large />
            </div>
          )}
        </div>

        <div className="flex justify-center mt-10">
          <Link href={ctaLink} className="btn btn-outline md:hidden">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
