'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { Search, FileText, Code, TestTube, Rocket, Headphones } from 'lucide-react';

interface ProcessProps {
  dict: any;
}

export const Process: React.FC<ProcessProps> = ({ dict }) => {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: dict.process.steps.discovery.title,
      description: dict.process.steps.discovery.description,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      icon: FileText,
      title: dict.process.steps.planning.title,
      description: dict.process.steps.planning.description,
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '03',
      icon: Code,
      title: dict.process.steps.development.title,
      description: dict.process.steps.development.description,
      color: 'from-green-500 to-emerald-500',
    },
    {
      number: '04',
      icon: TestTube,
      title: dict.process.steps.testing.title,
      description: dict.process.steps.testing.description,
      color: 'from-orange-500 to-red-500',
    },
    {
      number: '05',
      icon: Rocket,
      title: dict.process.steps.launch.title,
      description: dict.process.steps.launch.description,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      number: '06',
      icon: Headphones,
      title: dict.process.steps.support.title,
      description: dict.process.steps.support.description,
      color: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <Section id="process" className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative max-w-6xl mx-auto">
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
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-6 rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />

                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${step.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`text-3xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-gray-900 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
