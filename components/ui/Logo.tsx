import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  /**
   * 'mark' — just the A + orange dot (the 'Adapto' wordmark portion of the
   *          source SVG is cropped via background-position).
   * 'full' — full brand block as exported (mark + wordmark).
   */
  variant?: 'mark' | 'full';
  /** Tailwind size classes applied to the wrapper. */
  sizeClass?: string;
}

/**
 * /public/adapto-logo.svg is a 632×592 raster PNG embedded in an SVG wrapper,
 * exported as the full brand block (mark + 'Adapto' wordmark + dot).
 *
 * For the 'mark' variant we render the image as a background and crop the
 * bottom ~32% (where the wordmark lives) by scaling the background larger
 * than the visible container and pinning it to top-center. Using
 * background-image avoids the next/image style overrides that prevented
 * the overflow-clip approach from working.
 */
export function Logo({
  className,
  variant = 'mark',
  sizeClass,
}: LogoProps) {
  if (variant === 'full') {
    return (
      <span
        aria-label="Adapto"
        className={cn(
          'inline-block select-none',
          sizeClass ?? 'h-12',
          className,
        )}
      >
        <Image
          src="/adapto-logo.svg"
          alt="Adapto"
          width={632}
          height={592}
          priority
          className="h-full w-auto"
        />
      </span>
    );
  }

  // Mark-only crop.
  // Container aspect ≈ 4:3 (wider than tall) so the source image overflows
  // vertically; combined with background-position: top, this hides the
  // wordmark that sits in the bottom of the source.
  return (
    <span
      role="img"
      aria-label="Adapto"
      className={cn(
        'inline-block shrink-0 select-none bg-no-repeat',
        sizeClass ?? 'h-10 w-14 md:h-12 md:w-16',
        className,
      )}
      style={{
        backgroundImage: 'url(/adapto-logo.svg)',
        backgroundSize: '160% auto',
        backgroundPosition: '50% 18%',
      }}
    />
  );
}
