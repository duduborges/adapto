'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, m } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';
import { i18n, languageShort } from '@/lib/i18n/config';
import { Logo } from './Logo';
import { Button } from './Button';
import { site, bookingHref, bookingIsExternal } from '@/lib/site';
import { Menu, X, ArrowRight, ArrowUpRight, MapPin, Mail } from 'lucide-react';

/** Page sections the desktop nav links to, in page order. */
const SECTION_IDS = ['services', 'process', 'why', 'manifesto', 'contact'] as const;

/**
 * Drives the white pill behind the desktop nav link of the section in view.
 * The scroll position sets a target (which link, how wide); the pill then
 * chases it with spring physics, one spring per edge. The leading edge is
 * stiffer than the trailing one, so on the way to the next link the pill
 * stretches like a drop of liquid and then pulls itself together. Writes go
 * straight to the DOM in a rAF loop that stops once both edges settle;
 * only the active index (for aria-current) is React state.
 */
function useSectionPill(
  listRef: React.RefObject<HTMLUListElement>,
  pillRef: React.RefObject<HTMLLIElement>,
  labelsRef: React.RefObject<HTMLDivElement>,
  /** Index of a link that is the current page (the FAQ on /faq), or -1. */
  pageIndex: number,
) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Spring state for each edge: position and velocity (px, px/s)
    const left = { x: 0, v: 0 };
    const right = { x: 0, v: 0 };
    let target = { l: 0, r: 0, opacity: 0 };
    let opacity = 0;
    let initialised = false;
    let measureFrame = 0;
    let animFrame = 0;
    let lastTime = 0;

    const render = () => {
      const pill = pillRef.current;
      if (!pill) return;
      pill.style.transform = `translateX(${left.x}px)`;
      pill.style.width = `${Math.max(0, right.x - left.x)}px`;
      pill.style.opacity = String(opacity);
      // Keep the dark label copy fixed relative to the list while the pill moves
      if (labelsRef.current) labelsRef.current.style.transform = `translateX(${-left.x}px)`;
    };

    const step = (now: number) => {
      animFrame = 0;
      const dt = Math.min(0.032, (now - (lastTime || now)) / 1000) || 1 / 60;
      lastTime = now;

      const movingRight = target.l > left.x;
      // Leading edge: snappy. Trailing edge: lags behind, then catches up.
      const lead = { k: 340, c: 30 };
      const trail = { k: 150, c: 23 };
      const springs: [typeof left, number, { k: number; c: number }][] = [
        [left, target.l, movingRight ? trail : lead],
        [right, target.r, movingRight ? lead : trail],
      ];
      let settled = true;
      for (const [edge, goal, { k, c }] of springs) {
        const a = k * (goal - edge.x) - c * edge.v;
        edge.v += a * dt;
        edge.x += edge.v * dt;
        if (Math.abs(goal - edge.x) > 0.3 || Math.abs(edge.v) > 5) settled = false;
      }
      opacity += (target.opacity - opacity) * Math.min(1, dt * 10);
      if (Math.abs(target.opacity - opacity) > 0.01) settled = false;

      if (settled) {
        left.x = target.l;
        right.x = target.r;
        left.v = right.v = 0;
        opacity = target.opacity;
        render();
        lastTime = 0;
        return;
      }
      render();
      animFrame = requestAnimationFrame(step);
    };

    const measure = () => {
      measureFrame = 0;
      const list = listRef.current;
      const pill = pillRef.current;
      if (!list || !pill) return;

      const sections = SECTION_IDS.map((id) => document.getElementById(id));
      const links = Array.from(list.querySelectorAll<HTMLElement>('a'));
      const jumpTo = () => {
        // First paint (or reduced motion): straight to the target
        initialised = true;
        left.x = target.l;
        right.x = target.r;
        left.v = right.v = 0;
        opacity = target.opacity;
        render();
      };

      // A page of its own (the FAQ): the pill rests on its link
      if (pageIndex >= 0 && links[pageIndex] && list.offsetWidth) {
        const link = links[pageIndex];
        target = { l: link.offsetLeft, r: link.offsetLeft + link.offsetWidth, opacity: 1 };
        setActive(pageIndex);
        jumpTo();
        return;
      }

      // Pages without the home sections (privacy, services, 404), or nav
      // hidden: no pill
      if (
        sections.some((el) => !el) ||
        links.length < SECTION_IDS.length ||
        !list.offsetWidth
      ) {
        pill.style.opacity = '0';
        setActive(-1);
        return;
      }

      // Continuous position: -1 in the hero, i while section i fills the
      // view, fractional while crossing from one section into the next.
      const probe = window.scrollY + window.innerHeight * 0.4;
      const zone = window.innerHeight * 0.5;
      let pos = -1;
      sections.forEach((el, i) => {
        const start = el!.getBoundingClientRect().top + window.scrollY - zone / 2;
        if (probe >= start) pos = i - 1 + Math.min(1, (probe - start) / zone);
      });

      // Only the section links follow the scroll (page links come after them)
      const last = SECTION_IDS.length - 1;
      // Aim at the nearest link rather than a point in between: the springs
      // supply the in-between motion, which is what makes it read as fluid.
      const idx = Math.max(0, Math.min(Math.round(pos), last));
      const link = links[idx];
      target = {
        l: link.offsetLeft,
        r: link.offsetLeft + link.offsetWidth,
        opacity: pos < -0.5 ? 0 : 1, // shows up as Services arrives
      };
      setActive(target.opacity ? idx : -1);

      if (!initialised || reduce) {
        jumpTo();
        return;
      }
      if (!animFrame) animFrame = requestAnimationFrame(step);
    };

    const schedule = () => {
      if (!measureFrame) measureFrame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Link widths change once the web font swaps in
    const ro = new ResizeObserver(schedule);
    if (listRef.current) ro.observe(listRef.current);
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      cancelAnimationFrame(measureFrame);
      cancelAnimationFrame(animFrame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [listRef, pillRef, labelsRef, pageIndex]);

  return active;
}

