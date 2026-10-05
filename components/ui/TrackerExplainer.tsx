'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import {
  ArrowUpRight,
  ChartGantt,
  Check,
  Circle,
  LoaderCircle,
  ChevronRight,
  KeyRound,
  MonitorSmartphone,
  RefreshCw,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from './Button';
import { site } from '@/lib/site';

interface TrackerExplainerProps {
  open: boolean;
  onClose: () => void;
  /** dict.process.tracker */
  t: any;
  /** dict.process.steps — phase titles for the pill */
  steps: Record<string, { number: string; title: string }>;
}

type ExplainerStep = { title: string; description: string };

/** One icon per step, in the order of dict.process.tracker.explainer.steps. */
const stepIcons: LucideIcon[] = [KeyRound, MonitorSmartphone, ChartGantt, RefreshCw];

const legend = [
  { key: 'completed', dot: 'bg-success' },
  { key: 'in_progress', dot: 'bg-warning' },
  { key: 'pending', dot: 'bg-cream/25' },
] as const;

type Status = 'completed' | 'in_progress' | 'pending';

/**
 * Sample project for the pill: the same mid-execution state the Process
 * section shows, with each phase broken into its milestones. The phase in
 * progress is opened below the pill with its milestone list.
 */
const pillPhases: { key: string; milestones: Status[] }[] = [
  { key: 'discovery', milestones: ['completed', 'completed', 'completed'] },
  { key: 'modeling', milestones: ['completed', 'completed', 'completed', 'completed'] },
  { key: 'execution', milestones: ['completed', 'completed', 'in_progress', 'pending', 'pending'] },
  { key: 'control', milestones: ['pending', 'pending', 'pending'] },
  { key: 'delivery', milestones: ['pending', 'pending', 'pending'] },
];

const phaseStatus = (ms: Status[]): Status =>
  ms.every((m) => m === 'completed')
    ? 'completed'
    : ms.some((m) => m !== 'pending')
      ? 'in_progress'
      : 'pending';

const activeIndex = pillPhases.findIndex((p) => phaseStatus(p.milestones) === 'in_progress');
const activePhase = pillPhases[activeIndex];

const allMilestones = pillPhases.flatMap((p) => p.milestones);
const progress = Math.round(
  (allMilestones.filter((m) => m === 'completed').length / allMilestones.length) * 100,
);

const ruleClass: Record<Status, string> = {
  completed: 'border-l-success',
  in_progress: 'border-l-warning',
  pending: 'border-l-cream/15',
};

const segmentClass: Record<Status, string> = {
  completed: 'bg-success',
  in_progress: 'bg-warning animate-pulse',
  pending: 'bg-cream/15',
};

const chipClass: Record<Status, string> = {
  completed: 'border-success/30 bg-success/10 text-success',
  in_progress: 'border-warning/30 bg-warning/10 text-warning',
  pending: 'border-cream/10 bg-cream/[0.03] text-cream/40',
};

const milestoneIcon: Record<Status, LucideIcon> = {
  completed: Check,
  in_progress: LoaderCircle,
  pending: Circle,
};

/** Horizontal pill: two 7rem caps around equal phases — centre of the active one. */
const markerLeft = `calc(7rem + (100% - 14rem) * ${(activeIndex + 0.5) / pillPhases.length})`;

function StatusChip({ status, label }: { status: Status; label: string }) {
  return (
    <span
      className={`shrink-0 whitespace-nowrap rounded-full border px-1.5 py-px font-mono text-[8.5px] uppercase tracking-[0.12em] ${chipClass[status]}`}
    >
      {label}
    </span>
  );
}

function MilestoneBar({ milestones }: { milestones: Status[] }) {
  const done = milestones.filter((m) => m === 'completed').length;
  return (
    <div className="flex items-center gap-2">
      <span className="flex flex-1 gap-0.5" aria-hidden>
        {milestones.map((m, j) => (
          <span key={j} className={`h-1 flex-1 rounded-full ${segmentClass[m]}`} />
        ))}
      </span>
      <span className="font-mono text-[10px] text-cream/45">
        {done}/{milestones.length}
      </span>
    </div>
  );
}

