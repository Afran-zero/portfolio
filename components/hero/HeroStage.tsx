"use client";

import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { PorCloud } from "./PorCloud";

/**
 * HeroStage — right-hand hero panel: a dot field and glow that follow the
 * cursor, with the animated PorCloud portrait on top.
 *
 * Cursor position is lerped into CSS variables on the stage element:
 *   --cx / --cy   cursor position inside the stage (px)
 *   --dx / --dy   small offset applied to the dot field (parallax)
 *   --glow        0..1 presence of the cursor inside the stage
 * The "hot" dot layer is revealed with a radial mask centred on the cursor,
 * so dots near the pointer light up blue. Scroll drift comes from
 * --scroll-progress (ScrollShapeField).
 *
 * Only runs for fine pointers without reduced motion; otherwise the dots
 * stay static and the portrait keeps its idle animation.
 */
export function HeroStage({ children }: { children?: ReactNode }) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const target = { x: 0, y: 0, active: 0 };
    const current = { x: 0, y: 0, active: 0 };
    let raf = 0;

    const centre = () => ({ x: el.clientWidth / 2, y: el.clientHeight / 2 });
    target.x = centre().x;
    target.y = centre().y;
    current.x = target.x;
    current.y = target.y;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
    };
    const onEnter = () => {
      target.active = 1;
    };
    const onLeave = () => {
      target.active = 0;
    };

    const step = () => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      current.active += (target.active - current.active) * 0.08;

      const c = centre();
      el.style.setProperty("--cx", `${current.x.toFixed(1)}px`);
      el.style.setProperty("--cy", `${current.y.toFixed(1)}px`);
      el.style.setProperty("--dx", `${((current.x - c.x) * 0.04).toFixed(2)}px`);
      el.style.setProperty("--dy", `${((current.y - c.y) * 0.04).toFixed(2)}px`);
      el.style.setProperty("--glow", current.active.toFixed(3));
      raf = requestAnimationFrame(step);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(step);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const dotPattern = (id: string, fill: string, radius: number) => (
    <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="9" cy="9" r={radius} fill={fill} />
    </pattern>
  );

  return (
    <div
      ref={ref}
      className="hero-stage relative isolate flex min-h-[360px] items-center justify-center overflow-hidden py-6 md:col-span-5 md:min-h-[410px] md:py-8"
      style={
        {
          "--cx": "50%",
          "--cy": "50%",
          "--dx": "0px",
          "--dy": "0px",
          "--glow": "0",
        } as CSSProperties
      }
    >
      {/* Dot field: dim base layer + blue layer revealed around the cursor. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 z-0"
        style={{
          transform:
            "translate(var(--dx), calc(var(--dy) + var(--scroll-progress, 0) * -24px))",
        }}
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {dotPattern(`${uid}-dots`, "rgba(17,17,17,0.16)", 1.1)}
            {dotPattern(`${uid}-hot`, "#1769ff", 1.6)}
          </defs>
          <rect width="100%" height="100%" fill={`url(#${uid}-dots)`} />
        </svg>
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            maskImage:
              "radial-gradient(circle 150px at var(--cx) var(--cy), #000 0%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle 150px at var(--cx) var(--cy), #000 0%, transparent 100%)",
          }}
        >
          <rect width="100%" height="100%" fill={`url(#${uid}-hot)`} />
        </svg>
      </div>

      {/* Soft glow that trails the cursor. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 h-[280px] w-[280px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(23,105,255,0.28), rgba(23,105,255,0) 100%)",
          transform: "translate(calc(var(--cx) - 50%), calc(var(--cy) - 50%))",
          opacity: "var(--glow)",
        }}
      />

      <div className="relative z-10 flex h-auto w-full max-w-[400px] flex-col items-center justify-center md:max-w-[440px]">
        <PorCloud className="h-[390px] w-[360px] md:h-[470px] md:w-[434px]" />
        {children}
      </div>
    </div>
  );
}
