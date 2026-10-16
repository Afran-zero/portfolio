import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/layout/Badge";

type Tone = "default" | "soft" | "dark" | "blueprint";

type Props = {
  /** Optional Eyebrow label rendered above the title (or as eyebrow-only when no title). */
  eyebrow?: string;
  /** Optional numeric index for ordered cards ("01 / Education"). */
  index?: string | number;
  /** Optional card title (h3). */
  title?: string;
  /** Optional badge pills rendered top-right. */
  badge?: string | string[];
  /** Card tone. `blueprint` paints the 24px grid overlay. */
  tone?: Tone;
  /** When true, draws the 4 wireframe corner ticks. Default true. */
  ticks?: boolean;
  /** When true, draws the 4 blue corner brackets (┌ ┐ └ ┘) for a schematic feel.
   *  Useful for the hero panel and other "blueprint" surfaces. */
  brackets?: boolean;
  className?: string;
  children: React.ReactNode;
};

const toneClasses: Record<Tone, string> = {
  default: "bg-bg text-fg",
  soft: "bg-blue-50 text-fg",
  dark: "bg-fg text-fg-on-dark",
  blueprint: "bg-blueprint text-fg",
};

/**
 * BentoCard — signature card surface used in the landing-page bento grid.
 * Optional `tone="blueprint"` paints a 24px grid overlay (technical / schematic feel).
 * Optional `ticks` paints the four wireframe corner ticks (default true for blueprint tone).
 */
export function BentoCard({
  eyebrow,
  index,
  title,
  badge,
  tone = "default",
  ticks,
  brackets = false,
  className,
  children,
}: Props) {
  const showTicks = ticks ?? tone === "blueprint";
  const cornerEls = (
    <>
      {showTicks ? (
        <>
          <span aria-hidden="true" className="ticks-bl" />
          <span aria-hidden="true" className="ticks-br" />
        </>
      ) : null}
      {brackets ? (
        <>
          <span aria-hidden="true" className="bracket-tl" />
          <span aria-hidden="true" className="bracket-tr" />
          <span aria-hidden="true" className="bracket-bl" />
          <span aria-hidden="true" className="bracket-br" />
        </>
      ) : null}
    </>
  );

  return (
    <article
      className={cn(
        "ticks relative flex h-full flex-col border border-border p-3 transition-colors duration-base ease-out hover:border-blue md:p-4",
        toneClasses[tone],
        className,
      )}
    >
      {(eyebrow || title || badge) && (
        <header className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            {eyebrow && (
              <Eyebrow index={index}>{eyebrow}</Eyebrow>
            )}
            {title && (
              <h3 className="mt-2 text-lg font-medium leading-snug tracking-tight md:text-xl">
                {title}
              </h3>
            )}
          </div>
          {badge && (
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
              {(Array.isArray(badge) ? badge : [badge]).map((b) => (
                <Badge key={b} variant="default">
                  {b}
                </Badge>
              ))}
            </div>
          )}
        </header>
      )}
      <div>{children}</div>
      {cornerEls}
    </article>
  );
}