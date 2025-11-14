'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

interface DifferentialsProps {
  dict: any;
}

export const Differentials: React.FC<DifferentialsProps> = ({ dict }) => {
  const differentials = [
    {
      icon: '✨',
      title: dict.differentials.items.personalized.title,
      description: dict.differentials.items.personalized.description,
    },
    {
      icon: '🔄',
      title: dict.differentials.items.adaptable.title,
      description: dict.differentials.items.adaptable.description,
    },
    {
      icon: '📊',
      title: dict.differentials.items.scalable.title,
      description: dict.differentials.items.scalable.description,
    },
    {
      icon: '🤝',
      title: dict.differentials.items.support.title,
      description: dict.differentials.items.support.description,
    },
  ];

  return (
    <Section id="differentials" className="bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-16"
        >
          <Badge className="bg-white/10 text-white border-white/20">
            {dict.differentials.badge}
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {dict.differentials.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {differentials.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="space-y-4"
            >
              <div className="text-5xl">{item.icon}</div>
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-lg">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
