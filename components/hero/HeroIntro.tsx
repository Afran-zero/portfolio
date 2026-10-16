"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  name: string;
  className?: string;
};

/**
 * HeroIntro — greeting, name and headline for the home hero.
 *
 * Entrance: greeting slides in, then the name, then the headline. Honors
 * prefers-reduced-motion.
 */
export function HeroIntro({ name, className }: Props) {
  const reduced = useReducedMotion();

  return (
    <div className={className}>
      <motion.p
        className="font-mono text-xs uppercase tracking-widest text-blue-dark md:text-sm"
        initial={reduced ? false : { opacity: 0, x: -8 }}
        animate={reduced ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
      >
        Hello, I&rsquo;m
      </motion.p>

      <motion.p
        className="mt-2 text-2xl font-medium leading-tight tracking-tight text-fg md:text-3xl"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0, 0, 1] }}
      >
        {name}
      </motion.p>

      <motion.h1
        className="mt-6 text-display font-medium leading-[0.98] tracking-tight text-fg"
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.2, 0, 0, 1] }}
      >
        AI and data engineer.
      </motion.h1>
    </div>
  );
}
