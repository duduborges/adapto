'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Month {
  year: number;
  /** 0-11, like Date. */
  month: number;
}

interface DatePickerProps {
  intlLocale: string;
  month: Month;
  canGoBack: boolean;
  canGoForward: boolean;
  onMonth: (delta: 1 | -1) => void;
  /** Number of open times per "YYYY-MM-DD". */
  counts: Map<string, number>;
  selected: string | null;
  today: string;
  onSelect: (date: string) => void;
  labels: { previousMonth: string; nextMonth: string; timesCount: string };
}

const pad = (n: number) => String(n).padStart(2, '0');

export function DatePicker({
  intlLocale,
  month,
  canGoBack,
  canGoForward,
  onMonth,
  counts,
  selected,
  today,
  onSelect,
  labels,
}: DatePickerProps) {
  const { year, month: m } = month;
  const firstWeekday = new Date(Date.UTC(year, m, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();

  // These are calendar dates, not instants: format them in UTC so the visitor's
  // own offset can't push them onto the neighbouring day.
  const utc = { timeZone: 'UTC' };
  const monthTitle = new Intl.DateTimeFormat(intlLocale, {
    ...utc,
    month: 'long',
    year: 'numeric',
  }).format(Date.UTC(year, m, 1));
  const longDay = new Intl.DateTimeFormat(intlLocale, {
    ...utc,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const weekdayLong = new Intl.DateTimeFormat(intlLocale, { ...utc, weekday: 'long' });
  const weekdayShort = new Intl.DateTimeFormat(intlLocale, { ...utc, weekday: 'short' });
  // 2023-01-01 was a Sunday.
  const weekdays = Array.from({ length: 7 }, (_, i) => Date.UTC(2023, 0, 1 + i));

  const navButton =
    'flex h-10 w-10 items-center justify-center rounded-full border border-cream/10 text-cream/70 transition-colors hover:border-cream/25 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-cream/10 disabled:hover:text-cream/70';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 aria-live="polite" className="font-brand text-xl text-cream first-letter:uppercase md:text-2xl">
          {monthTitle}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onMonth(-1)}
            disabled={!canGoBack}
            aria-label={labels.previousMonth}
            className={navButton}
          >
            <ChevronLeft aria-hidden className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onMonth(1)}
            disabled={!canGoForward}
            aria-label={labels.nextMonth}
            className={navButton}
          >
            <ChevronRight aria-hidden className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 md:gap-1.5">
        {weekdays.map((day) => (
          <abbr
            key={day}
            title={weekdayLong.format(day)}
            className="pb-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-cream/50 no-underline"
          >
            {weekdayShort.format(day).replace('.', '').slice(0, 3)}
          </abbr>
        ))}

        {Array.from({ length: firstWeekday }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = `${year}-${pad(m + 1)}-${pad(day)}`;
          const count = counts.get(date) ?? 0;
          const isSelected = selected === date;
          const isToday = today === date;

          return (
            <button
              key={date}
              type="button"
              disabled={count === 0}
              aria-pressed={isSelected}
              aria-current={isToday ? 'date' : undefined}
              aria-label={`${longDay.format(Date.UTC(year, m, day))}${
                count > 0 ? `, ${labels.timesCount.replace('{count}', String(count))}` : ''
              }`}
              onClick={() => onSelect(date)}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-lg text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:text-[15px]',
                isSelected
                  ? 'bg-ember-fill font-semibold text-cream'
                  : count > 0
                    ? 'bg-cream/[0.06] font-medium text-cream hover:bg-ember/25'
                    : 'cursor-default text-cream/25',
                isToday && !isSelected && 'ring-1 ring-inset ring-cream/30',
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
