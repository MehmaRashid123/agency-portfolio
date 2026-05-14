'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import type { PortfolioLink, Settings } from '@/lib/api';

interface Props {
  portfolio: PortfolioLink;
  settings?: Settings;
}

export default function PortfolioPageClient({ portfolio, settings }: Props) {
  const logoText = settings?.logoText || 'AGENCY';
  const dotColor = settings?.logoDotColor || '#FF4D00';
  const foundedYear = settings?.about?.foundedYear || '2020';
  const siteName = settings?.siteName || logoText;
  const contactEmail = settings?.contact?.email;
  const whatsapp = settings?.contact?.whatsapp;
  const socials = settings?.footer?.socials;

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(labelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.2 })
      .fromTo(
        headingRef.current?.querySelectorAll('.word') ?? [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
        '-=0.3'
      )
      .fromTo(statsRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2')
      .fromTo(btnsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');

    if (thumbsRef.current) {
      const cards = thumbsRef.current.querySelectorAll('.thumb-card');
      tl.fromTo(
        cards,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' },
        0.5
      );

      // Float animation
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 2.5 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });
      });
    }
  }, []);

  const heroProjects = portfolio.projects.slice(0, 4);
  const words = portfolio.title.split(' ');

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'var(--font-body)' }}>

      {/* ── Simplified Navbar ── */}
      <nav
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 'var(--nav-h)', display: 'flex', alignItems: 'center', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        aria-label="Portfolio navigation"
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
            {logoText}<span style={{ color: dotColor }}>.</span>
          </Link>
          <Link
            href="/work"
            style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            View Full Work →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{ minHeight: '100vh', paddingTop: 'var(--nav-h)', display: 'flex', alignItems: 'center' }}
        aria-label="Portfolio hero"
      >
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '3rem', alignItems: 'center', padding: '4rem 1.5rem' }}>

          {/* Left */}
          <div>
            <p
              ref={labelRef}
              style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF4D00', fontWeight: 600, marginBottom: '1.25rem', opacity: 0 }}
            >
              PORTFOLIO
            </p>
            <h1
              ref={headingRef}
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#fff', marginBottom: '1.5rem' }}
            >
              {words.map((word, i) => (
                <span key={i} className="word" style={{ display: 'inline-block', marginRight: '0.25em', opacity: 0 }}>
                  {word}
                </span>
              ))}
            </h1>
            <div style={{ width: '60px', height: '1px', background: '#222', margin: '1.5rem 0' }} />
            <div ref={statsRef} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', color: '#666', fontSize: '0.8rem', marginBottom: '2.5rem', opacity: 0 }}>
              <span>{portfolio.projects.length} Projects</span>
              <span>·</span>
              <span>Est. {foundedYear}</span>
              <span>·</span>
              <span>{siteName}</span>
            </div>
            <div ref={btnsRef} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0 }}>
              <Link href="/contact" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                Start a Project
              </Link>
              <Link href="/work" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                View All Work
              </Link>
            </div>
          </div>

          {/* Right — staggered thumbnails */}
          <div
            ref={thumbsRef}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: '0.75rem', position: 'relative' }}
            aria-hidden="true"
          >
            {heroProjects.map((project, i) => (
              <div
                key={project._id}
                className="thumb-card"
                style={{
                  gridRow: i === 0 ? 'span 2' : 'span 1',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  background: '#141414',
                  position: 'relative',
                  aspectRatio: i === 0 ? '3/4' : '4/3',
                  opacity: 0,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px #FF4D00';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                {project.thumbnail?.url && (
                  <Image
                    src={project.thumbnail.url}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects Section ── */}
      <section style={{ padding: '80px 0' }} aria-label="Selected projects">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Selected Projects
            </h2>
            <span style={{ background: 'rgba(255,77,0,0.12)', color: '#FF4D00', padding: '0.25rem 0.75rem', borderRadius: '2px', fontSize: '0.75rem', fontWeight: 600 }}>
              {portfolio.projects.length} projects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.projects.map((project) => (
              <Link
                key={project._id}
                href={`/work/${project.slug}`}
                className="project-card block aspect-[4/3]"
                aria-label={`View project: ${project.title}`}
                style={{ animation: 'fadeUp 0.6s var(--ease-out-expo) both' }}
              >
                <div className="relative w-full h-full overflow-hidden bg-[var(--bg-2)]">
                  {project.thumbnail?.url && (
                    <Image
                      src={project.thumbnail.url}
                      alt={project.title}
                      fill
                      className="card-img object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  <div className="card-overlay">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(project as any).tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="label text-[10px] px-2 py-1 border border-[var(--border)]">{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                      {project.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section
        style={{ background: '#111111', borderTop: '2px solid #FF4D00', padding: '80px 0', textAlign: 'center' }}
        aria-label="Contact call to action"
      >
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Like what you see?
          </h2>
          <p style={{ color: '#999', marginBottom: '2.5rem', fontSize: '1rem' }}>
            Let's build something together.
          </p>
          <Link href="/contact" className="btn btn-primary" style={{ fontSize: '0.9rem', marginBottom: '2rem', display: 'inline-flex' }}>
            Start a Project
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                style={{ color: '#555', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FF4D00')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
              >
                {contactEmail}
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#555', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FF4D00')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── Minimal Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem 0', textAlign: 'center' }} aria-label="Portfolio footer">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
            {logoText}<span style={{ color: dotColor }}>.</span>
          </p>
          <p style={{ color: '#333', fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          {socials && (
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { label: 'Instagram', href: socials.instagram },
                { label: 'Behance', href: socials.behance },
                { label: 'LinkedIn', href: socials.linkedin },
                { label: 'Dribbble', href: socials.dribbble },
              ]
                .filter((s) => s.href)
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#444', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FF4D00')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
                  >
                    {s.label}
                  </a>
                ))}
            </div>
          )}
          <Link
            href="/work"
            style={{ color: '#555', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FF4D00')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
          >
            View full portfolio →
          </Link>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .thumb-card { transition: transform 0.3s var(--ease-out-expo), box-shadow 0.3s ease !important; }
        @media (max-width: 768px) {
          .portfolio-hero-grid { grid-template-columns: 1fr !important; }
          .portfolio-hero-grid > div:last-child { display: none; }
        }
      `}</style>
    </div>
  );
}
