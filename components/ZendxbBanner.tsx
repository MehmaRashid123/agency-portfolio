"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Service SVG icons ─────────────────────────────────────────────────── */
const SERVICES = [
  {
    label: "Graphic\nDesigning",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>
      </svg>
    ),
  },
  {
    label: "Branding",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    label: "3D &\nAnimation",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    label: "Web\nDevelopment",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    label: "App\nDevelopment",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
  {
    label: "SEO &\nMarketing",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    label: "UI/UX\nDesign",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
];

const STATS = [
  {
    value: "200+", label: "PROJECTS",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  },
  {
    value: "FAST", label: "RESPONSE",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7b2fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  },
  {
    value: "GLOBAL", label: "CLIENTS",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  },
  {
    value: "CREATIVE", label: "TEAM",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7b2fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
];

/* ── Animated SVG logo matching the real logo ──────────────────────────── */
function BannerLogo() {
  return (
    <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ZendXB logo">
      <defs>
        <linearGradient id="bl-cg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff"/>
          <stop offset="100%" stopColor="#7b2fff"/>
        </linearGradient>
        <linearGradient id="bl-cg2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7b2fff"/>
          <stop offset="100%" stopColor="#00d4ff"/>
        </linearGradient>
        <filter id="bl-glow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="bl-softglow">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer bg circle */}
      <circle cx="50" cy="50" r="48" fill="#0a1628" stroke="url(#bl-cg)" strokeWidth="1.5" opacity="0.7"/>

      {/* Rotating dashed ring */}
      <circle cx="50" cy="50" r="43" stroke="url(#bl-cg)" strokeWidth="0.8" strokeDasharray="5 4" fill="none" opacity="0.5" style={{ transformOrigin: "50px 50px", animation: "bl-spin 10s linear infinite" }}/>

      {/* Inner glow */}
      <ellipse cx="50" cy="50" rx="24" ry="24" fill="url(#bl-cg)" opacity="0.07" style={{ transformOrigin: "50px 50px", animation: "bl-pulse 3s ease-in-out infinite" }}/>

      {/* Z shape */}
      <g filter="url(#bl-glow)">
        <line x1="27" y1="29" x2="73" y2="29" stroke="url(#bl-cg)" strokeWidth="5.5" strokeLinecap="round"/>
        <line x1="73" y1="29" x2="27" y2="71" stroke="url(#bl-cg2)" strokeWidth="5.5" strokeLinecap="round"/>
        <line x1="27" y1="71" x2="73" y2="71" stroke="url(#bl-cg)" strokeWidth="5.5" strokeLinecap="round"/>
      </g>

      {/* Circuit dots */}
      {[
        { cx: 27, cy: 29, c: "#00d4ff", d: "0s" },
        { cx: 50, cy: 29, c: "#7b2fff", d: "0.3s" },
        { cx: 73, cy: 29, c: "#00d4ff", d: "0.6s" },
        { cx: 50, cy: 50, c: "#00d4ff", d: "0.9s" },
        { cx: 27, cy: 71, c: "#7b2fff", d: "1.2s" },
        { cx: 50, cy: 71, c: "#00d4ff", d: "1.5s" },
        { cx: 73, cy: 71, c: "#7b2fff", d: "1.8s" },
      ].map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r="3" fill={dot.c} filter="url(#bl-glow)"
          style={{ animation: `bl-dot 2.4s ease-in-out ${dot.d} infinite` }}/>
      ))}

      {/* Corner circuit stubs */}
      <line x1="27" y1="29" x2="19" y2="21" stroke="#00d4ff" strokeWidth="1" opacity="0.5"/>
      <line x1="73" y1="29" x2="81" y2="21" stroke="#7b2fff" strokeWidth="1" opacity="0.5"/>
      <line x1="27" y1="71" x2="19" y2="79" stroke="#7b2fff" strokeWidth="1" opacity="0.5"/>
      <line x1="73" y1="71" x2="81" y2="79" stroke="#00d4ff" strokeWidth="1" opacity="0.5"/>
      <circle cx="19" cy="21" r="2" fill="#00d4ff" opacity="0.6"/>
      <circle cx="81" cy="21" r="2" fill="#7b2fff" opacity="0.6"/>
      <circle cx="19" cy="79" r="2" fill="#7b2fff" opacity="0.6"/>
      <circle cx="81" cy="79" r="2" fill="#00d4ff" opacity="0.6"/>

      <style>{`
        @keyframes bl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bl-pulse { 0%,100% { opacity:0.06; } 50% { opacity:0.16; } }
        @keyframes bl-dot { 0%,100% { opacity:0.35; transform:scale(1); } 50% { opacity:1; transform:scale(1.6); } }
      `}</style>
    </svg>
  );
}

