'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { site } from '@/lib/site';

interface HeroProps {
  dict: any;
}

export function Hero({ dict }: HeroProps) {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink pt-32 md:pt-40">
      {/* Massive A watermark — the brand mark as a structural background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-12 -z-10 hidden select-none font-serif text-[44rem] leading-none text-ember/[0.06] md:block"
        style={{ fontFeatureSettings: '"ss01"' }}
      >
        A
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-20 -z-10 select-none font-serif text-[22rem] leading-none text-ember/[0.06] md:hidden"
      >
        A
      </div>

      {/* coordinate / station metadata top-left */}
      <div className="absolute left-6 top-28 z-10 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-cream/30 md:left-10 md:block">
        <div>49.2827° N · 123.1207° W</div>
        <div className="mt-1">Vancouver — Canada</div>
      </div>

      <Container size="wide" className="relative">
        <div className="grid grid-cols-12 items-end gap-8">
          {/* Section number marker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="col-span-12 font-mono text-xs uppercase tracking-[0.2em] text-cream/40 md:col-span-2"
          >
            <span className="text-ember">§00</span> · Intro
          </motion.div>

          <div className="col-span-12 md:col-span-10">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-[clamp(2.6rem,7vw,7rem)] font-medium leading-[0.95] tracking-[-0.02em] text-cream"
            >
              <span className="block">{dict.hero.title}</span>
              <span className="block font-serif italic text-ember">
                {dict.hero.titleAccent}
              </span>
            </motion.h1>
          </div>
        </div>

        {/* Subtitle + CTA in a 2-column editorial layout */}
        <div className="mt-20 grid grid-cols-12 gap-8 md:mt-28">
          <div className="col-span-12 md:col-span-2">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-cream/40">
              <span className="text-ember">↳</span> 2026
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-12 max-w-2xl text-balance text-lg leading-[1.55] text-cream/75 md:col-span-7 md:text-xl"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-12 flex flex-col items-start gap-4 md:col-span-3 md:items-end"
          >
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
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

        {/* Bottom strip: marquee-ish credibility line */}
        <div className="mt-24 flex flex-col gap-6 border-t border-cream/10 pt-6 md:mt-32 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            {dict.hero.eyebrow}
          </p>
          <a
            href="#manifesto"
            className="group inline-flex items-center gap-2 self-start font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40 transition-colors hover:text-cream md:self-auto"
          >
            {dict.hero.scrollHint}
            <ArrowDown className="h-3 w-3 text-ember transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </Container>
    </section>
  );
}
