import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import type { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Meta } from "@/components/ui/Meta";

type Props = {
  project: Project;
  featured?: boolean;
  className?: string;
  /**
   * When true, drops the card's own border, background, and padding so the
   * component can sit inside a parent card (e.g. `BentoCard`) without
   * doubling surfaces. Useful for symmetric bento layouts.
   */
  flush?: boolean;
};

type Action = {
  key: string;
  href: string;
  label: string;
};

/**
 * External (target=_blank) actions shown in the card footer.
 * GitHub only renders when the project has a `github` URL.
 */
function projectActions(project: Project): Action[] {
  const actions: Action[] = [];
  if (project.github) {
    actions.push({ key: "github", href: project.github, label: "GitHub →" });
  }
  if (project.link) {
    actions.push({ key: "live", href: project.link, label: "Live →" });
  }
  return actions;
}

/**
 * ProjectCard — outlined card with hover → blue border + --blue-50 background.
 * Reference: PLAN §10, §39, §20.
 *
 * The card itself is not clickable — users pick an explicit action (Live,
 * GitHub, or Case study). This avoids React hydration errors from nested
 * anchors when more than one external link lives inside a single card.
 *
 * `featured` paints a solid blue "Feature →" pill in the top-right corner.
 * `flush` removes the card's surface so the component can sit inside a
 * parent bento card.
 */
export function ProjectCard({ project, featured = false, flush = false, className }: Props) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col transition-colors duration-base ease-out",
        !flush && "border border-border bg-bg p-6 hover:border-blue hover:bg-blue-50",
        flush && "p-0",
        className,
      )}
    >
      {/* Optional thumbnail — renders only when project.image is set. */}
      {project.image && (
        <div className="relative -mx-6 -mt-6 mb-4 aspect-video overflow-hidden border-b border-border bg-blueprint">
          <Image
            src={project.image}
            alt={project.image_alt ?? `${project.name} — screenshot`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <Eyebrow>{project.category}</Eyebrow>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-fg-muted opacity-0 transition-all duration-base ease-out group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-blue"
        />
      </div>
      <h3 className="mt-4 text-xl font-medium tracking-tight text-fg">
        {project.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        {project.summary}
      </p>
      {project.impact && (
        <p className="mt-3 text-sm leading-relaxed text-fg">
          <span className="font-mono text-xs uppercase tracking-widest text-blue">
            Impact —{" "}
          </span>
          {project.impact}
        </p>
      )}
      <div className="mt-auto pt-6">
        <Meta
          items={[
            String(project.year),
            project.stack.slice(0, 4).join(" · "),
          ]}
        />
        {/* Action row — buttons sized at min 44px tap target. */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {project.case_study && (
            <Link
              href={`/industry/projects/${project.slug}`}
              className="inline-flex h-11 items-center gap-1.5 px-3 font-mono text-xs uppercase tracking-widest text-blue-dark transition-colors hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
              aria-label={`${project.name} — case study`}
            >
              Case study →
            </Link>
          )}
          {projectActions(project).map((action) => (
            <a
              key={action.key}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 min-w-[44px] items-center gap-2 border border-border bg-bg px-3 font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:border-blue hover:text-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
      {featured && (
        <span
          className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 rounded-sm bg-blue px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-fg-on-dark"
          aria-hidden="true"
        >
          Feature
          <ArrowRight className="h-3 w-3" />
        </span>
      )}
    </article>
  );
}