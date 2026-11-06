/**
 * The rules of the "Book a free call" page. Change the availability here;
 * everything else (the slot list, the API checks, the page) follows from it.
 */
export const BOOKING = {
  /** The calendar's own time zone: the hours below are read in it. */
  timeZone: 'America/Vancouver',
  durationMinutes: 30,
  /** A new call starts on this grid (10:00, 10:30...). */
  stepMinutes: 30,
  /** Free time kept around anything on the calendar. 0: calls can be back to back. */
  bufferMinutes: 0,
  /** How soon a call can be booked: no surprise 9am call booked at midnight. */
  minNoticeHours: 12,
  /** How far ahead the calendar opens. */
  horizonDays: 30,
  /**
   * Bookable hours per weekday, in `timeZone`. 0 = Sunday ... 6 = Saturday; a
   * missing day is closed. A call must end by the closing time. For a one-off
   * absence (holiday, trip), block the time in Google Calendar instead.
   */
  weeklyHours: {
    1: [['09:00', '17:00']],
    2: [['09:00', '17:00']],
    3: [['09:00', '17:00']],
    4: [['09:00', '17:00']],
    5: [['09:00', '17:00']],
  } as Partial<Record<number, [string, string][]>>,
} as const;

/** Field limits, shared by the form and the API. */
export const BOOKING_LIMITS = {
  name: 100,
  email: 254,
  company: 150,
  // Google caps an extended property (where this is kept) at 1024 characters.
  problem: 1000,
} as const;

/** Where a visitor came from. See lib/booking/attribution.ts. */
export const ATTRIBUTION_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'referrer',
  'landing',
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_FIELDS)[number], string>>;

/** What the API answers on a successful booking. */
export interface BookingResult {
  startsAt: string;
  endsAt: string;
  meetLink: string | null;
}

/** The reasons a booking can fail that the page explains to the visitor. */
export type BookingErrorCode =
  | 'slot_taken'
  | 'already_booked'
  | 'invalid'
  | 'rate_limited'
  | 'unavailable';
