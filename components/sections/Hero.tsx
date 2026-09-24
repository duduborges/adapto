'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ArrowRight, ArrowDown, MapPin } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import { bookingHref, bookingIsExternal } from '@/lib/site';

// WebGL scene — client-only, no server render
// The static HeroPoster below holds its place until the first frame is drawn.
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
});

/**
 * Server-rendered stand-in for the WebGL scene. The scene opens as a sphere
 * (see SHAPES in HeroScene), so this draws that sphere — same size,
 * same place — and the canvas crossfades over it instead of popping into an
 * empty column once Three.js has downloaded.
 */
function HeroPoster({
  hidden,
  animated = false,
  scale = 1,
}: {
  hidden: boolean;
  animated?: boolean;
  /** Match the scene's camera zoom so the crossfade lines up. */
  scale?: number;
}) {
  // Sphere radius in viewBox units: SPHERE_RADIUS / (camera z · tan(fov/2)) of the half-height
  const r = 115;
  const meridians = [0.25, 0.55, 0.85];
  const parallels = [-0.6, -0.3, 0, 0.3, 0.6];
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 transition-opacity duration-700',
        hidden && 'opacity-0',
      )}
    >
      <div className="absolute inset-x-[-6%] inset-y-[-4%] rounded-[2.5rem] bg-gradient-to-br from-ember/16 via-ember/5 to-transparent blur-[90px]" />
      <svg viewBox="0 0 500 400" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="hero-poster-fill" cx="42%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#c35622" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#c35622" stopOpacity="0.06" />
          </radialGradient>
        </defs>
        <g transform={`translate(250 200) scale(${scale}) translate(-250 -200)`}>
        <g className="animate-glow">
          <circle cx="250" cy="200" r={r} fill="url(#hero-poster-fill)" />
        </g>
        <g fill="none" stroke="#c35622" strokeOpacity="0.45" strokeWidth="1">
          <circle cx="250" cy="200" r={r} />
          {meridians.map((k) => (
            <ellipse key={`m${k}`} cx="250" cy="200" rx={r * k} ry={r} />
          ))}
          {parallels.map((y) => (
            <ellipse
              key={`p${y}`}
              cx="250"
              cy={200 + r * y}
              rx={r * Math.sqrt(1 - y * y)}
              ry={r * Math.sqrt(1 - y * y) * 0.18}
            />
          ))}
        </g>
        <g
          fill="none"
          strokeWidth="1"
          className={animated ? 'animate-[spin_36s_linear_infinite] motion-reduce:animate-none' : undefined}
          style={animated ? { transformOrigin: '250px 200px', transformBox: 'view-box' } : undefined}
        >
          <ellipse cx="250" cy="200" rx="150" ry="46" transform="rotate(-18 250 200)" stroke="#c35622" strokeOpacity="0.25" />
          <ellipse cx="250" cy="200" rx="160" ry="60" transform="rotate(24 250 200)" stroke="#fefefe" strokeOpacity="0.1" />
        </g>
        </g>
      </svg>
    </div>
  );
}

interface HeroProps {
  dict: any;
  lang?: string;
}

/**
 * The hero has two visual slots — the wide column (`desk`: ≥1024px and
 * landscape) and the one above the headline on phones and portrait tablets.
 * Only one is visible, so mount the WebGL scene
 * in that one alone: mounting both would fetch Three.js (~134 KB gzip) once
 * but spin up a second WebGL context for an invisible canvas.
 *
 * On small screens the scene waits for the browser to go idle, so the text
 * and the static sphere paint first, and it is skipped entirely when the
 * visitor has Save-Data on — the static sphere stays.
 */
type SceneSlot = 'desktop' | 'mobile' | null;

/** How much tighter the phone/tablet slot frames the object than desktop. */
const MOBILE_ZOOM = 1.3;

function useSceneSlot(): SceneSlot {
  const [slot, setSlot] = useState<SceneSlot>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (orientation: landscape)');
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
    );
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    const cancelPending = () => {
      if (idleHandle !== undefined) window.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
      idleHandle = timeoutHandle = undefined;
    };

    const sync = () => {
      cancelPending();
      if (mq.matches) {
        setSlot('desktop');
        return;
      }
      setSlot(null);
      if (saveData) return;
      const enable = () => setSlot('mobile');
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(enable, { timeout: 2000 });
      } else {
        timeoutHandle = setTimeout(enable, 600);
      }
    };

    sync();
    mq.addEventListener('change', sync);
    return () => {
      cancelPending();
      mq.removeEventListener('change', sync);
    };
  }, []);

  return slot;
}

