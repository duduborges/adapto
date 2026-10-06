'use client';

import { useEffect, useState } from 'react';

/**
 * Enter/exit for overlays (drawer, dialogs, cookie banner) with plain CSS
 * transitions, so framer-motion stays out of the bundle. `rendered`: keep the
 * element mounted (true from the render that opens it until `exitMs` after it
 * closes, so the exit transition can play). `shown`: put it in its visible
 * state; it turns on two frames after mount, once the hidden state has been
 * painted, so the enter transition runs too.
 */
export function usePresence(open: boolean, exitMs: number) {
  const [rendered, setRendered] = useState(open);
  const [shown, setShown] = useState(false);

  // Mount in the same render that opens it: refs inside (focus targets) exist
  // by the time the opener's effects run.
  if (open && !rendered) setRendered(true);

  useEffect(() => {
    if (!open) {
      setShown(false);
      const t = setTimeout(() => setRendered(false), exitMs);
      return () => clearTimeout(t);
    }
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [open, exitMs]);

  return { rendered: open || rendered, shown: open && shown };
}
