import { GeistSans } from 'geist/font/sans';
import { i18n } from '@/lib/i18n/config';
import './globals.css';

/**
 * Last-resort 404 for paths the locale middleware skips (files, /api/*).
 * Locale-aware 404s live in app/[lang]/not-found.tsx.
 */
export default function RootNotFound() {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="flex min-h-screen items-center justify-center bg-ink font-sans text-cream antialiased">
        <main className="px-6 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-ember">
            404
          </p>
          <h1 className="mt-4 text-3xl font-medium tracking-tight">
            This page doesn&apos;t exist.
          </h1>
          <a
            href={`/${i18n.defaultLocale}`}
            className="mt-8 inline-flex rounded-full bg-ember px-6 py-3 text-sm font-medium text-cream transition-all hover:brightness-110"
          >
            Back to home
          </a>
        </main>
      </body>
    </html>
  );
}
