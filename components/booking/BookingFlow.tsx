'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock, Globe2, RefreshCw, Video } from 'lucide-react';
import { BOOKING, type BookingResult } from '@/lib/booking/config';
import { intlTimeZone } from '@/lib/booking/time-zone';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { BookingForm, type BookingDetails } from './BookingForm';
import { DatePicker, type Month } from './DatePicker';
import { CONFIRMATION_KEY, type Confirmation } from './BookingConfirmed';

const SLIDE_TRANSITION =
  'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

// Keeps the step off screen out of the tab order and away from screen readers.
// A cast because React 18's types don't list `inert` yet, though it handles it.
const INERT = { inert: true } as object;

interface BookingFlowProps {
  lang: string;
  t: any;
}

/** "YYYY-MM-DD" of an instant as seen in `timeZone`. */
function dateKey(instant: string | number, timeZone: string): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: intlTimeZone(timeZone),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(instant));
}

function toMonth(date: string): Month {
  const [year, month] = date.split('-').map(Number);
  return { year, month: month - 1 };
}

const monthIndex = ({ year, month }: Month) => year * 12 + month;

function cityOf(timeZone: string): string {
  return (timeZone.split('/').pop() ?? timeZone).replace(/_/g, ' ');
}

function offsetOf(timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: intlTimeZone(timeZone),
    timeZoneName: 'shortOffset',
  }).formatToParts();
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
}

