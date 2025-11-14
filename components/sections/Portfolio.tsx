'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

interface PortfolioProps {
  dict: any;
}

export const Portfolio: React.FC<PortfolioProps> = ({ dict }) => {
  const projects = [
    {
      title: dict.portfolio.projects.erp.title,
      description: dict.portfolio.projects.erp.description,
      tags: ['ERP', 'Custom Development', 'Database'],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: dict.portfolio.projects.automation.title,
      description: dict.portfolio.projects.automation.description,
      tags: ['Automation', 'Workflow', 'Integration'],
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: dict.portfolio.projects.integration.title,
      description: dict.portfolio.projects.integration.description,
      tags: ['Integration', 'API', 'Dashboard'],
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <Section id="portfolio" className="bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-16"
        >
          <Badge>{dict.portfolio.badge}</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {dict.portfolio.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {dict.portfolio.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className={`h-48 bg-gradient-to-br ${project.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
