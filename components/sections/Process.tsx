'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, CircleDashed, Timer } from 'lucide-react';
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
 * Tracker a client actually gets: two phases done, one in focus, two ahead.
 */
const demoStatus: Record<PhaseKey, Status> = {
  discovery: 'completed',
  modeling: 'completed',
  execution: 'in_progress',
  control: 'pending',
  delivery: 'pending',
};

const focusKey: PhaseKey = 'execution';

/** Same visual language as the tracker: a coloured left rule plus a faint wash. */
const statusStyle: Record<
  Status,
  { rule: string; wash: string; badge: string; dot: string; Icon: React.ElementType }
> = {
  completed: {
    rule: 'border-l-success',
    wash: 'bg-success/[0.07]',
    badge: 'bg-success/15 text-success',
    dot: 'bg-success',
    Icon: Check,
  },
  in_progress: {
    rule: 'border-l-warning',
    wash: 'bg-warning/[0.08]',
    badge: 'bg-warning/15 text-warning',
    dot: 'bg-warning',
    Icon: Timer,
  },
  pending: {
    rule: 'border-l-cream/20',
    wash: 'bg-transparent',
    badge: 'bg-cream/[0.06] text-cream/50',
    dot: 'bg-cream/25',
    Icon: CircleDashed,
  },
};

