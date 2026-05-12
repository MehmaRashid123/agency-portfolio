"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project, Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const thumbnailUrl = project.thumbnail?.url || "";
  return (
    <Link href={`/work/${project.slug}`} className={`project-card block ${large ? "aspect-[16/9]" : "aspect-[4/3]"}`} aria-label={`View project: ${project.title}`}>
      <div className="relative w-full h-full overflow-hidden bg-[var(--bg-2)]">
        {thumbnailUrl && <Image src={thumbnailUrl} alt={project.title} fill className="card-img object-cover" sizes={large ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 40vw"} />}
        <div className="card-overlay">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.map(tag => <span key={tag} className="label text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--fg)]">{tag}</span>)}
          </div>
          <h3 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>{project.title}</h3>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedWork({ projects, settings }: { projects: Project[]; settings?: Settings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const heading = settings?.featuredWork?.heading || "Selected Work";
  const ctaLabel = settings?.featuredWork?.ctaLabel || "View All Work";
  const ctaLink = settings?.featuredWork?.ctaLink || "/work";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: headingRef.current, start: "top 85%" } });
      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, delay: i * 0.08, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%" } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const [p1, p2, p3, p4, p5, p6] = projects;
  if (!p1) return null;

  return (
    <section ref={sectionRef} className="section-pad" aria-label="Featured work">
      <div className="container">
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <h2 ref={headingRef} className="heading-lg" style={{ opacity: 0 }}>{heading}</h2>
          <Link href={ctaLink} className="btn btn-outline hidden md:inline-flex">{ctaLabel}</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
          <div className="work-card md:col-span-3" style={{ opacity: 0 }}><ProjectCard project={p1} large /></div>
          {p2 && <div className="work-card md:col-span-2" style={{ opacity: 0 }}><ProjectCard project={p2} /></div>}
          {p3 && <div className="work-card md:col-span-2" style={{ opacity: 0 }}><ProjectCard project={p3} /></div>}
          {p4 && <div className="work-card md:col-span-3" style={{ opacity: 0 }}><ProjectCard project={p4} large /></div>}
          {p5 && <div className="work-card md:col-span-2" style={{ opacity: 0 }}><ProjectCard project={p5} /></div>}
          {p6 && <div className="work-card md:col-span-3" style={{ opacity: 0 }}><ProjectCard project={p6} large /></div>}
        </div>
        <div className="flex justify-center mt-12">
          <Link href={ctaLink} className="btn btn-outline md:hidden">{ctaLabel}</Link>
        </div>
      </div>
    </section>
  );
}
