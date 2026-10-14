'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus, Minus, ArrowRight, X } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ServiceGlyph } from './ServiceGlyph';
import { cn } from '@/lib/utils';

interface ServicesProps {
  dict: any;
  lang: string;
}

/** Each category's page under /[lang]/services (see lib/services). */
const serviceSlugs = {
  custom: 'custom-software',
  websites: 'websites',
  ai: 'ai-integration',
  automation: 'automation',
  dashboards: 'dashboards',
  integrations: 'integrations',
} as const;

const serviceKeys = [
  'custom',
  'websites',
  'ai',
  'automation',
  'dashboards',
  'integrations',
] as const;
type ServiceKey = (typeof serviceKeys)[number];

// useLayoutEffect warns when the server renders it; the card never opens there
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function Services({ dict, lang }: ServicesProps) {
  const [open, setOpen] = useState<ServiceKey | null>('custom');
  // The open-topic motion only plays after a click — not for the topic that is
  // open on load, so nothing in the first paint starts hidden or mid-animation.
  const [animKey, setAnimKey] = useState<ServiceKey | null>(null);
  // Large screens: the topics sit side by side; picking one opens it as a
  // card that fills the section, with the topics as buttons on its right.
  const [active, setActive] = useState<ServiceKey | null>(null);
  // The topic under the pointer plays its glyph's animation
  const [hovered, setHovered] = useState<ServiceKey | null>(null);
  // Whether the row is coming back from a card: then its tiles step in again
  const [returned, setReturned] = useState(false);
  // Where the card grows from: the tile, or the side button, that opened it
  const origin = useRef<DOMRect | null>(null);
  const cardRef = useRef<HTMLElement>(null);
  const openCard = (key: ServiceKey, from: HTMLElement) => {
    origin.current = from.getBoundingClientRect();
    setHovered(null);
    setActive(key);
  };

  // The card opens like a window on a desktop: it starts as the box that
  // was clicked and grows into its own place (FLIP), its content fading in
  // once it is nearly full size so the stretched text is never seen.
  useIsoLayoutEffect(() => {
    const card = cardRef.current;
    const from = origin.current;
    origin.current = null;
    if (!card || !from) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const to = card.getBoundingClientRect();
    if (!to.width || !to.height) return;
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const sx = from.width / to.width;
    const sy = from.height / to.height;
    card.animate(
      [
        { transformOrigin: '0 0', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.4 },
        { transformOrigin: '0 0', transform: 'none', opacity: 1 },
      ],
      { duration: 560, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
    Array.from(card.children).forEach((child) =>
      child.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 300,
        delay: 260,
        easing: 'ease-out',
        fill: 'backwards',
      }),
    );
  }, [active]);
  const closeCard = () => {
    setReturned(true);
    setActive(null);
  };

  return (
    <Section
      id="services"
      size="wide"
      // Desktop: exactly one screen tall with the content centred, like How
      // we work, so section snapping enters and leaves it in a single scroll.
      // Spacing is in svh on desktop so it always fits (pt = header).
      className="relative overflow-hidden border-t border-cream/10 desk:flex desk:h-[100svh] desk:min-h-[620px] desk:scroll-mt-0 desk:flex-col desk:justify-center desk:pb-[3svh] desk:pt-24"
    >
      {/* Ember bloom — left-center behind the accordion */}
            {/* Hero grid, lit only where this section's glow is (not on phones) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden grid-glow sm:block"
        style={{ '--glow': 'radial-gradient(560px circle at calc(-10% + 250px) 50%, black 0%, rgba(0,0,0,0.5) 40%, transparent 72%)' } as React.CSSProperties}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] top-1/2 -z-10 h-[600px] w-[500px] -translate-y-1/2 rounded-full bg-ember/[0.07] blur-[150px]"
      />
      <SectionLabel label={dict.services.eyebrow} />

      <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-8 md:mt-16 md:gap-8 desk:mt-[4.5svh]">
        <h2
          data-reveal
          style={{ '--reveal-y': '12px' } as React.CSSProperties}
          className="col-span-12 max-w-5xl text-balance font-brand text-4xl sm:text-5xl leading-[1.05] tracking-[-0.01em] text-cream md:col-span-8 md:text-6xl"
        >
          {dict.services.title.replace(/\.$/, '')}
          <span className="text-ember">.</span>
        </h2>
        <p
          data-reveal
          style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}
          className="col-span-12 self-end text-base leading-relaxed text-cream/60 md:col-span-4 md:text-lg"
        >
          {dict.services.subtitle}
        </p>
      </div>

      <ul className="mt-20 border-t border-cream/15 md:mt-24 lg:hidden">
        {serviceKeys.map((key, i) => {
          const item = dict.services.items[key];
          const isOpen = open === key;
          return (
            <li
              key={key}
              data-reveal
              data-open={isOpen || undefined}
              data-anim={(isOpen && animKey === key) || undefined}
              style={{ '--reveal-y': '18px', '--reveal-delay': `${i * 0.09}s` } as React.CSSProperties}
              className="svc-row border-b border-cream/15"
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(isOpen ? null : key);
                  setAnimKey(isOpen ? null : key);
                }}
                className="group grid w-full grid-cols-12 items-center gap-x-3 gap-y-6 px-2 py-8 text-left transition-colors hover:bg-cream/[0.02] md:gap-10 md:px-4 md:py-12"
                aria-expanded={isOpen}
                aria-controls={`service-panel-${key}`}
              >
                <span className="col-span-1 font-mono text-sm font-semibold text-ember-400">
                  0{i + 1}
                </span>
                <div className="col-span-9 flex min-w-0 items-center gap-4 md:gap-6">
                  <span className="svc-tile flex shrink-0 items-center justify-center rounded-xl border">
                    <ServiceGlyph kind={key} />
                  </span>
                  <h3
                    className={`min-w-0 hyphens-auto font-brand text-[1.45rem] leading-tight tracking-tight transition-colors sm:text-3xl md:text-5xl ${
                      isOpen
                        ? 'text-cream'
                        : 'text-cream/70 group-hover:text-cream'
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>
                <span
                  aria-hidden
                  className={`col-span-2 flex h-10 w-10 items-center justify-end justify-self-end text-cream/50 transition-colors group-hover:text-ember md:col-span-2 md:h-12 md:w-12 ${
                    isOpen ? 'text-ember' : ''
                  }`}
                >
                  {isOpen ? (
                    <Minus className="h-6 w-6 md:h-7 md:w-7" />
                  ) : (
                    <Plus className="h-6 w-6 md:h-7 md:w-7" />
                  )}
                </span>
              </button>

              {/* Always rendered, collapsed to zero height when closed: the
                  descriptions are the most keyword-rich copy on the page, and
                  unmounting them kept 4 of 5 out of the HTML search engines read.
                  Height animates via grid rows 0fr→1fr, CSS-only. */}
              <div
                id={`service-panel-${key}`}
                className={cn(
                  'grid transition-[grid-template-rows,opacity] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
                aria-hidden={!isOpen}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="grid grid-cols-12 gap-6 px-2 pb-14 pt-2 md:gap-10 md:px-4 md:pb-20 md:pt-4">
                    <div className="col-span-12 col-start-1 md:col-span-7 md:col-start-2">
                      <p className="svc-in text-lg leading-[1.65] text-cream/85 md:text-xl">
                        {item.description}
                      </p>
                      <Link
                        href={`/${lang}/services/${serviceSlugs[key]}`}
                        // Closed panels stay in the HTML for crawlers but
                        // must not catch keyboard focus
                        tabIndex={isOpen ? undefined : -1}
                        style={{ '--d': '0.1s' } as React.CSSProperties}
                        className="svc-in group/link mt-8 inline-flex items-baseline gap-3 border-b border-ember pb-1 font-brand text-2xl text-cream transition-colors hover:text-ember md:text-3xl"
                      >
                        <span>{item.link}</span>
                        <ArrowRight className="h-5 w-5 self-center transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                    <div className="col-span-12 md:col-span-4 md:col-start-9">
                      <p className="svc-in mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50" style={{ '--d': '0.12s' } as React.CSSProperties}>
                        {dict.services.stackLabel}
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {item.tags.map((tag: string, t: number) => (
                          <li
                            key={tag}
                            style={{ '--d': `${0.18 + t * 0.07}s` } as React.CSSProperties}
                            className="svc-in inline-flex items-center gap-2 rounded-md border border-ember/25 bg-ember/[0.06] px-3 py-1.5 text-sm font-medium text-cream/90"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_6px_rgba(195,86,34,0.8)]" />
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Large screens. Rows mounted after load are never seen by
          RevealObserver, so the wrapper reveals (its tiles step in one by
          one, .svc-desk in globals.css) and the rows start revealed. */}
      <div data-reveal style={{ '--reveal-duration': '0.3s' } as React.CSSProperties} className="svc-desk mt-24 hidden lg:block desk:mt-[6svh]">
        {active === null ? (
          <ul data-enter={returned || undefined} className="grid grid-cols-6 border-y border-cream/15">
            {serviceKeys.map((key, i) => (
              <li
                key={key}
                data-revealed=""
                data-anim={hovered === key || undefined}
                style={{ '--i': i, '--reveal-delay': `${i * 0.08}s` } as React.CSSProperties}
                className="svc-row svc-dtile relative border-l border-cream/15 first:border-l-0"
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  type="button"
                  onClick={(e) => openCard(key, e.currentTarget)}
                  className="group relative flex h-full min-h-[17rem] w-full desk:min-h-[clamp(13rem,30svh,17rem)] flex-col justify-between gap-10 overflow-hidden px-5 py-8 text-left transition-colors duration-300 hover:bg-cream/[0.03] xl:px-6"
                >
                  {/* Ember wash rising from the bottom, and a line drawn under it */}
                  <span aria-hidden className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-t from-ember/[0.12] to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 motion-reduce:transition-none" />
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none" />
                  <span className="flex w-full items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-ember-400">0{i + 1}</span>
                    <Plus aria-hidden className="h-5 w-5 text-cream/50 transition-[color,transform] duration-300 group-hover:rotate-90 group-hover:text-ember motion-reduce:transition-none" />
                  </span>
                  <span className="flex flex-col gap-5">
                    <span className="svc-tile flex shrink-0 items-center justify-center rounded-xl border">
                      <ServiceGlyph kind={key} />
                    </span>
                    <h3 className="font-brand text-2xl leading-tight tracking-tight text-cream/70 transition-[color,transform] duration-300 group-hover:-translate-y-1 group-hover:text-cream motion-reduce:transition-none xl:text-3xl">
                      {dict.services.items[key].title}
                    </h3>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {(() => {
              const item = dict.services.items[active];
              const i = serviceKeys.indexOf(active);
              return (
                <article
                  key={active}
                  ref={cardRef}
                  data-revealed=""
                  data-open=""
                  data-anim=""
                  className="svc-row svc-card relative col-span-9 flex flex-col overflow-hidden rounded-2xl border border-cream/15 bg-cream/[0.02] p-10 xl:p-14 desk:p-[clamp(1.5rem,4.5svh,3.5rem)]"
                >
                  {/* Number, tile, title and close on one row, so the card
                      stays short enough to fit a 720px-tall screen */}
                  <div className="flex items-center gap-6">
                    <span className="svc-tile flex shrink-0 items-center justify-center rounded-xl border">
                      <ServiceGlyph kind={active} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-sm font-semibold text-ember-400">0{i + 1}</span>
                      <h3 className="font-brand text-5xl leading-tight tracking-tight text-cream xl:text-6xl desk:text-[clamp(2rem,5.5svh,3.75rem)]">
                        {item.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={closeCard}
                      aria-label={dict.services.close}
                      className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-full border border-cream/15 text-cream/60 transition-[color,border-color,transform] duration-300 hover:rotate-90 hover:border-ember hover:text-ember motion-reduce:transition-none"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-auto grid grid-cols-9 gap-10 pt-12 desk:pt-[4.5svh]">
                    <div className="col-span-5">
                      <p className="svc-in text-xl leading-[1.65] text-cream/85 desk:text-[clamp(1rem,2.5svh,1.25rem)] desk:leading-[1.6]">{item.description}</p>
                      <Link
                        href={`/${lang}/services/${serviceSlugs[active]}`}
                        style={{ '--d': '0.1s' } as React.CSSProperties}
                        className="svc-in group/link mt-8 inline-flex items-baseline gap-3 border-b border-ember pb-1 font-brand text-3xl text-cream desk:mt-[3.5svh] desk:text-[clamp(1.5rem,3.6svh,1.875rem)] transition-colors hover:text-ember"
                      >
                        <span>{item.link}</span>
                        <ArrowRight className="h-5 w-5 self-center transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                    <div className="col-span-4">
                      <p className="svc-in mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50" style={{ '--d': '0.12s' } as React.CSSProperties}>
                        {dict.services.stackLabel}
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {item.tags.map((tag: string, t: number) => (
                          <li
                            key={tag}
                            style={{ '--d': `${0.18 + t * 0.07}s` } as React.CSSProperties}
                            className="svc-in inline-flex items-center gap-2 rounded-md border border-ember/25 bg-ember/[0.06] px-3 py-1.5 text-sm font-medium text-cream/90"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_6px_rgba(195,86,34,0.8)]" />
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })()}
            <ul className="col-span-3 flex flex-col gap-2">
              {serviceKeys.map((key, i) => {
                const isActive = key === active;
                return (
                  <li
                    key={key}
                    style={{ '--i': i } as React.CSSProperties}
                    className="svc-dbtn flex-1"
                  >
                    <button
                      type="button"
                      onClick={(e) => (isActive ? closeCard() : openCard(key, e.currentTarget))}
                      aria-pressed={isActive}
                      className={cn(
                        'group relative flex h-full w-full items-center gap-3 overflow-hidden rounded-xl border px-4 py-3 text-left transition-[color,background-color,border-color,transform] duration-300 motion-reduce:transition-none',
                        isActive
                          ? 'border-ember/60 bg-ember/[0.08] text-cream'
                          : 'border-cream/15 text-cream/70 hover:-translate-x-1 hover:border-cream/30 hover:bg-cream/[0.03] hover:text-cream',
                      )}
                    >
                      {/* Ember bar marking the open topic */}
                      <span
                        aria-hidden
                        className={cn(
                          'absolute inset-y-2 left-0 w-[3px] origin-center rounded-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none',
                          isActive ? 'scale-y-100' : 'scale-y-0',
                        )}
                      />
                      <span className="font-mono text-xs font-semibold text-ember-400">0{i + 1}</span>
                      <span className="min-w-0 flex-1 font-brand text-lg leading-tight tracking-tight xl:text-xl">
                        {dict.services.items[key].title}
                      </span>
                      <ArrowRight
                        aria-hidden
                        className={cn(
                          'h-4 w-4 shrink-0 text-ember transition-[opacity,transform] duration-300 motion-reduce:transition-none',
                          isActive ? 'opacity-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
