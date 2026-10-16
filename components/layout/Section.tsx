import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  /** Vertical rhythm. "lg" for hero/contact, "md" default, "sm" for tight stacked sections. */
  spacing?: "none" | "xs" | "sm" | "md" | "lg";
  /** Background tint. */
  tone?: "default" | "soft" | "dark" | "navy" | "sky";
};

const spacingClasses = {
  none: "",
  xs: "py-6 md:py-8",
  sm: "py-10 md:py-14",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
};

const toneClasses = {
  default: "bg-bg text-fg",
  soft: "bg-blue-50 text-fg",
  dark: "bg-fg text-fg-on-dark",
  navy: "bg-gradient-to-b from-blue-dark via-[#07225a] to-[#04102e] text-fg-on-dark",
  sky: "bg-sky text-fg",
};

/**
 * Section — vertical-rhythm wrapper. Optional background tint and shape slot.
 */
export function Section({
  id,
  children,
  className,
  spacing = "md",
  tone = "default",
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        spacingClasses[spacing],
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}