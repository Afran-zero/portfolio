import { ArrowUpRight, Atom } from "lucide-react";

import type { ResearchProject } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Props = {
  project: ResearchProject;
  /** Optional span override. */
  className?: string;
};

/**
 * QuantumPaperCard — featured card for ongoing quantum research projects.
 *
 * The card body itself is intentionally NOT clickable — these projects are
 * still ongoing and have no detail page yet. When the preprint is ready,
 * wire up the body link + reveal a `paper_url`. For now, the only
 * navigational surface is the "Open to collaborators →" call-out, which
 * routes to the contact page.
 *
 * Blueprint-styled with a faux-circuit illustration (no asset file
 * required) and an "Ongoing" badge.
 */
export function QuantumPaperCard({ project, className }: Props) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col border border-border bg-bg card-lift",
        className,
      )}
      aria-label={`${project.title}, ongoing quantum research`}
    >
      {/* Faux circuit header — self-contained, no asset. */}
      <div className="relative h-36 overflow-hidden border-b border-border bg-blueprint">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(11,61,145,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,61,145,0.10) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        {/* Decorative qubit row */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <g
            stroke="#0b3d91"
            strokeWidth="1.2"
            fill="none"
            opacity="0.55"
          >
            <line x1="20" y1="50" x2="380" y2="50" />
            <line x1="100" y1="20" x2="100" y2="80" />
            <line x1="220" y1="20" x2="220" y2="80" />
            <line x1="320" y1="30" x2="320" y2="70" />
            <line x1="60" y1="50" x2="60" y2="80" />
            <line x1="60" y1="80" x2="180" y2="80" />
            <line x1="180" y1="50" x2="180" y2="80" />
            <line x1="260" y1="50" x2="260" y2="80" />
          </g>
          <g
            stroke="#1769ff"
            strokeWidth="1.6"
            fill="#ffffff"
          >
            <circle cx="60" cy="50" r="5" />
            <circle cx="180" cy="50" r="5" />
            <circle cx="260" cy="50" r="5" />
            <circle cx="100" cy="20" r="4" />
            <circle cx="220" cy="20" r="4" />
            <circle cx="320" cy="30" r="4" />
          </g>
        </svg>

        {/* Quantum glyph + ongoing badge */}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 bg-bg/90 px-2 py-1 font-mono text-micro uppercase tracking-widest text-blue-dark backdrop-blur-sm">
          <Atom className="h-3 w-3" aria-hidden="true" />
          QML
        </div>
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 bg-blue px-2 py-1 font-mono text-micro uppercase tracking-widest text-fg-on-dark">
          Ongoing
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <Eyebrow>Quantum · Research</Eyebrow>
        <h3 className="mt-3 text-2xl font-medium leading-tight tracking-tight text-fg md:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 max-w-xl text-sm italic leading-relaxed text-fg-muted md:text-base">
          {project.question}
        </p>
        <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-fg-muted">
          {project.method}
        </p>

        <div className="mt-auto pt-6">
          {/* The only clickable surface — routes to the contact page. */}
          <a
            href="/contact"
            className="inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-widest text-blue-dark transition-colors hover:text-fg"
          >
            Open to collaborators →
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="font-mono text-micro uppercase tracking-widest text-fg-muted">
              {project.setup?.split(/[,;]/)[0]?.trim() ?? "Simulator"}
            </span>
            <span className="font-mono text-micro uppercase tracking-widest text-fg-muted">
              Ongoing
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}