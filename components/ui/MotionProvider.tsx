'use client';

import { LazyMotion } from 'framer-motion';

// The animation features are fetched after the page loads instead of shipping
// in the main bundle; everything uses `m.*` (strict throws on a stray `motion.*`).
const loadFeatures = () => import('@/lib/motion-features').then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
