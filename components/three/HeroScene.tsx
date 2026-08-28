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
  IcosahedronGeometry,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
  type BufferAttribute,
} from 'three';

// Adapto brand palette
const EMBER = '#c35622';
const CREAM = '#fefefe';
const INK_700 = '#3a2e2e';

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Cycle of target exponents the object settles into: ball → square (cube) → triangle (octahedron) → star → ball…
const SHAPE_TARGETS = [2, 9, 1, 0.65];
const SEGMENT_DURATION = 3.2; // seconds per hop (transition + hold)
const TRANSITION_FRACTION = 0.55; // portion of the segment spent easing, rest is a hold

function shapeExponentAt(t: number) {
  const total = SEGMENT_DURATION * SHAPE_TARGETS.length;
  const local = t % total;
  const index = Math.floor(local / SEGMENT_DURATION);
  const nextIndex = (index + 1) % SHAPE_TARGETS.length;
  const segT = (local % SEGMENT_DURATION) / SEGMENT_DURATION;
  const eased = easeInOutCubic(Math.min(segT / TRANSITION_FRACTION, 1));
  return MathUtils.lerp(SHAPE_TARGETS[index], SHAPE_TARGETS[nextIndex], eased);
}

const RADIUS = 1.05;

/**
 * Two quality tiers. The light one keeps the morphing shape — the signature of
 * the scene — but drops the orbit rings and satellite network and runs a
 * quarter of the geometry, which is where the per-frame cost actually lives.
 *
 * Hero.tsx only mounts this component at >=1024px today, so the light tier is
 * currently unreachable; it exists so that showing the scene on small screens
 * is a one-line change in Hero rather than a rewrite here. The threshold must
 * stay below that mount breakpoint — raising it would silently strip the rings
 * from small laptops, which do see the scene.
 */
interface Tier {
  detail: number;
  rings: boolean;
  satellites: boolean;
  maxPixelRatio: number;
  antialias: boolean;
  clearcoat: number;
}

function pickTier(): Tier {
  const coarse = window.matchMedia('(max-width: 1023px)').matches;
  return coarse
    ? {
        detail: 2,
        rings: false,
        satellites: false,
        maxPixelRatio: 1.5,
        antialias: false,
        clearcoat: 0,
      }
    : {
        detail: 3,
        rings: true,
        satellites: true,
        maxPixelRatio: 2,
        antialias: true,
        clearcoat: 0.6,
      };
}

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

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const tier = pickTier();

    const scene = new Scene();
    const camera = new PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 5.6);

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
    const objectGroup = new Group();
    scene.add(objectGroup);

    const geometry = new IcosahedronGeometry(RADIUS, tier.detail);
    const posAttr = geometry.attributes.position as BufferAttribute;
    const vertexCount = posAttr.count;

    /**
     * Each vertex sits on a unit sphere; re-normalizing by an Lp-norm reshapes
     * the mesh (p=2 sphere, large p cube, p=1 octahedron, p<1 concave star).
     *
     * The directions never change, so |x|,|y|,|z| and their logs are computed
     * once here. Per frame that turns `pow(|x|, p)` into `exp(p * logX)` —
     * exp is markedly cheaper than pow, and this runs on every vertex, every
     * frame. log(0) is -Infinity, and exp(p * -Infinity) is 0, which is the
     * correct value for pow(0, p), so axis-aligned vertices need no special case.
     */
    const dirX = new Float32Array(vertexCount);
    const dirY = new Float32Array(vertexCount);
    const dirZ = new Float32Array(vertexCount);
    const logX = new Float32Array(vertexCount);
    const logY = new Float32Array(vertexCount);
    const logZ = new Float32Array(vertexCount);

    for (let i = 0; i < vertexCount; i++) {
      const v = new Vector3(
        posAttr.getX(i),
        posAttr.getY(i),
        posAttr.getZ(i),
      ).normalize();
      dirX[i] = v.x;
      dirY[i] = v.y;
      dirZ[i] = v.z;
      logX[i] = Math.log(Math.abs(v.x));
      logY[i] = Math.log(Math.abs(v.y));
      logZ[i] = Math.log(Math.abs(v.z));
    }

    const positions = posAttr.array as Float32Array;

    /**
     * Faked glass. A real `transmission` material makes Three.js render the
     * whole scene a second time into a transmission render target every frame;
     * opacity + clearcoat reads nearly the same against this near-flat
     * background for one render pass instead of two.
     */
    const solidMaterial = new MeshPhysicalMaterial({
      color: new Color(INK_700).lerp(new Color(EMBER), 0.2),
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
      const ringConfigs: {
        radius: number;
        tilt: [number, number, number];
        color: string;
        opacity: number;
        speed: number;
        dotSize: number;
      }[] = [
        { radius: 1.15, tilt: [0.4, 0.25, 0], color: EMBER, opacity: 0.32, speed: 0.35, dotSize: 0.03 },
        { radius: 1.3, tilt: [1.1, -0.3, 0.5], color: CREAM, opacity: 0.16, speed: -0.22, dotSize: 0.024 },
        { radius: 1.22, tilt: [-0.5, 0.8, 0.2], color: EMBER, opacity: 0.2, speed: 0.28, dotSize: 0.026 },
      ];

      ringConfigs.forEach((cfg) => {
        const group = new Group();
        group.rotation.set(...cfg.tilt);
        scene.add(group);

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
      scene.add(satelliteGroup);
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

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      elapsed += reducedMotion ? delta * 0.15 : delta;

      const p = shapeExponentAt(elapsed);
      const invP = 1 / p;
      for (let i = 0; i < vertexCount; i++) {
        const n = Math.exp(
          Math.log(
            Math.exp(p * logX[i]) +
              Math.exp(p * logY[i]) +
              Math.exp(p * logZ[i]),
          ) * invP,
        );
        const s = RADIUS / n;
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

      renderer.render(scene, camera);
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
      {/* Warm bloom behind the 3D object, matching the section's ember glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-6%] inset-y-[-4%] rounded-[2.5rem] bg-gradient-to-br from-ember/16 via-ember/5 to-transparent blur-[90px]"
      />
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
