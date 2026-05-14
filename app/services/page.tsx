import type { Metadata } from "next";
import { getServices, getSettings } from "@/lib/api";
import FAQAccordion from "@/components/FAQAccordion";
import ServiceCard from "./ServiceCard";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    return {
      title: settings.servicesPage?.heading || "Services & Pricing",
      description: settings.servicesPage?.subheading || "",
    };
  } catch {
    return { title: "Services & Pricing" };
  }
}

export default async function ServicesPage() {
  let services = await getServices().catch(() => []);
  const settings = await getSettings().catch(() => undefined);

  const pageHeading = settings?.servicesPage?.heading || "Services & Pricing";
  const pageSubheading = settings?.servicesPage?.subheading || "";
  const faqHeading = settings?.servicesPage?.faqHeading || "FAQ";
  const faqs = settings?.servicesPage?.faqs || [];

  return (
    <>
      <style>{`
        .service-card {
          background: var(--bg);
          border: 1px solid var(--border);
          padding: clamp(2rem, 4vw, 3rem);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: background 0.3s ease, border-color 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .service-card:hover {
          background: var(--bg-2);
          border-color: rgba(255, 77, 0, 0.35);
        }
        .service-card:hover .service-icon-box {
          border-color: var(--accent);
          background: rgba(255, 77, 0, 0.08);
        }
        .service-icon-box {
          width: 52px;
          height: 52px;
          border: 1px solid rgba(255, 77, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .service-ghost-num {
          font-family: var(--font-heading);
          font-size: clamp(3rem, 5vw, 4.5rem);
          font-weight: 700;
          color: rgba(255, 255, 255, 0.04);
          line-height: 1;
          letter-spacing: -0.04em;
          user-select: none;
          transition: color 0.3s ease;
        }
        .service-card:hover .service-ghost-num {
          color: rgba(255, 77, 0, 0.07);
        }
        .service-name {
          font-family: var(--font-heading);
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: #fff;
        }
        .service-price {
          font-family: var(--font-heading);
          font-size: clamp(1.4rem, 2vw, 1.75rem);
          font-weight: 600;
          color: var(--accent);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 1fr));
          border: 1px solid var(--border);
          gap: 0;
        }
        .services-grid .service-card {
          border: none;
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
      `}</style>

      <div style={{ paddingTop: "var(--nav-h)" }}>

        {/* ── Hero ── */}
        <section className="section-pad border-b border-[var(--border)]" aria-label="Services hero">
          <div className="container">
            <span className="label text-[var(--accent)] mb-6 block">What We Offer</span>
            <h1 className="heading-xl max-w-4xl">{pageHeading}</h1>
            {pageSubheading && (
              <p className="mt-6 text-lg max-w-xl" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                {pageSubheading}
              </p>
            )}
          </div>
        </section>

        {/* ── Cards ── */}
        <section className="section-pad" aria-label="Service offerings">
          <div className="container">
            {services.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "4rem 0" }}>
                No services available yet.
              </p>
            ) : (
              <div className="services-grid">
                {services.map((s, i) => (
                  <ServiceCard key={s._id} service={s} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── FAQ ── */}
        {faqs.length > 0 && (
          <section className="section-pad border-t border-[var(--border)]" aria-label="Frequently asked questions">
            <div className="container">
              <h2 className="heading-lg mb-12">{faqHeading}</h2>
              <div className="max-w-3xl">
                <FAQAccordion faqs={faqs} />
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
