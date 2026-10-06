'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AdaptoFusion } from '@/components/ui/AdaptoFusion';

interface DifferentialsProps {
  dict: any;
}

/**
 * Plays each comparison row's sequence (see `.why-*` in globals.css) as the
 * visitor scrolls to it, one row at a time — rows below stay hidden. Rows
 * start in their final state in the HTML; only rows still below the fold are
 * "armed" (rewound) once JS runs, so nothing is ever hidden from crawlers.
 * Reduced motion: never armed.
 */
function useRowSequence(listRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const list = listRef.current;
    if (!list || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-row]'));
    // One row at a time, top to bottom: a row only starts once it has been
    // reached AND the row above it started at least GAP ms earlier.
    const GAP = 650;
    const reached = new Set<HTMLElement>();
    let lastStart = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const pump = () => {
      timer = undefined;
      const next = rows.find((r) => 'armed' in r.dataset && !('on' in r.dataset));
      if (!next || !reached.has(next)) return;
      const wait = lastStart + GAP - performance.now();
      if (wait > 0) {
        timer = setTimeout(pump, wait);
        return;
      }
      next.dataset.on = '';
      lastStart = performance.now();
      pump();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reached.add(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
        if (!timer) pump();
      },
      // A row counts as reached once its top passes 75% of the screen height
      { rootMargin: '0px 0px -25% 0px' },
    );
    for (const row of rows) {
      // Already scrolled past: leave it finished
      if (row.getBoundingClientRect().bottom < 0) continue;
      row.dataset.armed = '';
      io.observe(row);
    }
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [listRef]);
}

export function Differentials({ dict }: DifferentialsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  useRowSequence(listRef);

  const rows = [
    {
      them: dict.differentials.contrast.themEmbedded,
      us: dict.differentials.items.embedded.title,
      detail: dict.differentials.items.embedded.description,
    },
    {
      them: dict.differentials.contrast.themDiagnostic,
      us: dict.differentials.items.diagnostic.title,
      detail: dict.differentials.items.diagnostic.description,
    },
    {
      them: dict.differentials.contrast.themHonest,
      us: dict.differentials.items.honest.title,
      detail: dict.differentials.items.honest.description,
    },
    {
      them: dict.differentials.contrast.themLasting,
      us: dict.differentials.items.lasting.title,
      detail: dict.differentials.items.lasting.description,
    },
  ];

  return (
    <Section
      id="why"
      size="wide"
      className="relative overflow-hidden border-t border-cream/10"
    >
      {/* Ember bloom — give the section more visual weight */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/2 top-1/2 -z-10 h-[640px] w-[640px] -translate-y-1/2 translate-x-1/2 rounded-full bg-ember/8 blur-[160px]"
      />

      <SectionLabel label={dict.differentials.eyebrow} />

      <div className="mt-12 grid grid-cols-12 items-center gap-x-4 gap-y-8 md:mt-16 md:gap-8">
        <div className="col-span-12 flex flex-col gap-8 lg:col-span-8">
          <h2
            data-reveal
            style={{ '--reveal-y': '12px' } as React.CSSProperties}
            className="max-w-5xl text-balance font-brand text-4xl sm:text-5xl leading-[1.02] tracking-[-0.015em] text-cream md:text-7xl"
          >
            {dict.differentials.title.replace(/\.$/, '')}
            <span className="text-ember">.</span>
          </h2>
          <p
            data-reveal
            style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}
            className="max-w-2xl text-lg leading-relaxed text-cream/70 md:text-xl"
          >
            {dict.differentials.subtitle}
          </p>
        </div>

        {/* Adapto (ember) joining the client's company (ring), on the hero
            grid — lit around the visual and fading out before the edges */}
        <div className="relative col-span-12 mx-auto w-full max-w-[260px] md:max-w-[300px] lg:col-span-4 lg:max-w-[340px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-[45%] -z-10 grid-glow"
            style={{ '--glow': 'radial-gradient(closest-side circle at 50% 50%, black 0%, rgba(0,0,0,0.55) 45%, transparent 100%)' } as React.CSSProperties}
          />
          <AdaptoFusion
            youLabel={dict.differentials.visual.you}
            usLabel={dict.differentials.visual.us}
            className="w-full"
          />
        </div>
      </div>

      <div ref={listRef} className="mt-20 md:mt-24">
        {/* Column headers — Adapto column has stronger visual weight */}
        <div className="grid grid-cols-12 items-center gap-4 border-b border-cream/15 pb-4 md:gap-8">
          <span className="col-span-1 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/50">
            #
          </span>
          <span className="col-span-5 font-mono text-xs uppercase tracking-[0.2em] text-cream/50">
            {dict.differentials.contrast.themHeading}
          </span>
          <span className="col-span-6 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ember-500">
            <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_6px_rgba(195,86,34,0.9)]" />
            {dict.differentials.contrast.usHeading}
          </span>
        </div>

        {rows.map((row, i) => (
          <div
            key={i}
            data-row
            className="why-row grid grid-cols-12 gap-4 border-b border-cream/10 py-10 md:gap-8 md:py-16"
          >
            <span className="col-span-1 pt-1 font-mono text-sm text-cream/50">
              0{i + 1}
            </span>

            {/* "Them" — shows large and white, gets struck, then shrinks and greys */}
            <div className="col-span-11 md:col-span-5">
              <div className="flex items-start gap-3">
                <X className="why-x mt-1.5 h-5 w-5 shrink-0 text-cream/50" aria-hidden />
                <p className="why-them">
                  <span className="why-strike">{row.them}</span>
                </p>
              </div>
            </div>

            {/* "Adapto" — enters once the claim is struck: bar grows, check is
                drawn, the panel lights up */}
            <div className="why-panel col-span-12 md:col-span-6">
              <div className="relative overflow-hidden rounded-r-lg py-4 pl-6 pr-4 md:pl-8">
                <span aria-hidden className="why-bar absolute inset-y-0 left-0 w-0.5 bg-ember" />
                <span
                  aria-hidden
                  className="why-glow absolute inset-0 bg-gradient-to-r from-ember/[0.16] via-ember/[0.07] to-ember/[0.02]"
                />
                <span
                  aria-hidden
                  className="why-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-ember/25 to-transparent"
                />
                <div className="relative flex items-start gap-4">
                  <span className="why-ring mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ember/50 bg-ember/10 md:h-9 md:w-9">
                    <svg viewBox="0 0 24 24" className="why-check h-4 w-4 text-ember md:h-5 md:w-5" aria-hidden>
                      <path
                        d="M20 6 9 17l-5-5"
                        pathLength={1}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <h3 className="why-title font-brand text-3xl leading-tight text-cream md:text-4xl">
                      {row.us}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-cream/75 md:text-lg">
                      {row.detail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
