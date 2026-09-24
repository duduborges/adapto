'use client';

import React, { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { CodeXml, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdaptoFusionProps {
  /** Label for the outlined circle — the client's company. */
  youLabel: string;
  /** Label for the ember disc — Adapto. */
  usLabel: string;
  className?: string;
}

// Geometry (viewBox 0 0 360 360). The ring is the client's company, with
// its people around the edge; the ember disc is Adapto. It starts outside,
// slides in and settles at the centre of the company.
// The ring sits dead centre so the settled state reads centred at any width.
const RING = { cx: 180, cy: 180, r: 118 };
const DISC_R = 56;
const START_CX = 26;
const END_CX = RING.cx;

// The client's team, spread around the ring between its edge and Adapto.
const TEAM_SIZE = 6;
const TEAM_RADIUS = 88;
const TEAM_ICON = 22;
const US_ICON = 40;
const teamPositions = Array.from({ length: TEAM_SIZE }, (_, i) => {
  const angle = ((i * (360 / TEAM_SIZE) - 90) * Math.PI) / 180;
  return {
    x: RING.cx + TEAM_RADIUS * Math.cos(angle),
    y: RING.cy + TEAM_RADIUS * Math.sin(angle),
  };
});

export function AdaptoFusion({ youLabel, usLabel, className }: AdaptoFusionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const reduceMotion = useReducedMotion();

  const cx = useMotionValue(reduceMotion ? END_CX : START_CX);
  // Outside the ring Adapto is only a dashed outline; it gains substance
  // (and the ring warms up) as it moves in.
  const ghostOpacity = useTransform(cx, [START_CX, END_CX], [0.7, 0]);
  const glowOpacity = useTransform(cx, [START_CX + 80, END_CX], [0, 1]);
  const usOffset = useTransform(cx, (v) => v - END_CX);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      cx.set(END_CX);
      return;
    }
    const controls = animate(cx, END_CX, {
      duration: 2.2,
      delay: 0.3,
      ease: [0.65, 0, 0.35, 1],
    });
    return () => controls.stop();
  }, [inView, reduceMotion, cx]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <svg
        viewBox="0 0 360 360"
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={`${usLabel} + ${youLabel}`}
      >
        <defs>
          <clipPath id="adapto-fusion-ring">
            <circle cx={RING.cx} cy={RING.cy} r={RING.r - 1} />
          </clipPath>
          <radialGradient id="adapto-fusion-glow">
            <stop offset="0%" stopColor="#c35622" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c35622" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint orbit — context around the company */}
        <circle
          cx={RING.cx}
          cy={RING.cy}
          r={RING.r + 34}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.08}
          strokeDasharray="2 6"
          className="text-cream"
        />

        {/* Warmth that builds inside the company as Adapto settles in */}
        <motion.circle
          cx={RING.cx}
          cy={RING.cy}
          r={RING.r}
          fill="url(#adapto-fusion-glow)"
          style={{ opacity: glowOpacity }}
        />

        {/* Adapto before joining — a dashed outline */}
        <motion.circle
          cx={cx}
          cy={RING.cy}
          r={DISC_R}
          fill="none"
          stroke="#c35622"
          strokeWidth={1.5}
          strokeDasharray="3 5"
          style={{ opacity: ghostOpacity }}
        />

        {/* Adapto inside — only the part within the ring is solid */}
        <g clipPath="url(#adapto-fusion-ring)">
          <motion.circle cx={cx} cy={RING.cy} r={DISC_R} fill="#c35622" />
        </g>

        {/* The client's company */}
        <circle
          cx={RING.cx}
          cy={RING.cy}
          r={RING.r}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="text-cream"
        />

        {teamPositions.map(({ x, y }, i) => (
          <UserRound
            key={i}
            x={x - TEAM_ICON / 2}
            y={y - TEAM_ICON / 2}
            width={TEAM_ICON}
            height={TEAM_ICON}
            strokeWidth={1.5}
            className="text-cream/70"
            aria-hidden
          />
        ))}

        {/* Adapto — engineering, travelling with the disc */}
        <motion.g style={{ x: usOffset }}>
          <CodeXml
            x={END_CX - US_ICON / 2}
            y={RING.cy - US_ICON / 2}
            width={US_ICON}
            height={US_ICON}
            strokeWidth={1.75}
            className="text-cream"
            aria-hidden
          />
        </motion.g>
      </svg>

    </div>
  );
}
