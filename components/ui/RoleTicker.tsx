"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Roles to cycle through (type → pause → erase → next). */
  roles: string[];
  className?: string;
  /** Typing speed (ms per char). Defaults to 80. */
  typeMs?: number;
  /** Pause duration at full word before erasing. Defaults to 1200. */
  pauseMs?: number;
  /** Erasing speed (ms per char). Defaults to 40. */
  eraseMs?: number;
};

const REDUCED_MOTION_MQ = "(prefers-reduced-motion: reduce)";

/**
 * RoleTicker — typewriter that cycles through `roles`.
 *
 * Animation loop: type current role one char at a time → pause → erase
 * one char at a time → advance to next role → repeat.
 *
 * Honors `prefers-reduced-motion`: when enabled, only the first role is
 * shown, no caret blink, no animation. Falls back to the same DOM so
 * layout doesn't shift.
 *
 * Renders an `aria-live="polite"` region with the current text and a
 * blinking caret. Caret is `aria-hidden`.
 */
export function RoleTicker({
  roles,
  className,
  typeMs = 80,
  pauseMs = 1200,
  eraseMs = 40,
}: Props) {
  const [text, setText] = useState("");
  const indexRef = useRef(0);
  const phaseRef = useRef<"typing" | "pausing" | "erasing">("typing");
  const reducedRef = useRef(false);

  // Detect prefers-reduced-motion without forcing a re-render every cycle.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(REDUCED_MOTION_MQ);
    reducedRef.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Static fallback (reduced motion or no roles) — render first role only.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reducedRef.current || roles.length === 0) {
      setText(roles[0] ?? "");
    }
  }, [roles]);

  // Animation loop.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (roles.length === 0) return;

    let cancelled = false;
    let timeoutId: number | undefined;

    const tick = () => {
      if (cancelled || reducedRef.current) return;
      const role = roles[indexRef.current % roles.length];
      const phase = phaseRef.current;

      if (phase === "typing") {
        if (text.length < role.length) {
          setText(role.slice(0, text.length + 1));
          timeoutId = window.setTimeout(tick, typeMs);
        } else {
          phaseRef.current = "pausing";
          timeoutId = window.setTimeout(tick, pauseMs);
        }
      } else if (phase === "pausing") {
        phaseRef.current = "erasing";
        timeoutId = window.setTimeout(tick, eraseMs);
      } else {
        // erasing
        if (text.length > 0) {
          setText(role.slice(0, text.length - 1));
          timeoutId = window.setTimeout(tick, eraseMs);
        } else {
          indexRef.current = (indexRef.current + 1) % roles.length;
          phaseRef.current = "typing";
          timeoutId = window.setTimeout(tick, typeMs);
        }
      }
    };

    // Kick off on the next frame so initial state is committed first.
    timeoutId = window.setTimeout(tick, typeMs);
    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
    // We intentionally restart when the visible text changes — this is the
    // simplest correct loop for a typewriter. Phase/index live across renders.
  }, [text, roles, typeMs, pauseMs, eraseMs]);

  return (
    <span
      aria-live="polite"
      className={cn(
        "relative inline-flex items-baseline whitespace-nowrap",
        className,
      )}
    >
      <span>{text}</span>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block h-[0.95em] w-[0.06em] translate-y-[0.05em] bg-current animate-caret"
      />
    </span>
  );
}