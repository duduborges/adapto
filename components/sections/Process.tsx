'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

interface ProcessProps {
  dict: any;
}

export const Process: React.FC<ProcessProps> = ({ dict }) => {
  const steps = [
    {
      number: '01',
      title: dict.process.steps.discovery.title,
      description: dict.process.steps.discovery.description,
    },
    {
      number: '02',
      title: dict.process.steps.planning.title,
      description: dict.process.steps.planning.description,
    },
    {
      number: '03',
      title: dict.process.steps.development.title,
      description: dict.process.steps.development.description,
    },
    {
      number: '04',
      title: dict.process.steps.testing.title,
      description: dict.process.steps.testing.description,
    },
    {
      number: '05',
      title: dict.process.steps.launch.title,
      description: dict.process.steps.launch.description,
    },
    {
      number: '06',
      title: dict.process.steps.support.title,
      description: dict.process.steps.support.description,
    },
  ];

  return (
    <Section id="process" className="bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-16"
        >
          <Badge>{dict.process.badge}</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {dict.process.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {dict.process.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="space-y-3">
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
