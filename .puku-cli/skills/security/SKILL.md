---
name: security
description: Security playbook for the Kaif portfolio — threat model, CSP, security headers, dependency hygiene, secret management, supply-chain, and CI checks. Load when reviewing dependencies, headers, build config, or any code that touches secrets/auth/network.
---

# Security Skill

This skill is the security baseline for the **Kaif portfolio**. The site is a static personal portfolio, but "static" does not mean "uninteresting to attackers". A compromised portfolio becomes a phishing surface for every visitor — including recruiters, professors, and academic peers.

Load this skill when:

- Adding or upgrading dependencies.
- Touching `next.config.ts`, `vercel.json`, or any header config.
- Adding any client-side script, fetch, or form.
- Reviewing a PR for security regressions.
- Investigating a CVE or supply-chain alert.
- Wiring up any feature that requires environment variables, tokens, or auth.

The architectural plan is in `PLAN.md`. This skill encodes the **enforceable rules**.

---

## 1. Threat model

### What we are protecting

- The integrity of the **deployed site** (defacement, drive-by malware, supply-chain injection).
- The **visitor's trust** (so a recruiter clicking the link doesn't get a phishing warning).
- The **owner** (Kaif — no leaks of his data beyond what's already public).
- The **repository** (no leaked secrets, no malicious code in history).

### What we are NOT protecting

- The owner against a determined, targeted attacker with access to his GitHub account. Use 2FA + hardware key.
- The visitor's downstream browsing (we don't control that).
- The portfolio against DDoS at the Vercel edge (Vercel mitigates).

### Attacker profile (realistic)

- Automated bots scanning for `.env` files, exposed tokens, and known CVEs.
- Opportunistic supply-chain attackers (typosquatted packages).
- SEO spammers trying to inject links into the static HTML at build time.
- Less common: targeted phishing, given the academic context.

### Primary attack vectors

1. **Supply chain** — compromised npm dependency.
2. **Build-time injection** — malicious postinstall script in a dependency.
3. **Secret leakage** — committed API keys, tokens, `.env` files.
4. **Misconfigured headers** — missing CSP, missing HSTS, allowing `unsafe-inline` scripts.
5. **Third-party scripts** — XSS via a chat widget, analytics, or CDN.
6. **Form abuse** (v2+) — contact form spam, email injection.

---

## 2. Hard security rules (v1)

The following are **non-negotiable** in the v1 portfolio.

### No secrets in the repo

