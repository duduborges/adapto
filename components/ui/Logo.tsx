import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type Variant = 'mark' | 'lockup' | 'wordmark' | 'mark-inverse';

interface LogoProps {
  className?: string;
  /**
   * 'mark'         — A + orange half-dot. Use on dark backgrounds (header, hero).
   * 'lockup'       — Full brand: A + dot + 'Adapto' wordmark + orange 'o' (footer).
   * 'wordmark'     — 'Adapto' word only.
   * 'mark-inverse' — A + dark half-dot. Use on cream/ember backgrounds.
   */
  variant?: Variant;
  /** Tailwind size classes applied to the wrapper element. */
  sizeClass?: string;
  /** Only the above-the-fold header logo should opt in. */
  priority?: boolean;
}

const ASSETS: Record<
  Variant,
  { src: string; width: number; height: number; alt: string }
> = {
  mark: {
    src: '/logos/adapto-mark.png',
    width: 1000,
    height: 1000,
    alt: 'Adapto',
  },
  lockup: {
    src: '/logos/adapto-lockup-white.png',
    width: 640,
    height: 640,
    alt: 'Adapto',
  },
  wordmark: {
    src: '/logos/adapto-wordmark.png',
    width: 640,
    height: 426,
    alt: 'Adapto',
  },
  'mark-inverse': {
    src: '/logos/adapto-mark-inverse.png',
    width: 640,
    height: 640,
    alt: 'Adapto',
  },
};

export function Logo({
  className,
  variant = 'mark',
  sizeClass,
  priority = false,
}: LogoProps) {
  const asset = ASSETS[variant];
  return (
    <span
      role="img"
      aria-label="Adapto"
      className={cn(
        'inline-flex shrink-0 select-none',
        sizeClass ?? 'h-12 md:h-14',
        className,
      )}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes="(max-width: 768px) 120px, 220px"
        className="h-full w-auto"
      />
    </span>
  );
}
