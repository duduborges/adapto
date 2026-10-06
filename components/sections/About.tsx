'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';

interface AboutProps {
  dict: any;
}

export function About({ dict }: AboutProps) {
  return (
    <Section id="manifesto" size="wide" className="relative">
      <SectionLabel label={dict.manifesto.eyebrow} />

      {/* Heading + lead — asymmetric editorial grid */}
      <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-8 md:mt-16 md:gap-8">
        <h2
          data-reveal
          style={{ '--reveal-y': '12px' } as React.CSSProperties}
          className="col-span-12 max-w-5xl text-balance font-brand text-4xl sm:text-5xl leading-[1.05] tracking-[-0.01em] text-cream md:text-6xl lg:text-7xl"
        >
          {/* The closing mark (. ? !) is the ember accent; a title without one
              gets a period. French keeps its non-breaking space before "?" */}
          {dict.manifesto.title.replace(/[.?!]$/, '')}
          <span className="text-ember">{dict.manifesto.title.match(/[.?!]$/)?.[0] ?? '.'}</span>
        </h2>
      </div>

      {/* Long-form body with drop cap */}
      <div className="mt-20 grid grid-cols-12 gap-x-4 gap-y-8 md:gap-8 md:mt-24">
        <aside
          data-reveal
          style={{ '--reveal-duration': '0.5s' } as React.CSSProperties}
          className="col-span-12 space-y-3 md:col-span-3"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/50">
            ↳ {dict.manifesto.marginaliaLabel}
          </p>
          <p className="font-brand text-base leading-snug text-cream/50">
            “{dict.manifesto.marginalia}”
          </p>
        </aside>

        <div
          data-reveal
          style={{ '--reveal-y': '12px', '--reveal-delay': '0.1s' } as React.CSSProperties}
          className="col-span-12 max-w-2xl md:col-span-8 md:col-start-5"
        >
          <p className="text-xl leading-[1.55] text-cream md:text-2xl">
            {dict.manifesto.lead}
          </p>

          <div className="mt-10 space-y-6 text-base leading-[1.7] text-cream/70 md:text-lg">
            {dict.manifesto.paragraphs.map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Pillars as a numbered list, not cards */}
      <div className="mt-28 grid grid-cols-12 gap-x-4 gap-y-8 md:gap-8 md:mt-36">
        <div className="col-span-12 md:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/50">
            ↳ Three principles
          </p>
        </div>
        <div className="col-span-12 md:col-span-9">
          <ul className="divide-y divide-cream/10 border-y border-cream/10">
            {(['inside', 'process', 'partnership'] as const).map((key, i) => {
              const p = dict.manifesto.pillars[key];
              return (
                <li
                  data-reveal
                  style={{ '--reveal-y': '12px', '--reveal-duration': '0.4s', '--reveal-delay': `${i * 0.06}s` } as React.CSSProperties}
                  key={key}
                  className="group grid grid-cols-12 items-baseline gap-4 py-8 md:gap-8 md:py-10"
                >
                  <span className="col-span-2 font-mono text-sm text-ember-500 md:col-span-1">
                    0{i + 1}
                  </span>
                  <h3 className="col-span-10 font-brand text-2xl text-cream md:col-span-4 md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="col-span-12 text-base leading-relaxed text-cream/60 md:col-span-7">
                    {p.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
