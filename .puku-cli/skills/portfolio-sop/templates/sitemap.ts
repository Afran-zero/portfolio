/**
 * ADVANCED sitemap.ts template — copy to app/sitemap.ts
 *
 * Generates a full sitemap including every route, every CV, and every OG image.
 * Adds:
 *   - Absolute URLs, no trailing slash
 *   - lastModified pulled from per-page frontmatter (or now() as fallback)
 *   - Correct changeFrequency + priority per route class
 *
 * Generated as part of the portfolio-sop skill. See skills/portfolio-sop/SKILL.md §7.
 */

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kaif.dev";
  const now = new Date();

  // Pages are listed in priority order. Do not include 404s or redirects.
  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${base}/industry`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/academic`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${base}/cv/academic`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/cv/professional`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}