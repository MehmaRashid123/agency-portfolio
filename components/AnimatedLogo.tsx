"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface AnimatedLogoProps {
  size?: number;
  showText?: boolean;
  href?: string;
  className?: string;
}

export default function AnimatedLogo({
  size = 44,
  showText = true,
  href = "/",
  className = "",
}: AnimatedLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Animate circuit dots along paths
    const dots = svg.querySelectorAll<SVGCircleElement>(".circuit-dot");
    dots.forEach((dot, i) => {
      const delay = i * 0.4;
      dot.style.animation = `circuitPulse 2.4s ease-in-out ${delay}s infinite`;
    });

    // Animate the outer ring rotation
    const ring = svg.querySelector<SVGCircleElement>(".outer-ring");
    if (ring) ring.style.animation = "ringRotate 8s linear infinite";

    // Animate glow pulse
    const glow = svg.querySelector<SVGEllipseElement>(".center-glow");
    if (glow) glow.style.animation = "glowPulse 3s ease-in-out infinite";
  }, []);

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ZendXB TechHub logo"
        role="img"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="cyanPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#7b2fff" />
          </linearGradient>
          <linearGradient id="cyanPurple2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7b2fff" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="#0d1b2a" stroke="url(#cyanPurple)" strokeWidth="1.5" opacity="0.6" />

        {/* Outer rotating ring (dashed) */}
        <circle
          className="outer-ring"
          cx="50" cy="50" r="44"
          stroke="url(#cyanPurple)"
          strokeWidth="0.8"
          strokeDasharray="6 4"
          fill="none"
          opacity="0.5"
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* Center glow */}
        <ellipse
          className="center-glow"
          cx="50" cy="50" rx="22" ry="22"
          fill="url(#cyanPurple)"
          opacity="0.08"
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* Z letter — main shape */}
        <g filter="url(#glow)">
          {/* Top bar of Z */}
          <line x1="28" y1="30" x2="72" y2="30" stroke="url(#cyanPurple)" strokeWidth="5" strokeLinecap="round" />
          {/* Diagonal of Z */}
          <line x1="72" y1="30" x2="28" y2="70" stroke="url(#cyanPurple2)" strokeWidth="5" strokeLinecap="round" />
          {/* Bottom bar of Z */}
          <line x1="28" y1="70" x2="72" y2="70" stroke="url(#cyanPurple)" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Circuit dots on Z path */}
        <circle className="circuit-dot" cx="28" cy="30" r="3" fill="#00d4ff" filter="url(#glow)" />
        <circle className="circuit-dot" cx="50" cy="30" r="2" fill="#7b2fff" filter="url(#glow)" />
        <circle className="circuit-dot" cx="72" cy="30" r="3" fill="#00d4ff" filter="url(#glow)" />
        <circle className="circuit-dot" cx="50" cy="50" r="2.5" fill="#00d4ff" filter="url(#glow)" />
        <circle className="circuit-dot" cx="28" cy="70" r="3" fill="#7b2fff" filter="url(#glow)" />
        <circle className="circuit-dot" cx="50" cy="70" r="2" fill="#00d4ff" filter="url(#glow)" />
        <circle className="circuit-dot" cx="72" cy="70" r="3" fill="#7b2fff" filter="url(#glow)" />

        {/* Small circuit lines extending from corners */}
        <line x1="28" y1="30" x2="20" y2="22" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
        <line x1="72" y1="30" x2="80" y2="22" stroke="#7b2fff" strokeWidth="1" opacity="0.5" />
        <line x1="28" y1="70" x2="20" y2="78" stroke="#7b2fff" strokeWidth="1" opacity="0.5" />
        <line x1="72" y1="70" x2="80" y2="78" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />

        {/* Corner circuit nodes */}
        <circle cx="20" cy="22" r="2" fill="#00d4ff" opacity="0.6" />
        <circle cx="80" cy="22" r="2" fill="#7b2fff" opacity="0.6" />
        <circle cx="20" cy="78" r="2" fill="#7b2fff" opacity="0.6" />
        <circle cx="80" cy="78" r="2" fill="#00d4ff" opacity="0.6" />
      </svg>

      {showText && (
        <span
          className="font-semibold tracking-tight leading-none"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: size * 0.45,
            background: "linear-gradient(135deg, #00d4ff, #7b2fff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ZENDXB
        </span>
      )}

      <style jsx global>{`
        @keyframes circuitPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.06; rx: 22; ry: 22; }
          50% { opacity: 0.18; rx: 28; ry: 28; }
        }
      `}</style>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="ZendXB TechHub — Home">
        {content}
      </Link>
    );
  }

  return content;
}