- No `.env` files committed. `.env*.local` is gitignored.
- No API keys, OAuth secrets, or service tokens anywhere in source.
- No client-side secrets (if it runs in the browser, it's public).
- No tokens in git history (use `git filter-repo` to scrub if leaked).

```gitignore
# .gitignore (required)
.env
.env.local
.env.*.local
*.pem
*.key
*.crt
.vercel
```

### No third-party scripts

- No analytics (Google, Plausible, PostHog, etc.).
- No chat widgets (Intercom, Crisp, etc.).
- No external font CDNs.
- No error reporting (Sentry, Bugsnag, etc.) — not for v1.

The only requests the browser makes are: **same-origin HTML/CSS/JS** and **same-origin static assets**.

### No database, no auth, no API

- v1 is a static site. There is no server-side state.
- No login. No contact form backend (form is static or a `mailto:`).
- No server actions that mutate data.

### No user input rendered without sanitization

- v1 has no user input. The contact section uses a `mailto:` link or a static form posting to a third party **only** in v2 — and **only** behind a CAPTCHA + rate limit.
- If Markdown/HTML is ever rendered from YAML, it **must** be sanitized with `DOMPurify` or a server-side sanitizer, never `dangerouslySetInnerHTML` with raw content.

### No telemetry from the user

- No cookies set by the site (v1).
- No `localStorage` of PII.
- No fingerprinting.

---

## 3. Content Security Policy (CSP)

### Goal

Block any injected script from running. Allow only same-origin assets.

### Policy (strict, v1)

```ts
// next.config.ts
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",   // Tailwind injects style tags
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");
```

### Important

- **No `'unsafe-eval'`**. We do not need it.
- **No `'unsafe-inline'` for scripts**. We do not need it.
- `'unsafe-inline'` for styles is acceptable because Tailwind emits `<style>` tags during SSR. If we eliminate that, we tighten further.
- We can drop `data:` from `img-src` if we never inline images.

### Deployment

- Set the CSP via **HTTP response header** (`Content-Security-Policy`), not a `<meta>` tag.
- Test in **report-only** mode first, then enforce:

```ts
headers: [
  {
    key: "Content-Security-Policy-Report-Only",
    value: csp, // ship this first
  },
],
```

After a week of zero reports, swap to `Content-Security-Policy`.

### Verification

```bash
curl -I https://kaif.dev | grep -i content-security
```

---

## 4. Security headers (full set)

```ts
// next.config.ts
const securityHeaders = [
  // CSP — see section 3
  { key: "Content-Security-Policy", value: csp },

  // Clickjacking
  { key: "X-Frame-Options", value: "DENY" },

  // MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Referrer
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Permissions — disable powerful APIs we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },

  // HSTS (Vercel sets this too, but be explicit)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },

  // Cross-origin isolation (defense in depth)
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Origin-Agent-Cluster", value: "?1" },
];
```

### Verification

- `securityheaders.com` — target **A+** rating.
- `Mozilla Observatory` — target **A+** rating.

---

## 5. Dependency hygiene

### The risk

Every npm dependency is a potential supply-chain attack surface. `pnpm install` runs `preinstall`, `install`, and `postinstall` scripts. A compromised popular package can run arbitrary code on the build machine.

### Rules

1. **Use `pnpm`**, not `npm` or `yarn`. pnpm is stricter and faster.
2. **Commit the lockfile** (`pnpm-lock.yaml`). Always.
3. **Pin exact versions** in `package.json` for production deps. No `^` or `~`.
4. **No `*` or `latest`** in any dependency spec.
5. **No postinstall scripts** in dependencies, ever. If a required dep uses one, fork or replace.
6. **Audit weekly** with `pnpm audit` (run in CI).
7. **Dependabot enabled** on the GitHub repo for security updates.
8. **Renovate** (optional) for grouped, tested PRs.

### Allow-list of dependencies

The portfolio should use a **small, vetted** dependency set. Anything new must be justified in the PR.

```text
Production:
- next
- react
- react-dom
- next/font (built-in)
- tailwindcss
- @tailwindcss/postcss
- clsx
- tailwind-merge
- lucide-react
- gray-matter
- yaml
- zod
- motion (formerly framer-motion)

Dev:
- typescript
- @types/*
- eslint
- eslint-config-next
- prettier
- @next/bundle-analyzer
- vitest (if used)
- @playwright/test (if used)
```

Anything outside this list is **rejected** unless explicitly approved with rationale.

### Pre-install script blocking

```json
// package.json
{
  "pnpm": {
    "onlyBuiltDependencies": []
  }
}
```

This makes pnpm **refuse** to run any package's build script. The `sharp` native module is the most common exception — if it's needed, list it explicitly and only it.

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["sharp"]
  }
}
```

### CI: dependency audit

```yaml
# .github/workflows/ci.yml (excerpt)
- name: Audit dependencies
  run: pnpm audit --prod --audit-level=high
```

Fail the build on any high/critical advisory.

### CI: lockfile check

```yaml
- name: Verify lockfile
  run: |
    pnpm install --frozen-lockfile
    git diff --exit-code pnpm-lock.yaml
```

The lockfile must not change without an explicit `pnpm install` commit.

---

## 6. Repository hygiene

### GitHub settings

- **Branch protection on `main`**: require PR + review + passing CI + linear history.
- **No force-push** to `main`.
- **No direct pushes** to `main`.
- **Signed commits** recommended (not enforced).
- **Secret scanning**: enabled (GitHub default).
- **Push protection**: enabled (GitHub default — blocks secrets in pushes).
- **Dependabot security updates**: enabled.
- **Dependabot version updates**: enabled, weekly.
- **Code scanning (CodeQL)**: enabled.

### `.gitignore` (required)

```gitignore
# Environment
.env
.env.local
.env.*.local

# Vercel
.vercel

# OS
.DS_Store
Thumbs.db

# Editors
.idea/
.vscode/
*.swp

# Build
.next/
out/
node_modules/

# Logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*

# Test
coverage/

