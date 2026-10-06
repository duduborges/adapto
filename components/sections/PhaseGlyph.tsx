import React from 'react';

/**
 * Line icons for the How we work pill (Process.tsx), one per phase, drawn in
 * the same hand as ServiceGlyph. Each shows what happens in that phase:
 * discovery looks closely at the team, scope writes it down as a checklist,
 * execution loops through sprints of code, quality is a checked shield and
 * delivery is the launch. The selected phase plays a small motion
 * (`.pg-*` in globals.css), skipped under reduced motion.
 */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const glyphs: Record<string, React.ReactNode> = {
  // We meet your team and map the pain points: a lens over a person
  discovery: (
    <g className="pg-scan">
      <circle cx={21} cy={21} r={12} {...stroke} />
      <circle cx={21} cy={17.5} r={3.5} {...stroke} />
      <path d="M14.5 28.5a6.5 6 0 0 1 13 0" {...stroke} />
      <path d="M30 30l9 9" {...stroke} strokeWidth={2.75} />
    </g>
  ),
  // Requirements, timeline and cost, written down: a checklist on a page
  modeling: (
    <>
      <rect x={11} y={6} width={26} height={36} rx={3} {...stroke} />
      <path className="pg-tick" pathLength={1} d="M15.5 15.5l2 2 3.5-4" {...stroke} />
      <path d="M24.5 15.5H32" {...stroke} />
      <path className="pg-tick pg-tick-2" pathLength={1} d="M15.5 24.5l2 2 3.5-4" {...stroke} />
      <path d="M24.5 24.5H32" {...stroke} />
      <rect x={16} y={31} width={4.5} height={4.5} rx={1} {...stroke} />
      <path d="M24.5 33.5H30" {...stroke} />
    </>
  ),
  // Short sprints of working code, round after round
  execution: (
    <>
      <g className="pg-cycle">
        <path d="M38 24a14 14 0 1 1-4.1-9.9" {...stroke} />
        <path d="M34.4 8.6v5.8h-5.8" {...stroke} />
      </g>
      <path d="M21 19.5l-4.5 4.5 4.5 4.5" {...stroke} />
      <path d="M27 19.5l4.5 4.5-4.5 4.5" {...stroke} />
    </>
  ),
  // Continuous testing and control: a shield with a check
  control: (
    <>
      <path d="M24 6l14 5v11c0 9-6 16-14 20-8-4-14-11-14-20V11z" {...stroke} />
      <path className="pg-tick" pathLength={1} d="M17.5 24l4.5 4.5 8.5-9" {...stroke} />
    </>
  ),
  // Final deploy: the launch
  delivery: (
    <g className="pg-rocket">
      <path d="M24 5c5 4 8 10 8 17v9H16v-9c0-7 3-13 8-17z" {...stroke} />
      <circle cx={24} cy={18} r={3} {...stroke} />
      <path d="M16 24l-5 6v5l5-2.5" {...stroke} />
      <path d="M32 24l5 6v5l-5-2.5" {...stroke} />
      <path className="pg-flame" d="M21 35c0 3 1.5 5 3 7 1.5-2 3-4 3-7" {...stroke} />
    </g>
  ),
};

export function PhaseGlyph({ kind, active }: { kind: string; active?: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="phase-glyph h-full w-full"
      data-active={active || undefined}
      aria-hidden
    >
      {glyphs[kind]}
    </svg>
  );
}
