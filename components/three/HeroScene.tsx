'use client';

import React, { useEffect, useRef } from 'react';
import {
  AmbientLight,
  BufferGeometry,
  Clock,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Quaternion,
  PointLight,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
  type BufferAttribute,
} from 'three';

import {
  CAMERA_FOV,
  CAMERA_Z,
  CREAM,
  EMBER,
  INK_700,
  RING_CONFIGS,
  buildMorphMesh,
  buildMorphTargets,
  shapeBlendAt,
} from './morph';

/**
 * Two quality tiers. The light one keeps the morphing shape and its orbit
 * rings — the signature of the scene — but drops the satellite network and
 * runs a quarter of the geometry, which is where the per-frame cost actually
 * lives. The rings are three line loops and three dots: next to nothing.
 * On phones it also swaps the physical material for a Lambert one (a far
 * cheaper fragment shader — the body is translucent and flat-shaded, so it
 * reads the same), renders at 1.25× and caps the loop at 24 fps: the shape
 * turns slowly, so the lost frames don't show, and the cap cut main-thread
 * busy time from 100% to ~35% under a 6× CPU throttle.
 *
 * Hero.tsx mounts the scene in the wide column on wide landscape screens and
 * above the headline otherwise; phones and tablets under 1024px get the
 * light tier (a portrait iPad Pro is fast enough for the full one). The
 * threshold must stay aligned with that breakpoint — raising it would
 * silently strip the rings from small laptops, which do see the full scene.
 */
interface Tier {
  /** Grid cells per cube face edge in the base mesh (see buildMorphMesh). */
  segments: number;
  rings: boolean;
  satellites: boolean;
  maxPixelRatio: number;
  antialias: boolean;
  clearcoat: number;
  /** Cheap Lambert body instead of the physical (glass-like) one. */
  cheapMaterial: boolean;
  /** Render at most this many frames per second (0 = every display frame). */
  maxFps: number;
}

function pickTier(): Tier {
  const coarse = window.matchMedia('(max-width: 1023px)').matches;
  return coarse
    ? {
        segments: 6,
        rings: true,
        satellites: false,
        maxPixelRatio: 1.25,
        antialias: false,
        clearcoat: 0,
        cheapMaterial: true,
        maxFps: 24,
      }
    : {
        segments: 9,
        rings: true,
        satellites: true,
        maxPixelRatio: 2,
        antialias: true,
        clearcoat: 0.6,
        cheapMaterial: false,
        maxFps: 0,
      };
}

/**
 * Drag-to-rotate (mouse only). The pointer spins the whole composition
 * (object, rings, satellites); the object keeps morphing and turning on its
 * own inside it.
 * On release it coasts to a stop, then drifts back to its designed pose.
 */
const ROTATE_PER_PX = 0.009; // radians per pixel dragged
const MAX_SPIN = 10; // rad/s — caps a hard flick
const SPIN_DAMPING = 3; // higher = coasts for less time
const RETURN_DELAY_MS = 2500; // idle time before easing back to the rest pose
const RETURN_RATE = 1.2; // higher = eases back faster
const WORLD_X = new Vector3(1, 0, 0);
const WORLD_Y = new Vector3(0, 1, 0);
const REST_POSE = new Quaternion();

function ringPoints(radius: number, segments = 96) {
  const pts: Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return pts;
}

interface Orbit {
  group: Group;
  dot: Mesh;
  radius: number;
  speed: number;
}

interface HeroSceneProps {
  /** Fired once, right after the first frame is drawn. */
  onReady?: () => void;
  /** Camera zoom — >1 frames the object tighter (read once, on mount). */
  zoom?: number;
}

