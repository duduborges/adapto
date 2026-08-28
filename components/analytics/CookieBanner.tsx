'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { CONSENT_EVENT, readConsent, writeConsent } from '@/lib/consent';
import type { Locale } from '@/types';

interface CookieBannerProps {
  lang: Locale;
  dict: any;
}

export function CookieBanner({ lang, dict }: CookieBannerProps) {
  // Never render on the server — the answer lives in localStorage.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(readConsent() === null);
    const onChange = (e: Event) =>
      setOpen((e as CustomEvent<string | null>).detail === null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label={dict.cookies.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-x-3 bottom-3 z-[60] md:inset-x-auto md:bottom-6 md:left-6 md:max-w-md"
        >
          <div className="rounded-2xl border border-cream/10 bg-ink-950/95 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <p className="text-sm font-medium text-cream">
              {dict.cookies.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-cream/60">
              {dict.cookies.body}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => writeConsent('granted')}
                className="rounded-full bg-ember px-5 py-2 text-sm font-medium text-cream transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                {dict.cookies.accept}
              </button>
              <button
                type="button"
                onClick={() => writeConsent('denied')}
                className="rounded-full border border-cream/10 bg-cream/5 px-5 py-2 text-sm text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                {dict.cookies.reject}
              </button>
              <Link
                href={`/${lang}/privacy`}
                className="ml-auto text-xs text-cream/40 underline underline-offset-4 transition-colors hover:text-cream/70"
              >
                {dict.cookies.policy}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
