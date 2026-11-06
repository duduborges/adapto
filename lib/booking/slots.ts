import { BOOKING } from './config';
import { intlTimeZone } from './time-zone';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

export interface BusyRange {
  start: number;
  end: number;
}

/** Milliseconds `timeZone` is ahead of UTC at the instant `utc`. */
function zoneOffset(utc: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: intlTimeZone(timeZone),
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(new Date(utc));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const wall = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return wall - Math.floor(utc / 1000) * 1000;
}

/**
 * The instant a wall-clock time happens in `timeZone`. Measured twice because
 * the first guess can land on the other side of a daylight-saving change.
 */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): number {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  const guess = wall - zoneOffset(wall, timeZone);
  return wall - zoneOffset(guess, timeZone);
}

/** Today's date as the calendar sees it, as UTC-based y/m/d arithmetic. */
function wallDate(now: number, timeZone: string): number {
  const offset = zoneOffset(now, timeZone);
  return Math.floor((now + offset) / DAY) * DAY;
}

/**
 * Every bookable start, as ISO strings in UTC: the weekly hours minus what is
 * busy, within the notice and horizon limits. Pure, so it can be tested.
 */
export function computeSlots(now: number, busy: BusyRange[]): string[] {
  const { timeZone, stepMinutes, durationMinutes, bufferMinutes } = BOOKING;
  const earliest = now + BOOKING.minNoticeHours * 60 * MINUTE;
  const latest = now + BOOKING.horizonDays * DAY;
  const buffer = bufferMinutes * MINUTE;
  const duration = durationMinutes * MINUTE;

  const slots: string[] = [];
  const firstDay = wallDate(now, timeZone);

  for (let i = 0; i <= BOOKING.horizonDays; i++) {
    const date = new Date(firstDay + i * DAY);
    const ranges = BOOKING.weeklyHours[date.getUTCDay()] ?? [];

    for (const [open, close] of ranges) {
      const [openH, openM] = open.split(':').map(Number);
      const [closeH, closeM] = close.split(':').map(Number);
      const lastMinute = closeH * 60 + closeM - durationMinutes;

      for (let m = openH * 60 + openM; m <= lastMinute; m += stepMinutes) {
        const start = zonedTimeToUtc(
          date.getUTCFullYear(),
          date.getUTCMonth() + 1,
          date.getUTCDate(),
          Math.floor(m / 60),
          m % 60,
          timeZone,
        );
        if (start < earliest || start > latest) continue;

        const end = start + duration;
        const clashes = busy.some(
          (b) => start < b.end + buffer && end > b.start - buffer,
        );
        if (!clashes) slots.push(new Date(start).toISOString());
      }
    }
  }
  return slots;
}
