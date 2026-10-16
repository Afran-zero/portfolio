import { ArrowUpRight, Star } from "lucide-react";

import type { GitHubRepo } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = {
  repo: GitHubRepo;
  className?: string;
};

/**
 * GitHubCard — curated repo card.
 * Reference: PLAN §24. Language as mono label, no colored dots.
 * Stars only shown when < 100 (keep it tasteful).
 */
export function GitHubCard({ repo, className }: Props) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group block h-full border border-border bg-bg p-5 transition-colors duration-base ease-out hover:border-blue hover:bg-blue-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-sm uppercase tracking-widest text-fg">
          {repo.name}
        </p>
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-fg-muted transition-all duration-base ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue"
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-fg-muted">
        {repo.description}
      </p>
      <div className="mt-4 flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-fg-muted">
        {repo.language && <span>{repo.language}</span>}
        {typeof repo.stars === "number" && repo.stars < 100 && (
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3" aria-hidden="true" />
            {repo.stars}
          </span>
        )}
      </div>
    </a>
  );
}