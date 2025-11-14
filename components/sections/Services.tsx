'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { Code2, Zap, Target, Link2, Wrench, TrendingUp } from 'lucide-react';

interface ServicesProps {
  dict: any;
}

export const Services: React.FC<ServicesProps> = ({ dict }) => {
  const services = [
    {
      icon: Code2,
      title: dict.services.items.development.title,
      description: dict.services.items.development.description,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: dict.services.items.automation.title,
      description: dict.services.items.automation.description,
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Target,
      title: dict.services.items.consulting.title,
      description: dict.services.items.consulting.description,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Link2,
      title: dict.services.items.integration.title,
      description: dict.services.items.integration.description,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Wrench,
      title: dict.services.items.support.title,
      description: dict.services.items.support.description,
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      icon: TrendingUp,
      title: dict.services.items.optimization.title,
      description: dict.services.items.optimization.description,
      gradient: 'from-red-500 to-pink-500',
    },
  ];

  return (
    <Section id="services" className="relative bg-gray-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-16"
        >
          <Badge>{dict.services.badge}</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {dict.services.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {dict.services.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-gray-900 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
