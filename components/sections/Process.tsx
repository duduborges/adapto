'use client';

import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Gift } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { TrackerExplainer } from '@/components/ui/TrackerExplainer';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

interface ProcessProps {
  dict: any;
}

const phaseKeys = ['discovery', 'modeling', 'execution', 'control', 'delivery'] as const;
type PhaseKey = (typeof phaseKeys)[number];

type Status = 'completed' | 'in_progress' | 'pending';

type Step = { number: string; title: string; description: string };

/**
 * A sample project frozen mid-way, so the section reads like the Adapto
 * Tracker a client gets. Status is carried by the left rule alone — the
 * first version added badges, a progress bar and a panel, and it got noisy.
 */
const demoStatus: Record<PhaseKey, Status> = {
  discovery: 'completed',
  modeling: 'completed',
  execution: 'in_progress',
  control: 'pending',
  delivery: 'pending',
};

const focusKey: PhaseKey = 'execution';

/** Discovery + modeling cost nothing — pricing only exists once scope is real. */
const freePhases: PhaseKey[] = ['discovery', 'modeling'];

const ruleClass: Record<Status, string> = {
  completed: 'border-l-success',
  in_progress: 'border-l-warning',
  pending: 'border-l-cream/15',
};

const dotClass: Record<Status, string> = {
  completed: 'bg-success',
  in_progress: 'bg-warning',
  pending: 'bg-cream/25',
};

export function Process({ dict }: ProcessProps) {
  const t = dict.process.tracker;
  const steps = dict.process.steps as Record<PhaseKey, Step>;
  const [selected, setSelected] = useState<PhaseKey>(focusKey);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const closeExplainer = useCallback(() => setExplainerOpen(false), []);

  return (
    <Section
      id="process"
      size="wide"
      className="relative overflow-hidden border-t border-cream/10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-glow"
        style={{ '--glow': 'radial-gradient(640px circle at calc(25% + 350px) calc(75% - 250px), black 0%, rgba(0,0,0,0.5) 40%, transparent 72%)' } as React.CSSProperties}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-1/4 left-1/4 -z-10 h-[500px] w-[700px] rounded-full bg-ember/[0.07] blur-[130px]"
      />

      <SectionLabel label={dict.process.eyebrow} />

      <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-8 md:mt-16 md:gap-8">
        <h2
          data-reveal
          style={{ '--reveal-y': '12px' } as React.CSSProperties}
          className="col-span-12 max-w-5xl text-balance font-serif text-4xl sm:text-5xl leading-[1.05] tracking-[-0.01em] text-cream md:col-span-8 md:text-6xl"
        >
          {dict.process.title.replace(/\.$/, '')}
          <span className="text-ember">.</span>
        </h2>
        <div
          data-reveal
          style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}
          className="col-span-12 flex items-center gap-3 self-end md:col-span-4"
        >
          <span
            aria-hidden
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ember/40 bg-ember/10 text-ember md:h-8 md:w-8"
          >
            <Gift className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </span>
          <p className="text-sm font-semibold leading-snug text-ember md:text-base">
            {dict.process.freeHeadline}
          </p>
        </div>
      </div>

      {/* Desktop — the tracker pill */}
      <div
        data-reveal
        style={{ '--reveal-y': '14px' } as React.CSSProperties}
        className="mt-20 hidden lg:block md:mt-24"
      >
        <div className="flex items-stretch rounded-full border border-cream/10 bg-cream/[0.02] p-2">
          <div className="flex h-32 w-28 shrink-0 items-center justify-center rounded-l-full border-l-2 border-l-ember bg-ink-800 pl-2 font-serif text-lg text-cream/70 xl:w-32">
            {t.start}
          </div>

          <div className="flex min-w-0 flex-1 gap-px bg-cream/[0.06] px-px">
            {phaseKeys.map((key) => {
              const isSelected = selected === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(key)}
                  aria-pressed={isSelected}
                  className={cn(
                    'relative flex h-32 min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-2 border-l-2 px-3 text-center',
                    'ring-1 ring-inset ring-cream/[0.06] transition-all duration-300',
                    'hover:-translate-y-1 hover:shadow-[0_10px_24px_-10px_rgba(195,86,34,0.45)]',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ember',
                    isSelected ? 'bg-ink-700' : 'bg-ink-800 hover:bg-ink-700/60',
                    ruleClass[demoStatus[key]],
                  )}
                >
                  {isSelected && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-ember"
                    />
                  )}
                  {key === focusKey && (
                    <span
                      aria-label={t.focus}
                      className="absolute right-3 top-3 h-1.5 w-1.5 animate-pulse rounded-full bg-ember"
                    />
                  )}
                  <span className="font-mono text-[10px] tracking-widest text-cream/35">
                    {steps[key].number}
                  </span>
                  <span
                    className={cn(
                      'font-serif text-xl leading-[1.1] transition-colors duration-300 xl:text-2xl',
                      isSelected ? 'text-cream' : 'text-cream/60',
                    )}
                  >
                    {steps[key].title}
                  </span>
                  {freePhases.includes(key) && (
                    <span className="inline-flex items-center rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ember">
                      {t.free}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex h-32 w-28 shrink-0 items-center justify-center rounded-r-full border-r-2 border-r-ember/30 bg-ink-800 pr-2 font-serif text-lg text-cream/40 xl:w-32">
            {t.end}
          </div>
        </div>

        <div className="mt-8 min-h-[3.5rem] max-w-2xl">
          {/* initial={false}: the first description is in the server HTML at full
              opacity; the fade only plays when a visitor picks another phase */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-base leading-relaxed text-cream/60 md:text-lg"
            >
              {steps[selected].description}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile / tablet — a plain rail */}
      <ol className="mt-16 lg:hidden">
        {phaseKeys.map((key, i) => {
          const step = steps[key];
          const isLast = i === phaseKeys.length - 1;
          return (
            <li key={key} className="relative flex gap-5 pb-10 last:pb-0">
              <div className="relative flex w-2 shrink-0 justify-center">
                <span
                  className={cn(
                    'relative z-10 mt-2.5 h-2 w-2 rounded-full',
                    dotClass[demoStatus[key]],
                    key === focusKey && 'animate-pulse',
                  )}
                />
                {!isLast && (
                  <span aria-hidden className="absolute bottom-0 top-6 w-px bg-cream/10" />
                )}
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[10px] tracking-widest text-cream/35">
                  {step.number}
                </span>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-serif text-2xl text-cream">{step.title}</h3>
                  {freePhases.includes(key) && (
                    <span className="inline-flex items-center rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ember">
                      {t.free}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-cream/60">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Tracker CTA — explain it to prospects, open it for clients */}
      <div className="mt-14 flex flex-col gap-8 border-t border-cream/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <p className="font-serif text-2xl leading-tight text-cream md:text-3xl">
            {t.explainer.prompt}
          </p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setExplainerOpen(true)}
            aria-haspopup="dialog"
            className="self-start md:self-auto"
          >
            {t.explainer.button}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
          <p className="text-sm text-cream/50">{t.cta.description}</p>
          <Button
            href={site.trackerUrl}
            external
            variant="primary"
            size="md"
            className="self-start md:self-auto"
          >
            {t.cta.button}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </div>
      </div>

      <TrackerExplainer
        open={explainerOpen}
        onClose={closeExplainer}
        t={t}
        steps={steps}
      />
    </Section>
  );
}
