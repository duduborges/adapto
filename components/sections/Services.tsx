'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

interface ServicesProps {
  dict: any;
}

export const Services: React.FC<ServicesProps> = ({ dict }) => {
  const services = [
    {
      icon: '💻',
      title: dict.services.items.development.title,
      description: dict.services.items.development.description,
    },
    {
      icon: '⚡',
      title: dict.services.items.automation.title,
      description: dict.services.items.automation.description,
    },
    {
      icon: '🎯',
      title: dict.services.items.consulting.title,
      description: dict.services.items.consulting.description,
    },
    {
      icon: '🔗',
      title: dict.services.items.integration.title,
      description: dict.services.items.integration.description,
    },
    {
      icon: '🛠️',
      title: dict.services.items.support.title,
      description: dict.services.items.support.description,
    },
    {
      icon: '📈',
      title: dict.services.items.optimization.title,
      description: dict.services.items.optimization.description,
    },
  ];

  return (
    <Section id="services" className="bg-gray-50">
      <div className="max-w-6xl mx-auto">
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
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
