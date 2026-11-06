import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  ATTRIBUTION_FIELDS,
  BOOKING,
  BOOKING_LIMITS,
  type Attribution,
  type BookingErrorCode,
  type BookingResult,
} from '@/lib/booking/config';
import {
  createBookingEvent,
  getBusyRanges,
  hasUpcomingBooking,
  isCalendarConfigured,
} from '@/lib/booking/google-calendar';
import { computeSlots } from '@/lib/booking/slots';
import { intlTimeZone } from '@/lib/booking/time-zone';
import {
  clientIp,
  EMAIL_RE,
  esc,
  LINK_RE,
  rateLimited,
  sameOrigin,
} from '@/lib/request-guards';
import { site } from '@/lib/site';
import type { Locale } from '@/types';

export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;
const MAX_PER_IP = 5;
const MAX_PER_EMAIL = 2;

const FROM_EMAIL = process.env.RESEND_FROM || 'Adapto <contact@adapto-sh.com>';
const TO_EMAIL = process.env.CONTACT_TO || site.email;

const fail = (code: BookingErrorCode, status: number) =>
  NextResponse.json({ error: code }, { status });

/**
 * What the guest reads in the invitation: title and description. Only Adapto's
 * own words: the address is unverified, so echoing the visitor's text (even the
 * company, "Win at bit.ly/x" gets past any link check) would let anyone send it
 * to any inbox from our calendar. Their details go in the email to Adapto.
 */
const inviteTitle: Record<Locale, string> = {
  en: 'Free call with Adapto',
  fr: 'Appel gratuit avec Adapto',
};

const inviteDescription: Record<Locale, string> = {
  en: `Free 30-minute call with Adapto. We'll listen to how your company works and tell you honestly whether we're the right team for you.\n\nNeed another time? Write to ${site.email}.`,
  fr: `Appel gratuit de 30 minutes avec Adapto. Nous écoutons comment fonctionne votre entreprise et vous disons honnêtement si nous sommes la bonne équipe pour vous.\n\nBesoin d'une autre heure ? Écrivez à ${site.email}.`,
};

function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/** Only the known fields, trimmed: this comes straight from the browser. */
function cleanAttribution(value: unknown): Attribution {
  if (!value || typeof value !== 'object') return {};
  const clean: Attribution = {};
  for (const key of ATTRIBUTION_FIELDS) {
    const field = (value as Record<string, unknown>)[key];
    if (typeof field === 'string' && field.trim()) clean[key] = field.trim().slice(0, 200);
  }
  return clean;
}

/** "instagram / comment-adapt", or the best thing we know instead. */
function sourceLabel(a: Attribution): string {
  if (a.utm_source || a.utm_campaign) {
    return [a.utm_source, a.utm_campaign].filter(Boolean).join(' / ');
  }
  if (a.fbclid) return 'Meta ad (no UTM)';
  if (a.gclid) return 'Google ad (no UTM)';
  return a.referrer ?? 'Direct';
}

interface NotifyInput {
  name: string;
  email: string;
  company: string;
  problem: string;
  startsAt: number;
  visitorTimeZone: string;
  meetLink: string | null;
  attribution: Attribution;
}