/* ── Circuit background SVG ─────────────────────────────────────────────── */
function CircuitBg() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true"
      preserveAspectRatio="xMidYMid slice" viewBox="0 0 1400 340">
      <defs>
        <linearGradient id="cb-g1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0"/>
          <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#7b2fff" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="cb-g2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7b2fff" stopOpacity="0"/>
          <stop offset="50%" stopColor="#7b2fff" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Top & bottom flowing lines */}
      <line x1="0" y1="30" x2="1400" y2="30" stroke="url(#cb-g1)" strokeWidth="1">
        <animate attributeName="stroke-dasharray" values="0,1400;700,700;0,1400" dur="5s" repeatCount="indefinite"/>
      </line>
      <line x1="0" y1="310" x2="1400" y2="310" stroke="url(#cb-g2)" strokeWidth="1">
        <animate attributeName="stroke-dasharray" values="0,1400;500,900;0,1400" dur="6s" repeatCount="indefinite"/>
      </line>
      {/* Vertical dividers */}
      <line x1="350" y1="0" x2="350" y2="340" stroke="#00d4ff" strokeWidth="0.5" strokeOpacity="0.1"/>
      <line x1="700" y1="0" x2="700" y2="340" stroke="#7b2fff" strokeWidth="0.5" strokeOpacity="0.1"/>
      <line x1="1050" y1="0" x2="1050" y2="340" stroke="#00d4ff" strokeWidth="0.5" strokeOpacity="0.1"/>
      {/* Pulsing nodes */}
      {[
        { cx: 350, cy: 30, c: "#00d4ff", d: "0s" },
        { cx: 700, cy: 310, c: "#7b2fff", d: "1s" },
        { cx: 1050, cy: 30, c: "#00d4ff", d: "2s" },
        { cx: 350, cy: 310, c: "#7b2fff", d: "1.5s" },
        { cx: 1050, cy: 310, c: "#7b2fff", d: "0.5s" },
      ].map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r="3" fill={n.c}>
          <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.5s" begin={n.d} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function ZendxbBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const leftRef   = useRef<HTMLDivElement>(null);
  const midRef    = useRef<HTMLDivElement>(null);
  const rightRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: bannerRef.current, start: "top 78%" } });

      gsap.fromTo(midRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.15,
          scrollTrigger: { trigger: bannerRef.current, start: "top 78%" } });

      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.3,
          scrollTrigger: { trigger: bannerRef.current, start: "top 78%" } });

      gsap.fromTo(".zb-svc-card",
        { opacity: 0, scale: 0.75, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "back.out(1.5)",
          scrollTrigger: { trigger: bannerRef.current, start: "top 72%" }, delay: 0.25 });
    }, bannerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={bannerRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #080f1e 0%, #0d1b2a 35%, #0f1e38 65%, #0a1525 100%)",
        borderTop: "1px solid rgba(0,212,255,0.12)",
        borderBottom: "1px solid rgba(0,212,255,0.12)",
      }}
      aria-label="ZendXB TechHub — Digital Solutions Banner"
    >
      <CircuitBg />

      {/* Ambient glow blobs */}
      <div aria-hidden="true" className="absolute pointer-events-none"
        style={{ top: "50%", left: "22%", transform: "translate(-50%,-50%)", width: 420, height: 420,
          background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 65%)",
          animation: "zb-blob 7s ease-in-out infinite" }}/>
      <div aria-hidden="true" className="absolute pointer-events-none"
        style={{ top: "50%", right: "10%", transform: "translateY(-50%)", width: 340, height: 340,
          background: "radial-gradient(circle, rgba(123,47,255,0.07) 0%, transparent 65%)",
          animation: "zb-blob 9s ease-in-out infinite 3s" }}/>

      <div className="container relative z-10 py-8 md:py-12">
        {/* 3-column layout: logo | content | stats */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-0">

          {/* ── COL 1: Logo block ─────────────────────────────────────── */}
          <div ref={leftRef} className="flex flex-col items-center justify-center gap-3 lg:pr-8 lg:border-r"
            style={{ opacity: 0, minWidth: 200, borderColor: "rgba(0,212,255,0.12)" }}>
            <BannerLogo />
            <div className="text-center">
              <p className="font-bold text-xl tracking-[0.22em]"
                style={{ fontFamily: "var(--font-heading)", background: "linear-gradient(135deg,#00d4ff,#7b2fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                ZENDXB
              </p>
              <p className="text-[11px] tracking-[0.35em] mt-0.5" style={{ color: "rgba(232,244,255,0.45)" }}>
                TECHHUB
              </p>
              <div className="flex items-center justify-center gap-1 mt-3 flex-wrap">
                {["INNOVATE", "DESIGN", "DEVELOP", "GROW"].map((w, i, arr) => (
                  <span key={w} className="flex items-center gap-1">
                    <span className="text-[8px] tracking-widest" style={{ color: "rgba(0,212,255,0.65)" }}>{w}</span>
                    {i < arr.length - 1 && <span style={{ color: "rgba(123,47,255,0.5)", fontSize: 7 }}>•</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── COL 2: Headline + service grid ───────────────────────── */}
          <div ref={midRef} className="flex flex-col gap-5 flex-1 lg:px-8 lg:border-r"
            style={{ opacity: 0, borderColor: "rgba(0,212,255,0.12)" }}>

            {/* Headline */}
            <div>
              <h2 className="font-bold leading-none"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem,3vw,2.2rem)",
                  background: "linear-gradient(135deg,#00d4ff 0%,#e8f4ff 45%,#7b2fff 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                DIGITAL SOLUTIONS
              </h2>
              <h3 className="font-semibold mt-1 leading-none"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.1rem,2.2vw,1.6rem)", color: "rgba(232,244,255,0.88)" }}>
                THAT DRIVE SUCCESS
              </h3>
              <p className="text-[10px] tracking-[0.2em] mt-2" style={{ color: "rgba(0,212,255,0.55)" }}>
                CREATIVE &nbsp;•&nbsp; STRATEGIC &nbsp;•&nbsp; RESULTS-DRIVEN
              </p>
            </div>

            {/* Service cards — 4 top row, 3 bottom row */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-4 gap-2">
                {SERVICES.slice(0, 4).map((s) => <ServiceCard key={s.label} s={s} />)}
              </div>
              <div className="grid grid-cols-3 gap-2" style={{ maxWidth: "75%" }}>
                {SERVICES.slice(4).map((s) => <ServiceCard key={s.label} s={s} />)}
              </div>
            </div>
          </div>

          {/* ── COL 3: Stats + CTA ───────────────────────────────────── */}
          <div ref={rightRef} className="flex flex-col justify-between gap-4 lg:pl-8"
            style={{ opacity: 0, minWidth: 200 }}>

            {/* Stats list */}
            <div className="flex flex-col gap-0 rounded-lg overflow-hidden"
              style={{ border: "1px solid rgba(0,212,255,0.15)", background: "rgba(0,212,255,0.03)" }}>
              {STATS.map((s, i) => (
                <div key={s.label}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < STATS.length - 1 ? "1px solid rgba(0,212,255,0.08)" : "none" }}>
                  <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: i % 2 === 0 ? "rgba(0,212,255,0.12)" : "rgba(123,47,255,0.12)" }}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none"
                      style={{ background: "linear-gradient(135deg,#00d4ff,#7b2fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {s.value}
                    </p>
                    <p className="text-[9px] tracking-widest mt-0.5" style={{ color: "rgba(232,244,255,0.4)" }}>
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link href="/contact"
              className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-md font-bold tracking-widest text-sm group transition-all duration-300"
              style={{ fontFamily: "var(--font-heading)", background: "linear-gradient(135deg,rgba(0,212,255,0.12),rgba(123,47,255,0.12))", border: "1px solid rgba(0,212,255,0.35)", color: "#00d4ff" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "linear-gradient(135deg,rgba(0,212,255,0.22),rgba(123,47,255,0.22))";
                el.style.boxShadow = "0 0 28px rgba(0,212,255,0.22), inset 0 0 20px rgba(0,212,255,0.05)";
                el.style.borderColor = "rgba(0,212,255,0.6)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "linear-gradient(135deg,rgba(0,212,255,0.12),rgba(123,47,255,0.12))";
                el.style.boxShadow = "none";
                el.style.borderColor = "rgba(0,212,255,0.35)";
              }}
            >
              HIRE US TODAY
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes zb-blob {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50% { transform: translate(-50%,-50%) scale(1.25); }
        }
      `}</style>
    </section>
  );
}

/* ── Service card sub-component ─────────────────────────────────────────── */
function ServiceCard({ s }: { s: { label: string; icon: React.ReactNode } }) {
  return (
    <div
      className="zb-svc-card flex flex-col items-center justify-center gap-2 py-3 px-2 rounded text-center select-none transition-all duration-300 cursor-default"
      style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.13)", opacity: 0 }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "rgba(0,212,255,0.09)";
        el.style.borderColor = "rgba(0,212,255,0.38)";
        el.style.boxShadow = "0 0 18px rgba(0,212,255,0.12)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "rgba(0,212,255,0.04)";
        el.style.borderColor = "rgba(0,212,255,0.13)";
        el.style.boxShadow = "none";
        el.style.transform = "translateY(0)";
      }}
    >
      <span style={{ color: "#00d4ff", filter: "drop-shadow(0 0 5px rgba(0,212,255,0.5))" }}>
        {s.icon}
      </span>
      <span className="text-[9px] font-medium tracking-wide leading-tight whitespace-pre-line"
        style={{ color: "rgba(232,244,255,0.72)" }}>
        {s.label}
      </span>
    </div>
  );
}
