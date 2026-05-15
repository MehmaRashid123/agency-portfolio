import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortfolioLink, getSettings } from '@/lib/api';
import PortfolioPageClient from './PortfolioPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const link = await getPortfolioLink(slug);
    if (!link || !('title' in link)) return { title: 'Portfolio' };
    return { title: link.title, description: `View selected projects — ${link.title}` };
  } catch {
    return { title: 'Portfolio' };
  }
}

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const [portfolio, settings] = await Promise.all([
    getPortfolioLink(slug),
    getSettings().catch(() => undefined),
  ]);

  if (portfolio === null) notFound();

  // Inactive — render inline (no redirect, no notFound)
  if (!('title' in portfolio)) {
    return <InactivePage settings={settings} />;
  }

  return <PortfolioPageClient portfolio={portfolio} settings={settings} />;
}

function InactivePage({ settings }: { settings: any }) {
  const siteName = settings?.siteName || 'ZENDXB TechHub';
  return (
    <div style={{
      background: 'var(--bg)', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '2rem',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '2.5rem' }}>
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ia-cg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff"/><stop offset="100%" stopColor="#7b2fff"/>
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="#0a1628" stroke="url(#ia-cg)" strokeWidth="1.5" opacity="0.8"/>
          <line x1="27" y1="29" x2="73" y2="29" stroke="url(#ia-cg)" strokeWidth="5.5" strokeLinecap="round"/>
          <line x1="73" y1="29" x2="27" y2="71" stroke="#7b2fff" strokeWidth="5.5" strokeLinecap="round"/>
          <line x1="27" y1="71" x2="73" y2="71" stroke="url(#ia-cg)" strokeWidth="5.5" strokeLinecap="round"/>
        </svg>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700,
          letterSpacing: '0.18em', marginTop: '0.75rem',
          background: 'linear-gradient(135deg,#00d4ff,#7b2fff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          ZENDXB
        </p>
      </div>

      <h1 style={{ fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 600,
        color: 'var(--fg)', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
        Link Unavailable
      </h1>
      <p style={{ color: 'rgba(232,244,255,0.4)', marginBottom: '2.5rem', maxWidth: '360px', lineHeight: 1.6 }}>
        This portfolio is currently unavailable.
      </p>
      <a href="/work" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        border: '1px solid rgba(0,212,255,0.35)', color: 'var(--accent)',
        padding: '0.75rem 1.75rem', fontSize: '0.82rem', fontWeight: 500,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        textDecoration: 'none', transition: 'background 0.2s, box-shadow 0.2s',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,212,255,0.08)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(0,212,255,0.15)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
        }}
      >
        View Our Work
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  );
}
