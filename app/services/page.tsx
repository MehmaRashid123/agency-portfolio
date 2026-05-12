import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getSettings } from "@/lib/api";
import FAQAccordion from "@/components/FAQAccordion";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    return { title: settings.servicesPage?.heading || "Services & Pricing", description: settings.servicesPage?.subheading || "" };
  } catch { return { title: "Services & Pricing" }; }
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  graphic: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="4" y="4" width="10" height="10" stroke="currentColor" strokeWidth="1.5" /><rect x="18" y="4" width="10" height="10" stroke="currentColor" strokeWidth="1.5" /><rect x="4" y="18" width="10" height="10" stroke="currentColor" strokeWidth="1.5" /><circle cx="23" cy="23" r="5" stroke="currentColor" strokeWidth="1.5" /></svg>,
  web: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="2" y="6" width="28" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" /><path d="M10 14L7 17L10 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M22 14L25 17L22 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M18 12L14 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  "3d": <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="currentColor" strokeWidth="1.5" /><path d="M16 4V28" stroke="currentColor" strokeWidth="1.5" opacity="0.4" /><path d="M4 10L28 10" stroke="currentColor" strokeWidth="1.5" opacity="0.4" /><path d="M4 22L28 22" stroke="currentColor" strokeWidth="1.5" opacity="0.4" /></svg>,
};

export default async function ServicesPage() {
  let services = [], settings = undefined;
  try {
    [services, settings] = await Promise.all([getServices().catch(() => []), getSettings().catch(() => undefined)]);
  } catch {}

  const pageHeading = (settings as any)?.servicesPage?.heading || "Services & Pricing";
  const faqHeading = (settings as any)?.servicesPage?.faqHeading || "FAQ";
  const faqs = (settings as any)?.servicesPage?.faqs || [];

  return (
    <div style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section-pad border-b border-[var(--border)]" aria-label="Services hero">
        <div className="container">
          <span className="label text-[var(--accent)] mb-6 block">What We Offer</span>
          <h1 className="heading-xl max-w-3xl">{pageHeading}</h1>
        </div>
      </section>

      <section aria-label="Service details">
        {services.map((s: any, i: number) => (
          <div key={s._id} id={s.slug} className={`border-b border-[var(--border)] ${i % 2 === 1 ? "bg-[var(--bg-2)]" : ""}`}>
            <div className="container py-16 md:py-24">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
                <div className="md:col-span-5 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-[var(--accent)]">{SERVICE_ICONS[s.slug] || SERVICE_ICONS.graphic}</span>
                    <span className="label text-[var(--accent)]">0{i + 1}</span>
                  </div>
                  <h2 className="heading-md">{s.name}</h2>
                  <p className="opacity-60 leading-relaxed">{s.description}</p>
                  <div className="mt-4">
                    <span className="label mb-2 block">Starting at</span>
                    <p className="text-3xl font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--accent)" }}>{s.startingPrice || "Custom quote"}</p>
                  </div>
                  <Link href="/contact" className="btn btn-primary self-start mt-2">{s.ctaLabel || "Get a Quote"}</Link>
                </div>
                <div className="md:col-span-7">
                  <span className="label mb-6 block">What&apos;s Included</span>
                  <ul className="flex flex-col gap-4" role="list">
                    {(s.features || []).map((item: string) => (
                      <li key={item} className="flex items-start gap-4 py-4 border-b border-[var(--border)] last:border-0">
                        <span className="text-[var(--accent)] mt-0.5 flex-shrink-0" aria-hidden="true">→</span>
                        <span className="opacity-70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {faqs.length > 0 && (
        <section className="section-pad" aria-label="Frequently asked questions">
          <div className="container">
            <h2 className="heading-lg mb-12">{faqHeading}</h2>
            <div className="max-w-3xl">
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
