/**
 * lib/seo/page-metadata.ts — single source of truth for per-page metadata.
 *
 * Per skills/portfolio-sop §3, §4, §14:
 *   - Title 50–60 chars after template applied.
 *   - Description 140–160 chars, unique per route.
 *   - canonical = absolute URL.
 *   - OG + Twitter filled in (title, description, url, images, type).
 *
 * Every page calls buildPageMetadata() in its generateMetadata export.
 */

import type { Metadata } from "next";

import { SITE_NAME, SITE_URL } from "@/lib/seo/person-jsonld";

export type BuildPageMetadataInput = {
  /** The page-level title prefix — root layout adds " — Md Kaif Afran Khan". */
  title: string;
  /** Unique, 140–160 char description. */
  description: string;
  /** Absolute path under SITE_URL, e.g. "/industry". No trailing slash. */
  path: string;
  /** OG image paths (absolute, starting with "/"). Defaults to /og/home.png. */
  images?: string[];
  /** OG type. Use "profile" only for /contact. */
  type?: "website" | "article" | "profile";
  /** Article-specific (for detail pages). */
  publishedTime?: string;
  modifiedTime?: string;
};

const DEFAULT_OG_IMAGE = "/og/home.png";

export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const url = `${SITE_URL}${input.path}`;
  const imagePaths = input.images ?? [DEFAULT_OG_IMAGE];
  const imageUrls = imagePaths.map((p) =>
    p.startsWith("http") ? p : `${SITE_URL}${p}`,
  );

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: input.type ?? "website",
      images: imageUrls.map((u) => ({
        url: u,
        width: 1200,
        height: 630,
        alt: input.title,
      })),
      ...(input.publishedTime
        ? { publishedTime: input.publishedTime }
        : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: imageUrls,
    },
    robots: { index: true, follow: true },
  };
}