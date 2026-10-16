import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Optional id-label prefix like "01" used for ordered section eyebrows. */
  index?: string | number;
  /**
   * When true, render a hollow neon-blue pulsing ring marker before the
   * label. Use this instead of `index` for sections that aren't numbered.
   */
  pulse?: boolean;
  /** When "dark", flip label text to white for navy/dark backgrounds. */
  tone?: "light" | "dark";
};

/**
 * Eyebrow label — small mono uppercase, used above section headings.
 * Per PLAN §9 and skills/content-writing-no-ai-slop §17.
 */
export function Eyebrow({
  children,
  className,
  index,
  pulse = false,
  tone = "light",
}: Props) {
  const isDark = tone === "dark";
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest",
        isDark ? "text-fg-on-dark" : "text-blue",
        className,
      )}
    >
      {pulse && (
        <span
          aria-hidden="true"
          className={cn(
            "relative inline-block h-1.5 w-1.5 rounded-full border motion-safe:animate-pulse-ring",
            isDark
              ? "border-fg-on-dark bg-fg-on-dark"
              : "border-blue bg-blue",
          )}
        />
      )}
      {index !== undefined && <span>{String(index).padStart(2, "0")} / </span>}
      <span>{children}</span>
    </p>
  );
}