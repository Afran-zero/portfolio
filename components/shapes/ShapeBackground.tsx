import { cn } from "@/lib/utils";

type Variant = "blue-rect" | "outlined-circle" | "dot-grid" | "blue-line" | "triangle" | "semi-circle";

type Props = {
  variant: Variant;
  className?: string;
  /** Width/height of the SVG viewBox in px. Use aspect-ratio when positioning. */
  size?: number;
  /** When true, the shape animates with --scroll-progress (0..1) — translateY by ±12px. */
  parallax?: boolean;
  /** Optional offset for parallax translateY in px. */
  parallaxAmount?: number;
};

/**
 * ShapeBackground — server component, no JS shipped.
 * Decorative 2D primitives per skills/2d-object-interactive §2–§4.
 *
 * Always aria-hidden. Sets `data-bg` so MouseShapeField can target it if desired.
 */
export function ShapeBackground({
  variant,
  className,
  size = 320,
  parallax = false,
  parallaxAmount = 12,
}: Props) {
  const parallaxStyle = parallax
    ? ({
        transform: `translateY(calc((var(--scroll-progress, 0) - 0.5) * ${parallaxAmount}px))`,
      } as React.CSSProperties)
    : undefined;

  return (
    <div
      aria-hidden="true"
      data-bg=""
      className={cn("pointer-events-none select-none", className)}
      style={parallaxStyle}
    >
      {variant === "blue-rect" && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect x="0" y="0" width="100" height="100" className="fill-blue-soft" />
        </svg>
      )}
      {variant === "outlined-circle" && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle
            cx="50"
            cy="50"
            r="49"
            className="fill-none stroke-fg/40"
            strokeWidth="0.5"
          />
        </svg>
      )}
      {variant === "dot-grid" && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {Array.from({ length: 11 }).flatMap((_, row) =>
            Array.from({ length: 11 }).map((__, col) => (
              <circle
                key={`${row}-${col}`}
                cx={row * 10 + 5}
                cy={col * 10 + 5}
                r="0.6"
                className="fill-fg/30"
              />
            )),
          )}
        </svg>
      )}
      {variant === "blue-line" && (
        <svg
          width={size}
          height={size / 4}
          viewBox="0 0 100 25"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-auto w-full"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="12.5"
            x2="100"
            y2="12.5"
            className="stroke-blue"
            strokeWidth="0.6"
          />
        </svg>
      )}
      {variant === "triangle" && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <polygon
            points="50,8 92,86 8,86"
            className="fill-none stroke-fg/40"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {variant === "semi-circle" && (
        <svg
          width={size}
          height={size / 2}
          viewBox="0 0 100 50"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-auto w-full"
          preserveAspectRatio="xMidYMin meet"
        >
          <path
            d="M 1 49 A 49 49 0 0 1 99 49"
            className="fill-none stroke-fg/40"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}