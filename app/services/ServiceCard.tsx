'use client';

import Link from "next/link";
import type { Service } from "@/lib/api";

function ServiceIcon({ slug }: { slug: string }) {
  if (slug === "graphic") return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="10" height="10" stroke="currentColor" strokeWidth="1.5" />
      <rect x="18" y="4" width="10" height="10" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="18" width="10" height="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="23" cy="23" r="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
  if (slug === "web") return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="28" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 14L7 17L10 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 14L25 17L22 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 12L14 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  if (slug === "3d") return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 4V28" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M4 10L28 10" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M4 22L28 22" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function ServiceCard({ service: s, index: i }: { service: Service; index: number }) {
  return (
    <div id={s.slug} className="service-card">
      {/* Top row: icon + ghost number */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className="service-icon-box">
          <ServiceIcon slug={s.slug} />
        </div>
        <span className="service-ghost-num" aria-hidden="true">
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Name */}
      <h2 className="service-name">{s.name}</h2>

      {/* Description */}
      {s.description && (
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.7, flexGrow: 1 }}>
          {s.description}
        </p>
      )}

      {/* Features */}
      {s.features && s.features.length > 0 && (
        <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }} role="list">
          {s.features.map((f) => (
            <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
              <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px", fontSize: "0.75rem" }} aria-hidden="true">→</span>
              {f}
            </li>
          ))}
        </ul>
      )}

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border)", marginTop: "auto" }} />

      {/* Price + CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.25rem" }}>
            Starting at
          </p>
          <p className="service-price">{s.startingPrice || "Custom"}</p>
        </div>
        <Link href="/contact" className="btn btn-primary" style={{ fontSize: "0.75rem", padding: "0.65rem 1.4rem", whiteSpace: "nowrap" }}>
          {s.ctaLabel || "Get a Quote"}
        </Link>
      </div>
    </div>
  );
}
