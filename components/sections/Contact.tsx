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
    <Section id="contact" size="wide" className="relative overflow-hidden border-t border-cream/10">
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

      <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-8 md:mt-16 md:gap-8">
        <h2
          data-reveal
          style={{ '--reveal-y': '12px' } as React.CSSProperties}
          className="col-span-12 max-w-5xl text-balance font-brand text-4xl sm:text-5xl leading-[1.02] tracking-[-0.01em] text-cream md:text-6xl lg:text-7xl"
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

      <div className="mt-16 grid grid-cols-12 gap-x-4 gap-y-8 md:gap-8 md:mt-20">
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
            className="group mt-10 inline-flex max-w-full items-baseline gap-3 border-b border-ember pb-1 font-brand text-3xl leading-tight text-cream transition-colors hover:text-ember md:text-4xl"
          >
            <Calendar className="h-6 w-6 self-center" />
            <span>{dict.contact.ctaPrimary}</span>
            <ArrowRight className="h-5 w-5 self-center transition-transform group-hover:translate-x-1" />
          </a>

          <ul className="mt-12 space-y-5 text-sm text-cream/70">
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

        {/* Form — right column */}
        <div
          data-reveal
          style={{ '--reveal-y': '12px', '--reveal-duration': '0.5s', '--reveal-delay': '0.1s' } as React.CSSProperties}
          className="col-span-12 md:col-span-6 md:col-start-7"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            ↳ {dict.contact.ctaSecondary}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <Field name="name" label={dict.contact.form.name} required maxLength={100} autoComplete="name" />
            <Field name="email" type="email" label={dict.contact.form.email} required maxLength={254} autoComplete="email" />
            <Field name="company" label={dict.contact.form.company} maxLength={150} autoComplete="organization" />
            <Field name="message" label={dict.contact.form.message} required textarea maxLength={5000} />

            {/* Honeypot — hidden from people, filled in by bots; the API drops those */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
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
                className="group inline-flex items-baseline gap-3 self-start whitespace-nowrap border-b border-ember pb-1 font-brand text-xl text-cream transition-colors hover:text-ember disabled:opacity-50 md:text-2xl"
              >
                {status === 'sending'
                  ? dict.contact.form.sending
                  : dict.contact.form.submit}
                <ArrowRight className="h-4 w-4 self-center transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
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
    'block w-full border-0 border-b border-cream/15 bg-transparent px-0 py-3 text-base text-cream placeholder:text-cream/30 transition-colors focus:border-ember focus:outline-none focus:ring-0';

  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
        {label} {required && <span className="text-ember">*</span>}
      </span>
      {textarea ? (
        <textarea name={name} required={required} maxLength={maxLength} rows={3} className={inputClass} />
      ) : (
        <input name={name} type={type} required={required} maxLength={maxLength} autoComplete={autoComplete} className={inputClass} />
      )}
    </label>
  );
}
