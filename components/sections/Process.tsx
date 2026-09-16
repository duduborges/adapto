'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
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

  return (
    <Section
      id="process"
      size="wide"
      className="relative overflow-hidden border-t border-cream/10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-1/4 left-1/4 -z-10 h-[500px] w-[700px] rounded-full bg-ember/[0.07] blur-[130px]"
      />

      <SectionLabel label={dict.process.eyebrow} />

      <div className="mt-12 grid grid-cols-12 gap-8 md:mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="col-span-12 max-w-5xl text-balance font-serif text-4xl leading-[1.05] tracking-[-0.01em] text-cream md:col-span-8 md:text-6xl"
        >
          {dict.process.title.replace(/\.$/, '')}
          <span className="text-ember">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-12 self-end text-base leading-relaxed text-cream/60 md:col-span-4 md:text-lg"
        >
          {dict.process.subtitle}
        </motion.p>
      </div>

      {/* Desktop — the tracker pill */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
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
                    'relative flex h-32 min-w-0 flex-1 flex-col items-center justify-center gap-2 border-l-2 px-3 text-center',
                    'transition-colors duration-300',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ember',
                    isSelected ? 'bg-ink-700' : 'bg-ink-800 hover:bg-ink-700/60',
                    ruleClass[demoStatus[key]],
                  )}
                >
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
                </button>
              );
            })}
          </div>

          <div className="flex h-32 w-28 shrink-0 items-center justify-center rounded-r-full border-r-2 border-r-ember/30 bg-ink-800 pr-2 font-serif text-lg text-cream/40 xl:w-32">
            {t.end}
          </div>
        </div>

        <div className="mt-8 min-h-[3.5rem] max-w-2xl">
          <AnimatePresence mode="wait">
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
      </motion.div>

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
                <h3 className="mt-1 font-serif text-2xl text-cream">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/60">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Tracker CTA */}
      <div className="mt-14 flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <p className="text-sm text-cream/50 md:text-base">{t.cta.description}</p>
        <Button
          href={site.trackerUrl}
          external
          variant="secondary"
          size="sm"
          className="self-start md:self-auto"
        >
          {t.cta.button}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Button>
      </div>
    </Section>
  );
}
