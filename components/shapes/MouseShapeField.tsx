"use client";

import { useEffect, useRef } from "react";

const LERP = 0.08;
const MAX_OFFSET = 6; // px — subtle, per skills/2d-object-interactive §7

/**
 * MouseShapeField — single rAF loop that drives two CSS variables
 * (`--mx`, `--my`) for any descendant with `transform: translate(var(--mx), var(--my))`.
 *
 * Reference: skills/2d-object-interactive §7.
 *
 * Behavior:
 *  - Single passive pointermove listener.
 *  - One rAF loop, lerps toward target.
 *  - Pauses when document is hidden.
 *  - No-op under prefers-reduced-motion (the consumer decides).
 */
export function MouseShapeField({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const paused = useRef(false);

  useEffect(() => {
    // No-op under reduced-motion and on coarse pointers (touch devices).
    // The pointermove rAF loop would otherwise burn main-thread cycles on
    // devices where the user has no fine pointer.
    const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerMql = window.matchMedia("(pointer: fine)");
    if (motionMql.matches || !pointerMql.matches) return;

    const onPointer = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      // Normalize to -1..1.
      target.current.x = (e.clientX / w) * 2 - 1;
      target.current.y = (e.clientY / h) * 2 - 1;
    };

    const step = () => {
      current.current.x += (target.current.x - current.current.x) * LERP;
      current.current.y += (target.current.y - current.current.y) * LERP;
      const el = ref.current;
      if (el) {
        el.style.setProperty("--mx", `${(current.current.x * MAX_OFFSET).toFixed(2)}px`);
        el.style.setProperty("--my", `${(current.current.y * MAX_OFFSET).toFixed(2)}px`);
      }
      raf.current = requestAnimationFrame(step);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        paused.current = true;
        if (raf.current) {
          cancelAnimationFrame(raf.current);
          raf.current = null;
        }
      } else if (paused.current) {
        paused.current = false;
        raf.current = requestAnimationFrame(step);
      }
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div ref={ref} className="[--mx:0px] [--my:0px]">
      {children}
    </div>
  );
}