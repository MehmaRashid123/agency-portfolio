"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Settings } from "@/lib/api";
import AnimatedLogo from "./AnimatedLogo";

const DEFAULT_LINKS = [
  { href: "/work",     label: "Work"     },
  { href: "/services", label: "Services" },
  { href: "/about",    label: "About"    },
  { href: "/contact",  label: "Contact"  },
];

export default function Navbar({ settings }: { settings?: Settings }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const pathname = usePathname();
  const navRef   = useRef<HTMLElement>(null);

  const navLinks = settings?.navbar?.links?.length
    ? [...settings.navbar.links].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : DEFAULT_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#0d1b2a]/95 backdrop-blur-sm border-b border-[var(--border)]" : "bg-transparent"
        }`}
        style={{ height: "var(--nav-h)" }}
        aria-label="Main navigation"
      >
        <div className="container h-full flex items-center justify-between">
          <AnimatedLogo size={38} showText={true} href="/" />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`label transition-colors duration-300 hover:text-[var(--fg)] ${
                  pathname === link.href ? "text-[var(--fg)]" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-px bg-[var(--fg)] transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-6 h-px bg-[var(--fg)] transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-6 h-px bg-[var(--fg)] transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* ── Mobile fullscreen menu ── */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--bg)] flex flex-col justify-center transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="container">
          <div className="flex flex-col gap-6">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="heading-lg transition-colors duration-300"
                style={{
                  transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                  transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: menuOpen ? 1 : 0,
                  transition: `transform 0.5s var(--ease-out-expo) ${i * 60}ms, opacity 0.5s ease ${i * 60}ms`,
                  background: "linear-gradient(135deg, #00d4ff, #7b2fff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
