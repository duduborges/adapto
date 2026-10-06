import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/types';
import { Container } from './Container';
import { Logo } from './Logo';
import { Button } from './Button';
import { site, bookingHref, bookingIsExternal } from '@/lib/site';
import { CookiePrefsLink } from '@/components/analytics/CookiePrefsLink';
import { SERVICES } from '@/lib/services';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

interface FooterProps {
  lang: Locale;
  dict: any;
}

export function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();

  const exploreLinks = [
    { label: dict.footer.links.services, href: `/${lang}#services` },
    { label: dict.footer.links.process, href: `/${lang}#process` },
    { label: dict.footer.links.why, href: `/${lang}#why` },
    { label: dict.footer.links.manifesto, href: `/${lang}#manifesto` },
    { label: dict.footer.links.faq, href: `/${lang}/faq` },
    { label: dict.nav.contact, href: `/${lang}#contact` },
  ];

  const serviceLinks = SERVICES.map(({ slug, key }) => ({
    label: dict.services.items[key].title as string,
    href: `/${lang}/services/${slug}`,
  }));

  return (
    <footer className="relative border-t border-cream/10 bg-ink-950 snap-start scroll-mt-20 md:scroll-mt-24">
      <Container size="wide" className="py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-12">
          <div className="space-y-6 sm:col-span-2 lg:col-span-3">
            <Link
              href={`/${lang}`}
              aria-label="Adapto — home"
              className="-ml-4 inline-flex transition-opacity hover:opacity-80"
            >
              <Logo variant="lockup" sizeClass="h-40 md:h-52" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-cream/60">
              {dict.footer.tagline}
            </p>
            <address className="space-y-2 not-italic">
              <div className="flex items-center gap-2 text-sm text-cream/50">
                <MapPin className="h-4 w-4 text-ember" />
                {dict.contact.info.location}
              </div>
              <p className="text-sm text-cream/50">
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-cream/70"
                >
                  {site.email}
                </a>
              </p>
            </address>
          </div>

          <nav className="space-y-4 lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">
              {dict.footer.sections.services}
            </h2>
            <ul className="space-y-3">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-cream/70 transition-colors hover:text-cream"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="space-y-4 lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">
              {dict.footer.sections.explore}
            </h2>
            <ul className="space-y-3">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-cream/70 transition-colors hover:text-cream"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-5 sm:col-span-2 lg:col-span-4">
            <p className="font-brand text-2xl leading-tight text-cream md:text-3xl">
              {dict.footer.cta}
            </p>
            <Button
              href={bookingHref()}
              external={bookingIsExternal()}
              variant="primary"
              size="lg"
              className="group"
            >
              <Calendar className="h-4 w-4" aria-hidden />
              {dict.footer.links.book}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Button>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/50 md:flex-row md:items-center">
          <p>
            © {year} {site.fullName}. {dict.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href={`/${lang}/privacy`}
              className="transition-colors hover:text-cream/70"
            >
              {dict.footer.links.privacy}
            </Link>
            <CookiePrefsLink label={dict.footer.links.cookiePrefs} />
            <p className="font-mono">
              <span className="text-cream/60">/{lang}</span> · {site.domain}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
