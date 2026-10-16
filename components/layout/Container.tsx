import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** "wide" extends beyond the standard max-width for hero/full-bleed sections. */
  width?: "default" | "wide" | "narrow";
};

const widthClasses = {
  default: "max-w-7xl",
  wide: "max-w-[88rem]",
  narrow: "max-w-4xl",
};

/**
 * Container — horizontal page padding + max-width wrapper.
 * Reference: skills/frontend §5.
 */
export function Container({ children, className, width = "default" }: Props) {
  return (
    <div className={cn("mx-auto w-full px-4 md:px-6 lg:px-8", widthClasses[width], className)}>
      {children}
    </div>
  );
}