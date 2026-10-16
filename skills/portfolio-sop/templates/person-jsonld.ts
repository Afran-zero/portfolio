/**
 * ADVANCED person-jsonld.ts template
 *
 * Typed factory that builds the canonical Person JSON-LD object for the site.
 * Pulls values from content/shared/person.yaml via getPerson() (Zod-validated).
 * Add every profile URL you can to the `sameAs` array — this is the entity
 * graph that LLMs use to disambiguate identity.
 *
 * Place at: lib/seo/person-jsonld.ts (or anywhere — it has no UI).
 *
 * Generated as part of the portfolio-sop skill. See skills/portfolio-sop/SKILL.md §17.2.
 */

import type { Person } from "@/lib/schemas";

const BASE = "https://kaif.dev";

/**
 * SameAs links — fill in every authoritative profile you have.
 * These are the strongest "this is the same human" signals on the web.
 */
export const SAME_AS = [
  // Examples — replace with your real handles:
  // "https://github.com/kaif-afran",
  // "https://www.linkedin.com/in/kaif-afran-khan",
  // "https://orcid.org/0000-0000-0000-0000",
  // "https://scholar.google.com/citations?user=XXXXXXXX",
  // "https://arxiv.org/a/khan_m_1",
] as const;

export function buildPersonJsonLd(person: Person) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    alternateName: person.short_name,
    jobTitle: person.role,
    description: person.bio,
    url: BASE,
    image: `${BASE}${person.portrait_path}`,
    pronouns: person.pronouns,
    homeLocation: person.location
      ? {
          "@type": "Place",
          name: person.location,
        }
      : undefined,
    sameAs: [...SAME_AS],
  } as const;
}

/**
 * WebSite JSON-LD for the home page.
 * Tells crawlers what the site is and links to the Person.
 */
export function buildWebSiteJsonLd(person: Person) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${person.name} — ${person.role}`,
    url: BASE,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: person.name,
      url: BASE,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE}/?q={search_term_string}`,
      // Query-input is omitted on purpose — this site has no internal search.
      "query-input": undefined,
    },
  } as const;
}