'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, MapPin } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Container } from '@/components/ui/Container';
import { bookingHref, bookingIsExternal } from '@/lib/site';

// WebGL scene — client-only, no server render
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[460px] animate-pulse lg:max-w-none">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[6%] inset-y-[8%] rounded-3xl bg-gradient-to-br from-ember/14 via-ember/4 to-transparent blur-3xl"
      />
    </div>
  ),
});

interface HeroProps {
  dict: any;
  lang?: string;
}

/**
 * The visual column is `hidden lg:block`. Mounting HeroScene below that
 * breakpoint would still fetch Three.js (~134 KB gzip) and spin up a WebGL
 * context for a zero-sized, invisible canvas, so gate the mount on the same
 * breakpoint the CSS uses.
 */
function useLargeViewport() {
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsLarge(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return isLarge;
}

export function Hero({ dict, lang = 'en' }: HeroProps) {
  const showScene = useLargeViewport();

  // French copy is longer — pull the headline ceiling down so it doesn't overflow.
  const titleClamp =
    lang === 'fr'
      ? 'text-[clamp(2rem,3.8vw,3.8rem)]'
      : 'text-[clamp(2.6rem,5vw,4.4rem)]';

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-24 md:pt-28">
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
      {/* Large brand mark watermark — slightly lighter than bg, bleeds off the right edge */}
      <div aria-hidden className="pointer-events-none absolute right-[-18%] top-1/2 hidden -translate-y-1/2 select-none lg:block">
        <Image
          src="/logos/adapto-mark.png"
          alt=""
          width={1000}
          height={1000}
          sizes="80vh"
          className="h-[80svh] w-auto opacity-[0.12]"
        />
      </div>

      <Container size="wide" className="relative flex flex-1 flex-col pb-6 md:pb-8">
        {/* Top meta row — Vancouver chip + section index */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-4"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/10 bg-cream/[0.04] px-2.5 py-1 text-[10px] font-medium text-cream/50 backdrop-blur-sm md:gap-2 md:px-3.5 md:py-1.5 md:text-xs md:text-cream/80">
            <MapPin className="h-3 w-3 text-ember/70 md:h-3.5 md:w-3.5 md:text-ember" />
            <span>Vancouver · BC · Canada</span>
            <span className="hidden text-cream/30 md:inline">—</span>
            <span className="hidden text-cream/55 md:inline">Remote-friendly worldwide</span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/35">
            <span className="text-ember">§00</span> · Intro
          </span>
        </motion.div>

        {/* Flex-1 wrapper: centers the content block between meta row and strip */}
        <div className="flex flex-1 items-center py-6">
          {/* Title + Visual two-column grid */}
          <div className="grid w-full grid-cols-12 items-center gap-8 lg:gap-12">
            {/* Headline column */}
            <div className="col-span-12 lg:col-span-5">
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
                className="mt-5 text-balance text-lg leading-[1.55] text-cream/75 md:mt-7 md:text-xl"
              >
                {dict.hero.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-9"
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
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40 md:inline">
                  30 min · No commitment
                </span>
              </motion.div>
            </div>

            {/* Visual column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-12 hidden lg:col-span-7 lg:block"
            >
              {showScene && <HeroScene />}
            </motion.div>
          </div>
        </div>

        {/* Bottom strip — always visible, sits below the flex-1 wrapper */}
        <div className="flex items-center justify-between border-t border-cream/10 pt-5">
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-cream/35 md:block">
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
