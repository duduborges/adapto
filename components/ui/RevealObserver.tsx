'use client';

import { useEffect } from 'react';

/**
 * Scroll-reveal as progressive enhancement.
 *
 * Elements marked `data-reveal` are fully visible in the server HTML, so
 * crawlers that don't run JavaScript (and anyone before hydration) get every
 * word. Only on wide screens, with JS running and no reduced-motion
 * preference, does this hide what is still below the fold and fade it in as
 * it scrolls into view. Phones and tablets never animate. The hiding itself
 * lives in globals.css, keyed on `html.reveal-on` + a missing
 * `data-revealed`, so nothing is hidden until this component has run.
 */
export function RevealObserver() {
  useEffect(() => {
    const enabled = window.matchMedia(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
    ).matches;
    if (!enabled || !('IntersectionObserver' in window)) return;

    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    // Anything already on (or above) the screen stays as it is — hiding it
    // now would make visible text blink out and back in.
    const fold = window.innerHeight;
    for (const el of els) {
      if (el.getBoundingClientRect().top < fold) el.dataset.revealed = '';
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = '';
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -80px 0px' },
    );
    for (const el of els) if (!('revealed' in el.dataset)) io.observe(el);

    root.classList.add('reveal-on');
    return () => {
      io.disconnect();
      root.classList.remove('reveal-on');
    };
  }, []);

  return null;
}
