'use client';

import React, { useEffect, useRef } from 'react';
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

/** Linear map of `v` from [a, b] to [c, d], clamped to the output range. */
function remap(v: number, a: number, b: number, c: number, d: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return c + (d - c) * t;
}

/** cubic-bezier(0.65, 0, 0.35, 1), the ease-in-out-cubic curve. */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const DURATION_MS = 2200;
const DELAY_MS = 300;

export function AdaptoFusion({ youLabel, usLabel, className }: AdaptoFusionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const ghostRef = useRef<SVGCircleElement>(null);
  const discRef = useRef<SVGCircleElement>(null);
  const usRef = useRef<SVGGElement>(null);

  // The disc's centre drives everything. Outside the ring Adapto is only a
  // dashed outline; it gains substance (and the ring warms up) as it moves
  // in. Written straight to the SVG attributes, one rAF tween, once in view.
  useEffect(() => {
    const draw = (cx: number) => {
      glowRef.current?.style.setProperty('opacity', String(remap(cx, START_CX + 80, END_CX, 0, 1)));
      ghostRef.current?.setAttribute('cx', String(cx));
      ghostRef.current?.style.setProperty('opacity', String(remap(cx, START_CX, END_CX, 0.7, 0)));
      discRef.current?.setAttribute('cx', String(cx));
      usRef.current?.setAttribute('transform', `translate(${cx - END_CX} 0)`);
    };
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(END_CX);
      return;
    }

    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / DURATION_MS);
            draw(START_CX + (END_CX - START_CX) * easeInOutCubic(t));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }, DELAY_MS);
      },
      { rootMargin: '-120px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

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
        <circle
          ref={glowRef}
          cx={RING.cx}
          cy={RING.cy}
          r={RING.r}
          fill="url(#adapto-fusion-glow)"
          style={{ opacity: 0 }}
        />

        {/* Adapto before joining — a dashed outline */}
        <circle
          ref={ghostRef}
          cx={START_CX}
          cy={RING.cy}
          r={DISC_R}
          fill="none"
          stroke="#c35622"
          strokeWidth={1.5}
          strokeDasharray="3 5"
          style={{ opacity: 0.7 }}
        />

        {/* Adapto inside — only the part within the ring is solid */}
        <g clipPath="url(#adapto-fusion-ring)">
          <circle ref={discRef} cx={START_CX} cy={RING.cy} r={DISC_R} fill="#c35622" />
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
        <g ref={usRef} transform={`translate(${START_CX - END_CX} 0)`}>
          <CodeXml
            x={END_CX - US_ICON / 2}
            y={RING.cy - US_ICON / 2}
            width={US_ICON}
            height={US_ICON}
            strokeWidth={1.75}
            className="text-cream"
            aria-hidden
          />
        </g>
      </svg>

    </div>
  );
}
