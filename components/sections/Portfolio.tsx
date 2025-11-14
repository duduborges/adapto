'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { Database, Zap, Network, ArrowRight } from 'lucide-react';

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
      icon: Database,
    },
    {
      title: dict.portfolio.projects.automation.title,
      description: dict.portfolio.projects.automation.description,
      tags: ['Automation', 'Workflow', 'Integration'],
      gradient: 'from-purple-500 to-pink-500',
      icon: Zap,
    },
    {
      title: dict.portfolio.projects.integration.title,
      description: dict.portfolio.projects.integration.description,
      tags: ['Integration', 'API', 'Dashboard'],
      gradient: 'from-orange-500 to-red-500',
      icon: Network,
    },
  ];

  return (
    <Section id="portfolio" className="relative bg-white overflow-hidden">
      {/* Dot pattern background */}
      <div className="absolute inset-0 dot-pattern opacity-40" />

      <div className="relative max-w-6xl mx-auto">
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
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Gradient header with icon */}
                <div className={`relative h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  <Icon className="w-16 h-16 text-white/90 group-hover:scale-110 transition-transform duration-300 relative z-10" />

                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold group-hover:text-gray-900 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 group-hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View more link */}
                  <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-900 transition-colors pt-2">
                    <span>View details</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
