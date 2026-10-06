'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import {
  ArrowUpRight,
  Boxes,
  Check,
  ChevronRight,
  Circle,
  Flag,
  Globe,
  KeyRound,
  Link2,
  ListChecks,
  LoaderCircle,
  Mail,
  MailCheck,
  MessageCircle,
  MonitorSmartphone,
  Play,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { site } from '@/lib/site';

/*
 * The Adapto Tracker, explained with a working sample of its "pill": a
 * horizontal timeline of one project (a room), made of a Start node,
 * milestones (development sprints) and checkpoints (pauses that also email
 * the client) in sequence, and an End node. Clients open it with the room's
 * access code, read-only. Selecting a node shows what the client would read
 * in it.
 */

type Status = 'completed' | 'in_progress' | 'pending';
type NodeType = 'start' | 'milestone' | 'checkpoint' | 'end';

interface DemoNode {
  type: NodeType;
  status: Status;
  title: string;
  date: string;
  objective?: string;
  aligned?: string;
  links?: string[];
  delivers?: string;
  email?: string;
  summary?: string;
  link?: string;
}

interface Copy {
  eyebrow: string;
  title: string;
  lead: string;
  demo: {
    project: string;
    code: string;
    readOnly: string;
    here: string;
    hint: string;
    status: Record<Status, string>;
    types: Record<NodeType, string>;
    fields: Record<
      'objective' | 'aligned' | 'links' | 'delivers' | 'screens' | 'email' | 'summary' | 'finalLink',
      string
    >;
    nodes: DemoNode[];
  };
  typesLabel: string;
  types: Record<NodeType, { title: string; description: string }>;
  stepsLabel: string;
  steps: { title: string; description: string }[];
  footnote: string;
  close: string;
}

interface TrackerExplainerProps {
  open: boolean;
  onClose: () => void;
  /** dict.process.tracker */
  t: { cta: { button: string }; explainer: Copy };
}

const typeIcon: Record<NodeType, LucideIcon> = {
  start: Play,
  milestone: Boxes,
  checkpoint: MailCheck,
  end: Flag,
};

const stepIcons: LucideIcon[] = [KeyRound, MonitorSmartphone, ListChecks, MessageCircle];

const statusIcon: Record<Status, LucideIcon> = {
  completed: Check,
  in_progress: LoaderCircle,
  pending: Circle,
};

const ruleClass: Record<Status, string> = {
  completed: 'border-l-success',
  in_progress: 'border-l-warning',
  pending: 'border-l-cream/15',
};

const chipClass: Record<Status, string> = {
  completed: 'border-success/30 bg-success/10 text-success',
  in_progress: 'border-warning/30 bg-warning/10 text-warning',
  pending: 'border-cream/10 bg-cream/[0.03] text-cream/45',
};

const dotClass: Record<Status, string> = {
  completed: 'bg-success',
  in_progress: 'bg-warning',
  pending: 'bg-cream/25',
};

function StatusChip({ status, label }: { status: Status; label: string }) {
  const Icon = statusIcon[status];
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-1.5 py-px font-mono text-[8.5px] uppercase tracking-[0.12em]',
        chipClass[status],
      )}
    >
      <Icon
        aria-hidden
        className={cn('h-2.5 w-2.5', status === 'in_progress' && 'animate-spin [animation-duration:2.5s]')}
      />
      {label}
    </span>
  );
}

/** A mock screenshot for a sprint's images: window bar + a few UI lines. */
function ScreenThumb({ variant }: { variant: number }) {
  return (
    <div className="aspect-[4/3] overflow-hidden rounded-md border border-cream/10 bg-ink-950/70">
      <div className="flex gap-1 border-b border-cream/10 px-2 py-1.5">
        <span className="h-1 w-1 rounded-full bg-cream/20" />
        <span className="h-1 w-1 rounded-full bg-cream/20" />
        <span className="h-1 w-1 rounded-full bg-cream/20" />
      </div>
      <div className="space-y-1.5 p-2.5">
        <span className="block h-1.5 w-1/2 rounded-full bg-cream/25" />
        {variant === 1 ? (
          <span className="flex h-8 items-end gap-1 pt-1">
            {[40, 70, 55, 90, 65].map((h, i) => (
              <span key={i} className="flex-1 rounded-sm bg-ember/50" style={{ height: `${h}%` }} />
            ))}
          </span>
        ) : (
          <>
            <span className="block h-1 w-full rounded-full bg-cream/10" />
            <span className="block h-1 w-5/6 rounded-full bg-cream/10" />
            <span className="block h-1 w-2/3 rounded-full bg-cream/10" />
            <span className={cn('mt-2 block h-2.5 w-1/3 rounded', variant === 0 ? 'bg-ember/60' : 'bg-success/50')} />
          </>
        )}
      </div>
    </div>
  );
}

