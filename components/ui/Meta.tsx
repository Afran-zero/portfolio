import { cn } from "@/lib/utils";

type Props = {
  items: Array<string | React.ReactNode>;
  className?: string;
  separator?: string;
  /** "dark" for navy/dark surfaces. */
  tone?: "light" | "dark";
};

/**
 * Mono metadata strip — used for project year/stack, role/dates, etc.
 */
export function Meta({ items, className, separator = "·", tone = "light" }: Props) {
  if (items.length === 0) return null;

  const isDark = tone === "dark";

  return (
    <p
      className={cn(
        "font-mono text-xs uppercase tracking-widest",
        isDark ? "text-fg-on-dark/70" : "text-fg-muted",
        className,
      )}
    >
      {items.map((item, i) => (
        <span key={i}>
          {item}
          {i < items.length - 1 && (
            <span className={cn("mx-2", isDark ? "text-fg-on-dark/40" : "text-fg-muted/60")}>
              {separator}
            </span>
          )}
        </span>
      ))}
    </p>
  );
}
