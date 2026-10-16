"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import {
  useAnimate,
  useInView,
  useReducedMotion,
  type AnimationPlaybackControls,
  type DOMKeyframesDefinition,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { BodyArt, FaceArt, SILHOUETTE_D } from "./AvatarArt";

/**
 * Animated portfolio avatar.
 *
 * Timeline
 *   0.5s   glance left, swing back right, settle into the original pose (spring)
 *   +4s    first emote: two nods, then a small shoulder shake
 *   then   random emote every 9-13s (nod / shoulder shake / both)
 *   always slow breathing
 *
 * Pauses when scrolled off-screen. Static pose under prefers-reduced-motion.
 */

// Head and body are the same artwork clipped two ways, cut along the neck skin so a
// slightly turned head never exposes shirt. The body layer overlaps the cut by 1px
// (no antialias seam) and a skin-coloured filler sits under the head to cover any gap.
const HEAD_CLIP = "M150 0H320V127H256L206 131H150Z";
const BODY_CLIP = "M0 130H206L256 126H500V500H0Z";
const NECK_FILL = "M208 108H262V136H208Z";
const NECK_SKIN = "#FB985A";

const EASE: [number, number, number, number] = [0.45, 0, 0.25, 1];

// Pivot points. Each moving part carries a full-canvas invisible rect, so its
// fill-box is the whole 500x500 viewBox and these percentages are viewBox fractions.
const pivot = (xPct: number, yPct: number): CSSProperties => ({
  transformBox: "fill-box",
  transformOrigin: `${xPct}% ${yPct}%`,
});
const HEAD_PIVOT = pivot(50, 26); // on the neck cut (250, 130)
const TORSO_PIVOT = pivot(50, 76); // hips          (250, 380)
const BREATH_PIVOT = pivot(50, 100); // feet stay planted

const sel = (part: string) => `[data-part="${part}"]`;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

type Props = {
  className?: string;
  /** Accessible description. */
  label?: string;
  /**
   * Frame shape. `"circle"` clips the SVG to a circle and adds a soft
   * ground shadow so the rectangular viewBox never shows the pale halo
   * or the flat-cut feet at the bottom edge. Default `"default"`.
   */
  shape?: "default" | "circle";
};

