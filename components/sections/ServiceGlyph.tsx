import React from 'react';

/**
 * Line icons for the Services accordion, one per category. Parts carry
 * classes that globals.css animates (`.svc-*`):
 * - [data-draw] strokes are drawn in when the row scrolls into view (desktop
 *   reveal, see RevealObserver), and
 * - each category has its own "open" motion, played when the visitor opens
 *   that topic (`[data-anim]` on the row).
 */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  pathLength: 1,
  'data-draw': '',
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function Gear({ cx, cy, r, teeth, className }: { cx: number; cy: number; r: number; teeth: number; className: string }) {
  return (
    <g className={className} style={{ transformOrigin: 'center' }}>
      <circle cx={cx} cy={cy} r={r} {...stroke} />
      <circle cx={cx} cy={cy} r={r * 0.35} {...stroke} />
      {Array.from({ length: teeth }, (_, i) => {
        const deg = (360 / teeth) * i;
        const [x1, y1] = polar(cx, cy, r, deg);
        const [x2, y2] = polar(cx, cy, r + 3.2, deg);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...stroke} strokeWidth={2.4} />;
      })}
    </g>
  );
}

const glyphs: Record<string, React.ReactNode> = {
  // Modules that snap together into one system
  custom: (
    <>
      {[
        [8, 8, -4, -4],
        [26, 8, 4, -4],
        [8, 26, -4, 4],
        [26, 26, 4, 4],
      ].map(([x, y, dx, dy], i) => (
        <rect
          key={i}
          className="svc-block"
          x={x}
          y={y}
          width={14}
          height={14}
          rx={2.5}
          {...stroke}
          style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, '--i': i } as React.CSSProperties}
        />
      ))}
      <rect className="svc-block-core" x={20} y={20} width={8} height={8} rx={1.5} fill="currentColor" />
    </>
  ),
  // A browser window whose page lays itself out
  websites: (
    <>
      <rect x={5} y={8} width={38} height={32} rx={3.5} {...stroke} />
      <line x1={5} y1={15} x2={43} y2={15} {...stroke} />
      {[9.5, 13, 16.5].map((cx) => (
        <circle key={cx} className="svc-fade" cx={cx} cy={11.5} r={1.1} fill="currentColor" />
      ))}
      {[
        [11, 22, 31],
        [11, 28, 37],
        [11, 34, 24],
      ].map(([x1, y, x2], i) => (
        <line
          key={i}
          className="svc-type"
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          {...stroke}
          style={{ '--i': i } as React.CSSProperties}
        />
      ))}
      <line className="svc-caret" x1={27} y1={31.5} x2={27} y2={36.5} {...stroke} />
    </>
  ),
  // Two meshed gears that run on their own
  automation: (
    <>
      <Gear cx={19} cy={19} r={8} teeth={8} className="svc-gear" />
      <Gear cx={34.5} cy={33.5} r={4.6} teeth={6} className="svc-gear-small" />
    </>
  ),
  // Bars that grow and a trend line on top
  dashboards: (
    <>
      <line x1={6} y1={42} x2={42} y2={42} {...stroke} />
      {[
        [9, 30],
        [18, 22],
        [27, 26],
        [36, 14],
      ].map(([x, y], i) => (
        <rect
          key={i}
          className="svc-bar"
          x={x}
          y={y}
          width={5}
          height={42 - y}
          rx={1}
          {...stroke}
          style={{ '--i': i } as React.CSSProperties}
        />
      ))}
      <polyline className="svc-trend" points="11.5,23 20.5,15 29.5,19 38.5,7" {...stroke} />
    </>
  ),
  // A hub connecting the tools around it
  integrations: (
    <>
      {[
        [10, 10],
        [38, 10],
        [10, 38],
        [38, 38],
      ].map(([x, y], i) => (
        <line
          key={`l${i}`}
          className="svc-link"
          x1={24 + (x < 24 ? -4 : 4)}
          y1={24 + (y < 24 ? -4 : 4)}
          x2={x + (x < 24 ? 2.5 : -2.5)}
          y2={y + (y < 24 ? 2.5 : -2.5)}
          {...stroke}
          style={{ '--i': i } as React.CSSProperties}
        />
      ))}
      <circle className="svc-hub" cx={24} cy={24} r={5.5} {...stroke} style={{ transformOrigin: 'center' }} />
      {[
        [10, 10],
        [38, 10],
        [10, 38],
        [38, 38],
      ].map(([x, y], i) => (
        <circle
          key={`n${i}`}
          className="svc-node"
          cx={x}
          cy={y}
          r={3.5}
          {...stroke}
          style={{ '--i': i, transformOrigin: 'center' } as React.CSSProperties}
        />
      ))}
    </>
  ),
};

export function ServiceGlyph({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 48 48" className="svc-glyph h-full w-full" aria-hidden>
      {glyphs[kind]}
    </svg>
  );
}
