"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Experience } from "@/lib/schemas";
import { formatRange } from "@/lib/date";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Meta } from "@/components/ui/Meta";

type Props = {
  items: Experience[];
};

/**
 * ExperienceTimeline — blueprint-styled vertical timeline.
 *
 * Two-column grid per row: rail (8-col / 4-col) + content (4-col / 8-col).
 * No absolute offsets — the rail is its own grid track, markers sit on a
 * 1px divider line within the rail column.
 */
export function ExperienceTimeline({ items }: Props) {
  const reduced = useReducedMotion();

  if (items.length === 0) {
    return (
      <p className="font-mono text-sm uppercase tracking-widest text-fg-muted">
        No experience entries yet.
      </p>
    );
  }

  return (
    <ol
      role="list"
      className="experience-timeline relative grid gap-10 pr-8 before:absolute before:bottom-3 before:left-[16px] before:top-3 before:w-px before:bg-blue/45 md:pr-16 md:before:left-[-16px]"
    >
      {items.map((item, i) => {
        const range = formatRange(item.start, item.end);
        return (
          <motion.li
            key={item.id}
            className="grid grid-cols-[32px_1fr] gap-6 md:relative md:block"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.2, 0, 0, 1] }}
          >
            {/* Rail column — a 1px line at the column's center, with a marker
                aligned to it and (for the last row) a tail gap so the line
                doesn't extend past the last dot. */}
            <div className="relative flex justify-center md:absolute md:-left-7 md:top-0 md:h-full md:w-6">
              {/* Marker — blueprint corner brackets + center dot.
                  Centered on the rail x via flex justify-center. */}
              <span
                aria-hidden="true"
                className="relative z-10 mt-1 inline-flex h-5 w-5 items-center justify-center md:mt-0 md:h-6 md:w-6"
              >
                {/* Corner brackets */}
                <span className="absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-blue" />
                <span className="absolute right-0 top-0 h-2 w-2 border-r-2 border-t-2 border-blue" />
                <span className="absolute left-0 bottom-0 h-2 w-2 border-l-2 border-b-2 border-blue" />
                <span className="absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-blue" />
                {/* Center dot — animates fill on viewport-in */}
                <motion.span
                  aria-hidden="true"
                  className="block h-2 w-2 rounded-full bg-bg"
                  initial={
                    reduced
                      ? false
                      : { scale: 0.6, backgroundColor: "var(--bg, #fff)" }
                  }
                  whileInView={
                    reduced
                      ? undefined
                      : { scale: 1, backgroundColor: "var(--blue, #1769ff)" }
                  }
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.4, delay: i * 0.05 + 0.1 }}
                />
              </span>
            </div>

            {/* Content column */}
            <div>
              <Eyebrow>{range}</Eyebrow>

              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-lg font-medium tracking-tight text-fg md:text-xl">
                  {item.role}
                </h3>
                <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">
                  {item.company} · {range}
                </span>
              </div>

              {item.location && (
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-fg-muted">
                  {item.location}
                </p>
              )}
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted md:text-base">
                {item.description}
              </p>
              {item.highlights && item.highlights.length > 0 && (
                <ul className="mt-3 max-w-2xl space-y-1 text-sm leading-relaxed text-fg">
                  {item.highlights.map((h, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span aria-hidden="true" className="select-none text-blue">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
              {item.stack && item.stack.length > 0 && (
                <div className="mt-4">
                  <Meta items={item.stack} />
                </div>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}