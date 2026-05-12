"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import type { Project, Settings } from "@/lib/api";
import { getProjects, getSettings } from "@/lib/api";

export default function WorkPage() {
  const [active, setActive] = useState("all");
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<Settings | undefined>();
  const [loading, setLoading] = useState(true);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    Promise.all([getProjects().catch(() => []), getSettings().catch(() => undefined)])
      .then(([p, s]) => { setAllProjects(p); setSettings(s); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    gsap.fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
  }, []);

  const fl = settings?.workPage?.filterLabels;
  const filters = [
    { value: "all", label: fl?.all || "All" },
    { value: "graphic", label: fl?.graphic || "Graphic Design" },
    { value: "web", label: fl?.web || "Web Development" },
    { value: "3d", label: fl?.threeD || "3D Art" },
  ];

  const heading = settings?.workPage?.heading || "Our Work";
  const filtered = active === "all" ? allProjects : allProjects.filter(p => p.category === active);

  return (
    <div style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section-pad pb-0" aria-label="Work page header">
        <div className="container">
          <h1 ref={headingRef} className="heading-xl mb-10" style={{ opacity: 0 }}>{heading}</h1>
          <div className="flex flex-wrap gap-3 mb-12" role="group" aria-label="Filter projects by category">
            {filters.map(f => (
              <button key={f.value} onClick={() => setActive(f.value)}
                className={`btn text-xs py-2.5 px-5 transition-all duration-300 ${active === f.value ? "btn-primary" : "btn-outline"}`}
                aria-pressed={active === f.value}>{f.label}</button>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad pt-0" aria-label="Project grid">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/3] bg-[#1a1a1a] rounded" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(project => (
                <Link key={project.slug} href={`/work/${project.slug}`} className="project-card block aspect-[4/3]" aria-label={`View project: ${project.title}`} style={{ animation: "fadeUp 0.6s var(--ease-out-expo) both" }}>
                  <div className="relative w-full h-full overflow-hidden bg-[var(--bg-2)]">
                    {project.thumbnail?.url && <Image src={project.thumbnail.url} alt={project.title} fill className="card-img object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />}
                    <div className="card-overlay">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.slice(0, 2).map(tag => <span key={tag} className="label text-[10px] px-2 py-1 border border-[var(--border)]">{tag}</span>)}
                      </div>
                      <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>{project.title}</h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && <p className="opacity-40 text-center py-20">No projects in this category yet.</p>}
        </div>
      </section>
      <style jsx global>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
