import type { Language } from "@/lib/schemas";

type Props = {
  items: Language[];
};

/**
 * LanguageProficiency — bar chart for spoken languages + a small cell for
 * test scores (e.g. IELTS). Languages with a `score` (0–10) get a
 * filled bar; those without render as a compact test-score cell.
 */
export function LanguageProficiency({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {items.map((lang) => (
        <li
          key={lang.name}
          className="border border-border bg-bg p-5"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">
            {lang.score !== undefined ? "Proficiency" : "Test score"}
          </p>
          <p className="mt-2 text-lg font-medium tracking-tight text-fg">
            {lang.name}
          </p>
          {lang.score !== undefined ? (
            <>
              <div
                className="mt-3 h-1.5 w-full overflow-hidden border border-border"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-blue transition-[width] duration-base ease-out"
                  style={{ width: `${(lang.score / 10) * 100}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-fg-muted">
                {lang.level} · {lang.score.toFixed(1)} / 10
              </p>
            </>
          ) : (
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-fg-muted">
              {lang.level}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}