export function Hero({ dict, lang = 'en' }: HeroProps) {
  const sceneSlot = useSceneSlot();
  const [sceneReady, setSceneReady] = useState(false);
  const onSceneReady = useCallback(() => setSceneReady(true), []);

  // A new slot means a fresh canvas: show the static sphere until it draws
  useEffect(() => setSceneReady(false), [sceneSlot]);

  const renderScene = (zoom: number) => (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-1000',
        sceneReady ? 'opacity-100' : 'opacity-0',
      )}
    >
      <HeroScene onReady={onSceneReady} zoom={zoom} />
    </div>
  );

  // French copy is longer — pull the headline ceiling down so it doesn't overflow.
  // Stacked tablets (sm+, not desk) get a larger headline — it has the full width.
  const titleClamp =
    lang === 'fr'
      ? 'text-[clamp(2rem,3.8vw,3.8rem)] sm:text-[clamp(2.6rem,6vw,4.2rem)] desk:text-[clamp(2rem,3.8vw,3.8rem)]'
      : 'text-[clamp(2.6rem,5vw,4.4rem)] sm:text-[clamp(3.2rem,7.2vw,5rem)] desk:text-[clamp(2.6rem,5vw,4.4rem)]';

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-24 md:pt-28 snap-start [scroll-snap-stop:always]">
      {/* subtle grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-bg mask-radial opacity-50"
      />
      {/* warm ember bloom behind the visual */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[520px] w-[520px] rounded-full bg-ember/15 blur-[140px]"
      />
      {/* Large brand mark watermark — slightly lighter than bg, bleeds off the right edge */}
      <div aria-hidden className="pointer-events-none absolute right-[-18%] top-1/2 hidden -translate-y-1/2 select-none desk:block">
        <Image
          src="/logos/adapto-mark.png"
          alt=""
          width={1000}
          height={1000}
          sizes="80vh"
          className="h-[80svh] w-auto opacity-[0.12]"
        />
      </div>

      <Container size="wide" className="relative flex w-full flex-1 flex-col pb-6 md:pb-8">
        {/* Flex-1 wrapper: centers the content block between meta row and strip */}
        <div className="flex flex-1 items-start pb-6 sm:items-center desk:py-6">
          {/* Title + Visual two-column grid */}
          <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-8 desk:gap-12">
            {/* Headline column */}
            <div className="col-span-12 desk:col-span-5">
              {/* Mobile/tablet visual — bleeds to the screen edges and is framed
                  tighter (MOBILE_ZOOM) so the object reads large; its height is
                  capped by the viewport so short phones keep the CTA in view. */}
              <div aria-hidden className="-mx-6 mb-2 flex justify-center md:-mx-8 desk:hidden">
                <div className="relative aspect-[5/4] w-[min(100%,46svh)] animate-hero-in motion-reduce:animate-none">
                  <HeroPoster
                    hidden={sceneSlot === 'mobile' && sceneReady}
                    animated
                    scale={MOBILE_ZOOM}
                  />
                  {sceneSlot === 'mobile' && renderScene(MOBILE_ZOOM)}
                </div>
              </div>

              {/* Location chip — sits right above the headline */}
              <div className="mb-5 flex animate-hero-in motion-reduce:animate-none md:mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/10 bg-cream/[0.04] px-2.5 py-1 text-[10px] font-medium text-cream/50 backdrop-blur-sm md:gap-2 md:px-3.5 md:py-1.5 md:text-xs md:text-cream/80">
                  <MapPin className="h-3 w-3 text-ember/70 md:h-3.5 md:w-3.5 md:text-ember" />
                  <span>Vancouver · BC · Canada</span>
                  <span className="hidden text-cream/30 md:inline">—</span>
                  <span className="hidden text-cream/55 md:inline">Remote-friendly worldwide</span>
                </span>
              </div>
              <h1
                style={{ animationDelay: '60ms' }}
                className={`${titleClamp} animate-hero-in motion-reduce:animate-none font-medium leading-[0.98] tracking-[-0.02em] text-cream`}
              >
                <span className="block">{dict.hero.title}</span>
                <span className="mt-2 block font-serif italic text-ember">
                  {dict.hero.titleAccent}
                </span>
              </h1>

              <p
                style={{ animationDelay: '200ms' }}
                className="mt-5 animate-hero-in motion-reduce:animate-none text-balance text-lg leading-[1.55] text-cream/75 md:mt-7 md:text-xl"
              >
                {dict.hero.subtitle}
              </p>

              <div
                style={{ animationDelay: '300ms' }}
                className="mt-7 flex animate-hero-in motion-reduce:animate-none flex-wrap items-center gap-x-8 gap-y-4 md:mt-9"
              >
                <a
                  href={bookingHref()}
                  {...(bookingIsExternal()
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="group inline-flex items-baseline gap-3 whitespace-nowrap border-b border-ember pb-1 font-serif text-2xl text-cream transition-colors hover:text-ember md:text-3xl"
                >
                  <span>{dict.hero.cta}</span>
                  <ArrowRight className="h-5 w-5 self-center transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <p
                style={{ animationDelay: '400ms' }}
                className="mt-8 flex animate-hero-in items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50 motion-reduce:animate-none md:hidden"
              >
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inset-0 animate-ping rounded-full bg-success/60 motion-reduce:animate-none" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-success" />
                </span>
                {dict.hero.available}
              </p>
            </div>

            {/* Visual column */}
            <div
              style={{ animationDelay: '150ms' }}
              className="col-span-12 hidden animate-hero-in motion-reduce:animate-none desk:col-span-7 desk:block"
            >
              <div className="relative aspect-[5/4] w-full">
                <HeroPoster hidden={sceneSlot === 'desktop' && sceneReady} />
                {sceneSlot === 'desktop' && renderScene(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip — always visible, sits below the flex-1 wrapper */}
        <div className="flex items-center justify-between border-t border-cream/10 pt-5">
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-cream/35 md:block">
            <span className="text-ember">↳</span> 2026 — Currently accepting projects
          </p>
          <a
            href="#services"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40 transition-colors hover:text-cream"
          >
            {dict.hero.scrollHint}
            <ArrowDown className="h-3 w-3 text-ember transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </Container>
    </section>
  );
}
