'use client';

import { useEffect } from 'react';
import { captureAttribution } from '@/lib/booking/attribution';

/** Notes where the visitor came from, on whichever page they enter the site. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
