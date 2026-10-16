import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Tightens the gap when cards are smaller (e.g. Selected Work). */
  gap?: "xs" | "sm" | "md" | "lg";
  /**
   * When true, every card in a row stretches to the row's tallest card
   * (`items-stretch` + `auto-rows-fr`). Default false — cards size to
   * content. Use `stretch` for symmetric bento layouts (Industry /
   * Academia split, Selected Work) where equal heights read better.
   */
  stretch?: boolean;
};

const gapClasses = {
  xs: "gap-2 md:gap-3",
  sm: "gap-3 md:gap-4",
  md: "gap-4 md:gap-5",
  lg: "gap-4 md:gap-6",
};

/**
 * BentoGrid — flexible 12-column grid wrapper.
 * Children carry `md:col-span-*` / `md:row-span-*` classes.
 * Mobile collapses to a single column.
 */
export function BentoGrid({ children, className, gap = "md", stretch = false }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-12",
        stretch && "items-stretch auto-rows-fr",
        gapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}