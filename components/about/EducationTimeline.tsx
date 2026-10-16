import type { Education } from "@/lib/schemas";
import { formatRange } from "@/lib/date";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  items: Education[];
};

/**
 * EducationTimeline — college → university animated sequence.
 * Each milestone uses Reveal with a stagger delay so the list reveals
 * top-to-bottom when scrolled into view. Honors prefers-reduced-motion
 * via the underlying Reveal component.
 *
 * Distinct from `components/education/ExperienceTimeline.tsx`, which is
 * used on /industry for work history.
 */
export function EducationTimeline({ items }: Props) {
  if (items.length === 0) return null;

  // Render oldest → newest so the eye reads college first, then university.
  const sorted = [...items].sort((a, b) => {
    const aStart = a.start ? new Date(a.start).getTime() : 0;
    const bStart = b.start ? new Date(b.start).getTime() : 0;
    return aStart - bStart;
  });

  return (
    <ol className="relative ml-2 border-l-2 border-blue md:ml-3">
      {sorted.map((item, i) => (
        <Reveal key={`${item.institution}-${item.degree}`} delay={i * 0.1}>
          <li className="mb-8 ml-5 last:mb-0 md:ml-6">
            <span
              aria-hidden="true"
              className="absolute -left-[7px] mt-2 h-3 w-3 rounded-full border-2 border-blue bg-bg md:-left-[9px] md:h-[14px] md:w-[14px]"
            />
            <p className="font-mono text-xs uppercase tracking-widest text-blue">
              {formatRange(item.start, item.end)}
            </p>
            <p className="mt-1 text-base font-medium tracking-tight text-fg md:text-lg">
              {item.degree}
              <span className="text-fg-muted"> · {item.institution}</span>
            </p>
            {item.location && (
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-fg-muted">
                {item.location}
              </p>
            )}
            {item.highlights && item.highlights.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm leading-relaxed text-fg-muted">
                {item.highlights.map((h, j) => (
                  <li key={j} className="flex gap-2">
                    <span aria-hidden="true" className="select-none text-blue">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
            {item.gpa !== undefined && (
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-fg-muted">
                CGPA {item.gpa.toFixed(2)} / {item.gpa_scale}
              </p>
            )}
          </li>
        </Reveal>
      ))}
    </ol>
  );
}