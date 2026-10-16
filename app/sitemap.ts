/**
 * app/sitemap.ts — XML sitemap for the portfolio.
 *
 * Per skills/portfolio-sop §7. Drives every public route from content getters
 * so adding a project / research project / publication automatically extends
 * the sitemap.
 *
 * Priorities (SOP §7):
 *   1.0  home
 *   0.8  primary content pages
 *   0.7  featured projects / research projects
 *   0.6  case studies, research detail, CVs
 *   0.5  utility pages (contact)
 */

import type { MetadataRoute } from "next";

import {
  getCaseStudyProjects,
  getResearchProjects,
} from "@/lib/content";
import { SITE_URL } from "@/lib/seo/person-jsonld";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;
  const now = new Date();

  const [caseStudies, researchProjects] = await Promise.all([
    getCaseStudyProjects(),
    getResearchProjects(),
  ]);

  return [
    // ─── Home ─────────────────────────────────────────────────────
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },

    // ─── Primary content pages ───────────────────────────────────
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

    // ─── Case studies ────────────────────────────────────────────
    ...caseStudies.map(
      (p): MetadataRoute.Sitemap[number] => ({
        url: `${base}/industry/projects/${p.slug}`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: p.featured ? 0.7 : 0.6,
      }),
    ),

    // ─── Research detail pages ───────────────────────────────────
    ...researchProjects.map(
      (p): MetadataRoute.Sitemap[number] => ({
        url: `${base}/academic/research/${p.slug}`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.6,
      }),
    ),

    // ─── CV routes (PDF redirects) ───────────────────────────────
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

    // ─── Utility ───────────────────────────────────────────────────
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}