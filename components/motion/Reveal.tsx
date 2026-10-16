"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  /** Translate Y distance (px). Default 8. */
  y?: number;
  className?: string;
};

/**
 * Reveal — fades + slides children in once when they scroll into view.
 *
 * Initial state is rendered visible on the server (no opacity:0 in SSR
 * HTML) so content stays readable before JS hydration. The motion
 * transform is only applied after mount, then driven by `whileInView`.
 *
 * Short-circuits under prefers-reduced-motion.
 * Reference: skills/2d-object-interactive §14.
 */
export function Reveal({ children, delay = 0, y = 8, className }: Props) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (reduced) return <div className={className}>{children}</div>;
  if (!mounted) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}