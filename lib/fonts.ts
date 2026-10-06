import { Geist, Geist_Mono } from 'next/font/google';

/**
 * Geist from Google Fonts rather than the `geist` package: the package ships
 * the full variable files (~70 KB each, every script), Google's latin subset
 * is a fraction of that. On a throttled phone the three preloaded fonts were
 * ~175 KB ahead of the headline. Same CSS variables as the package's.
 */
export const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

/**
 * Small labels and numbers only, nothing the first paint depends on: not
 * preloaded, so it doesn't compete with the headline font.
 */
export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Roboto Mono', 'Menlo', 'Monaco', 'Liberation Mono', 'DejaVu Sans Mono', 'Courier New', 'monospace'],
});
