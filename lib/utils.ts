import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names safely with Tailwind merge.
 * Use everywhere classes are composed.
 *
 * @example
 *   cn("p-4", isActive && "bg-blue", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}