/**
 * Skip-to-content link — keyboard accessibility.
 * Per WCAG 2.2 AA and skills/frontend §8.
 */
export function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-fg-on-dark"
    >
      Skip to content
    </a>
  );
}