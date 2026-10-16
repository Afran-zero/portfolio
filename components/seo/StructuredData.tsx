/**
 * StructuredData — server component that emits a JSON-LD <script>.
 *
 * Per skills/portfolio-sop §5. Used one or more times per page to make the
 * site legible to Google, ChatGPT, Claude, Perplexity, and other answer engines.
 *
 * The data is built at module/component scope from typed YAML getters
 * (never from user input), so dangerouslySetInnerHTML is safe here.
 */
export function StructuredData({ data }: { data: object }) {
  // Escape `<` so a future maintainer passing user-influenced fields can't
  // break out of the script tag. The data is currently built from typed
  // YAML getters (never from user input), so this is defense in depth.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}