# Secrets
*.pem
*.key
*.crt
*.p12
```

### Commit signing

- Encouraged: SSH-signed commits or GPG-signed commits.
- Not enforced: friction > value for a single-author repo.

---

## 7. Build-time security

### Build environment

- The Vercel build environment is ephemeral. No long-lived secrets.
- All env vars are scoped to the deployment environment (`Production`, `Preview`, `Development`).
- No `NEXT_PUBLIC_*` variables in v1 (we have no client-side env needs).

### Postinstall script policy

- `pnpm` is configured to **not run any package build scripts** (`onlyBuiltDependencies: []`).
- If a package needs a build step, it must be justified and added explicitly.
- After `pnpm install`, run `pnpm rebuild` only if absolutely necessary.

### Static analysis

Run on every PR:

- `pnpm lint` (ESLint + Next.js rules).
- `pnpm typecheck` (TypeScript strict).
- `pnpm audit` (dependency check).
- `codeql` analysis (GitHub default).

---

## 8. Runtime security

### What runs in the browser

- React 19 + Next.js client runtime.
- A handful of `motion` components.
- The mobile menu's `useState` and event handlers.
- The shape system's `requestAnimationFrame` loops.

### What does NOT run in the browser

- No `eval`, no `Function(...)`, no `setTimeout(string, ...)`.
- No `dangerouslySetInnerHTML` with untrusted input.
- No `document.write`.
- No `window.open` for arbitrary URLs (only for `mailto:` and `github.com` etc., which are explicit constants).
- No `fetch` to third-party origins.

### External links

All `target="_blank"` links must include `rel="noopener noreferrer"`.

```tsx
<a
  href="https://github.com/kaif"
  target="_blank"
  rel="noopener noreferrer"
>
  GitHub
</a>
```

### URL handling

- Never `dangerouslySetInnerHTML` an `href` from YAML.
- Validate all URLs from YAML at build time with Zod:

```ts
const LinkSchema = z.object({
  href: z.string().url().refine(
    (u) => /^https?:\/\//.test(u),
    { message: "Links must be http(s)" }
  ),
});
```

---

## 9. Forms (v2 — preview)

The v1 portfolio has **no form**. If a contact form is added in v2:

- **Server-side validation** (Zod) on every field.
- **Rate limit** at the edge (Vercel Edge Middleware).
- **CAPTCHA or honeypot** (Cloudflare Turnstile, hCaptcha, or a hidden field).
- **No PII in logs**.
- **CSRF protection** if using cookies.
- **Email injection prevention** if relaying to email.
- **Time-to-submit check** (reject sub-3-second submissions as bots).
- **Honeypot field** (a hidden input that bots fill, humans don't).
- **Strict Content-Type**: `application/json` or `application/x-www-form-urlencoded`.

---

## 10. Authentication (v2 — preview)

Not used in v1. If added (e.g., a private preview of publications):

- **OAuth via a known provider** (GitHub, Google). No custom password auth.
- **No JWT in `localStorage`** — use httpOnly, secure cookies.
- **Session expiration**: ≤ 24h sliding, 7d absolute.
- **No "remember me"** unless explicitly required.
- **MFA** on the owner account.
- **No secrets in code**. Use `process.env` with strict scoping.

---

## 11. Secrets management (v1)

The v1 portfolio has **zero secrets**. If/when secrets are required:

- Use **Vercel Environment Variables** (encrypted at rest, scoped per env).
- Never commit `.env*` files.
- Never echo secrets in logs.
- Rotate any secret that's ever been exposed.
- Prefer **short-lived tokens** over long-lived API keys.
- For local development, document required vars in `.env.example` (committed, no values).

```text
# .env.example (committed, no values)
# NEXT_PUBLIC_SITE_URL=https://kaif.dev
# GITHUB_TOKEN=                (server-side only, never NEXT_PUBLIC_*)
```

---

## 12. CI / pre-deploy security checks

A CI job runs on every PR:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }

      - name: Install (frozen lockfile)
        run: pnpm install --frozen-lockfile

      - name: Audit dependencies
        run: pnpm audit --prod --audit-level=high

      - name: Detect postinstall scripts
        run: |
          if grep -E '"(preinstall|postinstall|install)"\s*:' package.json; then
            echo "::error::Lifecycle scripts in package.json are not allowed."
            exit 1
          fi

      - name: Detect secrets (gitleaks)
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Build
        run: pnpm build

      - name: Verify CSP and headers
        run: |
          pnpm start &
          sleep 5
          curl -sI http://localhost:3000 | grep -iE "content-security|strict-transport|x-frame|referrer|permissions-policy"
```

A weekly scheduled job:

- `pnpm audit --prod --audit-level=moderate`
- Dependabot PR review
- `vercel deploy --prod` is gated on the weekly run succeeding.

---

## 13. Incident response

### If a dependency is compromised

1. **Identify the blast radius** — which versions, which builds.
2. **Pin to the last known-good version** or remove the dependency.
3. **Force-redeploy** on Vercel to invalidate any cached build artifacts.
4. **Check deployed HTML** for injected content (Curl the site, grep for known bad signatures).
5. **Rotate** any secrets that were accessible to the compromised code.
6. **Post-mortem** in a private doc. Update this skill with the lesson.

