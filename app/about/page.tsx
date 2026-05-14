import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTeam, getSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await getSettings();
    return {
      title: s.about?.heroHeading ? `About — ${s.siteName || "Agency"}` : "About",
      description: s.about?.heroSubheading || "Meet the team behind the work.",
    };
  } catch {
    return { title: "About" };
  }
}

export default async function AboutPage() {
  const [team, settings] = await Promise.all([
    getTeam().catch(() => []),
    getSettings().catch(() => undefined),
  ]);

  const sortedTeam = [...team].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const about = settings?.about;
  const siteName = settings?.siteName || settings?.logoText || "Agency";
  const foundedYear = about?.foundedYear || "2021";
  const heroHeading = about?.heroHeading || `We Are ${siteName}`;
  const heroSubheading = about?.heroSubheading || "A small, obsessive team of designers, developers, and 3D artists. We work with brands that want to stand out — not blend in.";
  const story = about?.story;
  const mission = about?.mission;
  const heroImage = about?.heroImage?.url;
  const values = about?.values?.length ? about.values : [
    { title: "Craft Over Speed", description: "We take the time to get it right. Every pixel, every line of code, every frame of animation is considered." },
    { title: "Honest Collaboration", description: "We work with clients, not for them. The best results come from open dialogue and shared ownership." },
    { title: "Motion as Language", description: "Animation isn't decoration — it's communication. We use motion to guide, delight, and inform." },
    { title: "No Shortcuts", description: "We don't use templates, stock assets, or AI-generated filler. Everything we make is original." },
  ];
  const toolsLabel = about?.toolsLabel || "Tools & Tech";
  const tools = about?.tools?.length ? about.tools : [
    "Figma", "Illustrator", "Photoshop", "Next.js",
    "React", "TypeScript", "GSAP", "Three.js",
    "Blender", "Cinema 4D", "After Effects", "Framer",
  ];

  return (
    <div style={{ paddingTop: "var(--nav-h)" }}>

      {/* ── Hero ── */}
      <section className="section-pad border-b border-[var(--border)]" aria-label="About hero">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "center" }}
            className="grid-cols-about">
            {/* Left */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <span className="label" style={{ color: "var(--accent)" }}>Est. {foundedYear}</span>
              <h1 className="heading-xl" style={{ lineHeight: 0.92 }}>{heroHeading}</h1>
              <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontSize: "1.05rem", maxWidth: "480px" }}>
                {heroSubheading}
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
                <Link href="/work" className="btn btn-primary">View Our Work</Link>
                <Link href="/contact" className="btn btn-outline">Get in Touch</Link>
              </div>
            </div>

            {/* Right — image */}
            <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: "var(--bg-2)" }}>
              {heroImage ? (
                <Image src={heroImage} alt={`${siteName} team`} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              ) : (
                /* Placeholder with accent grid */
                <div style={{ width: "100%", height: "100%", background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,77,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 700, color: "rgba(255,77,0,0.12)", letterSpacing: "-0.04em", userSelect: "none" }}>
                    {siteName.charAt(0)}
                  </span>
                </div>
              )}
              {/* Orange accent corner */}
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "60px", height: "3px", background: "var(--accent)" }} />
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", marginTop: "clamp(4rem, 8vw, 7rem)", borderTop: "1px solid var(--border)" }}>
            {[
              { value: `${new Date().getFullYear() - parseInt(foundedYear)}+`, label: "Years Active" },
              { value: `${team.length || "10"}+`, label: "Team Members" },
              { value: "100+", label: "Projects Delivered" },
            ].map((stat, i) => (
              <div key={i} style={{ padding: "2rem clamp(1rem, 3vw, 2.5rem)", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p className="label" style={{ marginTop: "0.5rem" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story / Mission ── */}
      {(story || mission) && (
        <section className="section-pad border-b border-[var(--border)]" aria-label="Our story">
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "start" }}
              className="grid-cols-story">
              <div>
                <span className="label" style={{ color: "var(--accent)" }}>Our Story</span>
                <div style={{ width: "40px", height: "1px", background: "var(--accent)", marginTop: "1rem" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {story && (
                  <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)", lineHeight: 1.75, color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}>
                    {story}
                  </p>
                )}
                {mission && (
                  <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)", lineHeight: 1.75, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}>
                    {mission}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Team ── */}
      {sortedTeam.length > 0 && (
        <section className="section-pad border-b border-[var(--border)]" aria-label="Team members">
          <div className="container">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(3rem, 6vw, 5rem)", flexWrap: "wrap", gap: "1rem" }}>
              <h2 className="heading-lg">The Team</h2>
              <span className="label">{sortedTeam.length} member{sortedTeam.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5px", background: "var(--border)" }}>
              {sortedTeam.map((member) => (
                <div key={member._id} style={{ background: "var(--bg)", display: "flex", flexDirection: "column" }} className="team-member-card">
                  <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "var(--bg-2)" }}>
                    {member.photo?.url ? (
                      <Image
                        src={member.photo.url}
                        alt={member.name}
                        fill
                        className="object-cover team-photo"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "var(--font-heading)", fontSize: "3rem", fontWeight: 700, color: "rgba(255,255,255,0.08)" }}>
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>
                    <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1rem", color: "#fff" }}>{member.name}</p>
                    <p className="label" style={{ marginTop: "0.3rem" }}>{member.role}</p>
                    {(member.socials?.instagram || member.socials?.behance || member.socials?.linkedin) && (
                      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                        {member.socials.behance && (
                          <a href={member.socials.behance} target="_blank" rel="noopener noreferrer" className="label" style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
                            Be
                          </a>
                        )}
                        {member.socials.linkedin && (
                          <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="label" style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
                            Li
                          </a>
                        )}
                        {member.socials.instagram && (
                          <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="label" style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
                            Ig
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Values ── */}
      <section className="section-pad border-b border-[var(--border)]" aria-label="Company values">
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(3rem, 6vw, 5rem)", flexWrap: "wrap", gap: "1rem" }}>
            <h2 className="heading-lg">Our Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "0", border: "1px solid var(--border)" }}>
            {values.map((v, i) => (
              <div key={i} style={{ padding: "clamp(2rem, 4vw, 3rem)", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1.25rem" }}
                className="value-card">
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 700, color: "rgba(255,77,0,0.1)", lineHeight: 1, letterSpacing: "-0.04em" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.2rem, 2vw, 1.5rem)", fontWeight: 600, letterSpacing: "-0.02em", color: "#fff" }}>
                  {v.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.75 }}>
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ── */}
      <section className="section-pad border-b border-[var(--border)]" aria-label="Tools and technologies">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "start" }}
            className="grid-cols-tools">
            <div>
              <h2 className="heading-lg">{toolsLabel}</h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignContent: "flex-start" }}>
              {tools.map((tool) => (
                <span key={tool} className="label tool-tag"
                  style={{ padding: "0.6rem 1.1rem", border: "1px solid var(--border)", color: "rgba(255,255,255,0.5)", transition: "all 0.2s ease", cursor: "default" }}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-pad" aria-label="Contact call to action">
        <div className="container" style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
          <span className="label" style={{ color: "var(--accent)", display: "block", marginBottom: "1.5rem" }}>Ready to work together?</span>
          <h2 className="heading-lg" style={{ marginBottom: "1.5rem" }}>Let's build something great.</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
            We're selective about the projects we take on — which means when we say yes, we're fully committed.
          </p>
          <Link href="/contact" className="btn btn-primary">Start a Project</Link>
        </div>
      </section>

      <style>{`
        .team-photo { filter: grayscale(100%); transition: filter 0.5s ease, transform 0.5s var(--ease-out-expo); }
        .team-member-card:hover .team-photo { filter: grayscale(0%); transform: scale(1.04); }
        .value-card { transition: background 0.3s ease; }
        .value-card:hover { background: var(--bg-2); }
        .tool-tag:hover { border-color: var(--accent) !important; color: var(--accent) !important; }
        @media (max-width: 768px) {
          .grid-cols-about { grid-template-columns: 1fr !important; }
          .grid-cols-story { grid-template-columns: 1fr !important; }
          .grid-cols-tools { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
