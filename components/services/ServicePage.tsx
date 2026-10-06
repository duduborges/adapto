import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Gift, X } from 'lucide-react';
import type { Locale } from '@/types';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ServiceGlyph } from '@/components/sections/ServiceGlyph';
import { Faq } from '@/components/sections/Faq';
import { bookingHref } from '@/lib/site';
import { SERVICES, type ServiceContent, type ServicePageUi, type ServiceSlug } from '@/lib/services';

interface ServicePageProps {
  lang: Locale;
  slug: ServiceSlug;
  content: ServiceContent;
  ui: ServicePageUi;
  /** Every service's content, for the "other services" list. */
  all: Record<ServiceSlug, ServiceContent>;
  dict: any;
}

/** Splits a trailing . ? ! off a heading so it can be set in ember, like the home page. */
function Heading({ text }: { text: string }) {
  const mark = text.match(/[.?!]$/)?.[0];
  return (
    <>
      {mark ? text.slice(0, -1) : text}
      <span className="text-ember">{mark ?? '.'}</span>
    </>
  );
}

const h2Class =
  'text-balance font-serif text-4xl leading-[1.05] tracking-[-0.01em] text-cream sm:text-5xl md:text-6xl';

export function ServicePage({ lang, slug, content, ui, all, dict }: ServicePageProps) {
  const index = SERVICES.findIndex((s) => s.slug === slug);
  const { key } = SERVICES[index];
  const tags: string[] = dict.services.items[key].tags;
  const others = SERVICES.filter((s) => s.slug !== slug);
  const why = ['embedded', 'diagnostic', 'honest', 'lasting'] as const;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 grid-glow"
          style={{ '--glow': 'radial-gradient(640px circle at calc(100% - 300px) 45%, black 0%, rgba(0,0,0,0.5) 40%, transparent 72%), radial-gradient(420px circle at 10% 0%, black 0%, rgba(0,0,0,0.35) 40%, transparent 72%)' } as React.CSSProperties}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-1/4 -z-10 h-[560px] w-[560px] rounded-full bg-ember/[0.12] blur-[140px]"
        />

        <Container size="wide">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45">
              <li>
                <Link href={`/${lang}`} className="transition-colors hover:text-cream">
                  {ui.home}
                </Link>
              </li>
              <ChevronRight aria-hidden className="h-3 w-3 text-cream/25" />
              <li>
                <Link href={`/${lang}#services`} className="transition-colors hover:text-cream">
                  {ui.services}
                </Link>
              </li>
              <ChevronRight aria-hidden className="h-3 w-3 text-cream/25" />
              <li aria-current="page" className="text-ember">
                {dict.services.items[key].title}
              </li>
            </ol>
          </nav>

          <div className="mt-12 grid grid-cols-12 items-center gap-x-4 gap-y-14 md:mt-16 lg:gap-x-12">
            <div className="col-span-12 lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cream/45">
                <span className="text-ember">{ui.service} {String(index + 1).padStart(2, '0')}</span>
                <span className="text-cream/25"> / {String(SERVICES.length).padStart(2, '0')}</span>
              </p>
              <h1 className="mt-6 text-[clamp(2.6rem,6vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.02em] text-cream">
                <span className="block">{content.title}</span>
                <span className="mt-1 block font-serif font-normal italic text-ember">
                  {content.titleAccent}
                </span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-cream/70 md:text-xl">
                {content.lead}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                <a
                  href={bookingHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-baseline gap-3 whitespace-nowrap border-b border-ember pb-1 font-serif text-2xl text-cream transition-colors hover:text-ember md:text-3xl"
                >
                  <span>{dict.nav.book}</span>
                  <ArrowRight className="h-5 w-5 self-center transition-transform group-hover:translate-x-1" />
                </a>
                <Link
                  href={`/${lang}#process`}
                  className="text-sm font-medium text-cream/60 underline-offset-4 transition-colors hover:text-cream hover:underline"
                >
                  {ui.howWeWork}
                </Link>
              </div>

              <p className="mt-8 inline-flex items-center gap-2.5 text-sm font-medium text-ember">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-ember/40 bg-ember/10">
                  <Gift aria-hidden className="h-3 w-3" />
                </span>
                {ui.freeNote}
              </p>
            </div>

            {/* Visual: the category's icon, large, with its motion playing
                (the .svc-row[data-anim] rules in globals.css) */}
            <div className="col-span-12 lg:col-span-5">
              <div
                data-reveal
                data-open=""
                data-anim=""
                className="svc-row relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px]"
              >
                <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
                  <circle cx="200" cy="200" r="190" fill="none" stroke="#c35622" strokeOpacity="0.22" />
                  <circle cx="200" cy="200" r="150" fill="none" stroke="#fefefe" strokeOpacity="0.08" strokeDasharray="2 6" />
                  <g className="origin-center animate-[spin_48s_linear_infinite] motion-reduce:animate-none" style={{ transformBox: 'view-box' }}>
                    <ellipse cx="200" cy="200" rx="196" ry="64" transform="rotate(-20 200 200)" fill="none" stroke="#c35622" strokeOpacity="0.28" />
                    <circle cx="384" cy="135" r="4" fill="#c35622" />
                  </g>
                  <g className="origin-center animate-[spin_64s_linear_infinite_reverse] motion-reduce:animate-none" style={{ transformBox: 'view-box' }}>
                    <ellipse cx="200" cy="200" rx="186" ry="78" transform="rotate(28 200 200)" fill="none" stroke="#fefefe" strokeOpacity="0.1" />
                    <circle cx="40" cy="120" r="3" fill="#fefefe" fillOpacity="0.6" />
                  </g>
                </svg>
                <div className="absolute inset-[27%] rounded-[2rem] border border-ember/60 bg-ember/[0.12] p-[11%] text-ember-400 shadow-[0_0_0_10px_rgba(195,86,34,0.05),0_30px_80px_-20px_rgba(195,86,34,0.6)] backdrop-blur-sm">
                  <ServiceGlyph kind={key} />
                </div>
              </div>

              <div className="mx-auto mt-10 max-w-[440px]">
                <p className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/55">
                  {ui.included}
                </p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="inline-flex items-center gap-2 rounded-md border border-ember/25 bg-ember/[0.06] px-3 py-1.5 text-sm font-medium text-cream/90"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_6px_rgba(195,86,34,0.8)]" />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Sounds familiar? ---------- */}
      <Section size="wide" className="relative border-t border-cream/10">
        <SectionLabel label={ui.problemsLabel} />
        <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-12 md:mt-16 md:gap-x-8">
          <h2 data-reveal className={`col-span-12 lg:col-span-5 ${h2Class}`}>
            <Heading text={content.problems.title} />
          </h2>
          <ul className="col-span-12 lg:col-span-7">
            {content.problems.items.map((item, i) => (
              <li
                key={item}
                data-reveal
                style={{ '--reveal-y': '12px', '--reveal-delay': `${i * 0.06}s` } as React.CSSProperties}
                className="flex items-start gap-5 border-b border-cream/10 py-6 first:pt-0 md:py-7 md:first:pt-0"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream/40">
                  <X aria-hidden className="h-3.5 w-3.5" />
                </span>
                <p className="text-lg leading-relaxed text-cream/75 md:text-xl">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------- What we build ---------- */}
      <Section size="wide" className="relative overflow-hidden border-t border-cream/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 hidden grid-glow sm:block"
          style={{ '--glow': 'radial-gradient(560px circle at 15% 70%, black 0%, rgba(0,0,0,0.5) 40%, transparent 72%)' } as React.CSSProperties}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[-8%] -z-10 h-[520px] w-[520px] rounded-full bg-ember/[0.07] blur-[140px]"
        />
        <SectionLabel label={ui.buildLabel} />
        <h2 data-reveal className={`mt-12 max-w-4xl md:mt-16 ${h2Class}`}>
          <Heading text={content.build.title} />
        </h2>
        <ul className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-5">
          {content.build.items.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              style={{ '--reveal-y': '16px', '--reveal-delay': `${(i % 3) * 0.08}s` } as React.CSSProperties}
              className="group relative overflow-hidden rounded-2xl border border-cream/10 bg-cream/[0.02] p-7 transition-colors duration-300 hover:border-ember/40 hover:bg-ember/[0.04] md:p-8"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-ember/0 blur-3xl transition-colors duration-500 group-hover:bg-ember/20"
              />
              <span className="font-mono text-xs font-semibold text-ember">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 font-serif text-2xl leading-tight text-cream md:text-[1.75rem]">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-cream/60">{item.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- How it works ---------- */}
      <Section size="wide" className="relative border-t border-cream/10">
        <SectionLabel label={ui.stepsLabel} />
        <h2 data-reveal className={`mt-12 max-w-4xl md:mt-16 ${h2Class}`}>
          <Heading text={content.steps.title} />
        </h2>

        <ol className="mt-16 grid grid-cols-1 gap-y-10 md:mt-20 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
          {content.steps.items.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{ '--reveal-y': '14px', '--reveal-delay': `${i * 0.1}s` } as React.CSSProperties}
              className="relative border-l border-cream/15 pl-6 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-8"
            >
              <span
                aria-hidden
                className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full lg:-top-[5px] lg:left-0 ${
                  i === 0 ? 'bg-ember shadow-[0_0_0_4px_rgba(195,86,34,0.15)]' : 'bg-cream/30'
                }`}
              />
              <span className="font-mono text-xs font-semibold tracking-widest text-ember">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-serif text-2xl leading-tight text-cream">{step.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-cream/60">{step.description}</p>
            </li>
          ))}
        </ol>

        <div
          data-reveal
          className="relative mt-16 overflow-hidden rounded-3xl border border-ember/30 bg-gradient-to-br from-ember/[0.14] via-ember/[0.05] to-transparent p-8 md:mt-24 md:p-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-ember/20 blur-[90px]"
          />
          <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-12">
            <div className="flex items-start gap-5 md:col-span-8">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ember/40 bg-ember/15 text-ember">
                <Gift aria-hidden className="h-5 w-5" />
              </span>
              <div>
                <p className="font-serif text-3xl leading-tight text-cream md:text-4xl">
                  <Heading text={ui.free.title} />
                </p>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream/70 md:text-lg">
                  {ui.free.body}
                </p>
              </div>
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <Button href={bookingHref()} external size="lg" className="group">
                {dict.nav.book}
                <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Why Adapto ---------- */}
      <Section size="wide" className="relative overflow-hidden border-t border-cream/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 hidden grid-glow sm:block"
          style={{ '--glow': 'radial-gradient(520px circle at 85% 40%, black 0%, rgba(0,0,0,0.5) 40%, transparent 72%)' } as React.CSSProperties}
        />
        <SectionLabel label={ui.whyLabel} />
        <h2 data-reveal className={`mt-12 max-w-4xl md:mt-16 ${h2Class}`}>
          <Heading text={ui.whyTitle} />
        </h2>
        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {why.map((k, i) => (
            <li
              key={k}
              data-reveal
              style={{ '--reveal-y': '14px', '--reveal-delay': `${i * 0.08}s` } as React.CSSProperties}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ember/50 bg-ember/10 text-ember">
                <Check aria-hidden className="h-4 w-4" />
              </span>
              <h3 className="mt-6 font-serif text-2xl leading-tight text-cream">
                {dict.differentials.items[k].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-cream/60">
                {dict.differentials.items[k].description}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Faq
        id="service-faq"
        eyebrow={ui.faqLabel}
        title={ui.faqTitle}
        subtitle={dict.faq.subtitle}
        bookLabel={dict.nav.book}
        items={content.faq}
      />

      {/* ---------- Other services ---------- */}
      <Section size="wide" className="relative border-t border-cream/10">
        <SectionLabel label={ui.otherLabel} />
        <h2 data-reveal className={`mt-12 max-w-4xl md:mt-16 ${h2Class}`}>
          <Heading text={ui.otherTitle} />
        </h2>
        <ul className="mt-16 border-t border-cream/15 md:mt-20">
          {others.map((s) => {
            const n = SERVICES.findIndex((x) => x.slug === s.slug) + 1;
            return (
              <li key={s.slug} className="border-b border-cream/15">
                <Link
                  href={`/${lang}/services/${s.slug}`}
                  className="group grid grid-cols-12 items-center gap-4 px-2 py-6 transition-colors hover:bg-cream/[0.02] md:gap-8 md:px-4 md:py-8"
                >
                  <span className="col-span-2 font-mono text-sm font-semibold text-ember md:col-span-1">
                    {String(n).padStart(2, '0')}
                  </span>
                  <span className="col-span-8 flex items-center gap-4 md:col-span-6 md:gap-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cream/[0.12] bg-cream/[0.02] p-2 text-ember/75 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-ember/50 group-hover:text-ember md:h-12 md:w-12 md:p-2.5">
                      <ServiceGlyph kind={s.key} />
                    </span>
                    <span className="font-serif text-2xl leading-tight text-cream/75 transition-colors group-hover:text-cream md:text-4xl">
                      {dict.services.items[s.key].title}
                    </span>
                  </span>
                  <span className="col-span-12 hidden text-sm leading-relaxed text-cream/50 md:col-span-4 md:block">
                    {all[s.slug].title} {all[s.slug].titleAccent}
                  </span>
                  <span className="col-span-2 flex justify-end md:col-span-1">
                    <ArrowUpRight
                      aria-hidden
                      className="h-6 w-6 text-cream/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
