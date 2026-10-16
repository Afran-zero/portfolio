import type { Education } from "@/lib/schemas";
import { formatYear } from "@/lib/date";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Meta } from "@/components/ui/Meta";

type Props = {
  items: Education[];
};

/**
 * EducationAcademic — academic framing of the shared education data.
 * Reference: PLAN §17. Same content as Industry's snapshot, with academic
 * framing (emphasize thesis / field / honors / research relevance).
 */
export function EducationAcademic({ items }: Props) {
  if (items.length === 0) {
    return (
      <p className="font-mono text-sm uppercase tracking-widest text-fg-muted">
        No education entries yet.
      </p>
    );
  }
  return (
    <div className="education-timeline relative space-y-8 before:absolute before:bottom-2 before:left-0 before:top-2 before:w-px before:bg-blue/45">
      {items.map((edu) => (
        <article
          key={`${edu.institution}-${edu.degree}`}
          className="relative pl-6"
        >
          <span
            aria-hidden="true"
            className="absolute -left-1.5 top-0 h-3 w-3 border-2 border-blue bg-bg-soft shadow-[0_0_8px_rgb(23_105_255_/_0.45)]"
          />
          <Eyebrow>
            {formatYear(edu.start)} to {formatYear(edu.end)}
          </Eyebrow>
          <h3 className="mt-2 text-xl font-medium tracking-tight text-fg md:text-2xl">
            {edu.degree}
            <span className="text-fg-muted"> · {edu.institution}</span>
          </h3>
          <p className="mt-1 text-sm text-fg-muted">
            {edu.field}
            {edu.location && ` · ${edu.location}`}
          </p>
          <Meta
            className="mt-3"
            items={[
              edu.gpa !== undefined
                ? `CGPA ${edu.gpa.toFixed(2)} / ${edu.gpa_scale}`
                : "",
              edu.credits !== undefined ? `${edu.credits} credits` : "",
            ]}
          />
          {edu.thesis && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
              <span className="font-mono text-xs uppercase tracking-widest text-blue">
                Thesis:{" "}
              </span>
              {edu.thesis}
            </p>
          )}
          {edu.highlights && edu.highlights.length > 0 && (
            <ul className="mt-3 max-w-2xl space-y-1 text-sm leading-relaxed text-fg">
              {edu.highlights.map((h, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true" className="select-none text-blue">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}