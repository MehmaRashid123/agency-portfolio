import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import { getSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    return {
      title: { default: settings.seo?.siteTitle || "ZENDXB TechHub — Creative Agency", template: "%s | " + (settings.siteName || "ZENDXB TechHub") },
      description: settings.seo?.metaDescription || "ZENDXB TechHub is a premium creative agency.",
      openGraph: { type: "website", siteName: settings.siteName || "ZENDXB TechHub", ...(settings.seo?.ogImage ? { images: [settings.seo.ogImage] } : {}) },
      twitter: { ...(settings.seo?.twitterHandle ? { creator: settings.seo.twitterHandle } : {}) },
    };
  } catch {
    return {
      title: { default: "ZENDXB TechHub — Creative Agency", template: "%s | ZENDXB TechHub" },
      description: "ZENDXB TechHub is a premium creative agency specializing in graphic design, web development, and 3D art.",
    };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings = undefined;
  try { settings = await getSettings(); } catch {}

  return (
    <html lang="en">
      <body>
        <Cursor />
        <SmoothScroll>
          <Navbar settings={settings} />
          <PageTransition>
            <main id="main-content">{children}</main>
          </PageTransition>
          <Footer settings={settings} />
        </SmoothScroll>
      </body>
    </html>
  );
}
