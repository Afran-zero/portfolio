import { ExternalLink, FileText } from "lucide-react";

import type { Publication } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Props = {
  publication: Publication;
  className?: string;
};

/**
 * Status → badge style. Per PLAN §29.
 * Status colors are restrained: blue family + outline, no rainbow.
 */
const statusStyles: Record<Publication["status"], string> = {
  Published: "bg-blue text-fg-on-dark",
  Accepted: "bg-blue-soft text-blue-dark border border-blue/40",
  "Under Review": "bg-bg-elevated text-fg-muted border border-border",
  Preprint: "bg-bg text-blue-dark border border-blue",
};

/**
 * PublicationItem — title, authors, venue, year, status badge, links,
 * collapsible abstract (native <details>, no JS).
 * Reference: PLAN §29.
 */
export function PublicationItem({ publication, className }: Props) {
  return (
    <article
      className={cn(
        "border border-border bg-bg p-6 transition-colors duration-base ease-out hover:border-blue",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Eyebrow>
            {publication.venue} · {publication.year}
          </Eyebrow>
          <h4 className="mt-2 text-lg font-medium leading-snug tracking-tight text-fg md:text-xl">
            {publication.title}
          </h4>
          <p className="mt-2 font-mono text-xs text-fg-muted">
            {publication.authors.join(", ")}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center font-mono text-[10px] uppercase tracking-widest",
            "rounded-sm px-2 py-1",
            statusStyles[publication.status],
          )}
        >
          {publication.status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        {publication.doi && (
          <a
            href={`https://doi.org/${publication.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono uppercase tracking-widest text-fg-muted hover:text-blue"
          >
            DOI
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
        {publication.arxiv && (
          <a
            href={publication.arxiv}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono uppercase tracking-widest text-fg-muted hover:text-blue"
          >
            arXiv
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
        {publication.paper_url && (
          <a
            href={publication.paper_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono uppercase tracking-widest text-fg-muted hover:text-blue"
          >
            Paper
            <FileText className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
      </div>

      {publication.abstract && (
        <details className="group mt-4 border-t border-border/60 pt-4">
          <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-blue">
            Abstract
          </summary>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg-muted">
            {publication.abstract}
          </p>
        </details>
      )}
    </article>
  );
}