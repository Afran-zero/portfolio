"use client";

import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { PORCLOUD_RUNS, PORCLOUD_VIEWBOX, type PorCloudRun } from "./porcloud-art";

/**
 * PorCloud — animated portrait built from images/porcloud.svg.
 *
 * The SVG is split into three layers (ring, cloud, figure) while keeping the
 * original stacking order, so each layer can move on its own:
 *
 *   figure  breathing + floating, shoulder shrug and smile on first load,
 *           pointer parallax (deep), scroll drift
 *   cloud   each puff lifts on hover, floats out of phase, parallax (deeper)
 *   ring    slow orbit of dots around the halo, speeds up on hover, scroll
 *           rotation, glow on hover; parallax (shallow)
 *
 * Motion is CSS-driven. Pointer parallax reads --mx / --my from
 * MouseShapeField and scroll reads --scroll-progress from ScrollShapeField;
 * both fall back to 0 when they are inactive (touch, reduced motion).
 * Clicking the figure replays the shrug and smile.
 */

type Props = {
  className?: string;
  label?: string;
};

export function PorCloud({
  className,
  label = "Illustration of me with my arms crossed, standing on a cloud",
}: Props) {
  // Bumping `pulse` remounts the figure groups so their one-shot animations replay.
  const [pulse, setPulse] = useState(0);
  const smileLayer = PORCLOUD_RUNS.map((run) => run.layer).lastIndexOf("figure");

  return (
    <svg
      viewBox={PORCLOUD_VIEWBOX}
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pc-root cursor-pointer overflow-visible", className)}
      onClick={() => setPulse((p) => p + 1)}
    >
      {PORCLOUD_RUNS.map((run, i) => (
        <g key={i}>
          <Run run={run} pulse={pulse} withSmile={i === smileLayer} />
          {i === 0 && <Orbit />}
        </g>
      ))}
    </svg>
  );
}

function Paths({ run }: { run: PorCloudRun }) {
  return (
    <>
      {run.paths.map((p, k) => (
        <path key={k} d={p.d} fill={p.fill} transform={p.transform} />
      ))}
    </>
  );
}

function Run({
  run,
  pulse,
  withSmile,
}: {
  run: PorCloudRun;
  pulse: number;
  withSmile: boolean;
}) {
  if (run.layer === "ring") {
    return (
      <g className="pc-depth" style={{ "--depth": 0.5 } as CSSProperties}>
        <g className="pc-ring-scroll">
          <g className="pc-ring-hover">
            <Paths run={run} />
          </g>
        </g>
      </g>
    );
  }

  if (run.layer === "cloud") {
    return (
      <g className="pc-depth" style={{ "--depth": 1.6 } as CSSProperties}>
        <g className="pc-scroll-y" style={{ "--scroll-y": "18px" } as CSSProperties}>
          <g className="pc-float-cloud">
            <g className="pc-hover-lift">
              <Paths run={run} />
            </g>
          </g>
        </g>
      </g>
    );
  }

  // Figure: depth → scroll → float → shrug (replayed on click) → breath.
  return (
    <g className="pc-depth" style={{ "--depth": 1 } as CSSProperties}>
      <g className="pc-scroll-y" style={{ "--scroll-y": "40px" } as CSSProperties}>
        <g className="pc-float">
          <g
            key={pulse}
            className="pc-shrug"
            style={{ animationDelay: pulse === 0 ? "0.5s" : "0s" }}
          >
            <g className="pc-breath">
              <Paths run={run} />
              {withSmile && (
                <path
                  className="pc-smile"
                  d="M228.6 121.2 Q236 130 243.4 121.2 Z"
                  fill="#FAF4EF"
                  stroke="#2A1F3A"
                  strokeWidth="0.8"
                  strokeLinejoin="round"
                  style={{ animationDelay: pulse === 0 ? "1.1s" : "0s" }}
                />
              )}
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

function Orbit() {
  return (
    <g className="pc-depth" style={{ "--depth": 0.8 } as CSSProperties}>
      <circle
        cx="240"
        cy="210"
        r="232"
        fill="none"
        stroke="#1769ff"
        strokeWidth="1.6"
        strokeDasharray="0.1 11"
        strokeLinecap="round"
        className="pc-orbit"
        opacity="0.75"
      />
    </g>
  );
}
