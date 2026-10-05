'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ServiceGlyph } from './ServiceGlyph';
import { cn } from '@/lib/utils';

interface ServicesProps {
  dict: any;
}

const serviceKeys = [
  'custom',
  'websites',
  'ai',
  'automation',
  'dashboards',
  'integrations',
] as const;
type ServiceKey = (typeof serviceKeys)[number];

export function Services({ dict }: ServicesProps) {
  const [open, setOpen] = useState<ServiceKey | null>('custom');
  // The open-topic motion only plays after a click — not for the topic that is
  // open on load, so nothing in the first paint starts hidden or mid-animation.
  const [animKey, setAnimKey] = useState<ServiceKey | null>(null);

  return (
    <Section
      id="services"
      size="wide"
      className="relative overflow-hidden border-t border-cream/10"
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

      <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-8 md:mt-16 md:gap-8">
        <h2
          data-reveal
          style={{ '--reveal-y': '12px' } as React.CSSProperties}
          className="col-span-12 max-w-5xl text-balance font-serif text-4xl sm:text-5xl leading-[1.05] tracking-[-0.01em] text-cream md:col-span-8 md:text-6xl"
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

      <ul className="mt-20 border-t border-cream/15 md:mt-24">
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
                className="group grid w-full grid-cols-12 items-center gap-6 px-2 py-8 text-left transition-colors hover:bg-cream/[0.02] md:gap-10 md:px-4 md:py-12"
                aria-expanded={isOpen}
                aria-controls={`service-panel-${key}`}
              >
                <span className="col-span-2 font-mono text-sm font-semibold text-ember md:col-span-1">
                  0{i + 1}
                </span>
                <div className="col-span-8 flex items-center gap-4 md:col-span-9 md:gap-6">
                  <span className="svc-tile flex shrink-0 items-center justify-center rounded-xl border">
                    <ServiceGlyph kind={key} />
                  </span>
                  <h3
                    className={`font-serif text-3xl leading-tight tracking-tight transition-colors md:text-5xl ${
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
                  className={`col-span-2 flex h-10 w-10 items-center justify-end justify-self-end text-cream/40 transition-colors group-hover:text-ember md:col-span-2 md:h-12 md:w-12 ${
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
                    </div>
                    <div className="col-span-12 md:col-span-4 md:col-start-9">
                      <p className="svc-in mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/45" style={{ '--d': '0.12s' } as React.CSSProperties}>
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
    </Section>
  );
}
