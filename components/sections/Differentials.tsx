'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';

interface DifferentialsProps {
  dict: any;
}

export function Differentials({ dict }: DifferentialsProps) {
  const rows = [
    {
      them: dict.differentials.contrast.themEmbedded,
      us: dict.differentials.items.embedded.title,
      detail: dict.differentials.items.embedded.description,
    },
    {
      them: dict.differentials.contrast.themDiagnostic,
      us: dict.differentials.items.diagnostic.title,
      detail: dict.differentials.items.diagnostic.description,
    },
    {
      them: dict.differentials.contrast.themHonest,
      us: dict.differentials.items.honest.title,
      detail: dict.differentials.items.honest.description,
    },
    {
      them: dict.differentials.contrast.themLasting,
      us: dict.differentials.items.lasting.title,
      detail: dict.differentials.items.lasting.description,
    },
  ];

  return (
    <Section
      id="why"
      size="wide"
      className="relative overflow-hidden border-t border-cream/10"
    >
      {/* Ember bloom — give the section more visual weight */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/2 top-1/2 -z-10 h-[640px] w-[640px] -translate-y-1/2 translate-x-1/2 rounded-full bg-ember/8 blur-[160px]"
      />

      <SectionLabel index="04" label={dict.differentials.eyebrow} />

      <div className="mt-12 grid grid-cols-12 gap-8 md:mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="col-span-12 max-w-5xl text-balance font-serif text-4xl leading-[1.02] tracking-[-0.015em] text-cream md:text-7xl"
        >
          {dict.differentials.title.replace(/\.$/, '')}
          <span className="text-ember">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-12 max-w-2xl text-lg leading-relaxed text-cream/70 md:col-span-7 md:text-xl"
        >
          {dict.differentials.subtitle}
        </motion.p>
      </div>

      <div className="mt-20 md:mt-24">
        {/* Column headers — Adapto column has stronger visual weight */}
        <div className="grid grid-cols-12 items-center gap-4 border-b border-cream/15 pb-4 md:gap-8">
          <span className="col-span-1 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            #
          </span>
          <span className="col-span-5 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            {dict.differentials.contrast.themHeading}
          </span>
          <span className="col-span-6 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ember">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            {dict.differentials.contrast.usHeading}
          </span>
        </div>

        {rows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="grid grid-cols-12 gap-4 border-b border-cream/10 py-10 md:gap-8 md:py-14"
          >
            <span className="col-span-1 font-mono text-sm text-cream/40">
              0{i + 1}
            </span>

            {/* "Them" column — dim & strikethrough */}
            <div className="col-span-11 md:col-span-5">
              <div className="flex items-start gap-3">
                <X className="mt-1 h-4 w-4 shrink-0 text-cream/30" />
                <p className="text-base leading-relaxed text-cream/45 line-through decoration-cream/20">
                  {row.them}
                </p>
              </div>
            </div>

            {/* "Adapto" column — visually elevated with ember left border */}
            <div className="col-span-12 md:col-span-6">
              <div className="rounded-r-md border-l-2 border-ember/60 bg-ember/[0.04] py-2 pl-5 md:pl-6">
                <div className="flex items-start gap-3">
                  <Check className="mt-1.5 h-4 w-4 shrink-0 text-ember" />
                  <div>
                    <h3 className="font-serif text-2xl leading-tight text-cream md:text-3xl">
                      {row.us}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream/70 md:text-base">
                      {row.detail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