export default function Avatar({
  className,
  label = "Illustration of me, arms crossed, wearing sunglasses",
  shape = "default",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const [scope, animate] = useAnimate<SVGSVGElement>();
  const inView = useInView(scope, { amount: 0.25 });
  const reduceMotion = useReducedMotion();
  const introPlayed = useRef(false);

  useEffect(() => {
    if (reduceMotion || !inView || !scope.current) return;

    // Capture the scope ref once: by cleanup time the ref may point at a
    // different (or unmounted) node.
    const target = scope.current;
    let cancelled = false;
    const timers = new Set<number>();
    const running = new Set<AnimationPlaybackControls>();

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(() => {
          timers.delete(t);
          resolve();
        }, ms);
        timers.add(t);
      });

    const play = (
      part: string,
      keyframes: DOMKeyframesDefinition,
      options: Record<string, unknown> = {},
    ) => {
      const c = animate(sel(part), keyframes as never, options as never);
      running.add(c);
      return c;
    };

    // ---- motion pieces -------------------------------------------------------

    const glance = (rot: number, headX: number, faceX: number, torsoRot: number, duration: number) =>
      Promise.all([
        play("head", { rotate: rot, x: headX }, { duration, ease: EASE }),
        play("face", { x: faceX }, { duration, ease: EASE }),
        play("torso", { rotate: torsoRot }, { duration, ease: EASE }),
      ]);

    const intro = async () => {
      await wait(500);
      await glance(-5, -2, -3, -1, 0.9); // look away
      if (cancelled) return;
      await wait(250);
      await glance(4.5, 2, 3, 1, 1.0); // swing back past the pose
      if (cancelled) return;
      await wait(200);
      const spring = { type: "spring", stiffness: 110, damping: 11 };
      await Promise.all([
        play("head", { rotate: 0, x: 0 }, spring),
        play("face", { x: 0 }, spring),
        play("torso", { rotate: 0 }, spring),
      ]); // settle into the drawn pose
    };

    const nod = async () => {
      for (let i = 0; i < 2; i++) {
        await play("head", { y: 5, rotate: 2.8 }, { duration: 0.24, ease: "easeOut" });
        if (cancelled) return;
        await play("head", { y: 0, rotate: 0 }, { duration: 0.34, ease: "easeInOut" });
        if (cancelled) return;
      }
    };

    const shoulders = async () => {
      await Promise.all([
        play(
          "torso",
          { rotate: [0, -2, 2, -1.5, 1.2, -0.6, 0], y: [0, -2, 1, -1.5, 0.8, -0.3, 0] },
          { duration: 1.25, ease: "easeInOut" },
        ),
        play(
          "head",
          { rotate: [0, 1, -1, 0.8, -0.8, 0.2, 0] },
          { duration: 1.25, ease: "easeInOut" },
        ),
      ]);
    };

    const emotes = [nod, shoulders, async () => { await nod(); await wait(150); await shoulders(); }];

    // ---- run -----------------------------------------------------------------

    // Breathing never stops while visible.
    play(
      "breath",
      { scaleY: [1, 1.015, 1] },
      { duration: 3.2, ease: "easeInOut", repeat: Infinity },
    );

    (async () => {
      if (!introPlayed.current) {
        await intro();
        if (cancelled) return;
        introPlayed.current = true;
        await wait(1800);
        if (cancelled) return;
        await nod();
        await wait(150);
        if (cancelled) return;
        await shoulders();
      }
      while (!cancelled) {
        await wait(rand(5000, 8000));
        if (cancelled) return;
        await emotes[Math.floor(Math.random() * emotes.length)]();
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      running.forEach((c) => c.stop());
      // Ease everything back to the drawn pose so a pause never freezes mid-gesture.
      if (target) {
        animate(sel("head"), { x: 0, y: 0, rotate: 0 }, { duration: 0.3 });
        animate(sel("face"), { x: 0 }, { duration: 0.3 });
        animate(sel("torso"), { x: 0, y: 0, rotate: 0 }, { duration: 0.3 });
        animate(sel("breath"), { scaleY: 1 }, { duration: 0.3 });
      }
    };
  }, [inView, reduceMotion, animate, scope, uid]);

  const clip = (name: string) => `url(#${uid}-${name})`;

  const svg = (
    <svg
      ref={scope}
      viewBox="0 0 500 500"
      className={className}
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={`${uid}-sil`}>
          <path d={SILHOUETTE_D} />
        </clipPath>
        <clipPath id={`${uid}-head`}>
          <path d={HEAD_CLIP} />
        </clipPath>
        <clipPath id={`${uid}-body`}>
          <path d={BODY_CLIP} />
        </clipPath>
        {/* Whole figure, minus sunglasses, minus the dark disc behind it. */}
        <g id={`${uid}-art`} clipPath={clip("sil")}>
          <BodyArt />
        </g>
      </defs>

      <g data-part="breath" className="avatar-breath" style={BREATH_PIVOT}>
        <rect width="500" height="500" fill="none" pointerEvents="none" />
        <g data-part="torso" className="avatar-torso-motion" style={TORSO_PIVOT}>
          <rect width="500" height="500" fill="none" pointerEvents="none" />

          <path d={NECK_FILL} fill={NECK_SKIN} />
          <g clipPath={clip("body")}>
            <use href={`#${uid}-art`} />
          </g>

          {/* Head sits on top; its bottom edge lands on neck skin. */}
            <g data-part="head" className="avatar-head-motion" style={HEAD_PIVOT}>
            <rect width="500" height="500" fill="none" pointerEvents="none" />
            <g clipPath={clip("head")}>
              <use href={`#${uid}-art`} />
              <g data-part="face">
                <FaceArt />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );

  if (shape !== "circle") return svg;

  return (
    <div
      className={cn(
        "relative [clip-path:circle(50%_at_50%_55%)]",
        className,
      )}
    >
      {/* SVG needs explicit h-full to fill the clipped wrapper. */}
      <div className="h-full w-full">{svg}</div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[80%] h-8 w-3/4 -translate-x-1/2 rounded-full bg-fg/25 opacity-40 blur-md"
      />
    </div>
  );
}
