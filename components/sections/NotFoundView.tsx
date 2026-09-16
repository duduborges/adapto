'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { i18n } from '@/lib/i18n/config';
import type { Locale } from '@/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

interface NotFoundCopy {
  code: string;
  requested: string;
  title: string;
  titleAccent: string;
  body: string;
  routesLabel: string;
  cta: string;
  secondary: string;
}

interface NavCopy {
  work: string;
  process: string;
  services: string;
  manifesto: string;
  contact: string;
}

interface NotFoundViewProps {
  copy: Record<Locale, { notFound: NotFoundCopy; nav: NavCopy }>;
  bookingHref: string;
}

const ROUTES = ['work', 'services', 'process', 'manifesto', 'contact'] as const;

// not-found.tsx gets no params, so the locale comes from the URL itself.
function splitPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0] as Locale | undefined;
  const lang = first && i18n.locales.includes(first) ? first : i18n.defaultLocale;
  const known = first === lang ? `/${lang}/` : '/';
  const missing = (first === lang ? segments.slice(1) : segments).join('/');
  return { lang, known, missing };
}

export function NotFoundView({ copy, bookingHref }: NotFoundViewProps) {
  const { lang, known, missing } = splitPath(usePathname() ?? '/');
  const { notFound: t, nav } = copy[lang];
  const home = `/${lang}`;

  return (
    <main className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-bg mask-radial opacity-30"
      />

      <Container size="wide" className="flex h-28 w-full items-center justify-between md:h-32">
        <Link
          href={home}
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
        >
          <Logo variant="lockup" sizeClass="h-20 md:h-24" priority />
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
          {t.code}
        </span>
      </Container>

      <Container
        size="wide"
        className="grid w-full flex-1 content-center gap-16 py-16 lg:grid-cols-12 lg:gap-10"
      >
        <div className="lg:col-span-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            {t.requested}
          </p>
          <p className="mt-4 break-all font-mono text-[clamp(1.1rem,2.6vw,1.9rem)] leading-snug text-cream/45">
            <span>{known}</span>
            {missing && (
              <span className="nf-strike text-cream">{missing}</span>
            )}
            <span aria-hidden className="nf-caret ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-ember" />
          </p>

          <h1 className="mt-12 text-[clamp(2.6rem,6.5vw,5.25rem)] font-medium leading-[0.98] tracking-tight text-cream">
            {t.title}
            <span className="block font-serif font-normal italic text-ember">
              {t.titleAccent}
            </span>
          </h1>
          <p className="mt-8 max-w-md text-base leading-relaxed text-cream/60">{t.body}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href={home} size="lg">
              <ArrowLeft className="h-4 w-4" />
              {t.cta}
            </Button>
            <Button href={bookingHref} variant="secondary" size="lg">
              {t.secondary}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav aria-label={t.routesLabel} className="self-end lg:col-span-4 lg:col-start-9">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            {t.routesLabel}
          </p>
          <ul className="mt-4 border-t border-cream/10">
            {ROUTES.map((route) => (
              <li key={route} className="border-b border-cream/10">
                <Link
                  href={`${home}#${route}`}
                  className="group flex items-baseline justify-between gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                >
                  <span className="font-serif text-2xl text-cream/85 transition-colors group-hover:text-cream md:text-3xl">
                    {nav[route]}
                  </span>
                  <span className="font-mono text-xs text-cream/30 transition-colors group-hover:text-ember">
                    {`${home}#${route}`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </main>
  );
}
