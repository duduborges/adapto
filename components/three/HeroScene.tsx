'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Adapto brand palette
const EMBER = '#c35622';
const CREAM = '#fefefe';
const INK_700 = '#3a2e2e';

/**
 * Shape morph: each vertex sits on a unit sphere. Re-normalizing by an
 * Lp-norm instead of the usual L2 norm continuously reshapes the mesh —
 * p=2 is a sphere, large p approaches a cube, p=1 is an octahedron,
 * p<1 pinches into a concave "star". Cheap enough to run per-vertex, per-frame.
 */
function lpNorm(x: number, y: number, z: number, p: number) {
  return Math.pow(
    Math.pow(Math.abs(x), p) + Math.pow(Math.abs(y), p) + Math.pow(Math.abs(z), p),
    1 / p
  );
}

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
  return THREE.MathUtils.lerp(SHAPE_TARGETS[index], SHAPE_TARGETS[nextIndex], eased);
}

const DETAIL = 3;
const RADIUS = 1.05;

function ringPoints(radius: number, segments = 96) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return pts;
}

interface Orbit {
  group: THREE.Group;
  dot: THREE.Mesh;
  radius: number;
  speed: number;
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const dirLight = new THREE.DirectionalLight(new THREE.Color(CREAM), 1.15);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);
    const emberLight = new THREE.PointLight(new THREE.Color(EMBER), 0.7);
    emberLight.position.set(-3, -2, -3);
    scene.add(emberLight);

    // Morphing object
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);

    const geometry = new THREE.IcosahedronGeometry(RADIUS, DETAIL);
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const directions: THREE.Vector3[] = [];
    for (let i = 0; i < posAttr.count; i++) {
      directions.push(new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)).normalize());
    }

    // Glassmorphism: a physically-transmissive material so the object reads
    // as translucent glass — light passes through, edges catch a soft sheen.
    const solidMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(INK_700).lerp(new THREE.Color(EMBER), 0.2),
      emissive: new THREE.Color(EMBER),
      emissiveIntensity: 0.08,
      roughness: 0.08,
      metalness: 0,
      transmission: 0.97,
      thickness: 0.6,
      ior: 1.3,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      transparent: true,
      opacity: 0.38,
      flatShading: true,
    });
    const solidMesh = new THREE.Mesh(geometry, solidMaterial);
    objectGroup.add(solidMesh);

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(EMBER),
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    wireMesh.scale.setScalar(1.012);
    objectGroup.add(wireMesh);

    // Orbit rings (lines + a travelling dot on each)
    const orbits: Orbit[] = [];
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
      const group = new THREE.Group();
      group.rotation.set(...cfg.tilt);
      scene.add(group);

      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints(cfg.radius));
      const ringMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(cfg.color),
        transparent: true,
        opacity: cfg.opacity,
      });
      group.add(new THREE.LineLoop(ringGeo, ringMat));

      const dotGeo = new THREE.SphereGeometry(cfg.dotSize, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(cfg.color) });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      group.add(dot);

      orbits.push({ group, dot, radius: cfg.radius, speed: reducedMotion ? cfg.speed * 0.15 : cfg.speed });
    });

    // Satellite nodes — a small orbiting network, echoing the old timeline's node/line motif
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);
    const satelliteCount = 6;
    const satellitePositions: THREE.Vector3[] = [];
    const satelliteColors: string[] = [];
    for (let i = 0; i < satelliteCount; i++) {
      const theta = (i / satelliteCount) * Math.PI * 2 + i * 0.7;
      const phi = 0.6 + (i % 3) * 0.35;
      const r = 1.25 + (i % 2) * 0.15;
      satellitePositions.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi) * (i % 2 === 0 ? 1 : -1),
          r * Math.sin(phi) * Math.sin(theta)
        )
      );
      satelliteColors.push(i % 3 === 0 ? EMBER : CREAM);
    }

    const satelliteLinePositions: number[] = [];
    satellitePositions.forEach((p) => {
      satelliteLinePositions.push(0, 0, 0, p.x, p.y, p.z);
    });
    const satelliteLineGeo = new THREE.BufferGeometry();
    satelliteLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(satelliteLinePositions, 3));
    const satelliteLineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(EMBER),
      transparent: true,
      opacity: 0.14,
    });
    satelliteGroup.add(new THREE.LineSegments(satelliteLineGeo, satelliteLineMat));

    satellitePositions.forEach((p, i) => {
      const isEmber = satelliteColors[i] === EMBER;
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(satelliteColors[i]),
        transparent: true,
        opacity: isEmber ? 0.85 : 0.45,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), mat);
      mesh.position.copy(p);
      satelliteGroup.add(mesh);
    });

    // Resize handling
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Animation loop
    let raf = 0;
    let elapsed = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      elapsed += reducedMotion ? delta * 0.15 : delta;

      const p = shapeExponentAt(elapsed);
      for (let i = 0; i < directions.length; i++) {
        const d = directions[i];
        const n = lpNorm(d.x, d.y, d.z, p);
        posAttr.setXYZ(i, (d.x / n) * RADIUS, (d.y / n) * RADIUS, (d.z / n) * RADIUS);
      }
      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      if (!reducedMotion) {
        objectGroup.rotation.y += delta * 0.28;
        objectGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.22;
      } else {
        objectGroup.rotation.y += delta * 0.05;
      }

      orbits.forEach(({ dot, radius, speed }) => {
        const t = elapsed * speed;
        dot.position.set(Math.cos(t) * radius, Math.sin(t) * radius, 0);
      });

      satelliteGroup.rotation.y -= delta * (reducedMotion ? 0.01 : 0.06);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      container.removeChild(renderer.domElement);

      geometry.dispose();
      solidMaterial.dispose();
      wireMaterial.dispose();
      orbits.forEach(({ group }) => {
        group.traverse((obj) => {
          if (obj instanceof THREE.Line || obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            const mat = obj.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat.dispose();
          }
        });
      });
      satelliteGroup.traverse((obj) => {
        if (obj instanceof THREE.Line || obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
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
