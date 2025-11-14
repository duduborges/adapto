'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, BarChart3, Handshake } from 'lucide-react';

interface DifferentialsProps {
  dict: any;
}

export const Differentials: React.FC<DifferentialsProps> = ({ dict }) => {
  const differentials = [
    {
      icon: Sparkles,
      title: dict.differentials.items.personalized.title,
      description: dict.differentials.items.personalized.description,
    },
    {
      icon: RefreshCw,
      title: dict.differentials.items.adaptable.title,
      description: dict.differentials.items.adaptable.description,
    },
    {
      icon: BarChart3,
      title: dict.differentials.items.scalable.title,
      description: dict.differentials.items.scalable.description,
    },
    {
      icon: Handshake,
      title: dict.differentials.items.support.title,
      description: dict.differentials.items.support.description,
    },
  ];

  return (
    <Section id="differentials" className="relative bg-black text-white overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-black to-purple-950 animate-gradient opacity-50" />
      <div className="absolute inset-0 grid-pattern opacity-10" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-10" />

      <div className="relative max-w-6xl mx-auto">
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
          {differentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
