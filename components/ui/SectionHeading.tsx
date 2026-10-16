import { Eyebrow } from "./Eyebrow";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  index?: string | number;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** When the parent surface is dark (e.g. navy / dark section), flip text to `text-fg-on-dark`. */
  tone?: "light" | "dark";
  /** When true (and `index` is unset), render a pulsing hollow neon-blue dot before the eyebrow label. */
  pulse?: boolean;
  className?: string;
};

/**
 * Section heading — eyebrow + h2 + optional description.
 * Reference: skills/frontend §13.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  align = "left",
  tone = "light",
  pulse = false,
  className,
}: Props) {
  const isDark = tone === "dark";
  return (
    <header
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow index={index} pulse={pulse} tone={tone}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "mt-3 text-3xl font-medium tracking-tight md:text-4xl",
          isDark ? "text-fg-on-dark" : "text-fg",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            isDark ? "text-fg-on-dark/80" : "text-fg-muted",
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}