export default function HeroScene({ onReady, zoom = 1 }: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  const zoomRef = useRef(zoom);
  onReadyRef.current = onReady;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const tier = pickTier();

    const scene = new Scene();
    const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);
    camera.position.set(0, 0, CAMERA_Z);
    camera.zoom = zoomRef.current;

    const renderer = new WebGLRenderer({
      antialias: tier.antialias,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new AmbientLight(0xffffff, 0.55));
    const dirLight = new DirectionalLight(new Color(CREAM), 1.15);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);
    const emberLight = new PointLight(new Color(EMBER), 0.7);
    emberLight.position.set(-3, -2, -3);
    scene.add(emberLight);

    // Morphing object
    // Everything the pointer can spin hangs off this group
    const dragGroup = new Group();
    scene.add(dragGroup);

    const objectGroup = new Group();
    dragGroup.add(objectGroup);

    const mesh = buildMorphMesh(tier.segments);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(mesh.positions, 3));
    geometry.setIndex(mesh.indices);
    const posAttr = geometry.attributes.position as BufferAttribute;
    const { vertexCount, dirX, dirY, dirZ, shapeRadii } = buildMorphTargets(mesh.positions);

    const positions = posAttr.array as Float32Array;

    /**
     * Faked glass. A real `transmission` material makes Three.js render the
     * whole scene a second time into a transmission render target every frame;
     * opacity + clearcoat reads nearly the same against this near-flat
     * background for one render pass instead of two.
     */
    const bodyColor = new Color(INK_700).lerp(new Color(EMBER), 0.2);
    const solidMaterial = tier.cheapMaterial
      ? new MeshLambertMaterial({
          color: bodyColor,
          emissive: new Color(EMBER),
          emissiveIntensity: 0.1,
          transparent: true,
          opacity: 0.5,
          flatShading: true,
        })
      : new MeshPhysicalMaterial({
          color: bodyColor,
          emissive: new Color(EMBER),
          emissiveIntensity: 0.08,
          roughness: 0.14,
          metalness: 0.06,
          clearcoat: tier.clearcoat,
          clearcoatRoughness: 0.25,
          transparent: true,
          opacity: 0.5,
          flatShading: true,
          // Front faces only, still writing depth: the body has to occlude the far
          // half of the wireframe shell, or the two sets of lines overlap and the
          // shape reads as a tangle instead of a solid.
        });
    const solidMesh = new Mesh(geometry, solidMaterial);
    objectGroup.add(solidMesh);

    const wireMaterial = new MeshBasicMaterial({
      color: new Color(EMBER),
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new Mesh(geometry, wireMaterial);
    wireMesh.scale.setScalar(1.012);
    objectGroup.add(wireMesh);

    // Orbit rings (lines + a travelling dot on each)
    const orbits: Orbit[] = [];
    const disposables: { dispose(): void }[] = [];

    if (tier.rings) {
      RING_CONFIGS.forEach((cfg) => {
        const group = new Group();
        group.rotation.set(...cfg.tilt);
        dragGroup.add(group);

        const ringGeo = new BufferGeometry().setFromPoints(ringPoints(cfg.radius));
        const ringMat = new LineBasicMaterial({
          color: new Color(cfg.color),
          transparent: true,
          opacity: cfg.opacity,
        });
        group.add(new LineLoop(ringGeo, ringMat));
        disposables.push(ringGeo, ringMat);

        const dotGeo = new SphereGeometry(cfg.dotSize, 12, 12);
        const dotMat = new MeshBasicMaterial({ color: new Color(cfg.color) });
        const dot = new Mesh(dotGeo, dotMat);
        group.add(dot);
        disposables.push(dotGeo, dotMat);

        orbits.push({
          group,
          dot,
          radius: cfg.radius,
          speed: reducedMotion ? cfg.speed * 0.15 : cfg.speed,
        });
      });
    }

    // Satellite nodes — a small orbiting network, echoing the old timeline's node/line motif
    const satelliteGroup = new Group();

    if (tier.satellites) {
      dragGroup.add(satelliteGroup);
      const satelliteCount = 6;
      const satellitePositions: Vector3[] = [];
      const satelliteColors: string[] = [];
      for (let i = 0; i < satelliteCount; i++) {
        const theta = (i / satelliteCount) * Math.PI * 2 + i * 0.7;
        const phi = 0.6 + (i % 3) * 0.35;
        const r = 1.25 + (i % 2) * 0.15;
        satellitePositions.push(
          new Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi) * (i % 2 === 0 ? 1 : -1),
            r * Math.sin(phi) * Math.sin(theta),
          ),
        );
        satelliteColors.push(i % 3 === 0 ? EMBER : CREAM);
      }

      const satelliteLinePositions: number[] = [];
      satellitePositions.forEach((p) => {
        satelliteLinePositions.push(0, 0, 0, p.x, p.y, p.z);
      });
      const satelliteLineGeo = new BufferGeometry();
      satelliteLineGeo.setAttribute(
        'position',
        new Float32BufferAttribute(satelliteLinePositions, 3),
      );
      const satelliteLineMat = new LineBasicMaterial({
        color: new Color(EMBER),
        transparent: true,
        opacity: 0.14,
      });
      satelliteGroup.add(new LineSegments(satelliteLineGeo, satelliteLineMat));
      disposables.push(satelliteLineGeo, satelliteLineMat);

      // One shared sphere geometry instead of six identical ones.
      const satelliteGeo = new SphereGeometry(0.028, 8, 8);
      disposables.push(satelliteGeo);

      satellitePositions.forEach((p, i) => {
        const isEmber = satelliteColors[i] === EMBER;
        const mat = new MeshBasicMaterial({
          color: new Color(satelliteColors[i]),
          transparent: true,
          opacity: isEmber ? 0.85 : 0.45,
        });
        const mesh = new Mesh(satelliteGeo, mat);
        mesh.position.copy(p);
        satelliteGroup.add(mesh);
        disposables.push(mat);
      });
    }

    // Pointer interaction — mouse only. Touch drags were removed: on phones a
    // swipe over the hero should just scroll the page.
    let dragging = false;
    let activePointer = -1;
    let lastX = 0;
    let lastY = 0;
    let lastMoveAt = 0;
    let spinY = 0; // angular velocity around the vertical axis, rad/s
    let spinX = 0; // around the horizontal axis
    let idleSince = performance.now();

    const canDrag = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (canDrag) container.style.cursor = 'grab';

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      activePointer = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      lastMoveAt = performance.now();
      spinX = spinY = 0;
      try {
        // Keep receiving moves when the pointer leaves the canvas mid-drag
        container.setPointerCapture(e.pointerId);
      } catch {
        // Pointer already gone (e.g. the browser took the gesture) — drag still works inside
      }
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== activePointer) return;
      const now = performance.now();
      const dt = Math.max(now - lastMoveAt, 1) / 1000;
      const angleY = (e.clientX - lastX) * ROTATE_PER_PX;
      const angleX = (e.clientY - lastY) * ROTATE_PER_PX;
      dragGroup.rotateOnWorldAxis(WORLD_Y, angleY);
      if (angleX) dragGroup.rotateOnWorldAxis(WORLD_X, angleX);
      // Smoothed so one jittery event doesn't decide the fling
      spinY = MathUtils.clamp(spinY * 0.5 + (angleY / dt) * 0.5, -MAX_SPIN, MAX_SPIN);
      spinX = MathUtils.clamp(spinX * 0.5 + (angleX / dt) * 0.5, -MAX_SPIN, MAX_SPIN);
      lastX = e.clientX;
      lastY = e.clientY;
      lastMoveAt = now;
      idleSince = now;
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== activePointer) return;
      dragging = false;
      // No releasePointerCapture here: capture ends on its own after
      // pointerup/pointercancel, and releasing it by hand throws in Firefox
      // once the pointer is gone (hasPointerCapture can still report true).
      container.style.cursor = 'grab';
      // Held still before letting go, or reduced motion: no coasting
      if (reducedMotion || performance.now() - lastMoveAt > 80) spinX = spinY = 0;
      idleSince = performance.now();
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', endDrag);
    container.addEventListener('pointercancel', endDrag);
    // Capture can be dropped without a pointerup (window switch, etc.)
    container.addEventListener('lostpointercapture', endDrag);

    // Resize handling
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier.maxPixelRatio));
      renderer.setSize(w, h);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Animation loop
    let raf = 0;
    let elapsed = 0;
    let onScreen = true;
    let running = false;
    const clock = new Clock();

    let firstFrameDrawn = false;
    const frameInterval = tier.maxFps ? 1000 / tier.maxFps : 0;
    let lastFrameAt = -Infinity;
    const animate = (now: number = performance.now()) => {
      raf = requestAnimationFrame(animate);
      // Frame cap (light tier): skip this display frame entirely. The clock
      // isn't read, so the next drawn frame gets the whole elapsed delta.
      if (frameInterval && now - lastFrameAt < frameInterval - 1) return;
      lastFrameAt = now;
      const delta = clock.getDelta();
      elapsed += reducedMotion ? delta * 0.15 : delta;

      const { from, to, k } = shapeBlendAt(elapsed);
      const fromRadii = shapeRadii[from];
      const toRadii = shapeRadii[to];
      for (let i = 0; i < vertexCount; i++) {
        const s = fromRadii[i] + (toRadii[i] - fromRadii[i]) * k;
        const j = i * 3;
        positions[j] = dirX[i] * s;
        positions[j + 1] = dirY[i] * s;
        positions[j + 2] = dirZ[i] * s;
      }
      posAttr.needsUpdate = true;
      // No computeVertexNormals(): `flatShading` makes the fragment shader
      // derive the normal from screen-space derivatives, so vertex normals are
      // never read. Recomputing them every frame was pure waste.

      if (!reducedMotion) {
        objectGroup.rotation.y += delta * 0.28;
        objectGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.22;
      } else {
        objectGroup.rotation.y += delta * 0.05;
      }

      for (let i = 0; i < orbits.length; i++) {
        const { dot, radius, speed } = orbits[i];
        const t = elapsed * speed;
        dot.position.set(Math.cos(t) * radius, Math.sin(t) * radius, 0);
      }

      satelliteGroup.rotation.y -= delta * (reducedMotion ? 0.01 : 0.06);

      if (!dragging) {
        if (Math.abs(spinY) > 0.01 || Math.abs(spinX) > 0.01) {
          dragGroup.rotateOnWorldAxis(WORLD_Y, spinY * delta);
          dragGroup.rotateOnWorldAxis(WORLD_X, spinX * delta);
          const decay = Math.exp(-SPIN_DAMPING * delta);
          spinY *= decay;
          spinX *= decay;
          idleSince = performance.now();
        } else if (
          !reducedMotion &&
          performance.now() - idleSince > RETURN_DELAY_MS &&
          dragGroup.quaternion.angleTo(REST_POSE) > 0.001
        ) {
          dragGroup.quaternion.slerp(REST_POSE, 1 - Math.exp(-RETURN_RATE * delta));
        }
      }

      renderer.render(scene, camera);
      if (!firstFrameDrawn) {
        firstFrameDrawn = true;
        onReadyRef.current?.();
      }
    };

    /**
     * The scene only animates while it is actually on screen and the tab is
     * in the foreground. Left unchecked it rendered for the whole visit — the
     * page is several screens tall, so most of that work was never seen.
     */
    const sync = () => {
      const shouldRun = onScreen && document.visibilityState === 'visible';
      if (shouldRun === running) return;
      running = shouldRun;
      if (shouldRun) {
        clock.getDelta(); // drop the paused interval so the shape doesn't jump
        animate();
      } else {
        cancelAnimationFrame(raf);
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: '100px' },
    );
    intersectionObserver.observe(container);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      cancelAnimationFrame(raf);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', endDrag);
      container.removeEventListener('pointercancel', endDrag);
      container.removeEventListener('lostpointercapture', endDrag);
      container.removeChild(renderer.domElement);

      geometry.dispose();
      solidMaterial.dispose();
      wireMaterial.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[540px] lg:max-w-none">
      {/* The ember light behind the object lives in the hero slot (HeroGlow) */}
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
