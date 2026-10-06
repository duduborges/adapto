'use client';

import React, { useState } from 'react';
import { ArrowRight, Calendar, Mail, MapPin, Globe2 } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { site, bookingHref, bookingIsExternal } from '@/lib/site';

interface ContactProps {
  dict: any;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact({ dict }: ContactProps) {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    // Capture the form node BEFORE we await — React clears
    // SyntheticEvent.currentTarget after the handler returns/awaits.
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      company: String(formData.get('company') || ''),
      message: String(formData.get('message') || ''),
      website: String(formData.get('website') || ''),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      form.reset();
    } catch (err) {
      console.error('[adapto] contact submit failed', err);
      setStatus('error');
    }
  }

  return (
    <Section
      id="contact"
      size="wide"
      // Desktop: exactly one screen tall with the content centred, like How we
      // work, so section snapping lands on the whole of it instead of its top.
      // Spacing is in svh on desktop so it always fits (pt = header).
      className="relative overflow-hidden border-t border-cream/10 desk:flex desk:h-[100svh] desk:min-h-[620px] desk:scroll-mt-0 desk:flex-col desk:justify-center desk:pb-[3svh] desk:pt-24"
    >
      {/* Ember bloom — behind the booking CTA */}
            {/* Hero grid, lit only where this section's glow is */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-glow"
        style={{ '--glow': 'radial-gradient(560px circle at calc(-5% + 250px) calc(25% + 300px), black 0%, rgba(0,0,0,0.5) 40%, transparent 72%), radial-gradient(420px circle at calc(100% - 200px) calc(100% - 200px), black 0%, rgba(0,0,0,0.5) 40%, transparent 72%)' } as React.CSSProperties}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-5%] top-1/4 -z-10 h-[600px] w-[500px] rounded-full bg-ember/[0.08] blur-[140px]"
      />
      {/* Second bloom — right side behind the form */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-ember/[0.05] blur-[110px]"
      />
      <SectionLabel label={dict.contact.eyebrow} />

      <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-8 md:mt-16 md:gap-8 desk:mt-[3svh]">
        <h2
          data-reveal
          style={{ '--reveal-y': '12px' } as React.CSSProperties}
          className="col-span-12 max-w-5xl text-balance font-brand text-4xl sm:text-5xl leading-[1.02] tracking-[-0.01em] text-cream md:text-6xl lg:text-7xl desk:text-[clamp(2.5rem,6.3svh,4.5rem)] desk:[@media(max-height:820px)]:text-[clamp(2.25rem,5.6svh,3.5rem)]"
        >
          {dict.contact.title.split('.')[0]}
          <span className="text-ember">.</span>
          {dict.contact.title.includes('.') && dict.contact.title.split('.').slice(1).join('.').trim() && (
            <>
              <br />
              <span className="text-cream/45">
                {dict.contact.title.split('.').slice(1).join('.').trim()}
              </span>
            </>
          )}
        </h2>
      </div>

      <div className="mt-16 grid grid-cols-12 gap-x-4 gap-y-8 md:gap-8 md:mt-20 desk:mt-[4svh] desk:[@media(max-height:820px)]:mt-[2.5svh]">
        {/* Big book-a-call CTA — left column */}
        <div
          data-reveal
          style={{ '--reveal-y': '12px', '--reveal-duration': '0.5s' } as React.CSSProperties}
          className="col-span-12 md:col-span-5"
        >
          <p className="text-lg leading-relaxed text-cream/70 md:text-xl">
            {dict.contact.subtitle}
          </p>

          <a
            href={bookingHref()}
            {...(bookingIsExternal()
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="group mt-10 inline-flex max-w-full items-baseline gap-3 border-b border-ember pb-1 font-brand text-3xl leading-tight text-cream transition-colors hover:text-ember md:text-4xl desk:mt-[3.5svh]"
          >
            <Calendar className="h-6 w-6 self-center" />
            <span>{dict.contact.ctaPrimary}</span>
            <ArrowRight className="h-5 w-5 self-center transition-transform group-hover:translate-x-1" />
          </a>

          <ul className="mt-12 space-y-5 text-sm text-cream/70 desk:mt-[3.5svh] desk:space-y-[1.8svh]">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
                  {dict.contact.info.locationLabel}
                </span>
                {dict.contact.info.location}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
                  {dict.contact.info.remoteLabel}
                </span>
                {dict.contact.info.remote}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
              <a href={`mailto:${site.email}`} className="hover:text-cream">
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Form — right column: a titled block with boxed fields and a filled
            button, so it reads as the second way in (it used to be bare lines
            in small grey type) */}
        <div
          data-reveal
          style={{ '--reveal-y': '12px', '--reveal-duration': '0.5s', '--reveal-delay': '0.1s' } as React.CSSProperties}
          className="relative col-span-12 md:col-span-6 md:col-start-7"
        >
          <div className="relative">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ember/40 bg-ember/15 text-ember">
                <Mail aria-hidden className="h-[18px] w-[18px]" />
              </span>
              <div>
                <h3 className="font-brand text-2xl leading-tight text-cream md:text-[1.7rem] desk:[@media(max-height:820px)]:text-xl">
                  {dict.contact.formTitle}
                </h3>
                <p className="mt-1 text-sm text-cream/60">{dict.contact.formNote}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5 desk:mt-[2.6svh] desk:space-y-[1.9svh]">
              <div className="grid gap-5 sm:grid-cols-2 desk:gap-[1.9svh]">
                <Field name="name" label={dict.contact.form.name} required maxLength={100} autoComplete="name" />
                <Field name="email" type="email" label={dict.contact.form.email} required maxLength={254} autoComplete="email" />
              </div>
              <Field name="company" label={dict.contact.form.company} maxLength={150} autoComplete="organization" />
              <Field name="message" label={dict.contact.form.message} required textarea maxLength={5000} />

              {/* Honeypot — hidden from people, filled in by bots; the API drops those */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p role="status" aria-live="polite" className="text-sm">
                  {status === 'success' && (
                    <span className="text-ember">{dict.contact.form.success}</span>
                  )}
                  {status === 'error' && (
                    <span className="text-red-400">{dict.contact.form.error}</span>
                  )}
                </p>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex items-center justify-center gap-2 self-start whitespace-nowrap rounded-full bg-ember px-6 py-3 font-medium text-cream shadow-[0_8px_30px_-12px_rgba(195,86,34,0.7)] transition-all hover:brightness-110 hover:shadow-[0_12px_40px_-10px_rgba(195,86,34,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50 sm:self-auto"
                >
                  {status === 'sending'
                    ? dict.contact.form.sending
                    : dict.contact.form.submit}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required,
  textarea,
  maxLength,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  maxLength?: number;
  autoComplete?: string;
}) {
  const inputClass =
    'block w-full rounded-lg border border-cream/15 bg-ink-950/60 px-4 py-2.5 text-base text-cream placeholder:text-cream/30 transition-colors hover:border-cream/25 focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/25';

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-cream/80">
        {label} {required && <span className="text-ember">*</span>}
      </span>
      {textarea ? (
        <textarea name={name} required={required} maxLength={maxLength} rows={3} className={`${inputClass} resize-none desk:[@media(max-height:820px)]:h-16`} />
      ) : (
        <input name={name} type={type} required={required} maxLength={maxLength} autoComplete={autoComplete} className={inputClass} />
      )}
    </label>
  );
}
