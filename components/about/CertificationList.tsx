import type { Certification } from "@/lib/schemas";

type Props = {
  items: Certification[];
  /** Optional extra class for the outer `<ul>`. */
  className?: string;
};

/**
 * Two-column key/value list of certifications: name on the left,
 * issuer · year on the right.
 */
export function CertificationList({ items, className }: Props) {
  return (
    <ul className={className ?? "mt-8 space-y-3"}>
      {items.map((cert) => (
        <li
          key={cert.id}
          className="flex items-baseline justify-between border-b border-border/60 pb-3 font-mono text-sm"
        >
          <span className="text-fg">{cert.name}</span>
          <span className="uppercase tracking-widest text-fg-muted">
            {cert.issuer} · {cert.year}
          </span>
        </li>
      ))}
    </ul>
  );
}