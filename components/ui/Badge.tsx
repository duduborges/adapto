import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] rounded-full border border-cream/10 bg-cream/5 text-cream/70',
        className,
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
      {children}
    </span>
  );
}
