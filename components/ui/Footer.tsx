import React from 'react';
import type { Locale } from '@/types';
import { Container } from './Container';
import { Logo } from './Logo';
import { site } from '@/lib/site';
import { MapPin, Mail, Calendar } from 'lucide-react';

interface FooterProps {
  lang: Locale;
  dict: any;
}

export function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();

  const exploreLinks = [
    { label: dict.footer.links.manifesto, href: '#manifesto' },
    { label: dict.footer.links.services, href: '#services' },
    { label: dict.footer.links.process, href: '#process' },
    { label: dict.footer.links.work, href: '#work' },
  ];

  return (
    <footer className="relative border-t border-cream/10 bg-ink-950">
      <Container size="wide" className="py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
          <div className="md:col-span-1 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <Logo size="h-16" />
              <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.18em] text-cream/50 flex flex-col">
                <span>Software</span>
                <span className="text-ember">/ House</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-cream/60">
              {dict.footer.tagline}
            </p>
            <div className="flex items-center gap-2 text-sm text-cream/50">
              <MapPin className="h-4 w-4 text-ember" />
              {dict.contact.info.location}
            </div>
          </div>

          <nav className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/40">
              {dict.footer.sections.explore}
            </h4>
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

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/40">
              {dict.footer.sections.contact}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={site.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-cream"
                >
                  <Calendar className="h-4 w-4 text-ember" />
                  {dict.footer.links.book}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-cream"
                >
                  <Mail className="h-4 w-4 text-ember" />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/40 md:flex-row md:items-center">
          <p>
            © {year} {site.fullName}. {dict.footer.rights}
          </p>
          <p className="font-mono">
            <span className="text-cream/60">/{lang}</span> · {site.domain}
          </p>
        </div>
      </Container>
    </footer>
  );
}
