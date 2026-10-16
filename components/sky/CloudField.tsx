import { cn } from "@/lib/utils";
import { CLOUD_ART, type CloudArt } from "./cloud-art";

/**
 * CloudField — decorative clouds for the home page sky.
 *
 * The shapes are traced from the reference cloud artwork (see cloud-art.ts):
 * a white silhouette with light-blue shading. A soft blue shadow sits under
 * each cloud, and each one drifts with the cloud-drift keyframes.
 * Pure SVG, pointer-events disabled.
 */

const SHADING = "#cde5f7";

function Cloud({ art }: { art: CloudArt }) {
  return (
    <svg
      viewBox={`0 0 ${art.w} ${art.h}`}
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full drop-shadow-[0_6px_6px_rgba(20,90,170,0.28)]"
    >
      <path d={art.sil} fill="#ffffff" />
      {art.shades.map((d, i) => (
        <path key={i} d={d} fill={SHADING} />
      ))}
    </svg>
  );
}

// Clouds in three depth layers. Back clouds are small, faint, and slightly
// soft, so they read as far away. Front clouds are the largest and sharpest.
// Indices refer to CLOUD_ART (largest first). Positions are percentages of the
// sky band, so the clouds spread across the width instead of sitting in a row.
type Layer = { art: number; left: string; top: string; width: string; speed: "a" | "b" };

const BACK: Layer[] = [
  { art: 5, left: "62%", top: "10%", width: "w-20", speed: "b" },
  { art: 4, left: "4%", top: "80%", width: "w-24", speed: "b" },
  { art: 5, left: "88%", top: "62%", width: "w-16", speed: "a" },
];
const MID: Layer[] = [
  { art: 3, left: "50%", top: "2%", width: "w-36", speed: "a" },
  { art: 2, left: "76%", top: "34%", width: "w-44", speed: "b" },
  { art: 4, left: "46%", top: "70%", width: "w-32", speed: "a" },
];
const FRONT: Layer[] = [
  { art: 0, left: "2%", top: "-6%", width: "w-72", speed: "a" },
  { art: 1, left: "70%", top: "-2%", width: "w-64", speed: "b" },
];

const LAYER_STYLE = {
  back: "z-0 opacity-60 blur-[1px]",
  mid: "z-0 opacity-85",
  front: "z-0 opacity-100",
};

export function CloudField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-0 h-72 overflow-hidden",
        className,
      )}
    >
      {[
        ...BACK.map((l) => ({ ...l, depth: "back" as const })),
        ...MID.map((l) => ({ ...l, depth: "mid" as const })),
        ...FRONT.map((l) => ({ ...l, depth: "front" as const })),
      ].map((l, i) => {
        const art = CLOUD_ART[l.art];
        if (!art) return null;
        const drift = l.speed === "a" ? "animate-cloud-drift" : "animate-cloud-drift-slow";
        return (
          <div
            key={i}
            className={cn("absolute h-auto", l.width, drift, LAYER_STYLE[l.depth])}
            style={{ left: l.left, top: l.top, aspectRatio: `${art.w} / ${art.h}` }}
          >
            <Cloud art={art} />
          </div>
        );
      })}
    </div>
  );
}
