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
    <Section id="work" size="wide" className="relative border-t border-cream/10">
      <SectionLabel index="05" label={dict.work.eyebrow} />

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
        <div className="mt-20 border-t border-cream/15 md:mt-24">
          {cases.map((c, i) => {
            const inner = (
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="group grid grid-cols-12 gap-6 border-b border-cream/15 py-10 md:gap-8 md:py-16"
              >
                {/* Index + meta */}
                <div className="col-span-12 md:col-span-2">
                  <p className="font-mono text-sm text-ember">0{i + 1}</p>
                  {c.year && (
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
                      {c.year}
                    </p>
                  )}
                  {c.tags && c.tags.length > 0 && (
                    <ul className="mt-4 space-y-1">
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
                </div>

                {/* Title + description */}
                <div className="col-span-12 md:col-span-4">
                  <h3 className="font-serif text-3xl leading-tight tracking-tight text-cream md:text-4xl">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-cream/60 md:text-base">
                    {c.description}
                  </p>
                  {c.link && (
                    <span className="mt-6 inline-flex items-center gap-2 border-b border-ember pb-0.5 font-mono text-xs uppercase tracking-[0.18em] text-cream transition-all group-hover:gap-3 group-hover:text-ember">
                      {dict.work.viewCase}
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  )}
                </div>

                {/* Image */}
                <div className="col-span-12 md:col-span-6">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </motion.article>
            );

            return c.link ? (
              <a
                key={c.slug}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {inner}
              </a>
            ) : (
              <div key={c.slug}>{inner}</div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
