'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { cases } from '@/lib/data/cases';

interface PortfolioProps {
  dict: any;
}

export function Portfolio({ dict }: PortfolioProps) {
  const hasCases = cases.length > 0;

  return (
    <Section id="work" size="wide" className="relative overflow-hidden border-t border-cream/10">
      {/* Ember bloom — top-right accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-5%] top-0 -z-10 h-[500px] w-[500px] rounded-full bg-ember/[0.06] blur-[130px]"
      />
      <SectionLabel index="01" label={dict.work.eyebrow} />

      <div className="mt-12 grid grid-cols-12 gap-8 md:mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="col-span-12 max-w-5xl text-balance font-serif text-4xl leading-[1.05] tracking-[-0.01em] text-cream md:col-span-8 md:text-6xl"
        >
          {dict.work.title.replace(/\.$/, '')}
          <span className="text-ember">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-12 self-end text-base leading-relaxed text-cream/60 md:col-span-4 md:text-lg"
        >
          {dict.work.subtitle}
        </motion.p>
      </div>

      {!hasCases && (
        <div className="mt-16 border-y border-dashed border-cream/15 px-6 py-16 text-center">
          <p className="font-serif text-2xl italic text-cream/50">
            {dict.work.empty}
          </p>
        </div>
      )}

      {hasCases && (
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-8">
          {cases.map((c, i) => {
            const inner = (
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-cream/15 bg-ink-800/40 transition-colors duration-300 hover:border-ember/40"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden border-b border-cream/10 bg-ink-800">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Meta + content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm text-ember">0{i + 1}</p>
                    {c.year && (
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
                        {c.year}
                      </p>
                    )}
                  </div>

                  <h3 className="mt-4 font-serif text-2xl leading-tight tracking-tight text-cream">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/60">
                    {c.description}
                  </p>

                  {c.tags && c.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                      {c.tags.map((t) => (
                        <li
                          key={t}
                          className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/40"
                        >
                          · {t}
                        </li>
                      ))}
                    </ul>
                  )}

                  {c.link && (
                    <span className="mt-6 inline-flex items-center gap-2 self-start border-b border-ember pb-0.5 font-mono text-xs uppercase tracking-[0.18em] text-cream transition-all group-hover:gap-3 group-hover:text-ember">
                      {dict.work.viewCase}
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </motion.article>
            );

            return c.link ? (
              <a
                key={c.slug}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                {inner}
              </a>
            ) : (
              <div key={c.slug} className="h-full">
                {inner}
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
