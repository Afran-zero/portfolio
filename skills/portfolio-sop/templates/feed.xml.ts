/**
 * ADVANCED Atom 1.0 feed template
 *
 * Route handler that emits an Atom feed at /feed.xml. Some LLM crawlers
 * (especially academic aggregators) prefer feed-shaped data. If your
 * portfolio is too static to have items to feed, skip this.
 *
 * Place at: app/feed.xml/route.ts
 *
 * Generated as part of the portfolio-sop skill. See skills/portfolio-sop/SKILL.md §9.
 */

import type { NextRequest } from "next/server";

const BASE = "https://kaif.dev";

const FEED_TITLE = "Md Kaif Afran Khan";
const FEED_SUBTITLE = "Industry and academic work from Md Kaif Afran Khan.";

const STATIC_ENTRIES: Array<{
  id: string;
  title: string;
  url: string;
  summary: string;
  updated: string;
}> = [
  {
    id: "home",
    title: "Md Kaif Afran Khan — AI Engineer & Researcher",
    url: `${BASE}/`,
    summary: "Portfolio home — bio, role, and current focus.",
    updated: new Date().toISOString(),
  },
  {
    id: "industry",
    title: "Industry experience",
    url: `${BASE}/industry`,
    summary: "Industry roles, projects, and shipped work.",
    updated: new Date().toISOString(),
  },
  {
    id: "academic",
    title: "Academic experience",
    url: `${BASE}/academic`,
    summary: "Degrees, research, and publications.",
    updated: new Date().toISOString(),
  },
  {
    id: "contact",
    title: "Contact",
    url: `${BASE}/contact`,
    summary: "How to reach Md Kaif Afran Khan.",
    updated: new Date().toISOString(),
  },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildAtom(entries: typeof STATIC_ENTRIES): string {
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
  <id>${escapeXml(BASE)}/</id>
  <title>${escapeXml(FEED_TITLE)}</title>
  <subtitle>${escapeXml(FEED_SUBTITLE)}</subtitle>
  <link href="${escapeXml(BASE)}/feed.xml" rel="self" />
  <link href="${escapeXml(BASE)}/" rel="alternate" />
  <updated>${escapeXml(updated)}</updated>
  <author>
    <name>${escapeXml(FEED_TITLE)}</name>
    <uri>${escapeXml(BASE)}/</uri>
  </author>
  <rights>© ${new Date().getUTCFullYear()} ${escapeXml(FEED_TITLE)}</rights>${items}
</feed>`;
}

export function GET(_req: NextRequest) {
  const xml = buildAtom(STATIC_ENTRIES);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}