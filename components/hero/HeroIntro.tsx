"use client";

import { motion, useReducedMotion } from "motion/react";
import { RoleTicker } from "@/components/ui/RoleTicker";

type Props = {
  name: string;
  roles: string[];
  className?: string;
};

/**
 * HeroIntro — name + role ticker block in the hero's left card.
 *
 * Small entrance choreography: eyebrow draws in (translateX from a small
 * offset), the name fades + slides up, the role ticker block arrives last
 * with a longer y-offset. Honors prefers-reduced-motion.
 */
export function HeroIntro({ name, roles, className }: Props) {
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

      <h1 className="mt-6 text-display font-medium leading-[0.98] tracking-tight text-fg">
        I'm a
        
        <motion.span
          className="mt-1 block text-[clamp(1.5rem,3vw,2.25rem)] font-normal leading-tight text-blue-dark"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22, ease: [0.2, 0, 0, 1] }}
        >
          <RoleTicker roles={roles} className="text-blue-dark" />
          <span aria-hidden="true">.</span>
        </motion.span>
      </h1>
    </div>
  );
}