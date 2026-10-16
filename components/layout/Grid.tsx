import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Visual only — useful when you want asymmetric 5/7, 7/5, etc. */
  cols?: 2 | 3 | 4 | 6 | 12;
  gap?: "sm" | "md" | "lg";
};

const colClasses = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
};

const gapClasses = {
  sm: "gap-4 md:gap-5",
  md: "gap-6 md:gap-8",
  lg: "gap-8 md:gap-10",
};

/**
 * Grid — responsive 1 / 8 / 12-col grid helper.
 * Mobile always single-column.
 */
export function Grid({ children, className, cols = 12, gap = "md" }: Props) {
  return (
    <div className={cn("grid grid-cols-1", colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}