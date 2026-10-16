/**
 * Zod schema for the /api/contact request body.
 *
 * Server-side only. Mirrors the client `FormState` in
 * `components/contact/ContactForm.tsx`. Adding a field here means
 * adding it there too.
 */

import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Allows letters (incl. Unicode), digits, spaces, and a small set of punctuation.
// Restricting this prevents SMTP header injection via the `replyTo:` and
// `Subject:` fields that interpolate `name` raw.
const NAME_RE = /^[\p{L}\p{N} .,'\-]{1,80}$/u;

export const ContactPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name must be 1–80 characters.")
    .max(80, "Name must be 1–80 characters.")
    .regex(
      NAME_RE,
      "Use letters, numbers, spaces, and basic punctuation only.",
    ),
  email: z
    .string()
    .trim()
    .max(254, "Please enter a valid email.")
    .regex(EMAIL_RE, "Please enter a valid email."),
  message: z
    .string()
    .trim()
    .min(1, "Message must be 1–2000 characters.")
    .max(2000, "Message must be 1–2000 characters."),
  /**
   * Honeypot. Real users never fill this; bots that scrape the DOM and
   * submit every input usually do. Must be empty.
   */
  company: z.string().max(0).optional().default(""),
  /**
   * Milliseconds between form mount and submit. Anything under ~2s is
   * almost certainly a bot. Client sets this; server enforces a minimum.
   */
  elapsedMs: z.number().int().nonnegative(),
});

export type ContactPayload = z.infer<typeof ContactPayloadSchema>;
