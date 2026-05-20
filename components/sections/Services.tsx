'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';

interface ServicesProps {
  dict: any;
}

const serviceKeys = ['custom', 'automation', 'dashboards', 'integrations'] as const;
type ServiceKey = (typeof serviceKeys)[number];

export function Services({ dict }: ServicesProps) {
  const [open, setOpen] = useState<ServiceKey | null>('custom');

  return (
    <Section id="services" size="wide" className="relative border-t border-cream/10">
      <SectionLabel index="02" label={dict.services.eyebrow} />

      <div className="mt-12 grid grid-cols-12 gap-8 md:mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="col-span-12 max-w-5xl text-balance font-serif text-4xl leading-[1.05] tracking-[-0.01em] text-cream md:col-span-8 md:text-6xl"
        >
          {dict.services.title.replace(/\.$/, '')}
          <span className="text-ember">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-12 self-end text-base leading-relaxed text-cream/60 md:col-span-4 md:text-lg"
        >
          {dict.services.subtitle}
        </motion.p>
      </div>

      <ul className="mt-20 border-t border-cream/15 md:mt-24">
        {serviceKeys.map((key, i) => {
          const item = dict.services.items[key];
          const isOpen = open === key;
          return (
            <li key={key} className="border-b border-cream/15">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : key)}
                className="group grid w-full grid-cols-12 items-center gap-4 py-7 text-left transition-colors hover:bg-cream/[0.02] md:gap-8 md:py-10"
                aria-expanded={isOpen}
              >
                <span className="col-span-2 font-mono text-sm text-ember md:col-span-1">
                  0{i + 1}
                </span>
                <h3
                  className={`col-span-9 font-serif text-3xl leading-tight tracking-tight transition-colors md:col-span-9 md:text-5xl ${
                    isOpen ? 'text-cream' : 'text-cream/70 group-hover:text-cream'
                  }`}
                >
                  {item.title}
                </h3>
                <span className="col-span-1 flex items-center justify-end text-cream/40 group-hover:text-ember md:col-span-2">
                  {isOpen ? (
                    <Minus className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-12 gap-4 pb-10 md:gap-8">
                      <div className="col-span-12 col-start-1 md:col-span-7 md:col-start-2">
                        <p className="text-lg leading-[1.6] text-cream/80 md:text-xl">
                          {item.description}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4 md:col-start-9">
                        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                          Stack & primitives
                        </p>
                        <ul className="space-y-2 text-sm text-cream/60">
                          {item.tags.map((tag: string) => (
                            <li key={tag} className="flex items-baseline gap-2">
                              <span className="text-ember">·</span>
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
