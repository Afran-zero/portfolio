/**
 * ADVANCED StructuredData.tsx template
 *
 * Server component that emits a JSON-LD <script>. Use one per page.
 * Place at: components/seo/StructuredData.tsx
 *
 * Generated as part of the portfolio-sop skill. See skills/portfolio-sop/SKILL.md §5.
 *
 * Usage in a page:
 *
 *   import { StructuredData } from "@/components/seo/StructuredData";
 *   ...
 *   return (
 *     <>
 *       <StructuredData data={{
 *         "@context": "https://schema.org",
 *         "@type": "Person",
 *         "name": "Md Kaif Afran Khan",
 *         ...
 *       }} />
 *       <main>...</main>
 *     </>
 *   );
 */

export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // The data is built at module/component scope, not from user input,
      // so dangerouslySetInnerHTML is safe here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}