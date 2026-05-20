'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';
import { i18n, languageShort } from '@/lib/i18n/config';
import { Logo } from './Logo';
import { Button } from './Button';
import { site } from '@/lib/site';
import { Menu, X, ArrowRight, MapPin, Mail } from 'lucide-react';

interface HeaderProps {
  lang: Locale;
  dict: any;
}

export function Header({ lang, dict }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body scroll lock + ESC handler when drawer is open
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add('no-scroll');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    // focus the close button so screen readers land here
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.documentElement.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

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
        scrolled || open
          ? 'border-b border-cream/10 bg-ink/85 backdrop-blur-xl'
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

        {/* Mobile toggle — generous hit area, no default highlight */}
        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-cream md:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Editorial mobile drawer — portaled to body to escape the header's
          backdrop-filter containing block, which traps fixed-position children. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <MobileDrawer
                key="mobile-drawer"
                dict={dict}
                lang={lang}
                navItems={navItems}
                switchLanguage={switchLanguage}
                onClose={() => setOpen(false)}
                closeButtonRef={closeButtonRef}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}

interface MobileDrawerProps {
  dict: any;
  lang: Locale;
  navItems: { label: string; href: string }[];
  switchLanguage: (l: Locale) => string;
  onClose: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement>;
}

function MobileDrawer({
  dict,
  lang,
  navItems,
  switchLanguage,
  onClose,
  closeButtonRef,
}: MobileDrawerProps) {
  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-[60] md:hidden"
    >
      {/* Scrim — 50% black, dismissible */}
      <motion.button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-ink-950/55 backdrop-blur-sm motion-reduce:backdrop-blur-none"
      />

      {/* Drawer panel — slides from the right */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{
          type: 'tween',
          ease: [0.22, 1, 0.36, 1],
          duration: 0.32,
        }}
        className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col overflow-y-auto bg-ink shadow-[-30px_0_60px_-20px_rgba(0,0,0,0.6)] motion-reduce:transition-none"
      >
        {/* Top bar inside drawer */}
        <div className="flex h-20 items-center justify-between border-b border-cream/10 px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            <span className="text-ember">§</span> Menu
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-cream/70 transition-colors hover:text-cream"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Editorial nav list */}
        <nav className="flex-1 px-6 py-10">
          <ul className="space-y-1">
            {navItems.map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.08 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <a
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-baseline gap-4 py-3 transition-colors"
                >
                  <span className="font-mono text-xs text-cream/30 transition-colors group-hover:text-ember">
                    0{i + 1}
                  </span>
                  <span className="font-serif text-3xl leading-tight tracking-tight text-cream transition-colors group-hover:text-ember">
                    {item.label}
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* CTA — editorial underline style, matches Hero/Contact */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="border-t border-cream/10 px-6 pb-6 pt-8"
        >
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group inline-flex items-baseline gap-3 whitespace-nowrap border-b border-ember pb-1 font-serif text-2xl text-cream transition-colors hover:text-ember"
          >
            <span>{dict.nav.book}</span>
            <ArrowRight className="h-4 w-4 self-center transition-transform group-hover:translate-x-1" />
          </a>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
            30 min · No commitment
          </p>
        </motion.div>

        {/* Footer — language switcher + meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.45 }}
          className="border-t border-cream/10 px-6 py-6"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
              Language
            </span>
            <div className="flex items-center gap-3" role="group" aria-label="Language switcher">
              {i18n.locales.map((locale) => (
                <Link
                  key={locale}
                  href={switchLanguage(locale)}
                  onClick={onClose}
                  aria-current={locale === lang ? 'page' : undefined}
                  className={cn(
                    'font-mono text-xs font-semibold tracking-[0.2em] transition-colors',
                    locale === lang
                      ? 'text-ember'
                      : 'text-cream/40 hover:text-cream',
                  )}
                >
                  {languageShort[locale]}
                </Link>
              ))}
            </div>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-cream/60">
            <li className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-ember/80" />
              {dict.contact.info.location}
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 transition-colors hover:text-cream"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-ember/80" />
                {site.email}
              </a>
            </li>
          </ul>
        </motion.div>
      </motion.aside>
    </div>
  );
}
