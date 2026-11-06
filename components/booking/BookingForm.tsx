'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { readAttribution } from '@/lib/booking/attribution';
import {
  BOOKING_LIMITS,
  type BookingErrorCode,
  type BookingResult,
} from '@/lib/booking/config';
import { EMAIL_RE, LINK_RE } from '@/lib/request-guards';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

export interface BookingDetails {
  name: string;
  email: string;
  company: string;
  problem: string;
}

type FieldName = keyof BookingDetails;
type Errors = Partial<Record<FieldName, string>>;

interface BookingFormProps {
  lang: string;
  t: any;
  startsAt: string;
  timeZone: string;
  /** Kept by the parent so going back to change the time loses nothing. */
  values: BookingDetails;
  onChange: (values: BookingDetails) => void;
  onBooked: (result: BookingResult) => void;
  onSlotTaken: () => void;
}

function validate(values: BookingDetails, t: any): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  const company = values.company.trim();
  const email = values.email.trim();

  if (!name) errors.name = t.errors.required;
  else if (LINK_RE.test(name)) errors.name = t.errors.noLinks;
  if (!email) errors.email = t.errors.required;
  else if (!EMAIL_RE.test(email)) errors.email = t.errors.email;
  if (!company) errors.company = t.errors.required;
  else if (LINK_RE.test(company)) errors.company = t.errors.noLinks;
  if (!values.problem.trim()) errors.problem = t.errors.required;
  return errors;
}

export function BookingForm({
  lang,
  t,
  startsAt,
  timeZone,
  values,
  onChange,
  onBooked,
  onSlotTaken,
}: BookingFormProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<Exclude<BookingErrorCode, 'slot_taken'> | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function update(name: FieldName, value: string) {
    onChange({ ...values, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const found = validate(values, t);
    setErrors(found);
    const firstInvalid = (Object.keys(values) as FieldName[]).find((k) => found[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setSubmitting(true);
    setFailure(null);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          startsAt,
          timeZone,
          locale: lang,
          website: honeypot.current?.value ?? '',
          attribution: readAttribution(),
        }),
      });
      const body = await res.json();
      if (res.ok) {
        // Stays disabled: the page is about to change to the confirmation.
        onBooked(body as BookingResult);
        return;
      }
      if (body.error === 'slot_taken') {
        onSlotTaken();
        return;
      }
      setFailure(body.error ?? 'unavailable');
    } catch (err) {
      console.error('[adapto] booking failed', err);
      setFailure('unavailable');
    }
    setSubmitting(false);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="name"
          label={t.form.name}
          value={values.name}
          error={errors.name}
          onChange={update}
          maxLength={BOOKING_LIMITS.name}
          autoComplete="name"
        />
        <Field
          name="email"
          type="email"
          label={t.form.email}
          value={values.email}
          error={errors.email}
          onChange={update}
          maxLength={BOOKING_LIMITS.email}
          autoComplete="email"
        />
      </div>
      <Field
        name="company"
        label={t.form.company}
        value={values.company}
        error={errors.company}
        onChange={update}
        maxLength={BOOKING_LIMITS.company}
        autoComplete="organization"
      />
      <Field
        name="problem"
        label={t.form.problem}
        hint={t.form.problemHint}
        value={values.problem}
        error={errors.problem}
        onChange={update}
        maxLength={BOOKING_LIMITS.problem}
        textarea
      />

      {/* Honeypot — hidden from people, filled in by bots; the API drops those */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {failure && (
        <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm leading-relaxed text-red-200">
          {t.errors[failure]}{' '}
          <a href={`mailto:${site.email}`} className="whitespace-nowrap underline underline-offset-2 hover:text-cream">
            {site.email}
          </a>
        </p>
      )}

      <div className="flex flex-col-reverse gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-cream/50">
          {t.form.privacy}{' '}
          <Link href={`/${lang}/privacy`} className="underline underline-offset-2 hover:text-cream">
            {t.form.privacyLink}
          </Link>
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ember-fill px-7 py-3.5 font-medium text-cream shadow-[0_8px_30px_-12px_rgba(195,86,34,0.7)] transition-all hover:brightness-110 hover:shadow-[0_12px_40px_-10px_rgba(195,86,34,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? (
            <>
              <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" />
              {t.form.submitting}
            </>
          ) : (
            <>
              {t.form.submit}
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  hint,
  type = 'text',
  value,
  error,
  onChange,
  textarea,
  maxLength,
  autoComplete,
}: {
  name: FieldName;
  label: string;
  hint?: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (name: FieldName, value: string) => void;
  textarea?: boolean;
  maxLength: number;
  autoComplete?: string;
}) {
  const inputClass = cn(
    'block w-full rounded-lg border bg-ink-950/60 px-4 py-2.5 text-base text-cream placeholder:text-cream/30 transition-colors focus:outline-none focus:ring-2',
    error
      ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/25'
      : 'border-cream/15 hover:border-cream/25 focus:border-ember focus:ring-ember/25',
  );
  const id = `booking-${name}`;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const shared = {
    id,
    name,
    value,
    maxLength,
    required: true,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    className: inputClass,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-cream/80">
        {label} <span aria-hidden className="text-ember">*</span>
      </label>
      {textarea ? (
        <textarea
          {...shared}
          rows={4}
          className={cn(inputClass, 'resize-y')}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          onChange={(e) => onChange(name, e.target.value)}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-300">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-sm text-cream/50">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
