/**
 * The hero object's geometry and timing, shared by the WebGL scene
 * (HeroScene, desktop) and its Canvas 2D twin (HeroScene2D, phones and
 * tablets). No Three.js in here, so the 2D scene doesn't pull it in.
 */

// Adapto brand palette
export const EMBER = '#c35622';
export const CREAM = '#fefefe';
export const INK_700 = '#3a2e2e';

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * The shapes the object settles into, in order, looping back to the first.
 * Keep 'sphere' first: the static stand-in shown before this scene loads
 * (HeroPoster in Hero.tsx) is a sphere, and the canvas crossfades over it.
 */
type ShapeName = 'sphere' | 'cube' | 'tetrahedron';
export const SHAPES: ShapeName[] = ['sphere', 'cube', 'tetrahedron'];
const SEGMENT_DURATION = 3.2; // seconds per hop (transition + hold)
const TRANSITION_FRACTION = 0.55; // portion of the segment spent easing, rest is a hold

/** Where in the cycle we are: blending from shape `from` to `to` by `k` (0–1). */
export function shapeBlendAt(t: number) {
  const total = SEGMENT_DURATION * SHAPES.length;
  const local = t % total;
  const from = Math.floor(local / SEGMENT_DURATION);
  const to = (from + 1) % SHAPES.length;
  const segT = (local % SEGMENT_DURATION) / SEGMENT_DURATION;
  const k = easeInOutCubic(Math.min(segT / TRANSITION_FRACTION, 1));
  return { from, to, k };
}

// Sizes, tuned so the three read as roughly the same mass on screen and the
// cube's corners stay close to the orbit rings instead of swallowing them.
export const SPHERE_RADIUS = 1.05;
const CUBE_HALF_SIDE = 0.82; // corners at ~1.42
const TETRA_INRADIUS = 0.52; // tips at 3× this, ~1.56

const INV_SQRT3 = 1 / Math.sqrt(3);
const TETRA_NORMALS: [number, number, number][] = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
].map(([x, y, z]) => [x * INV_SQRT3, y * INV_SQRT3, z * INV_SQRT3]);

/**
 * Distance from the centre to the shape's surface along unit direction
 * (x, y, z). For a polyhedron with face normals n and inradius h that is
 * h / max(n · d): the face the ray hits first is the one it points at most.
 */
function surfaceRadius(shape: ShapeName, x: number, y: number, z: number) {
  switch (shape) {
    case 'sphere':
      return SPHERE_RADIUS;
    case 'cube':
      return CUBE_HALF_SIDE / Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
    case 'tetrahedron': {
      let m = -Infinity;
      for (const [nx, ny, nz] of TETRA_NORMALS) m = Math.max(m, nx * x + ny * y + nz * z);
      return TETRA_INRADIUS / m;
    }
  }
}

/**
 * Base mesh for the morph: a cube whose faces are split into a grid, pushed
 * out onto a sphere. An icosphere can't do this job — its triangles cut
 * across the cube's and the tetrahedron's edges, which then render as
 * sawteeth. Here every cube edge is a grid line, and every tetrahedron edge
 * is a face diagonal of the cube (its corners are four of the cube's), so
 * each quad is split along that diagonal and all three shapes keep crisp
 * edges. The equal-angle (tan) spacing keeps the sphere evenly tessellated
 * without moving points off those lines.
 */
export function buildMorphMesh(segments: number) {
  const positions: number[] = [];
  const indices: number[] = [];
  const faces: { axis: 0 | 1 | 2; sign: 1 | -1 }[] = [
    { axis: 0, sign: 1 },
    { axis: 0, sign: -1 },
    { axis: 1, sign: 1 },
    { axis: 1, sign: -1 },
    { axis: 2, sign: 1 },
    { axis: 2, sign: -1 },
  ];

  for (const { axis, sign } of faces) {
    const base = positions.length / 3;
    const [ua, va] = axis === 0 ? [1, 2] : axis === 1 ? [2, 0] : [0, 1];
    for (let j = 0; j <= segments; j++) {
      for (let i = 0; i <= segments; i++) {
        const p = [0, 0, 0];
        p[axis] = sign;
        p[ua] = Math.tan(((i / segments) * 2 - 1) * (Math.PI / 4));
        p[va] = Math.tan(((j / segments) * 2 - 1) * (Math.PI / 4));
        const len = Math.hypot(p[0], p[1], p[2]);
        positions.push(
          (p[0] / len) * SPHERE_RADIUS,
          (p[1] / len) * SPHERE_RADIUS,
          (p[2] / len) * SPHERE_RADIUS,
        );
      }
    }
    // TETRA_NORMALS are face normals, so the tetrahedron's corners sit at the
    // opposite cube corners, those with x·y·z = −1. On this face its edge
    // therefore runs along u·v = −sign (u = −v on +faces, u = v on −faces).
    const alongMain = sign === -1;
    const row = segments + 1;
    for (let j = 0; j < segments; j++) {
      for (let i = 0; i < segments; i++) {
        const a = base + j * row + i;
        const b = a + 1;
        const c = a + row;
        const d = c + 1;
        // Wind so faces point outwards whatever the face orientation
        const tris = alongMain ? [[a, b, d], [a, d, c]] : [[a, b, c], [b, d, c]];
        for (const [x, y, z] of tris) {
          if (sign === 1) indices.push(x, y, z);
          else indices.push(x, z, y);
        }
      }
    }
  }

  return { positions, indices };
}

/**
 * Per-vertex morph data: each vertex keeps its direction from the centre and
 * only its distance changes. That distance is precomputed per shape, so a
 * frame is just a lerp between two numbers per vertex.
 */
export function buildMorphTargets(positions: ArrayLike<number>) {
  const vertexCount = positions.length / 3;
  const dirX = new Float32Array(vertexCount);
  const dirY = new Float32Array(vertexCount);
  const dirZ = new Float32Array(vertexCount);
  const shapeRadii = SHAPES.map(() => new Float32Array(vertexCount));

  for (let i = 0; i < vertexCount; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    const len = Math.hypot(x, y, z);
    dirX[i] = x / len;
    dirY[i] = y / len;
    dirZ[i] = z / len;
    SHAPES.forEach((shape, si) => {
      shapeRadii[si][i] = surfaceRadius(shape, dirX[i], dirY[i], dirZ[i]);
    });
  }

  return { vertexCount, dirX, dirY, dirZ, shapeRadii };
}

/** The three orbit rings: radius, Euler tilt (XYZ), colour, opacity, dot speed and size. */
export const RING_CONFIGS: {
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

/** Camera shared by both renderers so the object frames identically. */
export const CAMERA_FOV = 36;
export const CAMERA_Z = 5.6;
