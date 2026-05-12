import type { Metadata } from "next";
import Image from "next/image";
import { getTeam, getSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the team behind ZENDXB TechHub — designers, developers, and 3D artists.",
};

const tools = [
  "Figma", "Illustrator", "Photoshop", "InDesign",
  "Next.js", "React", "TypeScript", "GSAP",
  "Three.js", "Blender", "Cinema 4D", "After Effects",
  "Sanity", "Shopify", "Framer", "DaVinci Resolve",
];

const values = [
  { num: "01", title: "Craft Over Speed", desc: "We take the time to get it right. Every pixel, every line of code, every frame of animation is considered." },
  { num: "02", title: "Honest Collaboration", desc: "We work with clients, not for them. The best results come from open dialogue and shared ownership." },
  { num: "03", title: "Motion as Language", desc: "Animation isn't decoration — it's communication. We use motion to guide, delight, and inform." },
  { num: "04", title: "No Shortcuts", desc: "We don't use templates, stock assets, or AI-generated filler. Everything we make is original." },
];

export default async function AboutPage() {
  let team: Awaited<ReturnType<typeof getTeam>> = [];
  let settings: Awaited<ReturnType<typeof getSettings>> | null = null;

  try {
    [team, settings] = await Promise.all([getTeam(), getSettings()]);
  } catch {
    // fallback to empty
  }

  const sortedTeam = [...team].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const story = settings?.about?.story;
  const mission = settings?.about?.mission;
  const foundedYear = settings?.about?.foundedYear || "2021";

  return (
    <div style={{ paddingTop: "var(--nav-h)" }}>
      {/* Hero */}
      <section className="section-pad border-b border-[var(--border)]" aria-label="About hero">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="flex flex-col gap-6">
              <span className="label text-[var(--accent)]">Est. {foundedYear}</span>
              <h1 className="heading-xl">We Are ZENDXB TechHub</h1>
              <p className="opacity-60 leading-relaxed text-lg max-w-lg">
                {story || "A small, obsessive team of designers, developers, and 3D artists. We work with brands that want to stand out — not blend in."}
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-2)]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
                alt="ZENDXB TechHub team working"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-pad border-b border-[var(--border)]" aria-label="Mission statement">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="label text-[var(--accent)] mb-6 block">Our Mission</span>
            <p className="text-2xl md:text-3xl leading-relaxed opacity-80" style={{ fontFamily: "var(--font-heading)" }}>
              {mission || "To build digital experiences that are as precise as they are beautiful — and to make every brand we touch impossible to ignore."}
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      {sortedTeam.length > 0 && (
        <section className="section-pad border-b border-[var(--border)]" aria-label="Team members">
          <div className="container">
            <h2 className="heading-lg mb-12 md:mb-16">The Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {sortedTeam.map((member) => (
                <div key={member._id} className="flex flex-col gap-4">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-2)]">
                    {member.photo?.url ? (
                      <Image
                        src={member.photo.url}
                        alt={member.name}
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[var(--bg-2)]" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="label mt-1">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools */}
      <section className="section-pad border-b border-[var(--border)]" aria-label="Tools and technologies">
        <div className="container">
          <h2 className="heading-lg mb-12">Tools &amp; Tech</h2>
          <div className="flex flex-wrap gap-3">
            {tools.map((tool) => (
              <span key={tool} className="label px-4 py-2.5 border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad" aria-label="Company values">
        <div className="container">
          <h2 className="heading-lg mb-12 md:mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {values.map((v) => (
              <div key={v.num} className="flex flex-col gap-4 p-8 border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors duration-300">
                <span className="label text-[var(--accent)]">{v.num}</span>
                <h3 className="heading-md">{v.title}</h3>
                <p className="opacity-60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
