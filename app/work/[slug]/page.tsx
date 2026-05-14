import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProject, getProjects } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProject(slug);
    if (!project) return { title: "Project Not Found" };
    return { title: project.title, description: project.shortDescription };
  } catch {
    return { title: "Project Not Found" };
  }
}

// Renders any image/gif correctly
function ProjectImage({ src, alt, fill, className, sizes, style }: {
  src: string; alt: string; fill?: boolean; className?: string; sizes?: string; style?: React.CSSProperties;
}) {
  const isGif = src.toLowerCase().includes(".gif");
  if (isGif) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }} />
    );
  }
  return (
    <Image src={src} alt={alt} fill={fill} className={className} sizes={sizes} style={style} />
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  let project = null;
  let allProjects: Awaited<ReturnType<typeof getProjects>> = [];

  try {
    [project, allProjects] = await Promise.all([getProject(slug), getProjects()]);
  } catch {
    notFound();
  }

  if (!project) notFound();

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];

  // All images: thumbnail first, then additional images sorted by order
  const allImages = [
    ...(project.thumbnail?.url ? [project.thumbnail.url] : []),
    ...(project.images || [])
      .filter(img => img.url && img.url !== project.thumbnail?.url)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(img => img.url),
  ];

  const heroImg = allImages[0];
  const galleryImages = allImages.slice(1);

  return (
    <article style={{ paddingTop: "var(--nav-h)", background: "var(--bg)" }}>

      {/* ── Hero image — full bleed ── */}
      {heroImg && (
        <div style={{ width: "100%", aspectRatio: "16/8", overflow: "hidden", background: "var(--bg-2)", position: "relative" }}>
          <ProjectImage
            src={heroImg}
            alt={`${project.title} — hero`}
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Bottom fade */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, var(--bg), transparent)" }} />
        </div>
      )}

      {/* ── Project header ── */}
      <div className="container" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "start" }} className="project-header-grid">
          {/* Left: title */}
          <div>
            <span className="label" style={{ color: "var(--accent)", display: "block", marginBottom: "1rem" }}>
              {project.category}
            </span>
            <h1 className="heading-lg" style={{ lineHeight: 0.95 }}>{project.title}</h1>
            {project.shortDescription && (
              <p style={{ marginTop: "1.5rem", color: "rgba(255,255,255,0.55)", fontSize: "1.05rem", lineHeight: 1.75, maxWidth: "560px" }}>
                {project.shortDescription}
              </p>
            )}
          </div>

          {/* Right: meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", minWidth: "180px" }}>
            {project.client && (
              <div>
                <p className="label" style={{ marginBottom: "0.4rem" }}>Client</p>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>{project.client}</p>
              </div>
            )}
            {project.year && (
              <div>
                <p className="label" style={{ marginBottom: "0.4rem" }}>Year</p>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>{project.year}</p>
              </div>
            )}
            {project.tools?.length > 0 && (
              <div>
                <p className="label" style={{ marginBottom: "0.6rem" }}>Tools</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {project.tools.map(t => (
                    <span key={t} className="label" style={{ padding: "0.25rem 0.6rem", border: "1px solid var(--border)", fontSize: "0.65rem" }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
            {project.tags?.length > 0 && (
              <div>
                <p className="label" style={{ marginBottom: "0.6rem" }}>Tags</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {project.tags.map(t => (
                    <span key={t} className="label" style={{ padding: "0.25rem 0.6rem", border: "1px solid var(--border)", fontSize: "0.65rem" }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Full description ── */}
      {project.fullDescription && (
        <div className="container" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "720px" }}>
            <div
              style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", lineHeight: 1.85 }}
              dangerouslySetInnerHTML={{ __html: project.fullDescription }}
            />
          </div>
        </div>
      )}

      {/* ── Gallery ── */}
      {galleryImages.length > 0 && (
        <div className="container" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border)" }}>
            {/* First image: full width */}
            {galleryImages[0] && (
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "var(--bg-2)" }}>
                <ProjectImage src={galleryImages[0]} alt={`${project.title} — 2`} fill className="object-cover" sizes="100vw" />
              </div>
            )}
            {/* Remaining: 2-col grid */}
            {galleryImages.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "var(--border)" }}>
                {galleryImages.slice(1).map((img, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "var(--bg-2)" }}>
                    <ProjectImage src={img} alt={`${project.title} — ${i + 3}`} fill className="object-cover" sizes="50vw" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Video ── */}
      {project.videoUrl && (
        <div className="container" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#000" }}>
            <iframe
              src={project.videoUrl.replace("watch?v=", "embed/")}
              title={`${project.title} video`}
              allow="autoplay; fullscreen"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}

      {/* ── Prev / Next navigation ── */}
      <div className="container" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)", paddingBottom: "clamp(5rem, 10vw, 9rem)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border)" }} className="project-nav-grid">
          {/* Prev */}
          {prevProject && prevProject.slug !== slug && (
            <Link href={`/work/${prevProject.slug}`} style={{ display: "block", padding: "clamp(2rem, 4vw, 3rem)", background: "var(--bg)", transition: "background 0.3s ease" }}
              className="project-nav-link">
              <p className="label" style={{ marginBottom: "1rem", color: "rgba(255,255,255,0.3)" }}>← Previous</p>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)", fontWeight: 600, letterSpacing: "-0.02em", color: "#fff" }}>
                {prevProject.title}
              </h3>
            </Link>
          )}
          {/* Next */}
          {nextProject && nextProject.slug !== slug && (
            <Link href={`/work/${nextProject.slug}`} style={{ display: "block", padding: "clamp(2rem, 4vw, 3rem)", background: "var(--bg)", transition: "background 0.3s ease", textAlign: "right" }}
              className="project-nav-link">
              <p className="label" style={{ marginBottom: "1rem", color: "rgba(255,255,255,0.3)" }}>Next →</p>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)", fontWeight: 600, letterSpacing: "-0.02em", color: "#fff" }}>
                {nextProject.title}
              </h3>
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .project-nav-link:hover { background: var(--bg-2) !important; }
        @media (max-width: 640px) {
          .project-header-grid { grid-template-columns: 1fr !important; }
          .project-nav-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </article>
  );
}
