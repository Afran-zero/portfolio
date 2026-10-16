"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = { name: "", email: "", message: "" };

type Props = {
  /** Visual tone. `light` (default) renders white fields with dark text.
   *  `dark` renders translucent dark fields with light text for navy /
   *  dark parent surfaces. */
  tone?: "light" | "dark";
};

/**
 * ContactForm — posts to /api/contact, which sends the message via
 * Nodemailer (Gmail SMTP) and replies to the sender's address.
 *
 * Spam protection: hidden honeypot field + minimum time-to-submit (server
 * enforces). Honors the strict CSP via standard same-origin POST.
 */
export function ContactForm({ tone = "light" }: Props) {
  const isDark = tone === "dark";
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  // Honeypot value — must stay empty for legitimate submissions.
  const [company, setCompany] = useState("");

  // Time-to-submit tracking. setRef + ref pattern so we don't trigger a
  // re-render on mount.
  const mountedAtRef = useRef<number>(0);
  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  function update<K extends keyof FormState>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
    if (topError) setTopError(null);
    if (sent) setSent(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTopError(null);
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          company,
          elapsedMs: Date.now() - mountedAtRef.current,
        }),
      });

      const data = (await res.json()) as
        | { ok: true }
        | { ok: false; error: string; field?: keyof FormState };

      if (!res.ok || !data.ok) {
        const err = data as { ok: false; error: string; field?: keyof FormState };
        const fieldErrors: FieldErrors = {};
        if (err.field) {
          fieldErrors[err.field] = err.error;
        }
        setErrors(fieldErrors);
        setTopError(err.error);
        setSubmitting(false);
        return;
      }

      // Success: clear form and show confirmation.
      setValues(INITIAL);
      setCompany("");
      setSent(true);
      setSubmitting(false);
    } catch {
      setTopError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5"
      aria-label="Contact form"
    >
      {/* Honeypot — visually + interactively invisible. Real users won't
          see or fill it; naive bots that submit every input will. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          id="contact-name"
          label="Name"
          value={values.name}
          onChange={(v) => update("name", v)}
          error={errors.name}
          autoComplete="name"
          maxLength={80}
          required
          tone={tone}
        />
        <Field
          id="contact-email"
          label="Email"
          type="email"
          value={values.email}
          onChange={(v) => update("email", v)}
          error={errors.email}
          autoComplete="email"
          required
          tone={tone}
        />
      </div>
      <TextAreaField
        id="contact-message"
        label="Message"
        value={values.message}
        onChange={(v) => update("message", v)}
        error={errors.message}
        maxLength={2000}
        required
        tone={tone}
      />

      {sent && (
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "flex items-center gap-2 border px-4 py-2 font-mono text-xs uppercase tracking-widest",
            isDark
              ? "border-green/60 bg-green/10 text-green-soft"
              : "border-green bg-green-50 text-green-dark",
          )}
        >
          <Check aria-hidden="true" className="h-4 w-4" />
          Message sent. I'll reply to your email shortly.
        </p>
      )}

      {topError && (
        <p
          role="alert"
          className={cn(
            "border px-4 py-2 font-mono text-xs uppercase tracking-widest",
            isDark
              ? "border-blue/60 bg-blue/10 text-blue-soft"
              : "border-blue bg-blue-50 text-blue-dark",
          )}
        >
          {topError}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={cn(
            "font-mono text-[10px] uppercase tracking-widest",
            isDark ? "text-fg-on-dark/70" : "text-fg-muted",
          )}
        >
          Sends directly to my inbox.
        </p>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={submitting}
          className="[&_svg]:h-4 [&_svg]:w-4"
        >
          {submitting ? "Sending…" : sent ? "Send another" : "Send message"}
          {submitting ? (
            <Mail aria-hidden="true" />
          ) : (
            <ArrowRight aria-hidden="true" />
          )}
        </Button>
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: "text" | "email";
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  tone?: "light" | "dark";
};

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  required,
  autoComplete,
  maxLength,
  tone,
}: FieldProps) {
  const isDark = tone === "dark";
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={cn(
          "font-mono text-xs uppercase tracking-widest",
          isDark ? "text-fg-on-dark/70" : "text-fg-muted",
        )}
      >
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-blue">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          "border px-4 py-3 text-base transition-colors",
          isDark
            ? "border-white/20 bg-white/5 text-fg-on-dark placeholder:text-fg-on-dark/40 focus-visible:border-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            : "border-border bg-bg text-fg focus-visible:border-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
          error && "border-blue",
        )}
      />
      {error && (
        <p
          id={`${id}-err`}
          className="font-mono text-[10px] uppercase tracking-widest text-blue-dark"
        >
          {error}
        </p>
      )}
    </div>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  maxLength?: number;
  tone?: "light" | "dark";
};

function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  maxLength,
  tone,
}: TextAreaFieldProps) {
  const isDark = tone === "dark";
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={cn(
          "font-mono text-xs uppercase tracking-widest",
          isDark ? "text-fg-on-dark/70" : "text-fg-muted",
        )}
      >
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-blue">*</span>}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={5}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          "resize-y border px-4 py-3 text-base transition-colors",
          isDark
            ? "border-white/20 bg-white/5 text-fg-on-dark placeholder:text-fg-on-dark/40 focus-visible:border-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            : "border-border bg-bg text-fg focus-visible:border-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
          error && "border-blue",
        )}
      />
      <div className="flex items-center justify-between">
        {error ? (
          <p
            id={`${id}-err`}
            className="font-mono text-[10px] uppercase tracking-widest text-blue-dark"
          >
            {error}
          </p>
        ) : (
          <span />
        )}
        <p
          className={cn(
            "font-mono text-[10px] uppercase tracking-widest",
            isDark ? "text-fg-on-dark/70" : "text-fg-muted",
          )}
        >
          {value.length} / {maxLength ?? 2000}
        </p>
      </div>
    </div>
  );
}