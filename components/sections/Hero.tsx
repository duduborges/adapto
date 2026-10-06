'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ArrowRight, ArrowDown, MapPin } from 'lucide-react';
import { getImageProps } from 'next/image';
import dynamic from 'next/dynamic';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import { bookingHref, bookingIsExternal } from '@/lib/site';

// Client-only scenes, no server render: WebGL (Three.js) on desktop, its
// Canvas 2D twin on phones and tablets. The static HeroPoster below holds
// their place until the first frame is drawn.
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
});
const HeroScene2D = dynamic(() => import('@/components/three/HeroScene2D'), {
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
      <svg viewBox="0 0 500 400" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="hero-poster-fill" cx="42%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#c35622" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#c35622" stopOpacity="0.06" />
          </radialGradient>
        </defs>
        <g transform={`translate(250 200) scale(${scale}) translate(-250 -200)`}>
        {/* Animations stop once the canvas has taken over — they'd keep the
            compositor busy under an invisible layer for the whole visit. */}
        <g className={hidden ? undefined : 'animate-glow'}>
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
          className={animated && !hidden ? 'animate-[spin_36s_linear_infinite] motion-reduce:animate-none' : undefined}
          style={animated && !hidden ? { transformOrigin: '250px 200px', transformBox: 'view-box' } : undefined}
        >
          <ellipse cx="250" cy="200" rx="150" ry="46" transform="rotate(-18 250 200)" stroke="#c35622" strokeOpacity="0.25" />
          <ellipse cx="250" cy="200" rx="160" ry="60" transform="rotate(24 250 200)" stroke="#fefefe" strokeOpacity="0.1" />
        </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * The accent line, its first word ("adapts" / "s'adapte") breathing along
 * Outfit's weight axis: it thins, swells to bold and settles back, as if
 * reshaping itself (.adapt-word in globals.css, large screens only).
 * Letter-spacing moves the other way to hold the word's width, so the rest of
 * the line stays put. The word starts at rest (the headline paints at once)
 * and is a single text node (it reads and indexes as a normal word).
 */
function AdaptWord({ text }: { text: string }) {
  const space = text.indexOf(' ');
  const word = space === -1 ? text : text.slice(0, space);
  const rest = space === -1 ? '' : text.slice(space);
  return (
    <>
      <span className="adapt-word">{word}</span>
      {rest}
    </>
  );
}

/**
 * Ember light behind the hero object, centred on it. It lives in the visual
 * slot itself (not in the poster or the scene), so it stays put while the
 * canvas crossfades over the static sphere. `size` = its diameter as a share
 * of the slot's width: about 1.6x the object's, which the phone slot frames
 * larger (MOBILE_ZOOM). Breathes slowly; still under reduced motion.
 */
function HeroGlow({ size }: { size: string }) {
  return (
    <div
      aria-hidden
      style={{
        width: size,
        background:
          'radial-gradient(circle, rgba(195,86,34,0.8) 0%, rgba(195,86,34,0.36) 42%, rgba(195,86,34,0) 70%)',
      }}
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl animate-[hero-glow_6s_ease-in-out_infinite] motion-reduce:animate-none"
    />
  );
}

/** Transparent 1x1 GIF: what the watermark's <img> falls back to off desktop. */
const BLANK_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAACH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * The brand mark behind the desktop hero. Desktop only, so its sources sit
 * behind a <source media> that matches the `desk` screen: a plain <img> in a
 * display:none box is still downloaded, and on a throttled phone that 1200px
 * image competed with the headline (Lighthouse mobile LCP 3.7 s). On desktop
 * it is the largest thing in the first viewport, so the browser scores it as
 * the LCP element: eager and high priority.
 */
function BrandWatermark() {
  const {
    props: { srcSet, src: _src, ...rest },
  } = getImageProps({
    src: '/logos/adapto-mark.png',
    alt: '',
    width: 1000,
    height: 1000,
    sizes: '80vh',
    loading: 'eager',
    fetchPriority: 'high',
    className: 'h-[80svh] w-auto opacity-[0.12]',
  });
  return (
    <picture>
      <source media="(min-width: 1024px) and (orientation: landscape)" srcSet={srcSet} sizes="80vh" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...rest} alt="" src={BLANK_GIF} />
    </picture>
  );
}

interface HeroProps {
  dict: any;
  lang?: string;
}

/**
 * The hero has two visual slots — the wide column (`desk`: ≥1024px and
 * landscape) and the one above the headline on phones and portrait tablets.
 * Only one is visible, so mount a scene in that one alone. Desktop gets the
 * WebGL scene; phones and portrait tablets get HeroScene2D, the same object
 * drawn with Canvas 2D — booting WebGL there blocked a mid-range phone's main
 * thread for ~2 s during load (Lighthouse TBT), and the 2D one never loads
 * Three.js at all.
 *
 * Both wait for the visitor's first input (or a few seconds after load),
 * then for the browser to go idle, so the text and the static sphere paint
 * first and the boot stays out of the load window.
 */
type SceneSlot = 'desktop' | 'mobile' | null;

/** How much tighter the phone/tablet slot frames the object than desktop. */
const MOBILE_ZOOM = 1.3;

/** With no input, how long after `load` the scene still boots on its own. */
const LATE_START_MS = 3500;

function useSceneSlot(): SceneSlot {
  const [slot, setSlot] = useState<SceneSlot>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (orientation: landscape)');
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    const cancelPending = () => {
      if (idleHandle !== undefined) window.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
      idleHandle = timeoutHandle = undefined;
    };

    const sync = () => {
      cancelPending();
      setSlot(null);
      const target: SceneSlot = mq.matches ? 'desktop' : 'mobile';
      // Booting a scene during page load blocked the main thread for seconds
      // (Lighthouse TBT 5.1 s with WebGL on desktop), and the static sphere
      // already holds the spot until the first frame is drawn.
      const enable = () => setSlot(target);
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(enable, { timeout: 2000 });
      } else {
        timeoutHandle = setTimeout(enable, 600);
      }
    };

    // Even on idle, the scene's boot (Three.js parse + WebGL setup, or the 2D
    // twin) landed inside the load window and was most of the Total Blocking
    // Time PageSpeed reported (370 ms desktop). So it waits for the visitor's
    // first input, or a few seconds after load if none comes; the animated
    // static sphere holds the spot until then.
    let started = false;
    const inputs = ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'] as const;
    const start = () => {
      if (started) return;
      started = true;
      inputs.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener('load', onLoad);
      clearTimeout(lateHandle);
      sync();
      mq.addEventListener('change', sync);
    };
    let lateHandle: ReturnType<typeof setTimeout> | undefined;
    const onLoad = () => {
      lateHandle = setTimeout(start, LATE_START_MS);
    };
    inputs.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });

    return () => {
      inputs.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener('load', onLoad);
      clearTimeout(lateHandle);
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

  const renderScene = (Scene: typeof HeroScene, zoom: number) => (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-1000',
        sceneReady ? 'opacity-100' : 'opacity-0',
      )}
    >
      <Scene onReady={onSceneReady} zoom={zoom} />
    </div>
  );

  // Phone sizes follow --svh: 1% of the screen height, measured once before
  // first paint and frozen (see the script in app/[lang]/layout.tsx). Not
  // height breakpoints, which flipped when the address bar collapsed on the
  // first scroll, and not plain svh, which iOS Chrome and in-app browsers
  // update as the bar moves, so the headline and the 3D visual jumped. The
  // values match the old breakpoints (2.2rem at 700px, 2rem at 620px of
  // height...), reached continuously; plain svh is the no-JS fallback.
  // French copy is longer — pull the headline ceiling down so it doesn't overflow.
  // Stacked tablets (sm+, not desk) get a larger headline — it has the full width.
  const titleClamp =
    lang === 'fr'
      ? 'text-[clamp(2rem,3.8vw,3.8rem)] phone:text-[clamp(1.7rem,calc(var(--svh,1svh)*4.25),2rem)] sm:text-[clamp(2.6rem,6vw,4.2rem)] desk:text-[clamp(2rem,3.8vw,3.8rem)]'
      : 'text-[clamp(2.6rem,5vw,4.4rem)] phone:text-[clamp(2rem,calc(var(--svh,1svh)*5.2),2.6rem)] sm:text-[clamp(3.2rem,7.2vw,5rem)] desk:text-[clamp(2.6rem,5vw,4.4rem)]';

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-20 phone:h-[calc(var(--svh,1svh)*100)] phone:min-h-fit phone:pb-[3.75rem] sm:pt-24 md:pt-28 desk:[@media(max-height:760px)]:pt-24 snap-start [scroll-snap-stop:always]">
      {/* subtle grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-bg mask-radial opacity-50"
      />
      {/* Ember light coming in from outside: its source sits past the right
          edge, just below the top corner. Large screens only; phones and
          tablets keep just the object's own glow (HeroGlow) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden desk:block"
        style={{
          background:
            'radial-gradient(ellipse 60% 65% at 112% 15%, rgba(195,86,34,0.2) 0%, rgba(195,86,34,0.08) 38%, rgba(195,86,34,0) 72%)',
        }}
      />
      {/* Large brand mark watermark — slightly lighter than bg, bleeds off the right edge */}
      <div aria-hidden className="pointer-events-none absolute right-[-18%] top-1/2 hidden -translate-y-1/2 select-none desk:block">
        <BrandWatermark />
      </div>

      <Container size="wide" className="relative flex w-full flex-1 flex-col pb-4 sm:pb-6 md:pb-8 desk:[@media(max-height:760px)]:pb-5">
        {/* Flex-1 wrapper: centers the content block between meta row and strip.
            On phones the whole chain is a flex column instead, so the hero is
            exactly one screen tall: the text keeps its natural height and the
            3D visual flexes to fill what's left (see the visual below).
            The section's bottom padding on phones is a no-content zone: mobile
            browsers increasingly put the address bar at the bottom (Safari by
            default, Chrome as an option, floating over the page in newer iOS),
            so nothing that matters — not even the scroll strip — sits there.
            It is a fixed 3.75rem: it used to add env(safe-area-inset-bottom),
            which changes when the toolbar collapses and re-laid the whole
            hero out on the first scroll.
            Phones get a one-line subtitle (subtitleShort) instead of the full
            one, so the first screen still says what we build without taking
            the room the 3D visual needs. The full one stays in the HTML. */}
        <div className="flex flex-1 items-start pb-6 phone:flex-col phone:items-stretch phone:pb-4 sm:items-center desk:py-6">
          {/* Title + Visual two-column grid */}
          <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-8 phone:flex phone:flex-1 phone:flex-col phone:items-stretch desk:gap-12">
            {/* Headline column */}
            <div className="col-span-12 phone:flex phone:flex-1 phone:flex-col desk:col-span-5">
              {/* Mobile/tablet visual — bleeds to the screen edges and is framed
                  tighter (MOBILE_ZOOM) so the object reads large. Tablets: sized
                  from the viewport height. Phones: it fills the space the text
                  leaves (flex-1), never under 110px (80px on very short screens)
                  nor over 44svh — past that the box gets too tall and narrow for
                  the orbit rings. The box is
                  absolutely positioned in that area so its own size never
                  feeds back into the column's height. */}
              <div
                aria-hidden
                className="-mx-6 mb-2 flex justify-center phone:relative phone:mb-3 phone:max-h-[calc(var(--svh,1svh)*44)] phone:min-h-[clamp(80px,calc(var(--svh,1svh)*100-540px),110px)] phone:flex-1 md:-mx-8 desk:hidden"
              >
                <div className="relative aspect-[5/4] w-[min(100%,calc(var(--svh,1svh)*46))] animate-hero-in motion-reduce:animate-none phone:absolute phone:inset-y-0 phone:left-1/2 phone:h-full phone:w-auto phone:max-w-full phone:-translate-x-1/2">
                  <HeroGlow size="92%" />
                  <HeroPoster
                    hidden={sceneSlot === 'mobile' && sceneReady}
                    animated
                    scale={MOBILE_ZOOM}
                  />
                  {sceneSlot === 'mobile' && renderScene(HeroScene2D, MOBILE_ZOOM)}
                </div>
              </div>

              {/* Location chip — sits right above the headline */}
              <div className="mb-5 flex animate-hero-in motion-reduce:animate-none phone:mb-[clamp(0.75rem,calc(var(--svh,1svh)*5.3-25px),1.25rem)] md:mb-6 desk:mb-11 desk:[@media(max-height:820px)]:mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/10 bg-cream/[0.04] px-2.5 py-1 text-[10px] font-medium text-cream/50 backdrop-blur-sm md:gap-2 md:px-3.5 md:py-1.5 md:text-xs md:text-cream/80">
                  <MapPin className="h-3 w-3 text-ember/70 md:h-3.5 md:w-3.5 md:text-ember" />
                  <span>Vancouver · BC · Canada</span>
                  <span className="hidden text-cream/50 md:inline">—</span>
                  <span className="hidden text-cream/55 md:inline">{dict.hero.remote}</span>
                </span>
              </div>
              <h1
                style={{ animationDelay: '60ms' }}
                className={`${titleClamp} animate-hero-in motion-reduce:animate-none font-brand font-semibold leading-[0.98] tracking-[-0.02em] text-cream`}
              >
                <span className="block">{dict.hero.title}</span>{' '}
                <span className="mt-2 block text-ember desk:mt-1">
                  <AdaptWord text={dict.hero.titleAccent} />
                </span>
              </h1>

              <p
                style={{ animationDelay: '200ms' }}
                className="mt-4 animate-hero-in motion-reduce:animate-none text-balance text-base leading-[1.55] text-cream/75 phone:hidden sm:mt-6 sm:text-lg md:mt-7 md:text-xl desk:mt-12 desk:[@media(max-height:820px)]:mt-6"
              >
                {dict.hero.subtitle}
              </p>
              <p className="hidden overflow-hidden text-[0.95rem] leading-snug text-cream/70 phone:block phone:mt-[clamp(0px,calc((var(--svh,1svh)*100-620px)*100),0.75rem)] phone:max-h-[clamp(0px,calc((var(--svh,1svh)*100-620px)*100),6rem)]">
                {dict.hero.subtitleShort}
              </p>

              <div
                style={{ animationDelay: '300ms' }}
                className="mt-7 flex animate-hero-in motion-reduce:animate-none flex-wrap items-center gap-x-8 gap-y-4 phone:mt-[clamp(1rem,calc(var(--svh,1svh)*8-40px),1.75rem)] sm:mt-8 md:mt-10 desk:mt-14 desk:[@media(max-height:820px)]:mt-8"
              >
                <a
                  href={bookingHref()}
                  {...(bookingIsExternal()
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="group inline-flex items-baseline gap-3 whitespace-nowrap border-b border-ember pb-1 font-brand text-2xl text-cream transition-colors hover:text-ember md:text-3xl"
                >
                  <span>{dict.hero.cta}</span>
                  <ArrowRight className="h-5 w-5 self-center transition-transform group-hover:translate-x-1" />
                </a>
              </div>

            </div>

            {/* Visual column */}
            <div
              style={{ animationDelay: '150ms' }}
              className="col-span-12 hidden animate-hero-in motion-reduce:animate-none desk:col-span-7 desk:block"
            >
              {/* On short desktop screens the 5:4 box, not the text, set the
                  hero's height and pushed the bottom strip off-screen — cap it */}
              <div className="relative mx-auto aspect-[5/4] w-full desk:[@media(max-height:820px)]:max-w-[600px] desk:[@media(max-height:760px)]:max-w-[540px]">
                <HeroGlow size="72%" />
                <HeroPoster hidden={sceneSlot === 'desktop' && sceneReady} />
                {sceneSlot === 'desktop' && renderScene(HeroScene, 1)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip — always visible, sits below the flex-1 wrapper */}
        <div className="flex items-center justify-between gap-4 border-t border-cream/10 pt-4 sm:pt-5">
          {/* Phones/tablets: availability lives here, not as an extra line under the CTA */}
          <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50 md:hidden">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inset-0 animate-ping rounded-full bg-success/60 motion-reduce:animate-none" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            {dict.hero.available}
          </p>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-cream/50 md:block">
            <span className="text-ember">↳</span> {dict.hero.availableStrip}
          </p>
          <a
            href="#services"
            aria-label={dict.hero.scrollHint}
            className="group inline-flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-cream"
          >
            {/* Phones: arrow only — the label doesn't fit beside the status */}
            <span className="phone:sr-only">{dict.hero.scrollHint}</span>
            <ArrowDown className="h-3.5 w-3.5 text-ember transition-transform group-hover:translate-y-0.5 sm:h-3 sm:w-3" />
          </a>
        </div>
      </Container>
    </section>
  );
}