/** Every zone the browser knows, as "City (GMT-8)", sorted by city. */
function timeZoneOptions(current: string) {
  const zones = Intl.supportedValuesOf?.('timeZone') ?? [];
  const all = zones.includes(current) ? zones : [current, ...zones];
  return all
    .map((value) => ({ value, label: `${cityOf(value)} (${offsetOf(value)})` }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function BookingFlow({ lang, t }: BookingFlowProps) {
  const router = useRouter();
  const intlLocale = lang === 'fr' ? 'fr-CA' : 'en-CA';

  const [slots, setSlots] = useState<string[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  // Null until mounted: the visitor's zone isn't known while rendering on the server.
  const [timeZone, setTimeZone] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [month, setMonth] = useState<Month | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  // The last slot picked: the form stays on screen while it slides away.
  const [formSlot, setFormSlot] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [panelHeight, setPanelHeight] = useState<number>();
  const [slotTaken, setSlotTaken] = useState(false);
  const [details, setDetails] = useState<BookingDetails>({
    name: '',
    email: '',
    company: '',
    problem: '',
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const timesRef = useRef<HTMLDivElement>(null);
  const timesPanelRef = useRef<HTMLDivElement>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);
  const timesHeadingRef = useRef<HTMLHeadingElement>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const stepChanged = useRef(false);

  const loadSlots = useCallback(async () => {
    setLoadFailed(false);
    setSlots(null);
    try {
      const res = await fetch('/api/booking/slots');
      if (!res.ok) throw new Error(`Slots request failed: ${res.status}`);
      const body = (await res.json()) as { slots: string[] };
      setSlots(body.slots);
    } catch (err) {
      console.error('[adapto] could not load booking slots', err);
      setLoadFailed(true);
    }
  }, []);

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || BOOKING.timeZone);
    loadSlots();
  }, [loadSlots]);

  // Back on the tab after a while: someone may have booked in the meantime. A
  // failure here keeps the list on screen; the booking itself still checks.
  useEffect(() => {
    const refresh = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const res = await fetch('/api/booking/slots');
        if (res.ok) setSlots(((await res.json()) as { slots: string[] }).slots);
      } catch {
        /* Keep what's there. */
      }
    };
    document.addEventListener('visibilitychange', refresh);
    return () => document.removeEventListener('visibilitychange', refresh);
  }, []);

  // The times grouped by day, in the visitor's zone: 9am in Vancouver can be
  // the next day in Sydney. Changing the zone regroups them.
  const byDay = useMemo(() => {
    const days = new Map<string, string[]>();
    if (!slots || !timeZone) return days;
    for (const s of slots) {
      const key = dateKey(s, timeZone);
      const day = days.get(key);
      if (day) day.push(s);
      else days.set(key, [s]);
    }
    return days;
  }, [slots, timeZone]);

  const counts = useMemo(
    () => new Map(Array.from(byDay, ([day, times]) => [day, times.length])),
    [byDay],
  );
  const openDays = useMemo(() => Array.from(byDay.keys()), [byDay]);

  // Land on the first open day, so a time is one click away from the start.
  useEffect(() => {
    if (openDays.length === 0) return;
    if (date && byDay.has(date)) return;
    setDate(openDays[0]);
    setMonth(toMonth(openDays[0]));
  }, [openDays, byDay, date]);

  // Back button on the form returns to the calendar instead of leaving the page.
  useEffect(() => {
    const onPop = () => {
      setSliding(true);
      setSlot(null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Keyboard and screen-reader users land on the new step's heading; the view
  // follows it when the step's start is off screen (phones).
  useEffect(() => {
    if (!stepChanged.current) return;
    stepChanged.current = false;
    (slot ? formHeadingRef : timesHeadingRef).current?.focus({ preventScroll: true });
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) cardRef.current?.scrollIntoView({ block: 'start' });
  }, [slot]);

  const onForm = Boolean(slot);

  // The card is as tall as the step on screen, not the taller of the two.
  useEffect(() => {
    const panel = (onForm ? formPanelRef : timesPanelRef).current;
    if (!panel) return;
    const sync = () => setPanelHeight(panel.offsetHeight);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [onForm]);

  function chooseSlot(next: string) {
    stepChanged.current = true;
    setSlotTaken(false);
    setSliding(true);
    setFormKey((key) => key + 1);
    setFormSlot(next);
    setSlot(next);
    window.history.pushState(null, '');
  }

  function backToTimes() {
    stepChanged.current = true;
    window.history.back();
  }

  function handleSlotTaken() {
    backToTimes();
    setSlotTaken(true);
    loadSlots();
  }

  function chooseDate(next: string) {
    setDate(next);
    // On phones the times are under the calendar: bring them into view.
    requestAnimationFrame(() => timesRef.current?.scrollIntoView({ block: 'nearest' }));
  }

  // Months with nothing open are skipped: the times beside the calendar always
  // belong to a day on screen.
  function changeMonth(delta: 1 | -1) {
    if (!month) return;
    const current = monthIndex(month);
    const inDirection = openDays.filter((d) => (monthIndex(toMonth(d)) - current) * delta > 0);
    const target = delta === 1 ? inDirection[0] : inDirection[inDirection.length - 1];
    if (!target) return;
    const index = monthIndex(toMonth(target));
    setMonth(toMonth(target));
    setDate(openDays.find((d) => monthIndex(toMonth(d)) === index) ?? target);
  }

  function handleBooked(result: BookingResult) {
    const confirmation: Confirmation = {
      ...result,
      timeZone: timeZone as string,
      email: details.email.trim().toLowerCase(),
    };
    try {
      window.sessionStorage.setItem(CONFIRMATION_KEY, JSON.stringify(confirmation));
    } catch {
      /* Storage disabled: the confirmation page falls back to its generic text. */
    }
    router.push(`/${lang}/book/confirmed`);
  }

  const zones = useMemo(() => (timeZone ? timeZoneOptions(timeZone) : []), [timeZone]);

  const formatTime = (instant: string) =>
    new Intl.DateTimeFormat(intlLocale, {
      timeZone: timeZone ? intlTimeZone(timeZone) : undefined,
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(instant));

  const longDate = (instant: string) =>
    new Intl.DateTimeFormat(intlLocale, {
      timeZone: timeZone ? intlTimeZone(timeZone) : undefined,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date(instant));

  const zonePicker = timeZone && (
    <label className="relative inline-flex max-w-full items-center gap-2 rounded-full border border-cream/15 bg-cream/[0.03] px-3.5 py-2 text-sm text-cream/75 transition-colors focus-within:border-ember focus-within:ring-2 focus-within:ring-ember/25 hover:border-cream/25">
      <Globe2 aria-hidden className="h-4 w-4 shrink-0 text-ember" />
      <span className="sr-only">{t.timeZone}</span>
      <span aria-hidden className="truncate">
        {cityOf(timeZone)} ({offsetOf(timeZone)})
      </span>
      {/* The native list: searchable by typing, and a proper wheel on phones. */}
      <select
        value={timeZone}
        onChange={(e) => setTimeZone(e.target.value)}
        className="absolute inset-0 w-full cursor-pointer opacity-0"
      >
        {zones.map((zone) => (
          <option key={zone.value} value={zone.value} className="bg-ink text-cream">
            {zone.label}
          </option>
        ))}
      </select>
    </label>
  );

  const emailLink = (
    <a href={`mailto:${site.email}`} className="text-ember-400 underline underline-offset-2 hover:text-cream">
      {site.email}
    </a>
  );

  const stepLabel = (n: number, label: string) => (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50">
      <span className="text-ember-400">{`0${n}`}</span> / 02 · {label}
    </p>
  );

  const loading = !loadFailed && (!slots || !timeZone);
  const today = timeZone ? dateKey(Date.now(), timeZone) : '';
  const firstMonth = openDays.length ? monthIndex(toMonth(openDays[0])) : 0;
  const lastMonth = openDays.length ? monthIndex(toMonth(openDays[openDays.length - 1])) : 0;

  return (
    <div
      ref={cardRef}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-cream/10 bg-ink-950/70 shadow-[0_24px_80px_-40px_rgba(195,86,34,0.45)] backdrop-blur-sm supports-[overflow:clip]:overflow-clip"
    >
      <div
        style={{ height: panelHeight }}
        className={cn(sliding && SLIDE_TRANSITION, sliding && 'transition-[height]')}
      >
        <div
          style={{ transform: onForm ? 'translateX(-100%)' : undefined }}
          className={cn('flex items-start', sliding && SLIDE_TRANSITION, sliding && 'transition-transform')}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && e.propertyName === 'transform') setSliding(false);
          }}
        >
          {/* ---------- Step 1: date and time ---------- */}
          <div ref={timesPanelRef} className="w-full shrink-0" {...(onForm ? INERT : {})}>
                          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-cream/10 p-5 md:px-8">
                    <div>
                      {stepLabel(1, t.step1)}
                      <h2 ref={timesHeadingRef} tabIndex={-1} className="sr-only">
                        {t.step1}
                      </h2>
                    </div>
                    {zonePicker}
                  </div>

                  {slotTaken && (
                    <p role="alert" className="mx-5 mt-5 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning md:mx-8">
                      {t.errors.slot_taken}
                    </p>
                  )}

                  {loadFailed ? (
                    <div role="alert" className="flex flex-col items-start gap-4 p-5 md:p-8">
                      <CalendarDays aria-hidden className="h-7 w-7 text-ember" />
                      <p className="max-w-md text-base leading-relaxed text-cream/80">
                        {t.loadError} {emailLink}
                      </p>
                      <button
                        type="button"
                        onClick={loadSlots}
                        className="inline-flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2 text-sm font-medium text-cream transition-colors hover:border-cream/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                      >
                        <RefreshCw aria-hidden className="h-4 w-4" />
                        {t.retry}
                      </button>
                    </div>
                  ) : loading ? (
                    <div role="status" aria-label={t.loading} className="grid gap-8 p-5 md:p-8 lg:grid-cols-[minmax(0,1fr)_13rem]">
                      <div>
                        <Skeleton className="h-8 w-44" />
                        <div className="mt-5 grid grid-cols-7 gap-1.5">
                          {Array.from({ length: 35 }, (_, i) => (
                            <Skeleton key={i} className="aspect-square rounded-lg" />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {Array.from({ length: 6 }, (_, i) => (
                          <Skeleton key={i} className="h-11 rounded-lg" />
                        ))}
                      </div>
                    </div>
                  ) : openDays.length === 0 ? (
                    <div className="flex flex-col items-start gap-4 p-5 md:p-8">
                      <CalendarDays aria-hidden className="h-7 w-7 text-ember" />
                      <p className="max-w-md text-base leading-relaxed text-cream/80">
                        {t.noSlots} {emailLink}
                      </p>
                    </div>
                  ) : (
                    month && (
                      <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-[minmax(0,1fr)_13rem]">
                        <DatePicker
                          intlLocale={intlLocale}
                          month={month}
                          canGoBack={monthIndex(month) > firstMonth}
                          canGoForward={monthIndex(month) < lastMonth}
                          onMonth={changeMonth}
                          counts={counts}
                          selected={date}
                          today={today}
                          onSelect={chooseDate}
                          labels={{
                            previousMonth: t.previousMonth,
                            nextMonth: t.nextMonth,
                            timesCount: t.timesCount,
                          }}
                        />

                        <div ref={timesRef} className="scroll-mb-4 border-t border-cream/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                          <h3 className="text-sm font-medium text-cream first-letter:uppercase lg:h-10 lg:leading-5">
                            {date && byDay.get(date) ? longDate(byDay.get(date)![0]) : ''}
                          </h3>
                          <ul className={cn('mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:mt-5 lg:max-h-[23rem] lg:grid-cols-1 lg:overflow-y-auto lg:pr-1')}>
                            {(date ? byDay.get(date) ?? [] : []).map((s) => (
                              <li key={s}>
                                <button
                                  type="button"
                                  onClick={() => chooseSlot(s)}
                                  className="w-full whitespace-nowrap rounded-lg border border-cream/15 px-2 py-3 text-center text-sm font-medium tabular-nums text-cream transition-colors hover:border-ember hover:bg-ember/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                                >
                                  {formatTime(s)}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  )}
                </div>

          {/* ---------- Step 2: details, waiting to the right ---------- */}
          <div ref={formPanelRef} className="w-full shrink-0" {...(onForm ? {} : INERT)}>
            {formSlot && timeZone && (
                  <div className="p-5 md:p-8">
                    <button
                      type="button"
                      onClick={backToTimes}
                      className="-ml-1 inline-flex items-center gap-2 rounded text-sm text-cream/60 transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                    >
                      <ArrowLeft aria-hidden className="h-4 w-4" />
                      {t.changeTime}
                    </button>

                    <div className="mt-6">{stepLabel(2, t.step2)}</div>
                    <h2
                      ref={formHeadingRef}
                      tabIndex={-1}
                      className="mt-3 font-brand text-2xl leading-tight text-cream outline-none first-letter:uppercase md:text-3xl"
                    >
                      {longDate(formSlot)}
                      <span className="text-ember">, </span>
                      {formatTime(formSlot)}
                    </h2>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-cream/60">
                      <li className="inline-flex items-center gap-1.5">
                        <Clock aria-hidden className="h-3.5 w-3.5 text-ember" />
                        {t.duration}
                      </li>
                      <li className="inline-flex items-center gap-1.5">
                        <Video aria-hidden className="h-3.5 w-3.5 text-ember" />
                        {t.meet}
                      </li>
                      <li className="inline-flex items-center gap-1.5">
                        <Globe2 aria-hidden className="h-3.5 w-3.5 text-ember" />
                        {cityOf(timeZone)} ({offsetOf(timeZone)})
                      </li>
                    </ul>

                    <div className="mt-7 border-t border-cream/10 pt-7">
                      <BookingForm
                        key={formKey}
                        lang={lang}
                        t={t}
                        startsAt={formSlot}
                        timeZone={timeZone}
                        values={details}
                        onChange={setDetails}
                        onBooked={handleBooked}
                        onSlotTaken={handleSlotTaken}
                      />
                    </div>
                  </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
