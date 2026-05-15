"use client";

/**
 * AboutTeaser — Two-column layout.
 * Left: 3D scene (only 3D on this page, intentional).
 * Right: Text reveals line by line with clip-path.
 * Scroll parallax on the image — subtle depth.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Settings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const Scene3DAccent = dynamic(() => import("./Scene3DAccent"), { ssr: false });

export default function AboutTeaser({ settings }: { settings?: Settings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef   = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);

  const heading  = settings?.aboutTeaser?.heading  || "We Are ZENDXB TechHub";
  const body     = settings?.aboutTeaser?.body     || "A small, obsessive team of designers, developers, and 3D artists. We work with brands that want to stand out — not blend in.";
  const ctaLabel = settings?.aboutTeaser?.ctaLabel || "Meet the Team";
  const ctaLink  = settings?.aboutTeaser?.ctaLink  || "/about";
  const image    = settings?.aboutTeaser?.image;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scene — fade + subtle scale
      gsap.fromTo(sceneRef.current,
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1, scale: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: sceneRef.current, start: "top 80%", once: true },
        }
      );

      // Scroll parallax on scene
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          gsap.set(sceneRef.current, { y: (self.progress - 0.5) * -50 });
        },
      });

      // Text — each line clips up, staggered
      const lines = textRef.current?.querySelectorAll<HTMLElement>(".about-reveal");
      if (lines) {
        gsap.fromTo(lines,
          { clipPath: "inset(100% 0 0 0)", y: 24 },
          {
            clipPath: "inset(0% 0 0 0)", y: 0,
            duration: 0.9, stagger: 0.14, ease: "power3.out",
            scrollTrigger: { trigger: textRef.current, start: "top 80%", once: true },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pad border-t border-[var(--border)]"
      aria-label="About the agency"
    >
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">

          {/* Visual */}
          <div
            ref={sceneRef}
            className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-2)] border border-[var(--border)]"
            style={{ opacity: 0 }}
          >
            {image?.url ? (
              <Image
                src={image.url}
                alt={heading}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <Scene3DAccent />
            )}

            {/* Corner marks — minimal, editorial */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <div className="w-6 h-px" style={{ background: "var(--accent)" }} />
              <div className="w-px h-6 mt-0" style={{ background: "var(--accent)" }} />
            </div>
            <div className="absolute bottom-4 right-4 pointer-events-none flex flex-col items-end">
              <div className="w-6 h-px" style={{ background: "var(--accent-2)" }} />
              <div className="w-px h-6" style={{ background: "var(--accent-2)" }} />
            </div>

            <span
              className="absolute bottom-5 left-5 label"
              style={{ color: "rgba(232,244,255,0.25)" }}
            >
              {settings?.siteName || "ZENDXB"}
            </span>
          </div>

          {/* Text */}
          <div ref={textRef} className="flex flex-col gap-8">
            <div className="overflow-hidden">
              <p
                className="about-reveal label"
                style={{ color: "var(--accent)", clipPath: "inset(100% 0 0 0)" }}
              >
                About Us
              </p>
            </div>

            <div className="overflow-hidden">
              <h2
                className="about-reveal heading-lg"
                style={{ clipPath: "inset(100% 0 0 0)" }}
              >
                {heading}
              </h2>
            </div>

            <div className="overflow-hidden">
              <p
                className="about-reveal text-base md:text-lg leading-relaxed"
                style={{ color: "rgba(232,244,255,0.5)", clipPath: "inset(100% 0 0 0)" }}
              >
                {body}
              </p>
            </div>

            <div className="overflow-hidden">
              <div
                className="about-reveal"
                style={{ clipPath: "inset(100% 0 0 0)" }}
              >
                <Link href={ctaLink} className="btn btn-outline self-start">
                  {ctaLabel} →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
