'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';
import { i18n, languageShort } from '@/lib/i18n/config';
import { Logo } from './Logo';
import { Button } from './Button';
import { site } from '@/lib/site';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  lang: Locale;
  dict: any;
}

export function Header({ lang, dict }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLanguage = (newLang: Locale) => {
    const segments = pathname.split('/');
    segments[1] = newLang;
    return segments.join('/');
  };

  const navItems = [
    { label: dict.nav.manifesto, href: '#manifesto' },
    { label: dict.nav.services, href: '#services' },
    { label: dict.nav.process, href: '#process' },
    { label: dict.nav.work, href: '#work' },
    { label: dict.nav.contact, href: '#contact' },
  ];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-cream/10 bg-ink/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:h-24 md:px-8 lg:px-10">
        <Link
          href={`/${lang}`}
          aria-label="Adapto Software House — home"
          className="group inline-flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Logo size="h-12 md:h-14" />
          <span className="hidden font-mono text-[10px] uppercase leading-tight tracking-[0.18em] text-cream/50 md:inline-flex md:flex-col">
            <span>Software</span>
            <span className="text-ember">/ House</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm font-medium text-cream/70 transition-colors hover:text-cream"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 rounded-full border border-cream/10 bg-cream/5 p-0.5">
            {i18n.locales.map((locale) => (
              <Link
                key={locale}
                href={switchLanguage(locale)}
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider transition-all',
                  locale === lang
                    ? 'bg-cream text-ink'
                    : 'text-cream/60 hover:text-cream',
                )}
              >
                {languageShort[locale]}
              </Link>
            ))}
          </div>

          <Button href={site.bookingUrl} external size="sm">
            {dict.nav.book}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-md p-2 text-cream md:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-cream/10 bg-ink/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-6 py-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-medium text-cream/80 hover:bg-cream/5 hover:text-cream"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4">
              <Button href={site.bookingUrl} external className="w-full justify-center">
                {dict.nav.book}
              </Button>
            </div>
            <div className="flex items-center gap-1 pt-4">
              {i18n.locales.map((locale) => (
                <Link
                  key={locale}
                  href={switchLanguage(locale)}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-semibold tracking-wider transition-all',
                    locale === lang
                      ? 'bg-cream text-ink'
                      : 'text-cream/60 hover:text-cream',
                  )}
                >
                  {languageShort[locale]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
