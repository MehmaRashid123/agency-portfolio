import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await getSettings();
    return { title: s.contact?.heading || "Contact", description: s.contact?.subheading || "Start a project with us." };
  } catch { return { title: "Contact" }; }
}

export default async function ContactPage() {
  let settings = undefined;
  try { settings = await getSettings(); } catch {}

  const c = (settings as any)?.contact || {};
  const heading = c.heading || "Let's Build Something";
  const subheading = c.subheading || "Tell us about your project. We respond within 24 hours.";
  const email = c.email || "hello@zendxb.com";
  const location = c.location || "Berlin, Germany";

  const contactInfo = [
    { label: "Email", value: email, href: `mailto:${email}` },
    ...(c.whatsapp ? [{ label: "WhatsApp", value: c.whatsapp, href: `https://wa.me/${c.whatsapp.replace(/\D/g,"")}` }] : []),
    { label: "Location", value: location, href: null },
  ];

  const socials = [
    { label: "Instagram", href: c.instagram },
    { label: "Behance", href: c.behance },
    { label: "LinkedIn", href: c.linkedin },
  ].filter(s => s.href);

  return (
    <div style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section-pad" aria-label="Contact">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="flex flex-col gap-10">
              <div>
                <span className="label text-[var(--accent)] mb-4 block">Get In Touch</span>
                <h1 className="heading-lg mb-6">{heading}</h1>
                <p className="opacity-60 leading-relaxed text-lg">{subheading}</p>
              </div>
              <div className="flex flex-col gap-6">
                {contactInfo.map(item => (
                  <div key={item.label}>
                    <span className="label mb-1 block">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="text-base hover:text-[var(--accent)] transition-colors duration-300">{item.value}</a>
                    ) : (
                      <p className="text-base opacity-70">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
              {socials.length > 0 && (
                <div>
                  <span className="label mb-4 block">Follow</span>
                  <div className="flex flex-wrap gap-4">
                    {socials.map(s => (
                      <a key={s.label} href={s.href!} target="_blank" rel="noopener noreferrer"
                        className="label hover:text-[var(--accent)] transition-colors duration-300" aria-label={`Follow us on ${s.label}`}>
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <ContactForm settings={settings} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
