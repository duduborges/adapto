'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Mail, MapPin, Globe2 } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { site } from '@/lib/site';

interface ContactProps {
  dict: any;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact({ dict }: ContactProps) {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      company: String(formData.get('company') || ''),
      message: String(formData.get('message') || ''),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <Section id="contact" size="wide" className="relative border-t border-cream/10">
      <SectionLabel index="06" label={dict.contact.eyebrow} />

      <div className="mt-12 grid grid-cols-12 gap-8 md:mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="col-span-12 max-w-5xl text-balance font-serif text-4xl leading-[1.02] tracking-[-0.01em] text-cream md:text-6xl lg:text-7xl"
        >
          {dict.contact.title.split('.')[0]}
          <span className="text-ember">.</span>
          {dict.contact.title.includes('.') && dict.contact.title.split('.').slice(1).join('.').trim() && (
            <>
              <br />
              <span className="font-serif italic text-cream/40">
                {dict.contact.title.split('.').slice(1).join('.').trim()}
              </span>
            </>
          )}
        </motion.h2>
      </div>

      <div className="mt-16 grid grid-cols-12 gap-8 md:mt-20">
        {/* Big book-a-call CTA — left column */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="col-span-12 md:col-span-5"
        >
          <p className="text-lg leading-relaxed text-cream/70 md:text-xl">
            {dict.contact.subtitle}
          </p>

          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex max-w-full items-baseline gap-3 border-b border-ember pb-1 font-serif text-3xl leading-tight text-cream transition-colors hover:text-ember md:text-4xl"
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
        </motion.div>

        {/* Form — right column */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-12 md:col-span-6 md:col-start-7"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            ↳ {dict.contact.ctaSecondary}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <Field name="name" label={dict.contact.form.name} required />
            <Field name="email" type="email" label={dict.contact.form.email} required />
            <Field name="company" label={dict.contact.form.company} required />
            <Field name="message" label={dict.contact.form.message} required textarea />

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
                className="group inline-flex items-baseline gap-3 self-start whitespace-nowrap border-b border-ember pb-1 font-serif text-xl text-cream transition-colors hover:text-ember disabled:opacity-50 md:text-2xl"
              >
                {status === 'sending'
                  ? dict.contact.form.sending
                  : dict.contact.form.submit}
                <ArrowRight className="h-4 w-4 self-center transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </motion.div>
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
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const inputClass =
    'block w-full border-0 border-b border-cream/15 bg-transparent px-0 py-3 text-base text-cream placeholder:text-cream/30 transition-colors focus:border-ember focus:outline-none focus:ring-0';

  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
        {label} {required && <span className="text-ember">*</span>}
      </span>
      {textarea ? (
        <textarea name={name} required={required} rows={3} className={inputClass} />
      ) : (
        <input name={name} type={type} required={required} className={inputClass} />
      )}
    </label>
  );
}
