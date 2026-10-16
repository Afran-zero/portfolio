import { ArrowUpRight, ExternalLink } from "lucide-react";

import type { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Meta } from "@/components/ui/Meta";

type Props = {
  project: Project;
  /** Optional span override (e.g. "md:col-span-2"). Defaults to 1. */
  className?: string;
};

/**
 * LiveProjectCard — bigger, interactive card used to feature a project with
 * a real `link` URL. Renders a stylized "browser chrome" preview block on
 * top (no asset file required), then the title, summary, meta, and a
 * prominent "Visit live site" CTA. No GitHub link is shown — the live URL
 * is the headline destination.
 */
export function LiveProjectCard({ project, className }: Props) {
  if (!project.link) return null;

  const host = (() => {
    try {
      return new URL(project.link).host.replace(/^www\./, "");
    } catch {
      return project.link.replace(/^https?:\/\//, "");
    }
  })();

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col border border-border bg-bg card-lift",
        className,
      )}
    >
      {/* Stylized browser-chrome preview — fully self-contained, no asset. */}
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${project.name}, ${host}`}
        className="relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
      >
        {/* Chrome bar */}
        <div className="flex items-center gap-2 border-b border-border bg-bg-soft px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-blue/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-blue/20" />
          <div className="ml-3 flex flex-1 items-center justify-center">
            <span className="inline-flex items-center gap-1.5 border border-border bg-bg px-3 py-1 font-mono text-micro uppercase tracking-widest text-fg-muted">
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              {host}
            </span>
          </div>
        </div>

        {/* Faux content area — blueprint tone so it reads as a real surface. */}
        <div className="relative h-44 overflow-hidden bg-blueprint">
          {/* Decorative grid + blocks suggesting a screenshot. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(28,71,115,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,71,115,0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative flex h-full flex-col gap-3 p-5">
            <div className="h-2 w-1/3 bg-blue/30" />
            <div className="h-2 w-1/2 bg-blue/20" />
            <div className="mt-auto grid grid-cols-3 gap-2">
              <div className="h-12 border border-blue/30 bg-bg/70" />
              <div className="h-12 border border-blue/30 bg-bg/70" />
              <div className="h-12 border border-blue/30 bg-bg/70" />
            </div>
          </div>

          {/* Hover overlay arrow */}
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center bg-fg text-fg-on-dark opacity-0 transition-all duration-base ease-out group-hover:opacity-100"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </a>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-6">
        <Eyebrow>{project.category}</Eyebrow>
        <h3 className="mt-3 text-2xl font-medium leading-tight tracking-tight text-fg md:text-3xl">
          {project.name}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted md:text-base">
          {project.summary}
        </p>
        {project.impact && (
          <p className="mt-3 text-sm leading-relaxed text-fg">
            <span className="font-mono text-micro uppercase tracking-widest text-blue">
              Impact:{" "}
            </span>
            {project.impact}
          </p>
        )}

        <div className="mt-auto pt-6">
          <Meta items={[String(project.year), ...project.stack.slice(0, 3)]} />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-2 bg-fg px-4 text-xs font-medium text-fg-on-dark transition-colors hover:bg-fg/90"
            >
              Visit live site
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <span className="font-mono text-micro uppercase tracking-widest text-fg-muted">
              {host}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}