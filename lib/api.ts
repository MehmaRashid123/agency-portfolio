const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

export interface Project {
  _id: string; title: string; slug: string;
  category: 'graphic' | 'web' | '3d'; status: 'draft' | 'published';
  shortDescription: string; fullDescription: string; tags: string[];
  client: string; year: string; tools: string[];
  thumbnail: { url: string; publicId: string };
  images: { url: string; publicId: string; order: number }[];
  videoUrl?: string; featured: boolean; createdAt: string;
}
export interface Service {
  _id: string; name: string; slug: 'graphic' | 'web' | '3d';
  description: string; features: string[]; startingPrice: string; ctaLabel: string;
}
export interface TeamMember {
  _id: string; name: string; role: string; bio: string;
  photo: { url: string; publicId: string };
  socials: { linkedin?: string; behance?: string; instagram?: string };
  displayOrder: number;
}
export interface Testimonial {
  _id: string; clientName: string; company: string; quote: string; rating: number;
  avatar?: { url: string; publicId: string };
}
export interface BlogPost {
  _id: string; title: string; slug: string;
  coverImage: { url: string; publicId: string };
  category: string; content: string; readTime: number;
  status: 'draft' | 'published'; createdAt: string;
}
export interface Settings {
  siteName?: string; logoText?: string; logoDotColor?: string; faviconUrl?: string;
  navbar?: { links: { label: string; href: string; order: number }[]; ctaLabel: string; ctaLink: string };
  hero?: { headline: string; headlineLine2?: string; subheadline: string; cta1Label: string; cta1Link: string; cta2Label: string; cta2Link: string; showreelUrl: string; scrollText?: string };
  marquee?: { items: string[]; speed: number };
  featuredWork?: { heading: string; subheading?: string; ctaLabel: string; ctaLink: string };
  servicesSection?: { heading: string; subheading?: string };
  stats?: { value: string; label: string }[];
  aboutTeaser?: { heading: string; body: string; ctaLabel: string; ctaLink: string; image?: { url: string; publicId: string } };
  testimonialsSection?: { heading: string; subheading?: string };
  ctaBanner?: { heading: string; subheading?: string; buttonLabel: string; buttonLink: string };
  footer?: { tagline: string; links: { label: string; href: string }[]; socials: { instagram?: string; behance?: string; linkedin?: string; dribbble?: string; twitter?: string }; copyrightText: string };
  workPage?: { heading: string; subheading?: string; filterLabels: { all: string; graphic: string; web: string; threeD: string } };
  servicesPage?: { heading: string; subheading?: string; faqHeading?: string; faqs: { question: string; answer: string }[] };
  about?: { heroHeading?: string; heroSubheading?: string; story?: string; mission?: string; foundedYear?: string; heroImage?: { url: string; publicId: string }; values?: { title: string; description: string }[]; toolsLabel?: string; tools?: string[] };
  contact?: { heading?: string; subheading?: string; email?: string; whatsapp?: string; location?: string; instagram?: string; behance?: string; linkedin?: string; formSuccessMessage?: string; serviceOptions?: string[]; budgetOptions?: string[] };
  blogPage?: { heading?: string; subheading?: string };
  seo?: { siteTitle?: string; metaDescription?: string; ogImage?: string; twitterHandle?: string };
}

async function apiFetch<T>(path: string, revalidate: number): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || `Failed to fetch ${path}`);
  return json.data as T;
}

export async function getProjects(category?: 'graphic' | 'web' | '3d'): Promise<Project[]> {
  const p = new URLSearchParams({ status: 'published' });
  if (category) p.set('category', category);
  return apiFetch<Project[]>(`/api/projects?${p}`, 60);
}
export async function getProject(slug: string): Promise<Project | null> {
  try {
    const projects = await apiFetch<Project[]>(`/api/projects?status=published`, 60);
    return projects.find(p => p.slug === slug) ?? null;
  } catch { return null; }
}
export async function getFeaturedProjects(): Promise<Project[]> {
  return apiFetch<Project[]>(`/api/projects?status=published&featured=true`, 60);
}
export async function getServices(): Promise<Service[]> {
  return apiFetch<Service[]>(`/api/services`, 3600);
}
export async function getTeam(): Promise<TeamMember[]> {
  return apiFetch<TeamMember[]>(`/api/team`, 3600);
}
export async function getTestimonials(): Promise<Testimonial[]> {
  return apiFetch<Testimonial[]>(`/api/testimonials?status=published`, 3600);
}
export async function getBlogPosts(): Promise<BlogPost[]> {
  return apiFetch<BlogPost[]>(`/api/blog?status=published`, 60);
}
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await apiFetch<BlogPost[]>(`/api/blog?status=published`, 60);
    return posts.find(p => p.slug === slug) ?? null;
  } catch { return null; }
}
export async function getSettings(): Promise<Settings> {
  return apiFetch<Settings>(`/api/settings`, 3600);
}
