import { cn } from "@/lib/utils";

type Props = {
  items: Array<string | React.ReactNode>;
  className?: string;
  separator?: string;
};

/**
 * Mono metadata strip — used for project year/stack, role/dates, etc.
 */
export function Meta({ items, className, separator = "·" }: Props) {
  if (items.length === 0) return null;

  return (
    <p
      className={cn(
        "font-mono text-xs uppercase tracking-widest text-fg-muted",
        className,
      )}
    >
      {items.map((item, i) => (
        <span key={i}>
          {item}
          {i < items.length - 1 && (
            <span className="mx-2 text-fg-muted/60">{separator}</span>
          )}
        </span>
      ))}
    </p>
  );
}