/**
 * Date formatting helpers used by timeline-style components.
 * All inputs accept ISO date strings (YYYY-MM-DD) or nullish for "Present".
 */

export function formatYear(iso: string | null | undefined): string {
  if (!iso) return "Present";
  return new Date(iso).getFullYear().toString();
}

export function formatRange(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  return `${formatYear(start)} — ${formatYear(end)}`;
}