/** Tells Adapto about the booking: the problem and origin live only here. */
async function notifyAdapto(input: NotifyInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[adapto] RESEND_API_KEY is not configured');
    return;
  }

  const when = (timeZone: string) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: intlTimeZone(timeZone),
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(input.startsAt);

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding: 8px 0; color: #5b4a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em; width: 130px; vertical-align: top;">${label}</td>
      <td style="padding: 8px 0; color: #2a2021; font-size: 15px;">${value}</td>
    </tr>`;

  const a = input.attribution;
  const details = ATTRIBUTION_FIELDS.filter((key) => a[key])
    .map((key) => row(key.replace('utm_', ''), esc(a[key] as string)))
    .join('');

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: input.email,
    subject: `New call booked: ${input.name} (${input.company}), ${when(BOOKING.timeZone)}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2a2021;">
        <div style="background: #2a2021; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fefefe; margin: 0; font-size: 20px;">New call booked</h1>
          <p style="color: rgba(254,254,254,0.7); margin: 8px 0 0; font-size: 15px;">${esc(when(BOOKING.timeZone))}</p>
        </div>
        <div style="border: 1px solid #e6e1e1; border-top: none; padding: 24px 28px; border-radius: 0 0 12px 12px; background: #fefefe;">
          <table style="width: 100%; border-collapse: collapse;">
            ${row('Name', esc(input.name))}
            ${row('Email', `<a href="mailto:${esc(input.email)}" style="color: #c35622; text-decoration: none;">${esc(input.email)}</a>`)}
            ${row('Company', esc(input.company))}
            ${row('Their time', esc(when(input.visitorTimeZone)))}
            ${input.meetLink ? row('Meet', `<a href="${esc(input.meetLink)}" style="color: #c35622; text-decoration: none;">${esc(input.meetLink)}</a>`) : ''}
          </table>
          <p style="margin: 20px 0 6px; color: #5b4a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em;">Problem to solve</p>
          <p style="margin: 0; color: #2a2021; font-size: 15px; line-height: 1.65;">${esc(input.problem).replace(/\n/g, '<br/>')}</p>
          <p style="margin: 24px 0 6px; padding-top: 16px; border-top: 1px solid #e6e1e1; color: #5b4a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em;">Where they came from</p>
          <p style="margin: 0 0 6px; color: #c35622; font-size: 15px; font-weight: 600;">${esc(sourceLabel(a))}</p>
          <table style="width: 100%; border-collapse: collapse;">${details}</table>
        </div>
      </div>
    `,
  });
  if (result.error) console.error('[adapto] Resend booking notice error:', result.error);
}

export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) return fail('invalid', 403);
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return fail('invalid', 415);
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return fail('invalid', 413);

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return fail('invalid', 400);
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return fail('invalid', 400);

    const text = (key: string) => (typeof body[key] === 'string' ? (body[key] as string).trim() : '');
    const startsAt = Date.parse(text('startsAt'));
    const endsAt = startsAt + BOOKING.durationMinutes * 60_000;

    // Honeypot: a hidden field real visitors never fill. Pretend it worked.
    if (text('website')) {
      const result: BookingResult = {
        startsAt: new Date(Number.isNaN(startsAt) ? Date.now() : startsAt).toISOString(),
        endsAt: new Date(Number.isNaN(endsAt) ? Date.now() : endsAt).toISOString(),
        meetLink: null,
      };
      return NextResponse.json(result);
    }

    const name = text('name').replace(/\s+/g, ' ');
    const email = text('email').toLowerCase();
    const company = text('company').replace(/\s+/g, ' ');
    const problem = text('problem');
    const timeZone = text('timeZone');
    const locale: Locale = text('locale') === 'fr' ? 'fr' : 'en';

    if (
      !name ||
      !company ||
      !problem ||
      Number.isNaN(startsAt) ||
      name.length > BOOKING_LIMITS.name ||
      email.length > BOOKING_LIMITS.email ||
      company.length > BOOKING_LIMITS.company ||
      problem.length > BOOKING_LIMITS.problem ||
      !EMAIL_RE.test(email) ||
      LINK_RE.test(name) ||
      LINK_RE.test(company) ||
      !isTimeZone(timeZone)
    ) {
      return fail('invalid', 400);
    }

    if (
      rateLimited(`booking-ip:${clientIp(request)}`, MAX_PER_IP) ||
      rateLimited(`booking-to:${email}`, MAX_PER_EMAIL)
    ) {
      return fail('rate_limited', 429);
    }

    if (!isCalendarConfigured()) {
      console.error('[adapto] Google Calendar is not configured');
      return fail('unavailable', 503);
    }

    // The page's list can be stale, and a request can ask for any time at all:
    // only what the calendar offers right now gets booked.
    const now = Date.now();
    const iso = new Date(startsAt).toISOString();
    if (!computeSlots(now, await getBusyRanges(now)).includes(iso)) {
      return fail('slot_taken', 409);
    }
    if (await hasUpcomingBooking(email, now)) return fail('already_booked', 409);

    const attribution = cleanAttribution(body.attribution);
    const created = await createBookingEvent({
      summary: inviteTitle[locale],
      description: inviteDescription[locale],
      startsAt,
      endsAt,
      timeZone,
      attendeeEmail: email,
      privateData: {
        // Up to 1024 characters each: the booking stays readable through the
        // API even if the notification email below is lost.
        name,
        company,
        problem,
        source: sourceLabel(attribution),
        ...attribution,
      },
    });
    if (!created) return fail('slot_taken', 409);

    try {
      await notifyAdapto({
        name,
        email,
        company,
        problem,
        startsAt,
        visitorTimeZone: timeZone,
        meetLink: created.meetLink,
        attribution,
      });
    } catch (notifyError) {
      // The call is booked and the guest is invited: don't fail the request.
      console.error('[adapto] booking notice failed', notifyError);
    }

    const result: BookingResult = {
      startsAt: iso,
      endsAt: new Date(endsAt).toISOString(),
      meetLink: created.meetLink,
    };
    return NextResponse.json(result);
  } catch (error) {
    console.error('[adapto] booking error', error);
    return fail('unavailable', 503);
  }
}