function StatusBadge({ status, label }: { status: Status; label: string }) {
  const { badge, Icon } = statusStyle[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider',
        badge,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

function FocusMark({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ember">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
      {label}
    </span>
  );
}

export function Process({ dict }: ProcessProps) {
  const t = dict.process.tracker;
  const steps = dict.process.steps as Record<PhaseKey, Step>;
  const [selected, setSelected] = useState<PhaseKey>(focusKey);

  const done = phaseKeys.filter((k) => demoStatus[k] === 'completed').length;
  const percent = Math.round((done / phaseKeys.length) * 100);
  const selectedStep = steps[selected];
  const selectedStatus = demoStatus[selected];

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

      {/* Progress summary — the first thing a client sees in the tracker */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mt-16 md:mt-24"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-sm text-cream/60 md:text-base">
            <span className="font-medium text-cream">
              {t.progress
                .replace('{done}', String(done))
                .replace('{total}', String(phaseKeys.length))}
            </span>
            <span className="text-cream/30"> · </span>
            {t.current} <span className="text-ember">{steps[focusKey].title}</span>
          </p>
          <span className="font-mono text-xs tracking-wider text-cream/40">{percent}%</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-cream/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${percent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-ember"
          />
        </div>
      </motion.div>

      {/* Desktop — the tracker pill */}
      <div className="mt-10 hidden lg:block">
        <div className="flex items-stretch rounded-full border border-cream/10 bg-cream/[0.03] p-2.5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
          {/* Start cap */}
          <div className="flex h-40 w-28 shrink-0 xl:w-36 flex-col items-center justify-center rounded-l-full border-l-4 border-l-ember bg-ink-800 pl-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
              {t.start.label}
            </span>
            <span className="mt-1.5 font-serif text-xl text-cream">{t.start.title}</span>
          </div>

          <div className="flex min-w-0 flex-1 gap-px bg-cream/10 px-px">
            {phaseKeys.map((key, i) => {
              const status = demoStatus[key];
              const style = statusStyle[status];
              const isSelected = selected === key;
              const isFocus = key === focusKey;
              return (
                <motion.button
                  key={key}
                  type="button"
                  onClick={() => setSelected(key)}
                  aria-pressed={isSelected}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                  className={cn(
                    'group relative flex h-40 min-w-0 flex-1 flex-col items-center justify-center gap-2.5 border-l-4 bg-ink-800 px-3 text-center xl:px-4',
                    'transition-colors duration-300 hover:bg-ink-700',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ember',
                    style.rule,
                  )}
                >
                  <span aria-hidden className={cn('pointer-events-none absolute inset-0', style.wash)} />
                  {/* Selection frame */}
                  <span
                    aria-hidden
                    className={cn(
                      'pointer-events-none absolute inset-0 ring-1 ring-inset transition-opacity duration-300',
                      isSelected ? 'opacity-100 ring-ember/60' : 'opacity-0 ring-transparent',
                    )}
                  />

                  {/* Narrow pills drop the phase number on the focus card so it fits one line. */}
                  <span className="relative flex items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-cream/40">
                    {isFocus && (
                      <>
                        <FocusMark label={t.focus} />
                        <span aria-hidden className="hidden text-cream/20 xl:inline">·</span>
                      </>
                    )}
                    <span className={cn(isFocus && 'hidden xl:inline')}>
                      {t.phase} {steps[key].number}
                    </span>
                  </span>
                  <span className="relative font-serif text-xl leading-[1.1] text-cream xl:text-2xl">
                    {steps[key].title}
                  </span>
                  <span className="relative">
                    <StatusBadge status={status} label={t.status[status]} />
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* End cap */}
          <div className="flex h-40 w-28 shrink-0 xl:w-36 flex-col items-center justify-center rounded-r-full border-r-4 border-r-ember/40 bg-ink-800 pr-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
              {t.end.label}
            </span>
            <span className="mt-1.5 font-serif text-xl text-cream/60">{t.end.title}</span>
          </div>
        </div>

        {/* Detail of the selected phase, like the tracker's node panel */}
        <div className="mt-6 grid grid-cols-12 gap-8">
          <div className="col-span-8 min-h-[9.5rem] border border-cream/10 bg-ink-800/60 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ember">
                    {t.phase} {selectedStep.number}
                  </span>
                  <h3 className="font-serif text-2xl text-cream">{selectedStep.title}</h3>
                  <StatusBadge status={selectedStatus} label={t.status[selectedStatus]} />
                </div>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-cream/60">
                  {selectedStep.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="col-span-4 self-center font-serif text-base italic text-cream/40">
            ↳ {t.annotation}
            <span className="mt-2 block font-sans text-xs not-italic text-cream/30">{t.hint}</span>
          </p>
        </div>
      </div>

      {/* Mobile / tablet — the tracker's vertical stack */}
      <ol className="relative mt-10 lg:hidden">
        {phaseKeys.map((key, i) => {
          const status = demoStatus[key];
          const step = steps[key];
          const isLast = i === phaseKeys.length - 1;
          return (
            <li key={key} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Rail */}
              <div className="relative flex w-3 shrink-0 justify-center">
                <span
                  className={cn(
                    'relative z-10 mt-1.5 h-3 w-3 rounded-full ring-4 ring-ink',
                    statusStyle[status].dot,
                  )}
                />
                {!isLast && (
                  <span aria-hidden className="absolute bottom-[-0.5rem] top-5 w-px bg-cream/15" />
                )}
              </div>

              <div
                className={cn(
                  'min-w-0 flex-1 border-l-4 bg-ink-800 p-4',
                  statusStyle[status].rule,
                  key === focusKey && 'ring-1 ring-inset ring-ember/50',
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cream/40">
                    {key === focusKey && (
                      <>
                        <FocusMark label={t.focus} />
                        <span aria-hidden className="text-cream/20">·</span>
                      </>
                    )}
                    {t.phase} {step.number}
                  </span>
                  <StatusBadge status={status} label={t.status[status]} />
                </div>
                <h3 className="mt-2 font-serif text-2xl text-cream">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/60">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Tracker CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mt-16 flex flex-col gap-6 border-t border-cream/10 pt-10 md:flex-row md:items-center md:justify-between"
      >
        <div className="max-w-xl">
          <p className="font-serif text-2xl text-cream md:text-3xl">{t.cta.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-cream/60 md:text-base">
            {t.cta.description}
          </p>
        </div>
        <Button href={site.trackerUrl} external size="lg" className="self-start md:self-auto">
          {t.cta.button}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Button>
      </motion.div>
    </Section>
  );
}
