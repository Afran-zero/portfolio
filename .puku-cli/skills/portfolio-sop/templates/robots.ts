/**
 * ADVANCED robots.ts template — copy to app/robots.ts
 *
 * Drops in to replace the minimal robots.ts at app/robots.ts. Adds:
 *   - Explicit allow for every major search engine
 *   - Explicit allow for every major AI / answer-engine crawler
 *     (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
 *   - Explicit disallow for SEO scrapers (AhrefsBot, SemrushBot, …)
 *   - Sitemap declaration
 *
 * Generated as part of the portfolio-sop skill. See skills/portfolio-sop/SKILL.md §8.
 */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://kaif.dev";

  return {
    rules: [
      // ─── 1. Search engines — full allow ─────────────────────────────
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/", "/_next/"] },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Bingbot", allow: "/", disallow: ["/api/", "/_next/"] },
      { userAgent: "Slurp", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "Baiduspider", allow: "/" },
      { userAgent: "YandexBot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },

      // ─── 2. AI training / grounding crawlers — full allow ───────────
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "cohere-training-data-crawler", allow: "/" },
      { userAgent: "YouBot", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },

      // ─── 3. Social preview bots — full allow ────────────────────────
      { userAgent: "facebookexternalhit", allow: "/" },
      { userAgent: "Facebot", allow: "/" },
      { userAgent: "Twitterbot", allow: "/" },
      { userAgent: "LinkedInBot", allow: "/" },
      { userAgent: "Slackbot", allow: "/" },
      { userAgent: "Discordbot", allow: "/" },
      { userAgent: "WhatsApp", allow: "/" },
      { userAgent: "TelegramBot", allow: "/" },

      // ─── 4. SEO scrapers — block ────────────────────────────────────
      { userAgent: "AhrefsBot", disallow: "/" },
      { userAgent: "SemrushBot", disallow: "/" },
      { userAgent: "SemrushBot-BA", disallow: "/" },
      { userAgent: "SemrushBot-SI", disallow: "/" },
      { userAgent: "SemrushBot-CT", disallow: "/" },
      { userAgent: "MJ12bot", disallow: "/" },
      { userAgent: "DotBot", disallow: "/" },
      { userAgent: "BLEXBot", disallow: "/" },
      { userAgent: "DataForSeoBot", disallow: "/" },
      { userAgent: "PetalBot", disallow: "/" },

      // ─── 5. Default — everyone else, full allow, block only junk ────
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}