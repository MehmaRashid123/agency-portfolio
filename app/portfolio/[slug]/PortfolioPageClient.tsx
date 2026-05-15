'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PortfolioLink, Settings } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  portfolio: PortfolioLink;
  settings?: Settings;
}

/* ── Inline animated logo ───────────────────────────────────────────────── */
function PortfolioLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-label="ZendXB logo">
      <defs>
        <linearGradient id="pl-cg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff"/>
          <stop offset="100%" stopColor="#7b2fff"/>
        </linearGradient>
        <linearGradient id="pl-cg2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7b2fff"/>
          <stop offset="100%" stopColor="#00d4ff"/>
        </linearGradient>
        <filter id="pl-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="47" fill="#0a1628" stroke="url(#pl-cg)" strokeWidth="1.5" opacity="0.8"/>
      <circle cx="50" cy="50" r="42" stroke="url(#pl-cg)" strokeWidth="0.8"
        strokeDasharray="5 4" fill="none" opacity="0.45"
        style={{ transformOrigin: '50px 50px', animation: 'pl-spin 10s linear infinite' }}/>
      <g filter="url(#pl-glow)">
        <line x1="27" y1="29" x2="73" y2="29" stroke="url(#pl-cg)"  strokeWidth="5.5" strokeLinecap="round"/>
        <line x1="73" y1="29" x2="27" y2="71" stroke="url(#pl-cg2)" strokeWidth="5.5" strokeLinecap="round"/>
        <line x1="27" y1="71" x2="73" y2="71" stroke="url(#pl-cg)"  strokeWidth="5.5" strokeLinecap="round"/>
      </g>
      {[
        { cx: 27, cy: 29, d: '0s'   },
        { cx: 73, cy: 29, d: '0.6s' },
        { cx: 50, cy: 50, d: '0.9s' },
        { cx: 27, cy: 71, d: '1.2s' },
        { cx: 73, cy: 71, d: '1.8s' },
      ].map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r="2.8"
          fill={i % 2 === 0 ? '#00d4ff' : '#7b2fff'} filter="url(#pl-glow)"
          style={{ animation: `pl-dot 2.4s ease-in-out ${dot.d} infinite` }}/>
      ))}
      <style>{`
        @keyframes pl-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pl-dot  { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.6)} }
      `}</style>
    </svg>
  );
}

