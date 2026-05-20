import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  /** Tailwind height class — defaults to h-12 (header) */
  size?: string;
}

export function Logo({ className, size = 'h-12 md:h-14' }: LogoProps) {
  return (
    <span
      className={cn('inline-flex items-center', className)}
      aria-label="Adapto"
    >
      <Image
        src="/adapto-logo.svg"
        alt="Adapto"
        width={632}
        height={592}
        priority
        className={cn(size, 'w-auto select-none')}
      />
    </span>
  );
}
