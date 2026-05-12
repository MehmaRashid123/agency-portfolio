import HeroSection from "@/components/HeroSection";
import Marquee from "@/components/Marquee";
import FeaturedWork from "@/components/FeaturedWork";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import AboutTeaser from "@/components/AboutTeaser";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";
import { getFeaturedProjects, getSettings, getTestimonials, type Project, type Settings, type Testimonial } from "@/lib/api";

export async function generateMetadata() {
  try {
    const settings = await getSettings();
    return {
      title: settings.seo?.siteTitle || "ZENDXB TechHub — We Build Things That Move",
      description: settings.seo?.metaDescription || "Premium creative agency.",
      ...(settings.seo?.ogImage ? { openGraph: { images: [settings.seo.ogImage] } } : {}),
    };
  } catch {
    return { title: "ZENDXB TechHub — We Build Things That Move" };
  }
}

export default async function HomePage() {
  let projects: Project[] = [];
  let settings: Settings | undefined = undefined;
  let testimonials: Testimonial[] = [];
  try {
    [projects, settings, testimonials] = await Promise.all([
      getFeaturedProjects().catch(() => []),
      getSettings().catch(() => undefined),
      getTestimonials().catch(() => []),
    ]);
  } catch {}

  return (
    <>
      <HeroSection settings={settings} />
      <Marquee settings={settings} />
      <FeaturedWork projects={projects} settings={settings} />
      <ServicesSection settings={settings} />
      <StatsSection settings={settings} />
      <AboutTeaser settings={settings} />
      <Testimonials testimonials={testimonials} settings={settings} />
      <CTABanner settings={settings} />
    </>
  );
}
