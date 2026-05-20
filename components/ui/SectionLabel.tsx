import React from 'react';
import { cn } from '@/lib/utils';

interface SectionLabelProps {
  index: string;
  label: string;
  className?: string;
}

export function SectionLabel({ index, label, className }: SectionLabelProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-cream/40',
        className,
      )}
    >
      <span className="text-ember">§{index}</span>
      <span className="h-px w-12 bg-cream/15" />
      <span>{label}</span>
    </div>
  );
}
