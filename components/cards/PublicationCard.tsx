import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Publication } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Meta } from "@/components/ui/Meta";

type Props = {
  publication: Publication;
  /** Optional destination — defaults to the academic publications section. */
  href?: string;
  featured?: boolean;
  className?: string;
};

/**
 * PublicationCard — mirrors `ProjectCard`'s visual weight so publications
 * and projects can sit in the same bento row without one out-sizing the
 * other. Same p-6 padding, same header rhythm (eyebrow + corner arrow),
 * same bottom-aligned meta footer.
 */
export function PublicationCard({
  publication,
  href = "/academic#publications",
  featured = false,
  className,
}: Props) {
  const inner = (
    <article
      className={cn(
        "group relative flex h-full flex-col border border-border bg-bg p-6 card-lift",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <Eyebrow>{publication.status} · {publication.year}</Eyebrow>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-fg-muted opacity-0 transition-all duration-base ease-out group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-blue"
        />
      </div>
      <h3 className="mt-4 text-xl font-medium tracking-tight text-fg">
        {publication.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm italic leading-relaxed text-fg-muted">
        {publication.abstract}
      </p>

      <div className="mt-auto pt-6">
        <Meta
          items={[
            publication.venue,
            publication.status,
          ]}
        />
        <div className="mt-3 flex items-center gap-4 text-xs">
          <span className="font-mono uppercase tracking-widest text-blue-dark">
            View publication →
          </span>
        </div>
      </div>

      {featured && (
        <span
          className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 rounded-sm bg-blue px-2 py-1 font-mono text-micro uppercase tracking-widest text-fg-on-dark"
          aria-hidden="true"
        >
          Feature
          <ArrowRight className="h-3 w-3" />
        </span>
      )}
    </article>
  );

  return (
    <Link
      href={href}
      aria-label={`${publication.title}, publication`}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
    >
      {inner}
    </Link>
  );
}