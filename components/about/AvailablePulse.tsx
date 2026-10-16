"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  text?: string;
  className?: string;
};

/**
 * AvailablePulse — gently breathes the word "Available" so the eye lands
 * on the call-to-action. The animation is a slow scale + opacity cycle,
 * matched to the avatar's breathing pace.
 *
 * Honors `prefers-reduced-motion`: renders the text without movement.
 */
export function AvailablePulse({ text = "Available", className }: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className={cn("inline-block", className)}
      aria-label={text}
      animate={
        reduced
          ? undefined
          : { opacity: [0.7, 1, 0.7], scale: [1, 1.04, 1] }
      }
      transition={
        reduced
          ? undefined
          : { duration: 3.2, ease: "easeInOut", repeat: Infinity }
      }
    >
      {text}
    </motion.span>
  );
}