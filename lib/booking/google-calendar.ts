import 'server-only';

import { createHash, randomUUID } from 'node:crypto';
import { BOOKING } from './config';
import { zonedTimeToUtc, type BusyRange } from './slots';

/*
 * Google Calendar over plain REST, like the Adapto Tracker: same Google
 * account, same OAuth client and refresh token.
 *
 * Env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, and
 * optionally GOOGLE_CALENDAR_ID (defaults to the account's primary calendar).
 *
 * The token's scope is `calendar.events`, which the freeBusy endpoint refuses,
 * so busy times are worked out from the events themselves.
 */

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';
const EVENTS_URL = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`;

/** The private extended property that marks an event as a website booking. */
const EMAIL_PROPERTY = 'adaptoBookingEmail';

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN,
  );
}

// Reused between requests on the same instance: the slot list is read often and
// an access token lasts an hour.
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });
  const body = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
  };
  if (!res.ok || !body.access_token) {
    throw new Error(`Google token exchange failed: ${body.error ?? res.status}`);
  }
  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + ((body.expires_in ?? 3600) - 60) * 1000,
  };
  return body.access_token;
}

interface CalendarEvent {
  id?: string;
  status?: string;
  transparency?: string;
  eventType?: string;
  hangoutLink?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  attendees?: { self?: boolean; responseStatus?: string }[];
}

async function listEvents(params: Record<string, string>): Promise<CalendarEvent[]> {
  const token = await getAccessToken();
  const events: CalendarEvent[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(EVENTS_URL);
    url.search = new URLSearchParams({
      singleEvents: 'true',
      maxResults: '250',
      fields:
        'nextPageToken,items(id,status,transparency,eventType,start,end,attendees(self,responseStatus))',
      ...params,
      ...(pageToken ? { pageToken } : {}),
    }).toString();

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const body = (await res.json()) as {
      items?: CalendarEvent[];
      nextPageToken?: string;
      error?: { message?: string };
    };
    if (!res.ok) {
      throw new Error(`Google Calendar list failed: ${body.error?.message ?? res.status}`);
    }
    events.push(...(body.items ?? []));
    pageToken = body.nextPageToken;
  } while (pageToken);

  return events;
}

/** An all-day event's "2026-11-11" is a date in the calendar's time zone. */
function eventBound(bound: { dateTime?: string; date?: string } | undefined): number {
  if (bound?.dateTime) return Date.parse(bound.dateTime);
  const [y, m, d] = (bound?.date ?? '').split('-').map(Number);
  return zonedTimeToUtc(y, m, d, 0, 0, BOOKING.timeZone);
}

function isBusy(event: CalendarEvent): boolean {
  if (event.status === 'cancelled' || event.transparency === 'transparent') return false;
  // "Working from home" and the like: a label on the day, not a commitment.
  if (event.eventType === 'workingLocation') return false;
  return event.attendees?.find((a) => a.self)?.responseStatus !== 'declined';
}

/** Everything on the calendar that blocks a call, from now to the horizon. */
export async function getBusyRanges(now: number): Promise<BusyRange[]> {
  const events = await listEvents({
    timeMin: new Date(now).toISOString(),
    // One extra day so the buffer also sees what sits past the last slot.
    timeMax: new Date(now + (BOOKING.horizonDays + 1) * 86_400_000).toISOString(),
  });
  return events.filter(isBusy).map((event) => ({
    start: eventBound(event.start),
    end: eventBound(event.end),
  }));
}

/** Whether this email already has a call coming up. */
export async function hasUpcomingBooking(email: string, now: number): Promise<boolean> {
  const events = await listEvents({
    timeMin: new Date(now).toISOString(),
    privateExtendedProperty: `${EMAIL_PROPERTY}=${email}`,
  });
  return events.some((event) => event.status !== 'cancelled');
}

export interface BookingEventInput {
  summary: string;
  description: string;
  startsAt: number;
  endsAt: number;
  timeZone: string;
  attendeeEmail: string;
  /** Kept on the event but never shown to the guest. */
  privateData: Record<string, string>;
}

/** Two tries for one slot share an ID, and Google only accepts an ID once. */
function slotEventId(startsAt: number, attempt: number): string {
  return createHash('sha256')
    .update(`adapto-booking:${CALENDAR_ID}:${startsAt}:${attempt}`)
    .digest('hex')
    .slice(0, 32);
}

/**
 * Creates the event with a Meet link and emails the invitation. Returns null if
 * someone else got the slot first.
 *
 * Checking the calendar and then writing leaves a gap two visitors can fall
 * into. The event ID closes it: it comes from the start time, so the second
 * insert gets a 409. An ID outlives its event, though, so after a 409 a slot is
 * only really taken if the event is still there, at that time. If it was
 * cancelled or moved, the next attempt's ID is free to use.
 */
export async function createBookingEvent(
  input: BookingEventInput,
): Promise<{ eventId: string; meetLink: string | null } | null> {
  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  for (let attempt = 0; attempt < 10; attempt++) {
    const id = slotEventId(input.startsAt, attempt);
    const res = await fetch(`${EVENTS_URL}?conferenceDataVersion=1&sendUpdates=all`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id,
        summary: input.summary,
        description: input.description,
        start: { dateTime: new Date(input.startsAt).toISOString(), timeZone: input.timeZone },
        end: { dateTime: new Date(input.endsAt).toISOString(), timeZone: input.timeZone },
        attendees: [{ email: input.attendeeEmail }],
        guestsCanInviteOthers: false,
        reminders: { useDefault: true },
        extendedProperties: {
          private: { ...input.privateData, [EMAIL_PROPERTY]: input.attendeeEmail },
        },
        conferenceData: {
          createRequest: {
            requestId: randomUUID(),
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      }),
      cache: 'no-store',
    });
    const body = (await res.json()) as CalendarEvent & { error?: { message?: string } };

    if (res.ok && body.id) return { eventId: body.id, meetLink: body.hangoutLink ?? null };
    if (res.status !== 409) {
      throw new Error(`Google Calendar insert failed: ${body.error?.message ?? res.status}`);
    }

    const existing = await fetch(`${EVENTS_URL}/${id}?fields=status,start`, {
      headers,
      cache: 'no-store',
    });
    const event = (await existing.json()) as CalendarEvent;
    const stillThere =
      existing.ok &&
      event.status !== 'cancelled' &&
      Date.parse(event.start?.dateTime ?? '') === input.startsAt;
    if (stillThere) return null;
  }
  throw new Error('Google Calendar insert failed: no free event ID for this slot');
}
