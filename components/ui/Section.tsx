import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  size?: 'default' | 'narrow' | 'wide';
  padding?: 'default' | 'tight' | 'loose';
  bare?: boolean;
}

const padding = {
  tight: 'py-16 md:py-20',
  default: 'py-24 md:py-32 lg:py-36',
  loose: 'py-32 md:py-40 lg:py-48',
};

export function Section({
  children,
  className,
  id,
  size = 'default',
  padding: pad = 'default',
  bare = false,
}: SectionProps) {
  return (
    <section id={id} className={cn(padding[pad], className)}>
      {bare ? children : <Container size={size}>{children}</Container>}
    </section>
  );
}
