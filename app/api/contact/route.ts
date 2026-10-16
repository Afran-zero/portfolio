import { NextResponse } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";

import { getContact } from "@/lib/content";
import { ContactPayloadSchema } from "@/lib/contact-schema";

/**
 * /api/contact — server-side handler for the contact form.
 *
 * Validates the payload, runs lightweight spam checks (honeypot +
 * minimum time-to-submit), then sends a plain-text + HTML email to the
 * site owner via Gmail SMTP using Nodemailer. The reply-to is set to the
 * sender's address so the owner can hit Reply in Gmail and respond.
 *
 * Auth via Gmail App Password (NOT the account password). See .env.local
 * for setup. The SMTP transporter is reused across requests.
 *
 * Strict CSP / same-origin POST. No third-party mail provider.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_SUBMIT_MS = 2000; // humans take longer; bots usually don't
const MAX_SUBMIT_MS = 30 * 60 * 1000; // 30 min — stale tabs / pre-filled forms
const RATE_LIMIT_PER_HOUR = 5;
const RATE_LIMIT_KEY_PREFIX = "kaif:contact";
const RATE_WINDOW_MS = 3_600_000;

type SuccessBody = { ok: true };
type ErrorBody = {
  ok: false;
  error: string;
  field?: "name" | "email" | "message";
};

// ---- Spam throttle ----
//
// In production (serverless), an in-process rate limit is useless because
// each cold instance starts at 0. When UPSTASH_REDIS_REST_URL +
// UPSTASH_REDIS_REST_TOKEN are set, we route through @upstash/ratelimit
// (sliding window, 5 submissions per hour per IP). When they are not set
// (local dev without Redis), we fall back to an in-process ring buffer so
// the route still functions.
//
// Both branches return `true` when the request is allowed, `false` when
// the caller should be told to slow down.

type Limiter = (ip: string) => Promise<boolean>;
let cachedLimiter: Limiter | null = null;

async function getLimiter(): Promise<Limiter> {
  if (cachedLimiter) return cachedLimiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    const { Redis } = await import("@upstash/redis");
    const { Ratelimit } = await import("@upstash/ratelimit");
    const redis = new Redis({ url, token });
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_PER_HOUR, "1 h"),
      analytics: false,
      prefix: RATE_LIMIT_KEY_PREFIX,
    });
    cachedLimiter = async (ip) => (await limiter.limit(ip)).success;
    return cachedLimiter;
  }

  // Fallback: in-process ring buffer keyed by IP. Bounded per-key; the
  // worst-case memory is O(active IPs × RATE_LIMIT_PER_HOUR).
  const windows = new Map<string, number[]>();
  cachedLimiter = async (ip) => {
    const now = Date.now();
    const cutoff = now - RATE_WINDOW_MS;
    const stamps = (windows.get(ip) ?? []).filter((t) => t >= cutoff);
    if (stamps.length >= RATE_LIMIT_PER_HOUR) {
      windows.set(ip, stamps);
      return false;
    }
    stamps.push(now);
    windows.set(ip, stamps);
    return true;
  };
  return cachedLimiter;
}

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ---- Transporter (lazy, reused) ----

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Mail is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local.",
    );
  }

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return cachedTransporter;
}

function bad(
  status: number,
  error: string,
  field?: ErrorBody["field"],
): NextResponse<ErrorBody> {
  return NextResponse.json({ ok: false, error, field }, { status });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(
  req: Request,
): Promise<NextResponse<ErrorBody | SuccessBody>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return bad(400, "Invalid JSON body.");
  }

  const parsed = ContactPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = (issue?.path[0] ?? undefined) as ErrorBody["field"];
    return bad(400, issue?.message ?? "Invalid input.", field);
  }
  const { name, email, message, company, elapsedMs } = parsed.data;

  // Honeypot must be empty — return 200 to avoid leaking the rule, but don't send.
  if (company && company.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (elapsedMs < MIN_SUBMIT_MS || elapsedMs > MAX_SUBMIT_MS) {
    return bad(400, "Please take a moment before submitting.");
  }

  // Resolve recipient + rate-limit in parallel: neither depends on the other.
  const ip = clientIp(req);
  const [limiter, contact] = await Promise.all([getLimiter(), getContact()]);

  if (!(await limiter(ip))) {
    return bad(429, "Too many submissions. Please try again later.");
  }

  const to = contact.email;
  if (!to) {
    return bad(500, "Contact email is not configured on the server.");
  }

  const fromUser = process.env.GMAIL_USER;
  if (!fromUser) {
    return bad(500, "Mail sender is not configured on the server.");
  }

  const subject = `Portfolio contact: ${name}`;
  const text =
    `From: ${name} <${email}>\n\n` +
    `${message}\n\n` +
    `--\nSent from the portfolio contact form.`;

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height: 1.6; color: #111;">
      <p style="margin:0 0 16px;">
        <strong>From:</strong> ${escapeHtml(name)}
        &lt;<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>&gt;
      </p>
      <hr style="border:none; border-top:1px solid #e5e5e5; margin:0 0 16px;" />
      <p style="margin:0 0 16px; white-space:pre-wrap;">${escapeHtml(message)}</p>
      <hr style="border:none; border-top:1px solid #e5e5e5; margin:16px 0;" />
      <p style="margin:0; font-size:12px; color:#666;">
        Sent from the portfolio contact form.
      </p>
    </div>
  `.trim();

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Portfolio Contact" <${fromUser}>`,
      to,
      replyTo: `${name} <${email}>`,
      subject,
      text,
      html,
      // Defensive headers to discourage auto-replies / loops.
      headers: {
        "X-Mailer": "kaif-portfolio-contact-form",
        "Auto-Submitted": "no",
      },
    });
  } catch (err) {
    // Don't leak the underlying SMTP error to the client.
    console.error("[contact] send failed:", err);
    return bad(500, "Could not send your message. Please try again later.");
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}