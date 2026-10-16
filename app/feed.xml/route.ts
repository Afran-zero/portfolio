/**
 * /feed.xml — Atom 1.0 feed for LLM crawlers that prefer feed-shaped data
 * (Perplexity, academic aggregators). Per skills/portfolio-sop §9.
 *
 * Static entries for the primary content pages. New project / research
 * pages can be appended here as the site grows.
 */

import type { NextRequest } from "next/server";

import {
  getCaseStudyProjects,
  getResearchProjects,
  getPerson,
} from "@/lib/content";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/seo/person-jsonld";

const FEED_TITLE = "Md Kaif Afran Khan";
const FEED_SUBTITLE =
  "Industry and academic work from Md Kaif Afran Khan: AI engineering, data engineering, and research.";

type Entry = {
  id: string;
  title: string;
  url: string;
  summary: string;
  updated: string;
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildAtom(entries: Entry[]): string {
  const updated = new Date().toISOString();
  const items = entries
    .map(
      (e) => `
  <entry>
    <id>${escapeXml(e.id)}</id>
    <title>${escapeXml(e.title)}</title>
    <link href="${escapeXml(e.url)}" rel="alternate" />
    <updated>${escapeXml(e.updated)}</updated>
    <summary>${escapeXml(e.summary)}</summary>
  </entry>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${escapeXml(SITE_URL)}/</id>
  <title>${escapeXml(FEED_TITLE)}</title>
  <subtitle>${escapeXml(FEED_SUBTITLE)}</subtitle>
  <link href="${escapeXml(SITE_URL)}/feed.xml" rel="self" />
  <link href="${escapeXml(SITE_URL)}/" rel="alternate" />
  <updated>${escapeXml(updated)}</updated>
  <author>
    <name>${escapeXml(FEED_TITLE)}</name>
    <uri>${escapeXml(SITE_URL)}/</uri>
  </author>
  <rights>© ${new Date().getUTCFullYear()} ${escapeXml(FEED_TITLE)}</rights>${items}
</feed>`;
}

export async function GET(_req: NextRequest): Promise<Response> {
  const now = new Date().toISOString();
  const [person, caseStudies, researchProjects] = await Promise.all([
    getPerson(),
    getCaseStudyProjects(),
    getResearchProjects(),
  ]);

  const baseEntries: Entry[] = [
    {
      id: "home",
      title: `${person.name} | ${person.role}`,
      url: `${SITE_URL}/`,
      summary: SITE_DESCRIPTION,
      updated: now,
    },
    {
      id: "industry",
      title: "Industry experience",
      url: `${SITE_URL}/industry`,
      summary:
        "Industry roles, projects, and client work in AI engineering, data, and full-stack development.",
      updated: now,
    },
    {
      id: "academic",
      title: "Academic profile",
      url: `${SITE_URL}/academic`,
      summary:
        "Research in machine learning, quantum computing, and graph learning. Publications, thesis, research projects.",
      updated: now,
    },
    {
      id: "contact",
      title: "Contact",
      url: `${SITE_URL}/contact`,
      summary: "How to reach Md Kaif Afran Khan.",
      updated: now,
    },
  ];

  const projectEntries: Entry[] = caseStudies.map((p) => ({
    id: `industry-project-${p.slug}`,
    title: p.name,
    url: `${SITE_URL}/industry/projects/${p.slug}`,
    summary: p.summary,
    updated: now,
  }));

  const researchEntries: Entry[] = researchProjects.map((p) => ({
    id: `academic-research-${p.slug}`,
    title: p.title,
    url: `${SITE_URL}/academic/research/${p.slug}`,
    summary: p.question,
    updated: now,
  }));

  const entries = [...baseEntries, ...projectEntries, ...researchEntries];
  const xml = buildAtom(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}