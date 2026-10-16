import type { NextConfig } from "next";

import { cvVariantRoutes } from "./lib/cv";

// Production CSP — strict. Next.js dev mode injects inline scripts and uses
// eval for HMR / fast refresh, so a separate, dev-only CSP is composed below.
const cspProd = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Development CSP — relaxes script-src to allow the Next.js dev server's
// inline bootstrappers and eval-based HMR. Style and frame policies remain
// strict. Safe to ship because it's never sent in production builds.
const cspDev = [
  "default-src 'self'",
  // 'unsafe-inline' for Next.js dev's <script> tags.
  // 'unsafe-eval' for the HMR / fast-refresh runtime.
  // https://unpkg.com/react-grab@0.2.0 — dev-only fiber inspector (replaces the npm dep).
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
  // Allow the dev server's WebSocket endpoint for HMR.
  "connect-src 'self' ws: https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "object-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
].join("; ");

// Composed at request time so NODE_ENV drives the policy. next.config.ts is
// evaluated before process.env.NODE_ENV is fully settled in some runtimes,
// so we read it lazily inside headers().
const csp = (): string => {
  // When Next runs the dev server, process.env.NODE_ENV is "development".
  // When this file is bundled for the build, it's "production".
  return process.env.NODE_ENV === "production" ? cspProd : cspDev;
};

const securityHeaders = [
  // Content-Security-Policy is set dynamically inside headers() based on
  // NODE_ENV — see cspProd / cspDev above. Not included in this static list.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Origin-Agent-Cluster", value: "?1" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Static redirects for the CV variants. Handled at the edge by Next
  // (no per-request handler), so the routes show as static in the build
  // table and need no `request.url` (which would otherwise force dynamic
  // rendering). Source list comes from `lib/cv.ts` so the `/cv` index page
  // and the redirect list stay in sync.
  async redirects() {
    return cvVariantRoutes;
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          // NODE_ENV-aware CSP: strict in production, relaxed in dev so the
          // Next.js dev server's inline scripts and HMR runtime are allowed.
          { key: "Content-Security-Policy", value: csp() },
          ...securityHeaders,
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/api/contact",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
