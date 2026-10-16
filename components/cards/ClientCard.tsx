import type { ClientWork } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Meta } from "@/components/ui/Meta";

type Props = {
  entry: ClientWork;
  className?: string;
};

function formatYear(iso: string | null | undefined): string {
  if (!iso) return "Present";
  return new Date(iso).getFullYear().toString();
}

function formatRange(start: string | undefined, end: string | null | undefined): string {
  return `${formatYear(start)} to ${formatYear(end)}`;
}

/**
 * ClientCard — confidential and named variants.
 * Reference: PLAN §23.
 */
export function ClientCard({ entry, className }: Props) {
  return (
    <article
      className={cn(
        "flex h-full flex-col border border-border bg-bg p-6 card-lift",
        className,
      )}
    >
      <Eyebrow>
        {entry.confidential ? "Confidential" : entry.name} · {entry.domain}
      </Eyebrow>
      <h3 className="mt-3 text-lg font-medium tracking-tight text-fg">
        {entry.role}
      </h3>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-fg-muted">
        {entry.name} · {formatRange(entry.start, entry.end)}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-fg-muted">
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm leading-relaxed text-fg">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span aria-hidden="true" className="select-none text-blue">•</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      {entry.stack && entry.stack.length > 0 && (
        <Meta className="mt-4" items={entry.stack} />
      )}
    </article>
  );
}