### If a secret is committed

1. **Rotate** the secret immediately (treat it as burned).
2. **Remove from history**: `git filter-repo --invert-paths --path <file>`.
3. **Force-push** the rewritten history (only if no one else has cloned).
4. **Notify** anyone who may have pulled.
5. **Audit Vercel build logs** for the secret's exposure.

### If the site is defaced

1. **Roll back** to the last known-good Vercel deployment.
2. **Audit git log** for the malicious commit.
3. **Force-push** the rollback if needed.
4. **Investigate** how the change was merged (compromised token, leaked GitHub credentials).
5. **Rotate** all credentials.
6. **Write a public post-mortem** if user trust was affected.

---

## 14. OWASP top 10 (portfolio-relevant subset)

| Risk                                | Mitigation in this repo                                    |
| ----------------------------------- | ---------------------------------------------------------- |
| A01 Broken Access Control           | No auth in v1; auth in v2 is OAuth + httpOnly cookies.     |
| A02 Cryptographic Failures          | HTTPS via Vercel + HSTS. No plaintext secrets.             |
| A03 Injection                       | No user input → no SQLi / command injection. No `dangerouslySetInnerHTML` on user content. |
| A04 Insecure Design                 | Static-only architecture, no DB, no server-side state.     |
| A05 Security Misconfiguration       | Strict CSP, full security headers, locked-down `pnpm`.     |
| A06 Vulnerable Components           | Pinned deps, weekly `pnpm audit`, Dependabot.              |
| A07 Identification & Auth Failures  | N/A in v1. v2: OAuth only, no passwords, MFA on owner.     |
| A08 Software & Data Integrity       | Lockfile committed, lockfile diff checked in CI, no postinstall scripts. |
| A09 Logging & Monitoring            | Vercel build logs. No PII. No app logging.                 |
| A10 SSRF                            | No outbound `fetch` from server. (Static site.)            |

---

## 15. Anti-patterns (forbidden in this repo)

| Anti-pattern                              | Why                                              |
| ----------------------------------------- | ------------------------------------------------ |
| `dangerouslySetInnerHTML` on YAML content | XSS risk                                         |
| `eval`, `new Function(string)`            | Code injection                                   |
| `fetch(arbitraryUserInput)`               | SSRF, exfiltration                               |
| Long-lived API keys in the browser        | Trivially exfiltrated                            |
| `localStorage.setItem("token", ...)`      | XSS-stealable                                    |
| `target="_blank"` without `rel`           | Tab-nabbing                                      |
| `Math.random()` for security              | Predictable                                      |
| Hand-rolled HTML sanitizer                | Re-inventing `DOMPurify` badly                   |
| `iframe` from arbitrary URL               | Clickjacking                                     |
| Trusting `Referer` / `Origin` blindly     | Spoofable                                        |
| Logging full request bodies               | PII leakage                                      |
| `innerHTML = ...` from a string           | XSS                                              |
| Disabling CSP "for dev" and shipping it   | Removes the strongest XSS mitigation             |

---

## 16. Pre-PR security checklist

- [ ] No new dependencies without explicit allow-list approval.
- [ ] `pnpm-lock.yaml` unchanged unless this PR is a dependency update.
- [ ] No postinstall scripts in `package.json`.
- [ ] No secrets in the diff.
- [ ] No `dangerouslySetInnerHTML` introduced.
- [ ] No `eval`, `Function(string)`, `setTimeout(string)`.
- [ ] All external links have `rel="noopener noreferrer"`.
- [ ] All URLs from YAML are validated by Zod.
- [ ] No new third-party scripts.
- [ ] No new `localStorage` / `sessionStorage` of sensitive data.
- [ ] CSP still passes (no new `'unsafe-eval'`, no new origin in `script-src`).
- [ ] `pnpm audit` clean.
- [ ] `pnpm lint` and `pnpm typecheck` clean.

---

## 17. Pre-deploy security checklist

- [ ] CSP enforced (not just report-only).
- [ ] All security headers present.
- [ ] HTTPS-only (Vercel default).
- [ ] HSTS preload-ready.
- [ ] No third-party requests in the deployed site.
- [ ] `securityheaders.com` reports **A+**.
- [ ] `Mozilla Observatory` reports **A+**.
- [ ] No `.env*` files in the deployed bundle (search the output for `process.env.NEXT_PUBLIC_*` to verify only declared values are inlined).
- [ ] No source maps in production.

---

## 18. The one-line security rule

> The cheapest vulnerability to fix is the one that's never introduced.
