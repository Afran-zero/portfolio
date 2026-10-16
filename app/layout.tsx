import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { ScrollShapeField } from "@/components/shapes/ScrollShapeField";
import { MouseShapeField } from "@/components/shapes/MouseShapeField";
import { Footer } from "@/components/navigation/Footer";
import { NavShell } from "@/components/navigation/NavShell";
import { getPerson } from "@/lib/content";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo/person-jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const person = await getPerson();
  const homeUrl = `${SITE_URL}/`;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${person.name} | ${person.role}`,
      template: `%s | ${person.name}`,
    },
    description: SITE_DESCRIPTION,
    alternates: {
      canonical: homeUrl,
      types: {
        "application/atom+xml": `${SITE_URL}/feed.xml`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: homeUrl,
      title: `${person.name} | ${person.role}`,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: `${SITE_URL}/og/home.png`,
          width: 1200,
          height: 630,
          alt: `${person.name} | ${person.role}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${person.name} | ${person.role}`,
      description: SITE_DESCRIPTION,
      images: [`${SITE_URL}/og/home.png`],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Atom 1.0 feed — some LLM crawlers prefer feed-shaped data. */}
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Md Kaif Afran Khan"
          href="/feed.xml"
        />
        {/* Theme color for browser chrome. */}
        <meta name="theme-color" content="#ffffff" />
        {/* react-grab fiber inspector — dev only. CDN script so it never
            enters the production bundle. */}
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body>
        <SkipToContent />
        <NavShell />
        <ScrollShapeField>
          <MouseShapeField>
            <main id="main">{children}</main>
          </MouseShapeField>
        </ScrollShapeField>
        <Footer />
      </body>
    </html>
  );
}