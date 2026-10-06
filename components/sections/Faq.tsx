import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StructuredData } from '@/components/seo/StructuredData';
import { bookingHref } from '@/lib/site';

interface FaqProps {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  bookLabel: string;
  items: { q: string; a: string }[];
  className?: string;
}

/**
 * A FAQ section: heading and booking link on the left, the questions on the
 * right, plus FAQPage structured data. The open/close height animation is
 * CSS-only (see .faq-item in globals.css).
 */
export function Faq({
  id = 'faq',
  eyebrow,
  title,
  subtitle,
  bookLabel,
  items,
  className,
}: FaqProps) {
  const heading = title.replace(/[.?!]$/, '');
  const mark = title.match(/[.?!]$/)?.[0] ?? '.';

  return (
    <Section
      id={id}
      size="wide"
      // overflow-clip, not -hidden: hidden makes the section a scroll
      // container, and the sticky column would then pin inside it (128px down)
      className={`relative overflow-clip border-t border-cream/10 ${className ?? ''}`}
    >
      <StructuredData data={faqSchema(items)} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden grid-glow sm:block"
        style={{ '--glow': 'radial-gradient(520px circle at calc(100% - 220px) 30%, black 0%, rgba(0,0,0,0.5) 40%, transparent 72%)' } as React.CSSProperties}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-8%] top-1/4 -z-10 h-[460px] w-[460px] rounded-full bg-ember/[0.06] blur-[130px]"
      />

      <div className="grid grid-cols-12 gap-x-4 gap-y-12 md:gap-x-8">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionLabel label={eyebrow} />
            <h2
              data-reveal
              style={{ '--reveal-y': '12px' } as React.CSSProperties}
              className="mt-10 text-balance font-brand text-4xl leading-[1.05] tracking-[-0.01em] text-cream sm:text-5xl md:mt-12 md:text-6xl"
            >
              {heading}
              <span className="text-ember">{mark}</span>
            </h2>
            {subtitle && (
              <p className="mt-6 max-w-sm text-base leading-relaxed text-cream/60 md:text-lg">
                {subtitle}
              </p>
            )}
            <a
              href={bookingHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-baseline gap-3 border-b border-ember pb-1 font-brand text-2xl text-cream transition-colors hover:text-ember"
            >
              <span>{bookLabel}</span>
              <ArrowRight className="h-5 w-5 self-center transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <FaqList items={items} />
        </div>
      </div>
    </Section>
  );
}

/**
 * The questions themselves: native <details>, so every answer is in the HTML
 * and they open without JavaScript. Used by the FAQ section above and by the
 * FAQ page, which groups several lists.
 */
export function FaqList({
  items,
  openFirst = true,
}: {
  items: { q: string; a: string }[];
  openFirst?: boolean;
}) {
  return (
    <ul className="border-t border-cream/15">
      {items.map((item, i) => (
        <li key={item.q} className="border-b border-cream/15">
          <details className="faq-item group" open={openFirst && i === 0}>
            <summary className="flex cursor-pointer list-none items-start gap-5 py-7 transition-colors hover:bg-cream/[0.02] md:gap-8 md:px-2 md:py-9 [&::-webkit-details-marker]:hidden">
              <span className="mt-1.5 font-mono text-xs font-semibold text-ember md:mt-2 md:text-sm">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 font-brand text-xl leading-snug text-cream/75 transition-colors group-open:text-cream group-hover:text-cream md:text-2xl">
                {item.q}
              </span>
              <span
                aria-hidden
                className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream/50 transition-all duration-300 group-open:rotate-45 group-open:border-ember/60 group-open:bg-ember/10 group-open:text-ember group-hover:border-ember/50 group-hover:text-ember md:h-9 md:w-9"
              >
                <Plus className="h-4 w-4" />
              </span>
            </summary>
            <p className="max-w-3xl pb-8 pl-9 pr-12 text-base leading-relaxed text-cream/65 md:pb-10 md:pl-[3.6rem] md:text-lg">
              {item.a}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}

/** FAQPage structured data for a set of questions. */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
