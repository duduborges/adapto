'use client';

import { useEffect } from 'react';

/**
 * Scopes the section-snap scroll behavior (see globals.css) to whatever page
 * mounts it, and lifts it while the footer is on screen.
 *
 * Why the lift: the footer's snap point sits a footer's height (~600px) past
 * Contact. With mandatory snapping, a short scroll (trackpad, smooth wheel)
 * from Contact lands nearer Contact than the footer, so the browser pulled it
 * back and the footer could not be reached. Once the footer starts to show,
 * the page scrolls freely to the bottom; scrolling back up past it turns
 * snapping on again right where Contact sits, so nothing jumps. (Snapping
 * itself only applies on large screens, see globals.css.)
 */
export function ScrollSnap() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('snap-scroll');

    const footer = document.querySelector('footer');
    if (!footer || !('IntersectionObserver' in window)) {
      return () => root.classList.remove('snap-scroll');
    }

    const io = new IntersectionObserver(
      ([entry]) => root.classList.toggle('snap-scroll', !entry.isIntersecting),
      // Only once the footer actually shows (2px in): parked on Contact, its
      // top merely touches the bottom of the screen and snapping stays on, so
      // scrolling back up still lands section by section. The first scroll
      // down brings it in and frees the rest of the way.
      { rootMargin: '0px 0px -2px 0px' },
    );
    io.observe(footer);

    return () => {
      io.disconnect();
      root.classList.remove('snap-scroll');
    };
  }, []);

  return null;
}
