'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';

interface AboutProps {
  dict: any;
}

export function About({ dict }: AboutProps) {
  return (
    <Section id="manifesto" size="wide" className="relative">
      <SectionLabel index="01" label={dict.manifesto.eyebrow} />

      {/* Heading + lead — asymmetric editorial grid */}
      <div className="mt-12 grid grid-cols-12 gap-8 md:mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="col-span-12 max-w-5xl text-balance font-serif text-4xl leading-[1.05] tracking-[-0.01em] text-cream md:text-6xl lg:text-7xl"
        >
          {dict.manifesto.title.split('.')[0]}
          <span className="text-ember">.</span>
        </motion.h2>
      </div>

      {/* Long-form body with drop cap */}
      <div className="mt-20 grid grid-cols-12 gap-8 md:mt-24">
        <motion.aside
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="col-span-12 space-y-3 md:col-span-3"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            ↳ Marginalia
          </p>
          <p className="font-serif text-base italic leading-snug text-cream/50">
            “The brief is what you tell us; the answer comes from what we see.”
          </p>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-12 max-w-2xl md:col-span-8 md:col-start-5"
        >
          <p className="text-xl leading-[1.55] text-cream md:text-2xl">
            {dict.manifesto.lead}
          </p>

          <div className="mt-10 space-y-6 text-base leading-[1.7] text-cream/70 md:text-lg">
            {dict.manifesto.paragraphs.map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pillars as a numbered list, not cards */}
      <div className="mt-28 grid grid-cols-12 gap-8 md:mt-36">
        <div className="col-span-12 md:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            ↳ Three principles
          </p>
        </div>
        <div className="col-span-12 md:col-span-9">
          <ul className="divide-y divide-cream/10 border-y border-cream/10">
            {(['inside', 'process', 'partnership'] as const).map((key, i) => {
              const p = dict.manifesto.pillars[key];
              return (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group grid grid-cols-12 items-baseline gap-4 py-8 md:gap-8 md:py-10"
                >
                  <span className="col-span-2 font-mono text-sm text-ember md:col-span-1">
                    0{i + 1}
                  </span>
                  <h3 className="col-span-10 font-serif text-2xl text-cream md:col-span-4 md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="col-span-12 text-base leading-relaxed text-cream/60 md:col-span-7">
                    {p.description}
                  </p>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
