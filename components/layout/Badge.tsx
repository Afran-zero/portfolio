import { cn } from "@/lib/utils";

type Variant = "default" | "soft" | "solid";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

const variantClasses: Record<Variant, string> = {
  default:
    "border border-[var(--badge-border)] bg-transparent text-[var(--badge-fg)]",
  soft: "border border-transparent bg-[var(--badge-bg)] text-[var(--badge-fg)]",
  solid: "border border-transparent bg-blue text-fg-on-dark",
};

/**
 * Badge — mono uppercase pill, used for tech tags and category markers.
 * Reference: PLAN §13, §56 (digital cyber style).
 */
export function Badge({ children, variant = "default", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-widest",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}