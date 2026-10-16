/**
 * app/robots.ts — Advanced robots directives.
 *
 * Per skills/portfolio-sop §6 + §8. The site is small and static, so we
 * allow every legitimate crawler (Googlebot, Bing, Applebot, plus every
 * AI/answer-engine crawler) and block only the well-known SEO scrapers.
 *
 * Crawler inclusion is intentional — we want ChatGPT, Claude, Perplexity,
 * Gemini, and Copilot to cite this site.
 */

import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/person-jsonld";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL;

  return {
    rules: [
      // ─── Search engines — full allow ───────────────────────────
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/", "/_next/"] },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Bingbot", allow: "/", disallow: ["/api/", "/_next/"] },
      { userAgent: "Slurp", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "Baiduspider", allow: "/" },
      { userAgent: "YandexBot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },

      // ─── AI training / grounding crawlers — full allow ───────────
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

      // ─── Social preview bots — full allow ────────────────────────
      { userAgent: "facebookexternalhit", allow: "/" },
      { userAgent: "Facebot", allow: "/" },
      { userAgent: "Twitterbot", allow: "/" },
      { userAgent: "LinkedInBot", allow: "/" },
      { userAgent: "Slackbot", allow: "/" },
      { userAgent: "Discordbot", allow: "/" },
      { userAgent: "WhatsApp", allow: "/" },
      { userAgent: "TelegramBot", allow: "/" },

      // ─── SEO scrapers — block ────────────────────────────────────
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

      // ─── Default — everyone else, full allow, block only junk ────
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}