function MilestoneItem({ status, label }: { status: Status; label: string }) {
  const Icon = milestoneIcon[status];
  return (
    <li
      className={`flex items-start gap-2 rounded-md border px-3 py-2.5 ${status === 'in_progress' ? 'border-warning/30 bg-warning/[0.06]' : 'border-cream/[0.06] bg-ink-800/60'}`}
    >
      <Icon
        aria-hidden
        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${status === 'completed' ? 'text-success' : status === 'in_progress' ? 'animate-spin text-warning [animation-duration:2.5s]' : 'text-cream/25'}`}
      />
      <span className={`text-xs leading-snug ${status === 'pending' ? 'text-cream/45' : 'text-cream/85'}`}>
        {label}
      </span>
    </li>
  );
}

/** Modal that walks a prospect through how the Adapto Tracker works. */
export function TrackerExplainer({
  open,
  onClose,
  t,
  steps,
}: TrackerExplainerProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const e = t.explainer;

  useEffect(() => setMounted(true), []);

  // Scroll lock + ESC, same pattern as the mobile drawer in Header
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add('no-scroll');
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Focus the panel itself: screen readers land in the dialog, and no
    // focus ring flashes on the close button for mouse/touch users.
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.documentElement.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tracker-explainer-title"
          className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6"
        >
          <m.button
            type="button"
            aria-label={e.close}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm motion-reduce:backdrop-blur-none"
          />

          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            ref={panelRef}
            tabIndex={-1}
            className="relative max-h-[92vh] outline-none w-full max-w-[1320px] overflow-y-auto rounded-t-2xl border border-cream/10 bg-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] md:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-6 border-b border-cream/10 px-5 py-6 md:px-14 md:py-10 lg:px-16">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ember">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                  {e.eyebrow}
                </span>
                <h3
                  id="tracker-explainer-title"
                  className="mt-4 text-balance font-serif text-3xl leading-[1.1] text-cream md:text-5xl"
                >
                  {e.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-cream/60 md:text-base">
                  {e.lead}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={e.close}
                className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cream/60 transition-colors hover:bg-cream/5 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* The pill, as the Tracker shows it — phases split into milestones */}
            <div className="border-b border-cream/10 px-5 py-7 md:px-14 md:py-10 lg:px-16">
              <div className="overflow-hidden rounded-xl border border-cream/10 bg-ink-950/60">
                {/* Window chrome */}
                <div className="flex items-center gap-3 border-b border-cream/10 bg-cream/[0.02] px-3.5 py-2.5 md:gap-4 md:px-4">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-cream/15 md:h-2.5 md:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-cream/15 md:h-2.5 md:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-cream/15 md:h-2.5 md:w-2.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate rounded-md bg-cream/[0.04] px-3 py-1 text-center font-mono text-[10px] text-cream/45 md:text-[11px]">
                    tracker.adapto-sh.com
                  </span>
                  <span className="hidden rounded-full border border-cream/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/45 sm:inline">
                    {e.demo.readOnly}
                  </span>
                </div>

                {/* Project header */}
                <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:px-6 md:py-5">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-ember" aria-hidden />
                    <span className="font-serif text-lg text-cream md:text-xl">{e.demo.project}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">
                      {e.demo.progress}
                    </span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream/10 sm:w-32 sm:flex-none">
                      <span className="block h-full rounded-full bg-success" style={{ width: `${progress}%` }} />
                    </span>
                    <span className="w-9 text-right font-mono text-xs text-cream/70">{progress}%</span>
                  </div>
                </div>

                {/* Horizontal pill — wide screens */}
                <div className="hidden px-6 pb-6 lg:block">
                  {/* "You are here" marker over the active phase. Positions
                      match the pill: two 7rem caps around 5 equal phases. */}
                  <div className="relative mb-2 h-6" aria-hidden>
                    <span
                      className="absolute flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ember px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-cream shadow-[0_6px_18px_-6px_rgba(195,86,34,0.8)]"
                      style={{ left: markerLeft }}
                    >
                      <span className="h-1 w-1 animate-pulse rounded-full bg-cream" />
                      {e.demo.here}
                    </span>
                  </div>

                  <div className="flex items-stretch rounded-full border border-cream/10 bg-cream/[0.02] p-1.5">
                    <div className="flex w-[6.625rem] shrink-0 items-center justify-center rounded-l-full border-l-2 border-l-ember bg-ink-800 pl-2 font-serif text-base text-cream/70">
                      {t.start}
                    </div>
                    <div className="flex min-w-0 flex-1 gap-px bg-cream/[0.06] px-px">
                      {pillPhases.map((phase, i) => {
                        const step = steps[phase.key];
                        const status = phaseStatus(phase.milestones);
                        const active = i === activeIndex;
                        return (
                          <div
                            key={phase.key}
                            className={`relative flex h-[8.5rem] min-w-0 flex-1 flex-col justify-between border-l-2 px-3.5 py-3.5 ${ruleClass[status]} ${active ? 'bg-ink-700' : 'bg-ink-800'}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[10px] tracking-widest text-cream/35">
                                {step?.number}
                              </span>
                              <StatusChip status={status} label={e.demo.status[status]} />
                            </div>
                            <span className={`font-serif text-lg leading-[1.1] ${status === 'pending' ? 'text-cream/55' : 'text-cream'}`}>
                              {step?.title}
                            </span>
                            <MilestoneBar milestones={phase.milestones} />
                            {active && (
                              <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-ember" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex w-[6.625rem] shrink-0 items-center justify-center rounded-r-full border-r-2 border-r-ember/30 bg-ink-800 pr-2 font-serif text-base text-cream/40">
                      {t.end}
                    </div>
                  </div>

                  {/* The active phase, opened: its milestones */}
                  <div className="relative mt-4 rounded-lg border border-cream/10 bg-cream/[0.02] p-4">
                    <span
                      aria-hidden
                      className="absolute -top-[5px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-cream/10 bg-ink-900"
                      style={{ left: markerLeft }}
                    />
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">
                      {steps[activePhase.key]?.number} · {steps[activePhase.key]?.title} · {e.demo.milestones}
                    </p>
                    <ol className="mt-3 grid grid-cols-5 gap-2">
                      {activePhase.milestones.map((m, j) => (
                        <MilestoneItem key={j} status={m} label={e.demo.sample[j]} />
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Vertical pill — phones and tablets */}
                <div className="px-3 pb-3 md:px-6 md:pb-6 lg:hidden">
                  <div className="rounded-[1.75rem] border border-cream/10 bg-cream/[0.02] p-1.5">
                    <div className="rounded-t-[1.4rem] border-t-2 border-t-ember bg-ink-800 py-3 text-center font-serif text-base text-cream/70">
                      {t.start}
                    </div>
                    <div className="flex flex-col gap-px bg-cream/[0.06] py-px">
                      {pillPhases.map((phase, i) => {
                        const step = steps[phase.key];
                        const status = phaseStatus(phase.milestones);
                        const active = i === activeIndex;
                        return (
                          <div
                            key={phase.key}
                            className={`border-l-2 px-4 py-3.5 ${ruleClass[status]} ${active ? 'bg-ink-700' : 'bg-ink-800'}`}
                          >
                            {active && (
                              <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-ember px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-cream">
                                <span className="h-1 w-1 animate-pulse rounded-full bg-cream" />
                                {e.demo.here}
                              </span>
                            )}
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex min-w-0 items-baseline gap-2.5">
                                <span className="font-mono text-[10px] tracking-widest text-cream/35">
                                  {step?.number}
                                </span>
                                <span className={`truncate font-serif text-lg leading-tight ${status === 'pending' ? 'text-cream/55' : 'text-cream'}`}>
                                  {step?.title}
                                </span>
                              </div>
                              <StatusChip status={status} label={e.demo.status[status]} />
                            </div>
                            <div className="mt-2.5">
                              <MilestoneBar milestones={phase.milestones} />
                            </div>
                            {active && (
                              <ol className="mt-3.5 space-y-1.5">
                                {phase.milestones.map((m, j) => (
                                  <MilestoneItem key={j} status={m} label={e.demo.sample[j]} />
                                ))}
                              </ol>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="rounded-b-[1.4rem] border-b-2 border-b-ember/30 bg-ink-800 py-3 text-center font-serif text-base text-cream/40">
                      {t.end}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-cream/55">{e.pillCaption}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {legend.map((l) => (
                    <span
                      key={l.key}
                      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/50"
                    >
                      <span className={`h-1 w-3 rounded-full ${l.dot}`} />
                      {e.legend[l.key]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ol className="grid gap-6 px-5 py-7 md:grid-cols-2 md:gap-10 md:px-14 md:py-12 lg:grid-cols-4 lg:gap-8 lg:px-16">
              {(e.steps as ExplainerStep[]).map((step, i, all) => {
                const Icon = stepIcons[i] ?? KeyRound;
                const isLast = i === all.length - 1;
                return (
                  <li key={i} className="relative flex gap-4 md:block">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ember/30 bg-ember/10 text-ember md:h-12 md:w-12">
                        <Icon className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="hidden font-mono text-xs text-cream/40 md:inline">
                        0{i + 1}
                      </span>
                    </div>

                    {/* Left-to-right connector to the next step (4-up only) */}
                    {!isLast && (
                      <span
                        aria-hidden
                        className="absolute left-[5.5rem] right-0 top-6 hidden items-center lg:flex"
                      >
                        <span className="h-px flex-1 border-t border-dashed border-cream/15" />
                        <ChevronRight className="-ml-1 h-3.5 w-3.5 text-cream/25" />
                      </span>
                    )}

                    <div className="min-w-0">
                      <h4 className="font-serif text-xl leading-tight text-cream md:mt-5 md:text-2xl">
                        <span className="mr-2 font-mono text-[11px] text-cream/35 md:hidden">
                          0{i + 1}
                        </span>
                        {step.title}
                      </h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-cream/60 md:mt-2">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="flex flex-col gap-4 border-t border-cream/10 bg-cream/[0.02] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-14 md:py-6 lg:px-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40">
                {e.footnote}
              </p>
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
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