interface HeaderProps {
  lang: Locale;
  dict: any;
}

export function Header({ lang, dict }: HeaderProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLLIElement>(null);
  const pillLabelsRef = useRef<HTMLDivElement>(null);
  const faqHref = `/${lang}/faq`;
  const activeSection = useSectionPill(
    navListRef,
    pillRef,
    pillLabelsRef,
    pathname === faqHref ? SECTION_IDS.length : -1,
  );

  useEffect(() => setMounted(true), []);

  // The header's backdrop fades in with the scroll, over its first 80px,
  // instead of switching on at once: on phones the old switch landed while the
  // browser's address bar was collapsing, and the pair read as the page jumping.
  // Written straight to the DOM on each frame, so it follows the finger.
  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const el = backdropRef.current;
      if (el) el.style.opacity = String(Math.min(1, Math.max(0, window.scrollY / 80)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    paint();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
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

  // Home sections first (the pill tracks them by scroll), then the FAQ page
  const navItems = [
    ...SECTION_IDS.map((id) => ({
      label: dict.nav[id] as string,
      href: `/${lang}#${id}`,
    })),
    { label: dict.nav.faq as string, href: faqHref },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Backdrop: opacity driven by the scroll (above); fully on while the
          menu is open */}
      <div
        ref={backdropRef}
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 bg-ink/85 backdrop-blur-xl',
          open && '!opacity-100',
        )}
        style={{ opacity: 0 }}
      />
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:h-24 md:px-8 lg:px-10">
        <Link
          href={`/${lang}`}
          aria-label="Adapto — home"
          className="group inline-flex items-center transition-opacity hover:opacity-80"
        >
          <Logo variant="mark" sizeClass="h-14 md:h-16" priority />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-8">
          <ul ref={navListRef} className="relative flex items-center gap-1">
            {/* Section indicator — positioned by useSectionPill */}
            {/* Section indicator — positioned by useSectionPill. It sits above
                the links and carries a dark copy of the labels, counter-shifted
                so they line up with the real ones: wherever the pill covers a
                word, even mid-slide, that part reads dark on white. */}
            <li
              ref={pillRef}
              aria-hidden
              role="presentation"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 overflow-hidden rounded-full bg-cream opacity-0 shadow-[0_4px_18px_-6px_rgba(254,254,254,0.35)] will-change-transform"
            >
              <div ref={pillLabelsRef} className="flex h-full items-center gap-1 will-change-transform">
                {navItems.map((item) => (
                  <span
                    key={item.href}
                    className="block whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-ink"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </li>
            {navItems.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={
                    activeSection === i ? (item.href === faqHref ? 'page' : 'location') : undefined
                  }
                  className="relative block whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-cream/70 transition-colors hover:text-cream"
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

          <a
            href={site.trackerUrl}
            target="_blank"
            rel="noopener noreferrer"
            // Hidden on small laptops: with the FAQ link and the longer
            // French CTA the row no longer fits at 1024px. The Tracker stays
            // in the mobile drawer and the Process section.
            className="group hidden items-center gap-1.5 whitespace-nowrap text-sm font-medium text-cream/70 transition-colors hover:text-cream xl:inline-flex"
          >
            {dict.process.tracker.cta.button}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <Button href={bookingHref()} external={bookingIsExternal()} size="sm">
            {dict.nav.book}
          </Button>
        </div>

        {/* Mobile toggle — generous hit area, no default highlight */}
        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-cream lg:hidden"
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
      className="fixed inset-0 z-[60] lg:hidden"
    >
      {/* Scrim — 50% black, dismissible */}
      <m.button
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
      <m.aside
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
            Menu
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
              <m.li
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
                  <span className="font-brand text-3xl leading-tight tracking-tight text-cream transition-colors group-hover:text-ember">
                    {item.label}
                  </span>
                </a>
              </m.li>
            ))}
          </ul>
        </nav>

        {/* CTA — editorial underline style, matches Hero/Contact */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start border-t border-cream/10 px-6 pb-6 pt-8"
        >
          <a
            href={bookingHref()}
            {...(bookingIsExternal()
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            onClick={onClose}
            className="group inline-flex items-baseline gap-3 whitespace-nowrap border-b border-ember pb-1 font-brand text-2xl text-cream transition-colors hover:text-ember"
          >
            <span>{dict.nav.book}</span>
            <ArrowRight className="h-4 w-4 self-center transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href={site.trackerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-cream/50 transition-colors hover:text-cream/80"
          >
            {dict.process.tracker.cta.button}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </m.div>

        {/* Footer — language switcher + meta */}
        <m.div
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
        </m.div>
      </m.aside>
    </div>
  );
}
