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
  const logoText = settings?.logoText || 'AGENCY';
  const dotColor = settings?.logoDotColor || '#FF4D00';
  return (
    <div
      style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', fontFamily: 'var(--font-body)' }}
    >
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', color: '#fff' }}>
        {logoText}<span style={{ color: dotColor }}>.</span>
      </p>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Link Unavailable
      </h1>
      <p style={{ color: '#666', fontFamily: 'var(--font-body)', marginBottom: '2.5rem', maxWidth: '360px' }}>
        This portfolio is currently unavailable.
      </p>
      <a
        href="/work"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #FF4D00', color: '#FF4D00', padding: '0.75rem 1.75rem', borderRadius: '2px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'background 0.2s' }}
      >
        View Our Work
      </a>
    </div>
  );
}
