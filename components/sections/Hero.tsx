'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Calendar, ArrowDown, CheckCircle2, Zap, Shield } from 'lucide-react';

interface HeroProps {
  dict: any;
}

export const Hero: React.FC<HeroProps> = ({ dict }) => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container relative mx-auto px-4 md:px-6 lg:px-8 max-w-7xl pt-20 md:pt-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              {dict.hero.title}
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {dict.hero.titleHighlight}
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
              {dict.hero.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" onClick={scrollToContact} className="group">
              <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {dict.hero.cta}
            </Button>
            <Button size="lg" variant="secondary" onClick={scrollToAbout} className="group">
              {dict.hero.ctaSecondary}
              <ArrowDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-8"
          >
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1.5 rounded-full bg-green-100">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium">100% Custom</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1.5 rounded-full bg-blue-100">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1.5 rounded-full bg-purple-100">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Secure & Reliable</span>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
                <motion.div
                  className="w-1.5 h-1.5 bg-gray-600 rounded-full"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};
