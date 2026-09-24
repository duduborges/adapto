import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

/**
 * Generic loading placeholder — size and shape are entirely up to the
 * className passed in (e.g. `h-4 w-32 rounded-full`, `aspect-video rounded-xl`).
 * Purely visual (aria-hidden); wrap the container that uses it in
 * role="status"/aria-live if the loading state needs to be announced,
 * rather than repeating that on every block.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-md bg-cream/10', className)}
    />
  );
}
