import Link from "next/link";
import type { Settings } from "@/lib/api";
import AnimatedLogo from "./AnimatedLogo";

const DEFAULT_NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const DEFAULT_SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
];

export default function Footer({ settings }: { settings?: Settings }) {
  const logoText = settings?.logoText || "ZENDXB";
  const dotColor = settings?.logoDotColor || "var(--accent)";
  const tagline = settings?.footer?.tagline || "We build things that move. Premium tech creative hub.";
  const copyright = settings?.footer?.copyrightText || `© ${new Date().getFullYear()} ZENDXB TechHub. All rights reserved.`;

  const navLinks = settings?.footer?.links?.length
    ? settings.footer.links
    : DEFAULT_NAV_LINKS;

  const socials = settings?.footer?.socials;
  const socialList = socials
    ? [
        { label: "Instagram", href: socials.instagram },
        { label: "Behance", href: socials.behance },
        { label: "LinkedIn", href: socials.linkedin },
        { label: "Dribbble", href: socials.dribbble },
        { label: "Twitter", href: socials.twitter },
      ].filter((s) => s.href)
    : DEFAULT_SOCIALS;

  return (
    <footer className="border-t border-[var(--border)]" aria-label="Site footer">
      <div className="container">

        {/* ── Main grid ── */}
        <div className="py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

          {/* Col 1 — Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <AnimatedLogo size={40} showText={true} href="/" />
            <p
              className="text-sm leading-relaxed max-w-[220px]"
              style={{ color: "rgba(232,244,255,0.45)" }}
            >
              {tagline}
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div className="flex flex-col gap-4">
            <span
              className="text-[10px] font-medium uppercase tracking-[0.16em]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Navigation
            </span>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="footer-link text-sm w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Services */}
          <div className="flex flex-col gap-4">
            <span
              className="text-[10px] font-medium uppercase tracking-[0.16em]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Services
            </span>
            <div className="flex flex-col gap-3">
              {[
                { label: "Graphic Design", href: "/services#graphic" },
                { label: "Web Development", href: "/services#web" },
                { label: "3D Art & Animation", href: "/services#3d" },
              ].map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="footer-link text-sm w-fit"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4 — Socials */}
          <div className="flex flex-col gap-4">
            <span
              className="text-[10px] font-medium uppercase tracking-[0.16em]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Follow
            </span>
            <div className="flex flex-col gap-3">
              {socialList.map((s) => (
                <a
                  key={s.label}
                  href={s.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social text-sm w-fit"
                  aria-label={`Follow us on ${s.label}`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            {copyright}
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/contact"
              className="footer-social text-xs"
            >
              Get a Quote →
            </Link>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              Built with Next.js
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
