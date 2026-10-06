import type { NextConfig } from 'next';

/**
 * Sent on every HTML response. `frame-ancestors 'none'` blocks clickjacking;
 * the rest are cheap wins that PageSpeed's "Best Practices" audit looks for.
 */
const isDev = process.env.NODE_ENV !== 'production';

/**
 * Content-Security-Policy. Only the third parties the site actually loads:
 * GA4 (after consent) and Vercel Speed Insights. 'unsafe-inline' scripts are
 * needed because Next injects inline bootstrap scripts and the pages are
 * static (no per-request nonce); dev also needs eval + websocket for HMR.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self' data:",
  `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://vitals.vercel-insights.com${isDev ? ' ws: wss:' : ''}`,
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // AVIF first, WebP fallback — roughly 30-50% smaller than the source PNGs.
    formats: ['image/avif', 'image/webp'],
    // No remote hosts: every image is local, so the optimizer can't be
    // pointed at third-party URLs.
    remotePatterns: [],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  experimental: {
    // CSS goes into the HTML instead of two render-blocking requests: on a
    // throttled phone that took first paint (= LCP) from 2.4 s to 1.6 s.
    inlineCss: true,
    // Only pull the icons actually imported instead of the whole lucide barrel.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async redirects() {
    return [
      // There is no services index page: the list lives on the home page
      { source: '/:lang(en|fr)/services', destination: '/:lang#services', permanent: false },
    ];
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/logos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
