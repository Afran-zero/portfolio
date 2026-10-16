"use client";

import { useEffect } from "react";

/**
 * ScrollShapeField — updates a single CSS variable `--scroll-progress` (0..1)
 * as the user scrolls the page. Consuming shapes (e.g. ShapeBackground with
 * parallax) read this and translate accordingly.
 *
 * Reference: skills/2d-object-interactive §8.
 *
 * No-ops under prefers-reduced-motion.
 */
export function ScrollShapeField({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    let raf: number | null = null;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      doc.style.setProperty("--scroll-progress", String(progress));
      raf = null;
    };

    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return <>{children}</>;
}