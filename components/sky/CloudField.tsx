import { cn } from "@/lib/utils";

/**
 * CloudField — decorative cloud SVG layer for the home page sky background.
 *
 * Renders 3 SVG cloud shapes positioned at the top of the section,
 * drifting at different speeds. Pointer-events disabled so it never
 * interferes with underlying CTAs. SVG (not raster) so it stays crisp on
 * any DPI and inherits the gradient color via fill="white" + filter blur.
 *
 * Used inside a Section with `tone="sky"` — the .bg-sky gradient supplies
 * the wash; this layer adds visible cloud shapes on top.
 */
export function CloudField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-0 h-64 overflow-hidden",
        className,
      )}
    >
      <svg
        className="absolute -top-2 left-[6%] h-24 w-40 animate-cloud-drift opacity-90"
        viewBox="0 0 160 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="40" cy="60" rx="38" ry="22" fill="white" />
        <ellipse cx="80" cy="48" rx="32" ry="22" fill="white" />
        <ellipse cx="120" cy="58" rx="30" ry="20" fill="white" />
        <ellipse cx="62" cy="70" rx="44" ry="16" fill="white" />
      </svg>
      <svg
        className="absolute -top-4 left-[42%] h-16 w-28 animate-cloud-drift-slow opacity-80"
        viewBox="0 0 112 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="28" cy="40" rx="26" ry="16" fill="white" />
        <ellipse cx="58" cy="32" rx="22" ry="16" fill="white" />
        <ellipse cx="86" cy="40" rx="22" ry="14" fill="white" />
        <ellipse cx="44" cy="48" rx="30" ry="12" fill="white" />
      </svg>
      <svg
        className="absolute top-2 right-[8%] h-20 w-32 animate-cloud-drift opacity-85"
        viewBox="0 0 128 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="32" cy="50" rx="30" ry="18" fill="white" />
        <ellipse cx="64" cy="40" rx="26" ry="18" fill="white" />
        <ellipse cx="96" cy="50" rx="24" ry="16" fill="white" />
        <ellipse cx="50" cy="60" rx="34" ry="14" fill="white" />
      </svg>
    </div>
  );
}