"use client";

/**
 * SectionReveal — Wraps any section with production-grade scroll-triggered
 * reveal animations using GSAP ScrollTrigger.
 *
 * Variants:
 *  - "fade-up"    : opacity + translateY (default)
 *  - "fade-left"  : opacity + translateX from left
 *  - "fade-right" : opacity + translateX from right
 *  - "scale"      : opacity + scale from 0.92
 *  - "clip"       : clip-path reveal from bottom
 */

import { useEffect, useRef, ReactNode, CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Variant = "fade-up" | "fade-left" | "fade-right" | "scale" | "clip";

interface Props {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  start?: string;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
  stagger?: boolean;
  staggerSelector?: string;
  staggerAmount?: number;
  as?: keyof JSX.IntrinsicElements;
}

export default function SectionReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.9,
  start = "top 82%",
  className = "",
  style,
  once = true,
  stagger = false,
  staggerSelector = "> *",
  staggerAmount = 0.1,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ease = "power3.out";

    const getFrom = (): gsap.TweenVars => {
      switch (variant) {
        case "fade-up":    return { opacity: 0, y: 50 };
        case "fade-left":  return { opacity: 0, x: -60 };
        case "fade-right": return { opacity: 0, x: 60 };
        case "scale":      return { opacity: 0, scale: 0.92, y: 20 };
        case "clip":       return { clipPath: "inset(100% 0 0 0)", opacity: 0 };
        default:           return { opacity: 0, y: 50 };
      }
    };

    const getTo = (): gsap.TweenVars => {
      switch (variant) {
        case "fade-up":    return { opacity: 1, y: 0 };
        case "fade-left":  return { opacity: 1, x: 0 };
        case "fade-right": return { opacity: 1, x: 0 };
        case "scale":      return { opacity: 1, scale: 1, y: 0 };
        case "clip":       return { clipPath: "inset(0% 0 0 0)", opacity: 1 };
        default:           return { opacity: 1, y: 0 };
      }
    };

    const ctx = gsap.context(() => {
      if (stagger) {
        const targets = el.querySelectorAll(staggerSelector);
        gsap.fromTo(targets, getFrom(), {
          ...getTo(),
          duration,
          delay,
          ease,
          stagger: staggerAmount,
          scrollTrigger: { trigger: el, start, once },
        });
      } else {
        gsap.fromTo(el, getFrom(), {
          ...getTo(),
          duration,
          delay,
          ease,
          scrollTrigger: { trigger: el, start, once },
        });
      }
    });

    return () => ctx.revert();
  }, [variant, delay, duration, start, once, stagger, staggerSelector, staggerAmount]);

  // Set initial hidden state to avoid flash
  const initialStyle: CSSProperties = {
    ...style,
    ...(variant === "clip"
      ? { clipPath: "inset(100% 0 0 0)", opacity: 0 }
      : { opacity: 0 }),
  };

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={initialStyle}>
      {children}
    </Tag>
  );
}
