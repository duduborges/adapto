'use client';

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import type { ContactFormData } from '@/types';

interface ContactProps {
  dict: any;
}

export const Contact: React.FC<ContactProps> = ({ dict }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-16"
        >
          <Badge>{dict.contact.badge}</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {dict.contact.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {dict.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {dict.contact.form.name}
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {dict.contact.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid email</p>
                )}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  {dict.contact.form.company}
                </label>
                <input
                  type="text"
                  id="company"
                  {...register('company', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {dict.contact.form.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {dict.contact.form.message}
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register('message', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? dict.contact.form.sending : dict.contact.form.submit}
              </Button>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                  {dict.contact.form.success}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {dict.contact.form.error}
                </div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-6">{dict.contact.info.title}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-black text-white flex items-center justify-center flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-gray-600">{dict.contact.info.location}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-black text-white flex items-center justify-center flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <a
                      href="mailto:eduardoborges.dev31@gmail.com"
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      eduardoborges.dev31@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-black text-white flex items-center justify-center flex-shrink-0">
                    📞
                  </div>
                  <div>
                    <div className="font-medium">Phone</div>
                    <a
                      href="tel:+16727553873"
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      +1 (672) 755-3873
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
              <p className="text-gray-700">{dict.contact.info.availability}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};
