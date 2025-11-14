'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { Users, FolderKanban, Globe2, Sparkles } from 'lucide-react';

interface AboutProps {
  dict: any;
}

export const About: React.FC<AboutProps> = ({ dict }) => {
  const stats = [
    {
      value: '15+',
      label: dict.about.stats.clients,
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      value: '25+',
      label: dict.about.stats.projects,
      icon: FolderKanban,
      color: 'from-purple-500 to-pink-500'
    },
    {
      value: '3',
      label: dict.about.stats.countries,
      icon: Globe2,
      color: 'from-green-500 to-emerald-500'
    },
    {
      value: '2',
      label: dict.about.stats.team,
      icon: Sparkles,
      color: 'from-orange-500 to-red-500'
    },
  ];

  return (
    <Section id="about" className="relative bg-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-30 -ml-48 -mb-48" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-16"
        >
          <Badge>{dict.about.badge}</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {dict.about.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {dict.about.description}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative text-center p-6 rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />

                <div className="relative space-y-3">
                  <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${stat.color} mx-auto`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">
                    {stat.label}
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
