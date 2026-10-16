/**
 * lib/seo/person-jsonld.ts — typed factory for the canonical Person / WebSite
 * JSON-LD objects. Reads from content/shared/person.yaml + content/shared/contact.yaml
 * (both Zod-validated). The sameAs array is derived from whatever profiles exist
 * in contact.yaml so it stays in sync with the canonical identity file.
 *
 * Per skills/portfolio-sop §5 + §17.2.
 */

import type { Contact, Person } from "@/lib/schemas";

/** Set NEXT_PUBLIC_SITE_URL once a domain is chosen. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Kaif | AI Engineer and Data Engineer";

/** Third-person summary for search and social previews. */
export const SITE_DESCRIPTION =
  "Md Kaif Afran Khan is an AI engineer, data engineer, and researcher in Dhaka, Bangladesh. He builds AI and data systems and studies quantum machine learning.";

/**
 * Profile URLs that should appear in `Person.sameAs`. These are the strongest
 * "this is the same human" signals on the public web. Sources: contact.yaml
 * (canonical identity) plus any explicitly listed below.
 *
 * Add ORCID, Google Scholar, arXiv, etc. here as you create them.
 */
function buildSameAs(contact: Contact): string[] {
  const urls: string[] = [];
  if (contact.github) urls.push(contact.github);
  if (contact.linkedin) urls.push(contact.linkedin);
  if (contact.scholar) urls.push(contact.scholar);
  if (contact.orcid) urls.push(contact.orcid);
  return urls;
}

export function buildPersonJsonLd(person: Person, contact: Contact) {
  const sameAs = buildSameAs(contact);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    alternateName: person.short_name,
    jobTitle: person.role,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}${person.portrait_path}`,
    pronouns: person.pronouns,
    homeLocation: person.location
      ? { "@type": "Place", name: person.location }
      : undefined,
    email: contact.email,
    address: person.location
      ? { "@type": "PostalAddress", addressLocality: person.location }
      : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  } as const;
}

export function buildWebSiteJsonLd(person: Person) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: person.name,
    alternateName: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: person.name,
      url: SITE_URL,
    },
  } as const;
}

/**
 * For /contact — Person schema with contactPoint. Per SOP §5.
 */
export function buildContactPointJsonLd(person: Person, contact: Contact) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    url: SITE_URL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "professional inquiries",
        email: contact.email,
        availableLanguage: ["English", "Bengali"],
        areaServed: "Worldwide",
      },
    ],
    sameAs: buildSameAs(contact),
  } as const;
}