export default function PortfolioPageClient({ portfolio, settings }: Props) {
  const siteName    = settings?.siteName    || 'ZENDXB TechHub';
  const foundedYear = settings?.about?.foundedYear || '2021';
  const contactEmail = settings?.contact?.email;
  const whatsapp     = settings?.contact?.whatsapp;
  const socials      = settings?.footer?.socials;

  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);
  const btnsRef     = useRef<HTMLDivElement>(null);
  const thumbsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    // Split heading into words
    const words = heading.innerText.split(' ');
    heading.innerHTML = words
      .map(w => `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.22em"><span class="hw" style="display:inline-block">${w}</span></span>`)
      .join('');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
      .fromTo(eyebrowRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2 })
      .fromTo('.hw', { y: '105%' }, { y: '0%', duration: 0.9, stagger: 0.07 }, '-=0.4')
      .fromTo(metaRef.current,  { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
      .fromTo(btnsRef.current,  { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');

    // Thumbnails stagger
    if (thumbsRef.current) {
      const cards = thumbsRef.current.querySelectorAll<HTMLElement>('.thumb-card');
      tl.fromTo(cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.5
      );
      // Gentle float
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -8 : 8,
          duration: 2.8 + i * 0.3,
          repeat: -1, yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.25,
        });
      });
    }

    // Scroll-triggered project cards
    gsap.utils.toArray<HTMLElement>('.portfolio-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)',
          duration: 0.85, delay: i * 0.05, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true } }
      );
    });

    return () => { tl.kill(); ScrollTrigger.getAll().forEach(st => st.kill()); };
  }, []);

  const heroProjects = portfolio.projects.slice(0, 4);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--fg)', fontFamily: 'var(--font-body)' }}>

      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: 'var(--nav-h)', display: 'flex', alignItems: 'center',
          background: 'rgba(13,27,42,0.92)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,212,255,0.1)',
        }}
        aria-label="Portfolio navigation"
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <PortfolioLogo size={32} />
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700,
                letterSpacing: '0.15em', lineHeight: 1,
                background: 'linear-gradient(135deg,#00d4ff,#7b2fff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                ZENDXB
              </p>
              <p style={{ fontSize: '0.55rem', letterSpacing: '0.25em', color: 'rgba(232,244,255,0.3)', marginTop: 1 }}>
                TECHHUB
              </p>
            </div>
          </Link>
          <Link
            href="/work"
            style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(232,244,255,0.4)', textDecoration: 'none', transition: 'color 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,244,255,0.4)')}
          >
            View Full Work
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{ minHeight: '100vh', paddingTop: 'var(--nav-h)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}
        aria-label="Portfolio hero"
      >
        {/* Ambient glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(0,212,255,0.05) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 50% 50% at 75% 50%, rgba(123,47,255,0.05) 0%, transparent 65%)' }} />

        <div className="container" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '4rem', alignItems: 'center',
          padding: '5rem clamp(1.5rem,5vw,5rem)',
        }}>
          {/* Left — text */}
          <div>
            <p ref={eyebrowRef} style={{
              fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--accent)', fontWeight: 600, marginBottom: '1.5rem', opacity: 0,
              display: 'flex', alignItems: 'center', gap: '0.6rem',
            }}>
              <span style={{ display: 'inline-block', width: 20, height: 1, background: 'var(--accent)' }} />
              PORTFOLIO
            </p>

            <h1 ref={headingRef} style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)',
              fontWeight: 600, lineHeight: 0.97,
              letterSpacing: '-0.03em',
              color: 'var(--fg)',
              marginBottom: '2rem',
            }}>
              {portfolio.title}
            </h1>

            {/* Divider */}
            <div style={{ width: 48, height: 1, marginBottom: '1.75rem',
              background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }} />

            <div ref={metaRef} style={{
              display: 'flex', gap: '0.4rem', flexWrap: 'wrap',
              fontSize: '0.78rem', marginBottom: '2.5rem', opacity: 0,
              color: 'rgba(232,244,255,0.35)',
            }}>
              <span>{portfolio.projects.length} Projects</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>Est. {foundedYear}</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>{siteName}</span>
            </div>

            <div ref={btnsRef} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0 }}>
              <Link href="/work" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'rgba(232,244,255,0.45)',
                textDecoration: 'none', transition: 'color 0.2s, gap 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.gap = '0.7rem'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(232,244,255,0.45)'; e.currentTarget.style.gap = '0.4rem'; }}
              >
                View All Work
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right — staggered thumbnails */}
          <div ref={thumbsRef} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'auto auto', gap: '0.75rem',
          }} aria-hidden="true">
            {heroProjects.map((project, i) => (
              <div key={project._id} className="thumb-card" style={{
                gridRow: i === 0 ? 'span 2' : 'span 1',
                borderRadius: 4, overflow: 'hidden',
                background: 'var(--bg-2)',
                position: 'relative',
                aspectRatio: i === 0 ? '3/4' : '4/3',
                opacity: 0,
                border: '1px solid var(--border)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.4)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(0,212,255,0.12)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {project.thumbnail?.url && (
                  <Image src={project.thumbnail.url} alt={project.title}
                    fill className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects Grid ── */}
      <section style={{ padding: 'clamp(5rem,10vw,9rem) 0', borderTop: '1px solid var(--border)' }}
        aria-label="Selected projects">
        <div className="container">
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--accent)', marginBottom: '0.75rem' }}>
                Selected Work
              </p>
              <h2 style={{ fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1 }}>
                Projects
              </h2>
            </div>
            <span style={{
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
              padding: '0.35rem 0.85rem',
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: 'var(--accent)',
            }}>
              {portfolio.projects.length} PROJECTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.projects.map((project) => (
              <Link
                key={project._id}
                href={`/work/${project.slug}`}
                className="portfolio-card project-card block aspect-[4/3]"
                aria-label={`View project: ${project.title}`}
                style={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
              >
                <div className="relative w-full h-full overflow-hidden bg-[var(--bg-2)]">
                  {project.thumbnail?.url && (
                    <Image src={project.thumbnail.url} alt={project.title}
                      fill className="card-img object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  )}
                  <div className="card-overlay">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
                      {(project as any).tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} style={{
                          fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.12em',
                          textTransform: 'uppercase', padding: '0.25rem 0.5rem',
                          border: '1px solid rgba(232,244,255,0.2)',
                          color: 'rgba(232,244,255,0.6)',
                        }}>{tag}</span>
                      ))}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600 }}>
                      {project.title}
                    </h3>
                    <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: 'var(--accent)' }}>
                      View Project
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        borderTop: '1px solid var(--border)',
        padding: 'clamp(5rem,10vw,9rem) 0',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }} aria-label="Contact call to action">
        {/* Glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(0,212,255,0.05) 0%, rgba(123,47,255,0.03) 40%, transparent 70%)' }} />

        <div className="container" style={{ maxWidth: 560, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--accent)', marginBottom: '1.25rem' }}>
            Let's Connect
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1,
            marginBottom: '1.25rem' }}>
            Like what you see?
          </h2>
          <p style={{ color: 'rgba(232,244,255,0.4)', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
            Let's build something together.
          </p>

          <Link href="/work" className="btn btn-outline"
            style={{ fontSize: '0.85rem', display: 'inline-flex', marginBottom: '2rem' }}>
            View All Work
          </Link>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} style={{
                color: 'rgba(232,244,255,0.3)', fontSize: '0.82rem',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,244,255,0.3)')}
              >{contactEmail}</a>
            )}
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(232,244,255,0.3)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,244,255,0.3)')}
              >WhatsApp</a>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0' }} aria-label="Portfolio footer">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PortfolioLogo size={28} />
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 700,
                letterSpacing: '0.15em',
                background: 'linear-gradient(135deg,#00d4ff,#7b2fff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                ZENDXB
              </p>
            </div>
          </div>

          {socials && (
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { label: 'Instagram', href: socials.instagram },
                { label: 'Behance',   href: socials.behance   },
                { label: 'LinkedIn',  href: socials.linkedin  },
                { label: 'Dribbble',  href: socials.dribbble  },
              ].filter(s => s.href).map(s => (
                <a key={s.label} href={s.href!} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'rgba(232,244,255,0.25)', fontSize: '0.75rem',
                    textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,244,255,0.25)')}
                >{s.label}</a>
              ))}
            </div>
          )}

          <p style={{ color: 'rgba(232,244,255,0.15)', fontSize: '0.72rem' }}>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @media (max-width: 768px) {
          .portfolio-hero-grid { grid-template-columns: 1fr !important; }
          .portfolio-hero-grid > div:last-child { display: none; }
        }
      `}</style>
    </div>
  );
}