/** What the client reads inside a node. */
function NodeDetail({ node, d }: { node: DemoNode; d: Copy['demo'] }) {
  const Icon = typeIcon[node.type];
  const label = 'font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40';
  return (
    <div className="rounded-lg border border-cream/10 bg-cream/[0.02] p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg border',
            node.type === 'checkpoint'
              ? 'border-ember/40 bg-ember/10 text-ember'
              : 'border-cream/15 bg-cream/[0.04] text-cream/70',
          )}
        >
          <Icon aria-hidden className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className={label}>{d.types[node.type]}</span>
        <span className="font-serif text-xl leading-tight text-cream">{node.title}</span>
        <StatusChip status={node.status} label={d.status[node.status]} />
        <span className="ml-auto font-mono text-[11px] text-cream/40">{node.date}</span>
      </div>

      {node.type === 'start' && (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <p className={label}>{d.fields.objective}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-cream/80">{node.objective}</p>
          </div>
          <div>
            <p className={label}>{d.fields.aligned}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-cream/80">{node.aligned}</p>
          </div>
          <div>
            <p className={label}>{d.fields.links}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {node.links?.map((l) => (
                <li
                  key={l}
                  className="inline-flex items-center gap-1.5 rounded-md border border-cream/10 bg-ink-800 px-2.5 py-1 text-xs text-cream/75"
                >
                  <Link2 aria-hidden className="h-3 w-3 text-ember" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {node.type === 'milestone' && (
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-start md:gap-8">
          <div>
            <p className={label}>{d.fields.delivers}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-cream/80 md:text-base">{node.delivers}</p>
          </div>
          {node.status !== 'pending' && (
            <div>
              <p className={label}>{d.fields.screens}</p>
              <div className="mt-2 grid w-full grid-cols-3 gap-2 md:w-72">
                {[0, 1, 2].map((v) => (
                  <ScreenThumb key={v} variant={v} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {node.type === 'checkpoint' && (
        <div className="mt-4 rounded-md border border-ember/25 bg-ember/[0.05] p-3.5">
          <p className={cn(label, 'flex items-center gap-2 text-ember/80')}>
            <Mail aria-hidden className="h-3.5 w-3.5" />
            {d.fields.email}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-cream/85 md:text-base">“{node.email}”</p>
        </div>
      )}

      {node.type === 'end' && (
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end md:gap-8">
          <div>
            <p className={label}>{d.fields.summary}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-cream/80 md:text-base">{node.summary}</p>
          </div>
          <div>
            <p className={label}>{d.fields.finalLink}</p>
            <span className="mt-2 inline-flex items-center gap-2 rounded-md border border-cream/10 bg-ink-800 px-3 py-1.5 font-mono text-xs text-cream/55">
              <Globe aria-hidden className="h-3.5 w-3.5 text-ember" />
              {node.link}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Modal that walks a prospect through how the Adapto Tracker works. */
export function TrackerExplainer({ open, onClose, t }: TrackerExplainerProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const e = t.explainer;
  const d = e.demo;
  const nodes = d.nodes;
  const activeIndex = nodes.findIndex((n) => n.status === 'in_progress');
  const [selected, setSelected] = useState(activeIndex);

  const sprints = nodes.filter((n) => n.type === 'milestone');
  const progress = Math.round(
    (sprints.filter((n) => n.status === 'completed').length / sprints.length) * 100,
  );

  useEffect(() => setMounted(true), []);

  // Scroll lock + ESC, same pattern as the mobile drawer in Header
  useEffect(() => {
    if (!open) return;
    setSelected(activeIndex);
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
  }, [open, onClose, activeIndex]);

  if (!mounted) return null;

  const section = 'border-b border-cream/10 px-5 py-7 md:px-14 md:py-10 lg:px-16';
  const sectionLabel = 'font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45';

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
            className="relative max-h-[92vh] w-full max-w-[1320px] overflow-y-auto rounded-t-2xl border border-cream/10 bg-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] outline-none md:rounded-2xl"
          >
            {/* ---------- Header ---------- */}
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
                  {e.title.replace(/\.$/, '')}
                  <span className="text-ember">.</span>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-cream/60 md:text-base">{e.lead}</p>
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

            {/* ---------- The sample pill ---------- */}
            <div className={section}>
              <div className="overflow-hidden rounded-xl border border-cream/10 bg-ink-950/60">
                {/* Window chrome */}
                <div className="flex items-center gap-3 border-b border-cream/10 bg-cream/[0.02] px-3.5 py-2.5 md:gap-4 md:px-4">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-cream/15 md:h-2.5 md:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-cream/15 md:h-2.5 md:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-cream/15 md:h-2.5 md:w-2.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate rounded-md bg-cream/[0.04] px-3 py-1 text-center font-mono text-[10px] text-cream/45 md:text-[11px]">
                    tracker.adapto-sh.com/pill/{d.code}
                  </span>
                  <span className="hidden rounded-full border border-cream/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/45 sm:inline">
                    {d.readOnly}
                  </span>
                </div>

                {/* Room header */}
                <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:px-6 md:py-5">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="h-2 w-2 rounded-full bg-ember" aria-hidden />
                    <span className="font-serif text-lg text-cream md:text-xl">{d.project}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-cream/10 bg-cream/[0.03] px-2 py-0.5 font-mono text-[10px] text-cream/55">
                      <KeyRound aria-hidden className="h-3 w-3 text-ember" />
                      {d.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream/10 sm:w-32 sm:flex-none">
                      <span className="block h-full rounded-full bg-success" style={{ width: `${progress}%` }} />
                    </span>
                    <span className="w-9 text-right font-mono text-xs text-cream/70">{progress}%</span>
                  </div>
                </div>

                {/* Horizontal pill — wide screens */}
                <div className="hidden px-6 pb-6 lg:block">
                  <div className="mt-3 flex items-stretch rounded-full border border-cream/10 bg-cream/[0.02] p-1.5">
                    {nodes.map((node, i) => {
                      const Icon = typeIcon[node.type];
                      const isSel = i === selected;
                      const first = i === 0;
                      const last = i === nodes.length - 1;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelected(i)}
                          aria-pressed={isSel}
                          className={cn(
                            'group relative flex min-w-0 flex-col justify-between gap-2 py-3.5 text-left transition-colors',
                            node.type === 'checkpoint' ? 'flex-[0.8]' : 'flex-1',
                            first
                              ? 'rounded-l-full border-l-2 border-l-ember pl-7 pr-3'
                              : last
                                ? 'rounded-r-full border-r-2 border-r-ember/30 pl-3.5 pr-7'
                                : cn('border-l-2 px-3.5', ruleClass[node.status], node.type === 'checkpoint' && 'border-dashed'),
                            isSel ? 'bg-ink-700' : 'bg-ink-800 hover:bg-ink-700/70',
                            !first && 'ml-px',
                          )}
                        >
                          {i === activeIndex && (
                            <span className="absolute -top-3.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-ember px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-cream shadow-[0_6px_18px_-6px_rgba(195,86,34,0.8)]">
                              <span className="h-1 w-1 animate-pulse rounded-full bg-cream" />
                              {d.here}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
                            <Icon
                              aria-hidden
                              className={cn('h-3 w-3', node.type === 'checkpoint' ? 'text-ember' : 'text-cream/50')}
                            />
                            {d.types[node.type]}
                          </span>
                          <span
                            className={cn(
                              'font-serif text-base leading-[1.15] xl:text-lg',
                              node.status === 'pending' ? 'text-cream/55' : 'text-cream',
                            )}
                          >
                            {node.title}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', dotClass[node.status])} />
                            <span className="truncate font-mono text-[10px] text-cream/40">{node.date}</span>
                          </span>
                          {isSel && (
                            <span aria-hidden className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-ember" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4">
                    <NodeDetail node={nodes[selected]} d={d} />
                  </div>
                </div>

                {/* Vertical pill — phones and tablets; the selected node opens in place */}
                <div className="px-3 pb-3 md:px-6 md:pb-6 lg:hidden">
                  <div className="rounded-[1.75rem] border border-cream/10 bg-cream/[0.02] p-1.5">
                    <div className="flex flex-col gap-px">
                      {nodes.map((node, i) => {
                        const Icon = typeIcon[node.type];
                        const isSel = i === selected;
                        const first = i === 0;
                        const last = i === nodes.length - 1;
                        return (
                          <div
                            key={i}
                            className={cn(
                              isSel ? 'bg-ink-700' : 'bg-ink-800',
                              first
                                ? 'rounded-t-[1.4rem] border-t-2 border-t-ember'
                                : last
                                  ? 'rounded-b-[1.4rem] border-b-2 border-b-ember/30'
                                  : cn('border-l-2', ruleClass[node.status], node.type === 'checkpoint' && 'border-dashed'),
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => setSelected(i)}
                              aria-expanded={isSel}
                              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                            >
                              <Icon
                                aria-hidden
                                className={cn('h-4 w-4 shrink-0', node.type === 'checkpoint' ? 'text-ember' : 'text-cream/50')}
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
                                  {d.types[node.type]} · {node.date}
                                </span>
                                <span
                                  className={cn(
                                    'mt-0.5 block truncate font-serif text-lg leading-tight',
                                    node.status === 'pending' ? 'text-cream/55' : 'text-cream',
                                  )}
                                >
                                  {node.title}
                                </span>
                              </span>
                              {i === activeIndex ? (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ember px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-cream">
                                  <span className="h-1 w-1 animate-pulse rounded-full bg-cream" />
                                  {d.here}
                                </span>
                              ) : (
                                <StatusChip status={node.status} label={d.status[node.status]} />
                              )}
                            </button>
                            {isSel && (
                              <div className="px-2 pb-2">
                                <NodeDetail node={node} d={d} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-cream/55">{d.hint}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {(['completed', 'in_progress', 'pending'] as Status[]).map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/50"
                    >
                      <span className={cn('h-1 w-3 rounded-full', dotClass[s])} />
                      {d.status[s]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ---------- The four kinds of stages ---------- */}
            <div className={section}>
              <p className={sectionLabel}>{e.typesLabel}</p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(['start', 'milestone', 'checkpoint', 'end'] as NodeType[]).map((type) => {
                  const Icon = typeIcon[type];
                  return (
                    <li
                      key={type}
                      className={cn(
                        'rounded-xl border p-5',
                        type === 'checkpoint'
                          ? 'border-dashed border-ember/35 bg-ember/[0.04]'
                          : 'border-cream/10 bg-cream/[0.02]',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl border',
                          type === 'checkpoint'
                            ? 'border-ember/40 bg-ember/10 text-ember'
                            : 'border-cream/15 bg-cream/[0.04] text-cream/75',
                        )}
                      >
                        <Icon aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} />
                      </span>
                      <h4 className="mt-4 font-serif text-2xl leading-tight text-cream">{e.types[type].title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-cream/60">{e.types[type].description}</p>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ---------- How the client uses it ---------- */}
            <div className="px-5 py-7 md:px-14 md:py-12 lg:px-16">
              <p className={sectionLabel}>{e.stepsLabel}</p>
              <ol className="mt-6 grid gap-6 md:grid-cols-2 md:gap-10 lg:grid-cols-4 lg:gap-8">
                {e.steps.map((step, i, all) => {
                  const Icon = stepIcons[i] ?? KeyRound;
                  const isLast = i === all.length - 1;
                  return (
                    <li key={i} className="relative flex gap-4 md:block">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ember/30 bg-ember/10 text-ember md:h-12 md:w-12">
                          <Icon className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth={1.75} aria-hidden />
                        </span>
                        <span className="hidden font-mono text-xs text-cream/40 md:inline">0{i + 1}</span>
                      </div>

                      {/* Left-to-right connector to the next step (4-up only) */}
                      {!isLast && (
                        <span aria-hidden className="absolute left-[5.5rem] right-0 top-6 hidden items-center lg:flex">
                          <span className="h-px flex-1 border-t border-dashed border-cream/15" />
                          <ChevronRight className="-ml-1 h-3.5 w-3.5 text-cream/25" />
                        </span>
                      )}

                      <div className="min-w-0">
                        <h4 className="font-serif text-xl leading-tight text-cream md:mt-5 md:text-2xl">
                          <span className="mr-2 font-mono text-[11px] text-cream/35 md:hidden">0{i + 1}</span>
                          {step.title}
                        </h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-cream/60 md:mt-2">{step.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="flex flex-col gap-4 border-t border-cream/10 bg-cream/[0.02] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-14 md:py-6 lg:px-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40">{e.footnote}</p>
              <Button href={site.trackerUrl} external variant="primary" size="md" className="self-start md:self-auto">
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
