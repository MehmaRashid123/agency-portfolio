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
    return {
      title: project.title,
      description: project.shortDescription,
    };
  } catch {
    return { title: "Project Not Found" };
  }
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

  const categoryLabel = {
    graphic: "Graphic Design",
    web: "Web Development",
    "3d": "3D Art & Animation",
  }[project.category];

  const heroImage = project.images?.[0]?.url || project.thumbnail?.url;
  const image2 = project.images?.[1]?.url;
  const image3 = project.images?.[2]?.url;

  return (
    <article style={{ paddingTop: "var(--nav-h)" }}>
      {/* Hero image */}
      {heroImage && (
        <div className="relative w-full aspect-[16/7] overflow-hidden bg-[var(--bg-2)]">
          <Image
            src={heroImage}
            alt={`${project.title} hero image`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Project header */}
      <div className="container py-12 md:py-16 border-b border-[var(--border)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <span className="label text-[var(--accent)] mb-4 block">{categoryLabel}</span>
            <h1 className="heading-lg">{project.title}</h1>
          </div>
          <div className="grid grid-cols-2 gap-6 md:gap-8 md:justify-end">
            <div>
              <span className="label mb-2 block">Client</span>
              <p className="text-sm opacity-70">{project.client}</p>
            </div>
            <div>
              <span className="label mb-2 block">Year</span>
              <p className="text-sm opacity-70">{project.year}</p>
            </div>
            <div>
              <span className="label mb-2 block">Services</span>
              <p className="text-sm opacity-70">{categoryLabel}</p>
            </div>
            <div>
              <span className="label mb-2 block">Tools</span>
              <p className="text-sm opacity-70">{project.tools?.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="container py-12 md:py-16 border-b border-[var(--border)]">
        <div className="max-w-2xl">
          <p className="text-lg md:text-xl leading-relaxed opacity-70">
            {project.shortDescription || project.fullDescription?.replace(/<[^>]+>/g, "")}
          </p>
        </div>
      </div>

      {/* Image gallery */}
      <div className="container py-12 md:py-16 flex flex-col gap-5">
        {image2 && (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--bg-2)]">
            <Image
              src={image2}
              alt={`${project.title} — image 2`}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
        {image3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-2)]">
              <Image
                src={image3}
                alt={`${project.title} — image 3`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {heroImage && (
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-2)]">
                <Image
                  src={heroImage}
                  alt={`${project.title} — image 4`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      {project.tags?.length > 0 && (
        <div className="container pb-12 border-b border-[var(--border)]">
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span key={tag} className="label px-4 py-2 border border-[var(--border)]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Next project */}
      {nextProject && (
        <div className="container py-16 md:py-24">
          <span className="label mb-6 block opacity-50">Next Project</span>
          <Link
            href={`/work/${nextProject.slug}`}
            className="group flex items-center justify-between gap-8 hover:opacity-70 transition-opacity duration-300"
            aria-label={`Next project: ${nextProject.title}`}
          >
            <h2 className="heading-lg">{nextProject.title}</h2>
            <span className="text-4xl md:text-6xl group-hover:translate-x-3 transition-transform duration-300">→</span>
          </Link>
        </div>
      )}
    </article>
  );
}
