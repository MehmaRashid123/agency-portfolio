"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import type { Project, Settings } from "@/lib/api";
import { getProjects, getSettings, getCategories } from "@/lib/api";

export default function WorkPage() {
  const [active, setActive] = useState("all");
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<Settings | undefined>();
  const [filters, setFilters] = useState<{ value: string; label: string }[]>([
    { value: "all", label: "All" },
  ]);
  const [loading, setLoading] = useState(true);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      getProjects().catch(() => []),
      getSettings().catch(() => undefined),
      getCategories().catch(() => []),
    ]).then(([p, s, cats]) => {
      setAllProjects(p);
      setSettings(s);
      const fl = s?.workPage?.filterLabels;
      setFilters([
        { value: "all", label: fl?.all || "All" },
        ...cats.map((c) => ({ value: c.slug, label: c.label })),
      ]);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!headingRef.current) return;
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    if (!gridRef.current || loading) return;
    const cards = gridRef.current.querySelectorAll(".work-card");
    gsap.fromTo(cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" }
    );
  }, [active, loading]);

  const heading = settings?.workPage?.heading || "Our Work";
  const subheading = settings?.workPage?.subheading;
  const filtered = active === "all"
    ? allProjects
    : allProjects.filter(p => p.category === active);

  return (
    <div style={{ paddingTop: "var(--nav-h)" }}>

      {/* ── Header — tight, no excess padding ── */}
      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          <div>
            <h1 ref={headingRef} className="heading-xl" style={{ opacity: 0, lineHeight: 0.92 }}>
              {heading}
            </h1>
            {subheading && (
              <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.75rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {subheading}
              </p>
            )}
          </div>
          {!loading && (
            <span className="label" style={{ color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Filter buttons */}
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }}
          role="group"
          aria-label="Filter by category"
        >
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              aria-pressed={active === f.value}
              className={`btn text-xs py-2.5 px-5 transition-all duration-200 ${
                active === f.value ? "btn-primary" : "btn-outline"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="container" style={{ paddingBottom: "6rem" }}>
        {loading ? (
          // Skeleton — uniform 3-col
          <div className="work-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="work-skeleton"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p className="label" style={{ color: "rgba(255,255,255,0.2)", marginBottom: "1.25rem" }}>
              No projects in this category
            </p>
            <button onClick={() => setActive("all")} className="btn btn-outline text-xs py-2 px-5">
              Show all
            </button>
          </div>
        ) : (
          <div ref={gridRef} className="work-grid">
            {filtered.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="project-card work-card block"
                aria-label={`View project: ${project.title}`}
                style={{ opacity: 0 }}
              >
                <div className="relative w-full h-full overflow-hidden bg-[var(--bg-2)]">
                  {project.thumbnail?.url && (
                    project.thumbnail.url.toLowerCase().includes(".gif") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.thumbnail.url}
                        alt={project.title}
                        className="card-img"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <Image
                        src={project.thumbnail.url}
                        alt={project.title}
                        fill
                        className="card-img object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )
                  )}
                  <div className="card-overlay">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.6rem" }}>
                      <span className="label" style={{ color: "var(--accent)", fontSize: "0.65rem" }}>
                        {project.category}
                      </span>
                      {project.tags?.slice(0, 1).map(tag => (
                        <span key={tag} className="label" style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", border: "1px solid rgba(255,255,255,0.15)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1rem, 2vw, 1.4rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#fff" }}>
                      {project.title}
                    </h2>
                    <p style={{ marginTop: "0.4rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      View →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .work-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .work-grid .project-card,
        .work-skeleton {
          aspect-ratio: 4 / 3;
        }
        .work-skeleton {
          background: var(--bg-2);
          animation: skPulse 1.5s ease-in-out infinite;
        }
        @keyframes skPulse {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.6;  }
        }
        @media (max-width: 1024px) {
          .work-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .work-grid { grid-template-columns: 1fr; gap: 0.75rem; }
        }
      `}</style>
    </div>
  );
}
