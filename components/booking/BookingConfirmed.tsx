'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CalendarCheck, Clock, Globe2, Mail } from 'lucide-react';
import type { BookingResult } from '@/lib/booking/config';
import { intlTimeZone } from '@/lib/booking/time-zone';
import { site } from '@/lib/site';
import { Button } from '@/components/ui/Button';

/** Handed over by BookingFlow. In the tab, not the URL: analytics see URLs. */
export const CONFIRMATION_KEY = 'adapto.booking.confirmation.v1';

export interface Confirmation extends BookingResult {
  timeZone: string;
  email: string;
  tracked?: boolean;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** The conversion. Both tools only exist if the visitor accepted cookies. */
function trackBooking() {
  window.gtag?.('event', 'generate_lead', { method: 'booking_page' });
  window.fbq?.('track', 'Schedule');
}

export function BookingConfirmed({ lang, t }: { lang: string; t: any }) {
  const [booking, setBooking] = useState<Confirmation | null>(null);

  useEffect(() => {
    let stored: Confirmation | null = null;
    try {
      stored = JSON.parse(window.sessionStorage.getItem(CONFIRMATION_KEY) ?? 'null');
      // Throws on anything malformed, which would otherwise break the render.
      if (stored) {
        new Intl.DateTimeFormat('en-CA', { timeZone: intlTimeZone(stored.timeZone) }).format(
          new Date(stored.startsAt),
        );
      }
    } catch {
      /* Storage disabled or unreadable: show the generic text. */
      stored = null;
    }
    if (!stored) return;
    setBooking(stored);

    // Once per booking, however many times this page is reloaded.
    if (!stored.tracked) {
      trackBooking();
      try {
        window.sessionStorage.setItem(
          CONFIRMATION_KEY,
          JSON.stringify({ ...stored, tracked: true }),
        );
      } catch {
        /* ignore */
      }
    }
  }, []);

  const format = (options: Intl.DateTimeFormatOptions) =>
    booking
      ? new Intl.DateTimeFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
          timeZone: intlTimeZone(booking.timeZone),
          ...options,
        }).format(new Date(booking.startsAt))
      : '';

  const steps: string[] = t.confirmed.steps;

  return (
    <div className="max-w-3xl">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ember/50 bg-ember/15 text-ember-400">
        <CalendarCheck aria-hidden className="h-6 w-6" />
      </span>
      <h1 className="mt-7 font-brand text-[clamp(2.6rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-cream">
        {t.confirmed.title}
        <span className="text-ember">.</span>
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-[1.6] text-cream/70 md:text-xl">
        {booking
          ? t.confirmed.leadEmail.replace('{email}', booking.email)
          : t.confirmed.lead}
      </p>

      {booking && (
        <div className="mt-10 rounded-2xl border border-cream/10 bg-ink-950/70 p-6 md:p-8">
          <p className="font-brand text-2xl leading-tight text-cream first-letter:uppercase md:text-3xl">
            {format({ weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/70">
            <li className="inline-flex items-center gap-2">
              <Clock aria-hidden className="h-4 w-4 text-ember" />
              {format({ hour: 'numeric', minute: '2-digit' })} · {t.duration}
            </li>
            <li className="inline-flex items-center gap-2">
              <Globe2 aria-hidden className="h-4 w-4 text-ember" />
              {format({ timeZoneName: 'short' }).split(' ').pop()}
            </li>
          </ul>
          {booking.meetLink?.startsWith('https://meet.google.com/') && (
            <Button href={booking.meetLink} external className="mt-6">
              {t.confirmed.joinMeet}
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <h2 className="mt-12 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50">
        {t.confirmed.nextTitle}
      </h2>
      <ol className="mt-5 space-y-4">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-4 text-base leading-relaxed text-cream/75">
            <span className="mt-1 font-mono text-xs font-semibold text-ember-400">{`0${i + 1}`}</span>
            {step}
          </li>
        ))}
      </ol>

      <p className="mt-8 inline-flex items-center gap-2 text-sm text-cream/60">
        <Mail aria-hidden className="h-4 w-4 shrink-0 text-ember" />
        <span>
          {t.confirmed.reschedule}{' '}
          <a href={`mailto:${site.email}`} className="text-ember-400 underline underline-offset-2 hover:text-cream">
            {site.email}
          </a>
        </span>
      </p>

      <div className="mt-12 border-t border-cream/10 pt-8">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm text-cream/60 transition-colors hover:text-cream"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          {t.confirmed.back}
        </Link>
      </div>
    </div>
  );
}
