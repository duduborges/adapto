'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionLabel } from '@/components/ui/SectionLabel';

interface ProcessProps {
  dict: any;
}

const phaseKeys = ['discovery', 'modeling', 'execution', 'control', 'delivery'] as const;
type PhaseKey = (typeof phaseKeys)[number];

/**
 * Slight rotation values to give a Miro-board "sticky note" feel.
 * Subtle — just enough to break the perfectly-aligned grid look.
 */
const rotations = ['-0.6deg', '0.5deg', '-0.4deg', '0.7deg', '-0.3deg'];

export function Process({ dict }: ProcessProps) {
  return (
    <Section
      id="process"
      size="wide"
      className="relative overflow-hidden border-t border-cream/10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40"
      />
      {/* Ember bloom — warm glow behind the sticky-note diagram */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-1/4 left-1/4 -z-10 h-[500px] w-[700px] rounded-full bg-ember/[0.07] blur-[130px]"
      />

      <SectionLabel index="03" label={dict.process.eyebrow} />

      <div className="mt-12 grid grid-cols-12 gap-8 md:mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="col-span-12 max-w-5xl text-balance font-serif text-4xl leading-[1.05] tracking-[-0.01em] text-cream md:col-span-8 md:text-6xl"
        >
          {dict.process.title.replace(/\.$/, '')}
          <span className="text-ember">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-12 self-end text-base leading-relaxed text-cream/60 md:col-span-4 md:text-lg"
        >
          {dict.process.subtitle}
        </motion.p>
      </div>

      {/* Desktop diagram — sticky-note cards connected by ember arrows */}
      <div className="mt-24 hidden md:block">
        <div className="flex items-stretch gap-2">
          {phaseKeys.map((key, i) => {
            const step = dict.process.steps[key] as {
              number: string;
              title: string;
              description: string;
            };
            return (
              <React.Fragment key={key}>
                <motion.article
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  style={{ rotate: rotations[i] }}
                  className="group relative flex flex-1 flex-col border border-cream/15 bg-ink p-5 transition-all hover:border-ember/50 hover:[rotate:0deg] lg:p-6"
                >
                  {/* Sticky-note tab */}
                  <span className="absolute -top-3 left-5 bg-ember px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cream shadow-[0_2px_8px_rgba(195,86,34,0.4)]">
                    Phase {step.number}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl leading-[1.1] text-cream lg:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-cream/60">
                    {step.description}
                  </p>
                  {/* Pin dot (visual signature) */}
                  <span
                    aria-hidden
                    className="absolute right-3 top-3 h-2 w-2 rounded-full bg-ember/40 transition-all group-hover:bg-ember group-hover:shadow-[0_0_12px_rgba(195,86,34,0.8)]"
                  />
                </motion.article>

                {i < phaseKeys.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.35, delay: i * 0.08 + 0.2 }}
                    className="flex items-center"
                    aria-hidden
                  >
                    <svg
                      width="32"
                      height="14"
                      viewBox="0 0 32 14"
                      fill="none"
                      className="text-ember"
                    >
                      <line
                        x1="0"
                        y1="7"
                        x2="26"
                        y2="7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <path
                        d="M22 1 L30 7 L22 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Hand-written annotation below the diagram */}
        <p className="mt-12 font-serif text-base italic text-cream/40">
          ↳ Every phase is reviewed with you before the next one starts. No surprises.
        </p>
      </div>

      {/* Mobile — stacked editorial list */}
      <ol className="mt-20 space-y-10 md:hidden">
        {phaseKeys.map((key) => {
          const step = dict.process.steps[key] as {
            number: string;
            title: string;
            description: string;
          };
          return (
            <li key={key} className="border-l-2 border-ember/40 pl-5">
              <span className="font-mono text-xs text-ember">Phase {step.number}</span>
              <h3 className="mt-2 font-serif text-2xl text-cream">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/60">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
