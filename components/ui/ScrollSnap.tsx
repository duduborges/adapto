'use client';

import { useEffect } from 'react';

/** Scopes the section-snap scroll behavior (see globals.css) to whatever page mounts it. */
export function ScrollSnap() {
  useEffect(() => {
    document.documentElement.classList.add('snap-scroll');
    return () => document.documentElement.classList.remove('snap-scroll');
  }, []);

  return null;
}
