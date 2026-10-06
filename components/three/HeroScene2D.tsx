'use client';

import React, { useEffect, useRef } from 'react';
import {
  CAMERA_FOV,
  CAMERA_Z,
  EMBER,
  INK_700,
  RING_CONFIGS,
  buildMorphMesh,
  buildMorphTargets,
  shapeBlendAt,
} from './morph';

/**
 * Canvas 2D twin of HeroScene for phones and tablets: the same morphing
 * object and orbit rings, projected by hand instead of through WebGL. No
 * Three.js download and no GPU context to boot — booting WebGL there cost
 * ~2 s of blocked main thread on a mid-range phone — and a frame is a few
 * hundred triangles, well under a millisecond of work.
 *
 * The object is convex, so hidden-surface removal is just back-face culling:
 * front faces never overlap. Rings are drawn in two passes, the half behind
 * the object first (dimmed by the translucent body painted over it), the
 * half in front last.
 */

const SEGMENTS = 6; // same as HeroScene's light tier
const MAX_FPS = 24; // same cap as HeroScene's light tier; the shape turns slowly
const MAX_PIXEL_RATIO = 1.5;
const RING_POINTS = 72;
/** Faces are bucketed into this many shades and filled one path per shade. */
const SHADE_LEVELS = 12;

// Lighting, matched by eye to HeroScene's Lambert body
const LIGHT = normalize(3, 4, 5);
const AMBIENT = 0.4;
const DIFFUSE = 0.55;
const BODY_RGB = mix(hexToRgb(INK_700), hexToRgb(EMBER), 0.2);
const EMBER_RGB = hexToRgb(EMBER);
const BODY_EMISSIVE = 0.1;
const BODY_OPACITY = 0.5;
const WIRE_OPACITY = 0.6;

/** Fill colour per shade bucket: Lambert body + a little ember emissive. */
const SHADE_STYLES = Array.from({ length: SHADE_LEVELS }, (_, i) => {
  const l = AMBIENT + DIFFUSE * (i / (SHADE_LEVELS - 1));
  const channel = (c: number) =>
    Math.min(255, Math.round(BODY_RGB[c] * l + EMBER_RGB[c] * BODY_EMISSIVE));
  return `rgb(${channel(0)},${channel(1)},${channel(2)})`;
});

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: number[], b: number[], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function normalize(x: number, y: number, z: number): [number, number, number] {
  const l = Math.hypot(x, y, z);
  return [x / l, y / l, z / l];
}

/** Row-major 3×3 rotation for a Three.js 'XYZ' Euler (R = Rx · Ry · Rz). */
function eulerXYZ(x: number, y: number, z: number) {
  const a = Math.cos(x), b = Math.sin(x);
  const c = Math.cos(y), d = Math.sin(y);
  const e = Math.cos(z), f = Math.sin(z);
  return [
    c * e, -c * f, d,
    a * f + b * d * e, a * e - b * d * f, -b * c,
    b * f - a * d * e, b * e + a * d * f, a * c,
  ];
}

interface HeroScene2DProps {
  /** Fired once, right after the first frame is drawn. */
  onReady?: () => void;
  /** Camera zoom — >1 frames the object tighter (read once, on mount). */
  zoom?: number;
}

