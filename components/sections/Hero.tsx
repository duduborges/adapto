'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { bookingHref, bookingIsExternal } from '@/lib/site';

interface HeroProps {
  dict: any;
  lang?: string;
}

export function Hero({ dict, lang = 'en' }: HeroProps) {
  // French copy is longer — pull the headline ceiling down so it doesn't overflow.
  const titleClamp =
    lang === 'fr'
      ? 'text-[clamp(2rem,5.2vw,5rem)]'
      : 'text-[clamp(2.4rem,6.2vw,6.5rem)]';

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink pt-32 md:pt-36">
      {/* subtle grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-bg mask-radial opacity-50"
      />
      {/* warm ember bloom behind the visual */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[520px] w-[520px] rounded-full bg-ember/15 blur-[140px]"
      />

      <Container size="wide" className="relative">
        {/* Top meta row — Vancouver chip + section index */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-4"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/10 bg-cream/[0.04] px-3.5 py-1.5 text-xs font-medium text-cream/80 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 text-ember" />
            <span>Vancouver · BC · Canada</span>
            <span className="text-cream/30">—</span>
            <span className="text-cream/55">Remote-friendly worldwide</span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/35">
            <span className="text-ember">§00</span> · Intro
          </span>
        </motion.div>

        {/* Title + Visual two-column grid */}
        <div className="mt-10 grid grid-cols-12 items-center gap-8 md:mt-14 lg:gap-12">
          {/* Headline column */}
          <div className="col-span-12 lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className={`${titleClamp} font-medium leading-[0.98] tracking-[-0.02em] text-cream`}
            >
              <span className="block">{dict.hero.title}</span>
              <span className="mt-2 block font-serif italic text-ember">
                {dict.hero.titleAccent}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 max-w-xl text-balance text-lg leading-[1.55] text-cream/75 md:mt-10 md:text-xl"
            >
              {dict.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-12"
            >
              <a
                href={bookingHref()}
                {...(bookingIsExternal()
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="group inline-flex items-baseline gap-3 whitespace-nowrap border-b border-ember pb-1 font-serif text-2xl text-cream transition-colors hover:text-ember md:text-3xl"
              >
                <span>{dict.hero.cta}</span>
                <ArrowRight className="h-5 w-5 self-center transition-transform group-hover:translate-x-1" />
              </a>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                30 min · No commitment
              </span>
            </motion.div>
          </div>

          {/* Visual column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 mt-6 lg:col-span-5 lg:mt-0"
          >
            <HeroVisual />
          </motion.div>
        </div>

        {/* Bottom strip — scroll hint only (Built by Brazilian Engineers removed) */}
        <div className="mt-16 flex items-center justify-between border-t border-cream/10 pt-6 md:mt-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/35">
            <span className="text-ember">↳</span> 2026 — Currently accepting projects
          </p>
          <a
            href="#about"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40 transition-colors hover:text-cream"
          >
            {dict.hero.scrollHint}
            <ArrowDown className="h-3 w-3 text-ember transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </Container>
    </section>
  );
}

/**
 * Hero visual — the brand mark big and prominent, with floating orbital
 * "module" cards that subtly suggest the systems Adapto builds around a
 * business. Keeps the editorial / friendly tone the partner asked for.
 */
function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[460px] lg:max-w-none">
      {/* Soft circular halo */}
      <div
        aria-hidden
        className="absolute inset-[6%] rounded-full bg-gradient-to-br from-ember/20 via-ember/5 to-transparent blur-2xl"
      />

      {/* Centered brand mark */}
      <motion.div
        initial={{ y: 4 }}
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src="/adapto-logo.svg"
          alt=""
          width={632}
          height={592}
          priority
          className="h-44 w-auto select-none drop-shadow-[0_8px_40px_rgba(195,86,34,0.35)] sm:h-56 lg:h-64"
        />
      </motion.div>

      {/* Orbital "module" cards */}
      <FloatingChip
        label="ERP"
        sublabel="inventory · sales"
        className="left-[4%] top-[14%]"
        delay={0}
      />
      <FloatingChip
        label="Automation"
        sublabel="workflows · jobs"
        className="right-[2%] top-[8%]"
        delay={0.4}
      />
      <FloatingChip
        label="Dashboards"
        sublabel="real-time KPIs"
        className="right-[6%] bottom-[14%]"
        delay={0.8}
      />
      <FloatingChip
        label="Integrations"
        sublabel="APIs · webhooks"
        className="left-[2%] bottom-[10%]"
        delay={1.2}
      />

      {/* Subtle connecting lines */}
      <svg
        aria-hidden
        viewBox="0 0 400 320"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-ember/30"
      >
        <defs>
          <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c35622" stopOpacity="0" />
            <stop offset="50%" stopColor="#c35622" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#c35622" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="url(#hero-line)" strokeWidth="1" fill="none" strokeDasharray="3 5">
          <line x1="80" y1="70" x2="200" y2="160" />
          <line x1="320" y1="55" x2="200" y2="160" />
          <line x1="320" y1="250" x2="200" y2="160" />
          <line x1="70" y1="260" x2="200" y2="160" />
        </g>
      </svg>
    </div>
  );
}

function FloatingChip({
  label,
  sublabel,
  className,
  delay = 0,
}: {
  label: string;
  sublabel: string;
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-3, 3, -3] }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`absolute z-20 rounded-md border border-cream/10 bg-ink/85 px-3 py-2 backdrop-blur-md shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-ember" />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-cream/90">
          {label}
        </span>
      </div>
      <p className="mt-0.5 font-mono text-[9px] text-cream/45">{sublabel}</p>
    </motion.div>
  );
}