export default function HeroScene2D({ onReady, zoom = 1 }: HeroScene2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onReadyRef = useRef(onReady);
  const zoomRef = useRef(zoom);
  onReadyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    // desynchronized: frames skip the compositor's commit step. Without it,
    // a Chrome trace at 4× CPU throttle spent ~37 ms per frame copying the
    // canvas (2.2 s of every 3 s); with it, ~0.5 ms.
    const ctx = canvas?.getContext('2d', { desynchronized: true });
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = reducedMotion ? 0.15 : 1;

    const { positions, indices } = buildMorphMesh(SEGMENTS);
    const { vertexCount, dirX, dirY, dirZ, shapeRadii } = buildMorphTargets(positions);
    const triCount = indices.length / 3;

    // Unique edges, each with the (one or two) triangles it borders: an edge
    // is drawn when either of them faces the camera.
    const edgeA: number[] = [];
    const edgeB: number[] = [];
    const edgeT1: number[] = [];
    const edgeT2: number[] = [];
    const seen = new Map<number, number>();
    for (let t = 0; t < triCount; t++) {
      for (let k = 0; k < 3; k++) {
        const u = indices[t * 3 + k];
        const v = indices[t * 3 + ((k + 1) % 3)];
        const key = Math.min(u, v) * vertexCount + Math.max(u, v);
        const existing = seen.get(key);
        if (existing === undefined) {
          seen.set(key, edgeA.length);
          edgeA.push(u);
          edgeB.push(v);
          edgeT1.push(t);
          edgeT2.push(-1);
        } else {
          edgeT2[existing] = t;
        }
      }
    }

    // Per-frame buffers: view-space position and screen position per vertex
    const vx = new Float32Array(vertexCount);
    const vy = new Float32Array(vertexCount);
    const vz = new Float32Array(vertexCount);
    const sx = new Float32Array(vertexCount);
    const sy = new Float32Array(vertexCount);
    const front = new Uint8Array(triCount);
    const shade = new Uint8Array(triCount); // bucket index into SHADE_STYLES

    const rings = RING_CONFIGS.map((cfg) => {
      const m = eulerXYZ(...cfg.tilt);
      const px = new Float32Array(RING_POINTS + 1);
      const py = new Float32Array(RING_POINTS + 1);
      const pz = new Float32Array(RING_POINTS + 1);
      for (let i = 0; i <= RING_POINTS; i++) {
        const a = (i / RING_POINTS) * Math.PI * 2;
        const x = Math.cos(a) * cfg.radius;
        const y = Math.sin(a) * cfg.radius;
        px[i] = m[0] * x + m[1] * y;
        py[i] = m[3] * x + m[4] * y;
        pz[i] = m[6] * x + m[7] * y;
      }
      return { cfg, m, px, py, pz };
    });

    let width = 0;
    let height = 0;
    let focal = 0;
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (w === 0 || h === 0) return;
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      width = w;
      height = h;
      // Same framing as a PerspectiveCamera: the FOV spans the height
      focal = (h / 2 / Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180)) * zoomRef.current;
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const scaleAt = (z: number) => focal / (CAMERA_Z - z);

    const drawRingHalf = (ring: (typeof rings)[number], behind: boolean) => {
      const { px, py, pz, cfg } = ring;
      ctx.strokeStyle = cfg.color;
      ctx.globalAlpha = cfg.opacity;
      ctx.beginPath();
      let drawing = false;
      for (let i = 0; i <= RING_POINTS; i++) {
        const isBehind = pz[i] < 0;
        if (isBehind !== behind) {
          drawing = false;
          continue;
        }
        const s = scaleAt(pz[i]);
        const x = width / 2 + px[i] * s;
        const y = height / 2 - py[i] * s;
        if (drawing) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
        drawing = true;
      }
      ctx.stroke();
    };

    const drawDot = (ring: (typeof rings)[number], t: number, behind: boolean) => {
      const { m, cfg } = ring;
      const a = t * cfg.speed;
      const lx = Math.cos(a) * cfg.radius;
      const ly = Math.sin(a) * cfg.radius;
      const z = m[6] * lx + m[7] * ly;
      if (z < 0 !== behind) return;
      const s = scaleAt(z);
      const x = width / 2 + (m[0] * lx + m[1] * ly) * s;
      const y = height / 2 - (m[3] * lx + m[4] * ly) * s;
      ctx.globalAlpha = 1;
      ctx.fillStyle = cfg.color;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(cfg.dotSize * s, 1), 0, Math.PI * 2);
      ctx.fill();
    };

    let elapsed = 0;
    let rotY = 0;
    let firstFrameDrawn = false;

    const draw = () => {
      if (!width) return;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';

      // Morph + object rotation (same motion as HeroScene)
      const { from, to, k } = shapeBlendAt(elapsed);
      const fromR = shapeRadii[from];
      const toR = shapeRadii[to];
      const rotX = reducedMotion ? 0 : Math.sin(elapsed * 0.18) * 0.22;
      const m = eulerXYZ(rotX, rotY, 0);
      for (let i = 0; i < vertexCount; i++) {
        const r = fromR[i] + (toR[i] - fromR[i]) * k;
        const x = dirX[i] * r;
        const y = dirY[i] * r;
        const z = dirZ[i] * r;
        vx[i] = m[0] * x + m[1] * y + m[2] * z;
        vy[i] = m[3] * x + m[4] * y + m[5] * z;
        vz[i] = m[6] * x + m[7] * y + m[8] * z;
        const s = scaleAt(vz[i]);
        sx[i] = width / 2 + vx[i] * s;
        sy[i] = height / 2 - vy[i] * s;
      }

      for (let t = 0; t < triCount; t++) {
        const a = indices[t * 3];
        const b = indices[t * 3 + 1];
        const c = indices[t * 3 + 2];
        const ux = vx[b] - vx[a], uy = vy[b] - vy[a], uz = vz[b] - vz[a];
        const wx = vx[c] - vx[a], wy = vy[c] - vy[a], wz = vz[c] - vz[a];
        const nx = uy * wz - uz * wy;
        const ny = uz * wx - ux * wz;
        const nz = ux * wy - uy * wx;
        // Facing the camera (at 0, 0, CAMERA_Z)?
        const facing = nx * -vx[a] + ny * -vy[a] + nz * (CAMERA_Z - vz[a]);
        front[t] = facing > 0 ? 1 : 0;
        if (front[t]) {
          const len = Math.hypot(nx, ny, nz) || 1;
          const lambert = Math.max(0, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / len);
          shade[t] = Math.round(lambert * (SHADE_LEVELS - 1));
        }
      }

      for (const ring of rings) drawRingHalf(ring, true);
      for (const ring of rings) drawDot(ring, elapsed, true);

      // Body: flat-shaded translucent faces, one path per shade bucket.
      // Front faces of a convex shape never overlap, so batching them
      // doesn't change the result.
      ctx.globalAlpha = BODY_OPACITY;
      for (let level = 0; level < SHADE_LEVELS; level++) {
        let any = false;
        for (let t = 0; t < triCount; t++) {
          if (!front[t] || shade[t] !== level) continue;
          if (!any) {
            ctx.beginPath();
            any = true;
          }
          const a = indices[t * 3];
          const b = indices[t * 3 + 1];
          const c = indices[t * 3 + 2];
          ctx.moveTo(sx[a], sy[a]);
          ctx.lineTo(sx[b], sy[b]);
          ctx.lineTo(sx[c], sy[c]);
          ctx.closePath();
        }
        if (any) {
          ctx.fillStyle = SHADE_STYLES[level];
          ctx.fill();
        }
      }

      // Wireframe: one path, every edge of a visible face (also covers the
      // anti-aliasing seams between neighbouring faces)
      ctx.globalAlpha = WIRE_OPACITY;
      ctx.strokeStyle = EMBER;
      ctx.beginPath();
      for (let e = 0; e < edgeA.length; e++) {
        if (!front[edgeT1[e]] && !(edgeT2[e] >= 0 && front[edgeT2[e]])) continue;
        ctx.moveTo(sx[edgeA[e]], sy[edgeA[e]]);
        ctx.lineTo(sx[edgeB[e]], sy[edgeB[e]]);
      }
      ctx.stroke();

      for (const ring of rings) drawRingHalf(ring, false);
      for (const ring of rings) drawDot(ring, elapsed, false);
      ctx.globalAlpha = 1;

      if (!firstFrameDrawn) {
        firstFrameDrawn = true;
        onReadyRef.current?.();
      }
    };

    // Loop: capped frame rate, paused off screen and in background tabs.
    // A timer waits out the gap between frames instead of a rAF that bails
    // early: every requested animation frame costs the browser a commit, even
    // one we skip, so asking for 60 a second to draw 24 tripled that work.
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let running = false;
    let onScreen = true;
    let last = 0;
    const frameInterval = 1000 / MAX_FPS;

    const frame = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      elapsed += delta * speed;
      rotY += delta * (reducedMotion ? 0.05 : 0.28);
      draw();
      schedule();
    };

    const schedule = () => {
      const wait = Math.max(0, frameInterval - (performance.now() - last));
      timer = setTimeout(() => {
        raf = requestAnimationFrame(frame);
      }, wait);
    };

    const stop = () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };

    const sync = () => {
      const shouldRun = onScreen && document.visibilityState === 'visible';
      if (shouldRun === running) return;
      running = shouldRun;
      if (shouldRun) {
        last = performance.now(); // drop the paused interval so the shape doesn't jump
        schedule();
      } else {
        stop();
      }
    };

    draw();
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: '100px' },
    );
    intersectionObserver.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      stop();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[540px] lg:max-w-none">
      {/* The ember light behind the object lives in the hero slot (HeroGlow) */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
