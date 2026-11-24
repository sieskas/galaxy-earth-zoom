import * as THREE from 'three';

export interface GalaxySystem {
  group: THREE.Group;
  skyBackdrop: THREE.Mesh;
  backgroundStars: THREE.Points;
  localStars: THREE.Points;
  solBeacon: THREE.Mesh;
  orionOffset: THREE.Vector3;
  update: (elapsed: number, zoomT: number, camera: THREE.Camera) => void;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianRandom(rand: () => number): number {
  const u = Math.max(1e-7, rand());
  const v = rand();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Anti-aliased, temporally stable star shader (zero sub-pixel shimmer / eye strain!)
const STAR_VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aPhase;

  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uScaleBoost;
  uniform float uMaxSize;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = color;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = max(1.5, -mvPosition.z);
    float nearFade = smoothstep(2.2, 8.5, dist);

    // Energy-conserving minimum point size: never render sub-pixel points that beat against the pixel grid
    float rawSize = aSize * uPixelRatio * uScaleBoost * (114.0 / dist);
    float minStableSize = 2.4 * uPixelRatio;
    float finalSize = clamp(max(rawSize, minStableSize), minStableSize, uMaxSize);

    // Conserve energy when clamping small stars up to minStableSize so they stay velvety & calm
    float energyRatio = clamp(rawSize / finalSize, 0.0, 1.0);
    vAlpha = aAlpha * uOpacity * nearFade * (0.25 + 0.75 * energyRatio * energyRatio);

    gl_PointSize = finalSize;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float r = length(uv) * 2.0;
    if (r > 1.0) discard;

    // Smooth radial Gaussian window: velvety across pixel boundaries, zero sparkling moiré
    float window = smoothstep(1.0, 0.15, r);
    float core = exp(-r * r * 7.5);
    float halo = exp(-r * r * 3.0) * 0.28 * window;
    float intensity = (core + halo) * window;

    vec3 col = mix(vColor, vec3(1.0, 0.98, 0.95), core * 0.35);
    gl_FragColor = vec4(col * intensity, intensity * vAlpha);
  }
`;

// Smooth circular Gaussian volumetric gas & dust shader (ZERO discernible oval flakes!)
const GAS_VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;

  uniform float uPixelRatio;
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = color;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = max(3.0, -mvPosition.z);
    float nearFade = smoothstep(20.0, 48.0, dist);
    vAlpha = aAlpha * uOpacity * nearFade;

    gl_PointSize = clamp(aSize * uPixelRatio * (120.0 / dist), 3.0, 86.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const GAS_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float r = length(uv) * 2.0;
    if (r >= 0.999) discard;

    float falloff = pow(max(1.0 - r * r, 0.0001), 3.4);
    gl_FragColor = vec4(vColor, falloff * vAlpha);
  }
`;

// Rich warm golden-amber barred galactic core (never pale/clipped)
const CORE_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CORE_FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    vec2 barP = vec2(p.x * 0.76, p.y * 1.26);
    float r = length(barP);
    if (r > 1.0) discard;

    float nucleus = exp(-r * r * 22.0) * 0.72;
    float bulge = exp(-r * r * 4.8) * 0.52;
    float halo = exp(-r * r * 1.55) * 0.24;

    vec3 col = vec3(1.0, 0.87, 0.62) * nucleus
             + vec3(0.92, 0.56, 0.24) * bulge
             + vec3(0.32, 0.48, 0.88) * halo;

    float alpha = clamp(nucleus + bulge + halo, 0.0, 0.90) * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

// Linear-space calibrated #020308 deep space skybox (ZERO lifted navy floor, ZERO blurry fog!)
const SKY_VERTEX_SHADER = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAGMENT_SHADER = /* glsl */ `
  uniform float uBandOpacity;
  varying vec3 vDir;

  void main() {
    vec3 d = normalize(vDir);
    vec3 tilted = normalize(vec3(d.x, d.y * 0.84 + d.z * 0.54, -d.y * 0.54 + d.z * 0.84));
    float planeDist = abs(tilted.y);
    // Razor-subtle, clean linear-space galactic glow band (stars carry the crisp detail)
    float band = exp(-planeDist * planeDist * 38.0);

    // True #020308 in linear space (after sRGB OutputPass -> exact #020308!)
    vec3 baseSpace = vec3(0.0005, 0.0009, 0.0024);
    vec3 subtleBand = vec3(0.0055, 0.0085, 0.0180) * band * uBandOpacity;

    gl_FragColor = vec4(baseSpace + subtleBand, 1.0);
  }
`;

// Warm golden Sol target beacon visible during Orion Arm mid-zoom (t=0.45)
const SOL_BEACON_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SOL_BEACON_FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    if (r > 1.0) discard;

    float window = smoothstep(1.0, 0.20, r);
    float core = exp(-r * r * 55.0);
    float corona = exp(-r * r * 9.0) * 0.45 * window;
    float streak = exp(-abs(p.y) * 32.0) * exp(-abs(p.x) * 2.6) * 0.30 * window;

    vec3 col = vec3(1.0, 0.96, 0.84) * core * 1.45
             + vec3(1.0, 0.78, 0.42) * corona
             + vec3(0.75, 0.88, 1.0) * streak;

    float alpha = clamp(core + corona + streak, 0.0, 1.0) * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function createGalaxySystem(pixelRatio: number): GalaxySystem {
  const rand = mulberry32(42069);
  const group = new THREE.Group();

  const GALAXY_RADIUS = 62;
  const SPIRAL_TWIST = 3.9;

  const orionR = GALAXY_RADIUS * 0.48;
  const orionAngle = Math.pow(orionR / GALAXY_RADIUS, 0.68) * SPIRAL_TWIST;
  const orionOffset = new THREE.Vector3(
    Math.cos(orionAngle) * orionR,
    0.0,
    Math.sin(orionAngle) * orionR,
  );

  const cCoreHot = new THREE.Color('#FFE09E');
  const cCoreWarm = new THREE.Color('#E08A3C');
  const cArmBlue = new THREE.Color('#74AEFF');
  const cArmDeep = new THREE.Color('#3B5FE0');
  const cHiiKnot = new THREE.Color('#F26B9E');
  const cDustDark = new THREE.Color('#020308');

  // 1. ULTRA-DENSE SPIRAL GALAXY (175,000 crisp stars + rich continuous inter-arm disk)
  const STAR_COUNT = 175000;
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const alphas = new Float32Array(STAR_COUNT);
  const phases = new Float32Array(STAR_COUNT);
  const tmpColor = new THREE.Color();

  const armAngles = [0, Math.PI, Math.PI * 0.52, Math.PI * 1.52];

  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3;
    const u = rand();

    let x = 0;
    let y = 0;
    let z = 0;
    let rNorm = 0;

    if (u < 0.17) {
      // Rich golden-amber barred galactic bulge
      const r = Math.abs(gaussianRandom(rand)) * GALAXY_RADIUS * 0.16;
      rNorm = Math.min(1, r / GALAXY_RADIUS);
      const theta = rand() * Math.PI * 2;
      x = Math.cos(theta) * r * 1.60;
      z = Math.sin(theta) * r * 0.72;
      y = gaussianRandom(rand) * (1.85 * Math.exp(-rNorm * 3.1) + 0.28);

      tmpColor.copy(cCoreHot).lerp(cCoreWarm, Math.min(1, rNorm * 3.8 + rand() * 0.35));
      sizes[i] = 0.65 + Math.pow(rand(), 3.0) * 1.65;
      alphas[i] = 0.22 + rand() * 0.32;
    } else if (u < 0.74) {
      // Logarithmic spiral arms with glowing OB ridges & pink H-II knots
      const pick = rand();
      const armIdx = pick < 0.65 ? (i % 2) : 2 + (i % 2);
      const isMajor = armIdx < 2;

      const r = Math.pow(rand(), 0.72) * GALAXY_RADIUS * 0.98 + 2.4;
      rNorm = r / GALAXY_RADIUS;

      const baseAngle = armAngles[armIdx];
      const twist = Math.pow(rNorm, 0.68) * SPIRAL_TWIST;
      const spread = (isMajor ? 0.21 : 0.29) * (0.40 + rNorm * 0.88);
      const angle = baseAngle + twist + gaussianRandom(rand) * spread;

      x = Math.cos(angle) * r;
      z = Math.sin(angle) * r;
      const thickness = 1.3 * Math.exp(-rNorm * 2.5) + 0.24;
      y = gaussianRandom(rand) * thickness;

      if (rNorm < 0.28) {
        tmpColor.copy(cCoreWarm).lerp(cArmBlue, rNorm / 0.28);
      } else {
        tmpColor.copy(cArmBlue).lerp(cArmDeep, Math.min(1, (rNorm - 0.28) * 1.05));
      }

      const spark = rand();
      if (spark > 0.974 && rNorm > 0.18) {
        tmpColor.copy(cHiiKnot).lerp(cCoreHot, 0.2);
        sizes[i] = 1.7 + rand() * 1.7;
        alphas[i] = 0.78;
      } else if (spark > 0.89) {
        tmpColor.lerp(cCoreHot, 0.5);
        sizes[i] = 1.2 + rand() * 1.5;
        alphas[i] = 0.68 + rand() * 0.30;
      } else {
        sizes[i] = 0.55 + Math.pow(rand(), 2.4) * 1.25;
        alphas[i] = (0.34 + rand() * 0.44) * (1.0 - rNorm * 0.22);
      }
    } else {
      // Rich continuous inter-arm stellar disk fill (26% of stars -> eliminates empty black voids!)
      const r = Math.pow(rand(), 0.65) * GALAXY_RADIUS * 1.04;
      rNorm = Math.min(1, r / GALAXY_RADIUS);
      const theta = rand() * Math.PI * 2;
      x = Math.cos(theta) * r;
      z = Math.sin(theta) * r;
      y = gaussianRandom(rand) * (1.75 * Math.exp(-rNorm * 1.7) + 0.35);

      tmpColor.copy(cCoreWarm).lerp(cArmBlue, Math.min(1, rNorm * 1.25));
      sizes[i] = 0.52 + rand() * 0.95;
      alphas[i] = (0.24 + rand() * 0.28) * (1.0 - rNorm * 0.42);
    }

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    colors[i3] = tmpColor.r;
    colors[i3 + 1] = tmpColor.g;
    colors[i3 + 2] = tmpColor.b;

    phases[i] = rand() * Math.PI * 2;
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  starGeo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
  starGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

  const starMat = new THREE.ShaderMaterial({
    vertexShader: STAR_VERTEX_SHADER,
    fragmentShader: STAR_FRAGMENT_SHADER,
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uTime: { value: 0 },
      uOpacity: { value: 1.0 },
      uScaleBoost: { value: 1.0 },
      uMaxSize: { value: 14.0 },
    },
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const galaxyStars = new THREE.Points(starGeo, starMat);
  galaxyStars.frustumCulled = false;
  group.add(galaxyStars);

  // 2. SEAMLESS GAUSSIAN VOLUMETRIC IONIZED GAS (3,600 ultra-soft overlapping clouds, ZERO oval flakes)
  const GAS_COUNT = 3600;
  const gasPos = new Float32Array(GAS_COUNT * 3);
  const gasCol = new Float32Array(GAS_COUNT * 3);
  const gasSize = new Float32Array(GAS_COUNT);
  const gasAlpha = new Float32Array(GAS_COUNT);

  for (let i = 0; i < GAS_COUNT; i++) {
    const i3 = i * 3;
    const armIdx = i % 4;
    const r = Math.pow(rand(), 0.74) * GALAXY_RADIUS * 0.90 + 4.5;
    const rNorm = r / GALAXY_RADIUS;
    const angle =
      armAngles[armIdx] +
      Math.pow(rNorm, 0.68) * SPIRAL_TWIST +
      gaussianRandom(rand) * (0.20 + rNorm * 0.22);

    gasPos[i3] = Math.cos(angle) * r;
    gasPos[i3 + 1] = gaussianRandom(rand) * (0.65 * Math.exp(-rNorm * 2.0) + 0.14);
    gasPos[i3 + 2] = Math.sin(angle) * r;

    if (rNorm < 0.26) {
      tmpColor.copy(cCoreWarm);
    } else if (rand() > 0.88) {
      tmpColor.copy(cHiiKnot).lerp(cArmBlue, 0.3);
    } else {
      tmpColor.copy(cArmBlue).lerp(cArmDeep, rNorm * 0.78);
    }

    gasCol[i3] = tmpColor.r;
    gasCol[i3 + 1] = tmpColor.g;
    gasCol[i3 + 2] = tmpColor.b;

    gasSize[i] = 10.0 + rand() * 14.0;
    gasAlpha[i] = (0.012 + rand() * 0.014) * (1.0 - rNorm * 0.32);
  }

  const gasGeo = new THREE.BufferGeometry();
  gasGeo.setAttribute('position', new THREE.BufferAttribute(gasPos, 3));
  gasGeo.setAttribute('color', new THREE.BufferAttribute(gasCol, 3));
  gasGeo.setAttribute('aSize', new THREE.BufferAttribute(gasSize, 1));
  gasGeo.setAttribute('aAlpha', new THREE.BufferAttribute(gasAlpha, 1));

  const gasMat = new THREE.ShaderMaterial({
    vertexShader: GAS_VERTEX_SHADER,
    fragmentShader: GAS_FRAGMENT_SHADER,
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uOpacity: { value: 1.0 },
    },
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const gasPoints = new THREE.Points(gasGeo, gasMat);
  gasPoints.frustumCulled = false;
  group.add(gasPoints);

  // 3. SOFT GAUSSIAN DARK DUST LANES
  const DUST_COUNT = 2200;
  const dustPos = new Float32Array(DUST_COUNT * 3);
  const dustCol = new Float32Array(DUST_COUNT * 3);
  const dustSize = new Float32Array(DUST_COUNT);
  const dustAlpha = new Float32Array(DUST_COUNT);

  for (let i = 0; i < DUST_COUNT; i++) {
    const i3 = i * 3;
    const armIdx = i % 4;
    const r = Math.pow(rand(), 0.82) * GALAXY_RADIUS * 0.78 + 4.5;
    const rNorm = r / GALAXY_RADIUS;
    const angle =
      armAngles[armIdx] +
      Math.pow(rNorm, 0.68) * SPIRAL_TWIST -
      0.13 +
      gaussianRandom(rand) * 0.09;

    dustPos[i3] = Math.cos(angle) * r;
    dustPos[i3 + 1] = gaussianRandom(rand) * 0.25;
    dustPos[i3 + 2] = Math.sin(angle) * r;

    dustCol[i3] = cDustDark.r;
    dustCol[i3 + 1] = cDustDark.g;
    dustCol[i3 + 2] = cDustDark.b;

    dustSize[i] = 8.0 + rand() * 10.0;
    dustAlpha[i] = 0.34 * (1.0 - rNorm * 0.35);
  }

  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));
  dustGeo.setAttribute('aSize', new THREE.BufferAttribute(dustSize, 1));
  dustGeo.setAttribute('aAlpha', new THREE.BufferAttribute(dustAlpha, 1));

  const dustMat = new THREE.ShaderMaterial({
    vertexShader: GAS_VERTEX_SHADER,
    fragmentShader: GAS_FRAGMENT_SHADER,
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uOpacity: { value: 1.0 },
    },
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const dustPoints = new THREE.Points(dustGeo, dustMat);
  dustPoints.renderOrder = 2;
  dustPoints.frustumCulled = false;
  group.add(dustPoints);

  // 4. RADIANT GOLDEN-AMBER BARRED CORE
  const coreMat = new THREE.ShaderMaterial({
    vertexShader: CORE_VERTEX_SHADER,
    fragmentShader: CORE_FRAGMENT_SHADER,
    uniforms: {
      uOpacity: { value: 1.0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  const corePlaneH = new THREE.Mesh(new THREE.PlaneGeometry(34, 34), coreMat);
  corePlaneH.rotation.x = -Math.PI / 2;
  group.add(corePlaneH);

  // Pivot so Orion Spur sits at world origin (0,0,0)
  const pivot = new THREE.Group();
  while (group.children.length > 0) {
    pivot.add(group.children[0]);
  }
  pivot.position.copy(orionOffset).negate();
  group.add(pivot);

  // 5. TRUE #020308 LINEAR-CALIBRATED SKYBOX
  const skyMat = new THREE.ShaderMaterial({
    vertexShader: SKY_VERTEX_SHADER,
    fragmentShader: SKY_FRAGMENT_SHADER,
    uniforms: {
      uBandOpacity: { value: 0.15 },
    },
    side: THREE.BackSide,
    depthWrite: false,
  });
  const skyBackdrop = new THREE.Mesh(new THREE.SphereGeometry(1200, 48, 32), skyMat);

  // 6. CRISP DEEP-FIELD STARFIELD (22,000 stars, concentrated along a crisp Milky Way band!)
  const BG_COUNT = 22000;
  const bgPos = new Float32Array(BG_COUNT * 3);
  const bgCol = new Float32Array(BG_COUNT * 3);
  const bgSize = new Float32Array(BG_COUNT);
  const bgAlpha = new Float32Array(BG_COUNT);
  const bgPhase = new Float32Array(BG_COUNT);

  for (let i = 0; i < BG_COUNT; i++) {
    const i3 = i * 3;
    let dx = 0;
    let dy = 0;
    let dz = 0;

    if (i < BG_COUNT * 0.48) {
      // Crisp starry Milky Way band across deep space
      const theta = rand() * Math.PI * 2;
      const lat = gaussianRandom(rand) * 0.11;
      const x0 = Math.cos(lat) * Math.cos(theta);
      const y0 = Math.sin(lat);
      const z0 = Math.cos(lat) * Math.sin(theta);
      dx = x0;
      dy = y0 * 0.84 - z0 * 0.54;
      dz = y0 * 0.54 + z0 * 0.84;
    } else {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      dx = Math.sin(phi) * Math.cos(theta);
      dy = Math.cos(phi);
      dz = Math.sin(phi) * Math.sin(theta);
    }

    const r = 720 + rand() * 260;
    bgPos[i3] = dx * r;
    bgPos[i3 + 1] = dy * r;
    bgPos[i3 + 2] = dz * r;

    const temp = rand();
    if (temp < 0.28) {
      tmpColor.set('#A6CAFF');
    } else if (temp < 0.74) {
      tmpColor.set('#F2F6FF');
    } else {
      tmpColor.set('#FFD49E');
    }

    bgCol[i3] = tmpColor.r;
    bgCol[i3 + 1] = tmpColor.g;
    bgCol[i3 + 2] = tmpColor.b;

    const isBright = rand() > 0.96;
    bgSize[i] = isBright ? 5.2 + rand() * 3.2 : 2.1 + Math.pow(rand(), 2.8) * 3.8;
    bgAlpha[i] = isBright ? 0.92 + rand() * 0.08 : 0.42 + rand() * 0.55;
    bgPhase[i] = rand() * Math.PI * 2;
  }

  const bgGeo = new THREE.BufferGeometry();
  bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
  bgGeo.setAttribute('color', new THREE.BufferAttribute(bgCol, 3));
  bgGeo.setAttribute('aSize', new THREE.BufferAttribute(bgSize, 1));
  bgGeo.setAttribute('aAlpha', new THREE.BufferAttribute(bgAlpha, 1));
  bgGeo.setAttribute('aPhase', new THREE.BufferAttribute(bgPhase, 1));

  const bgMat = new THREE.ShaderMaterial({
    vertexShader: STAR_VERTEX_SHADER,
    fragmentShader: STAR_FRAGMENT_SHADER,
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uTime: { value: 0 },
      uOpacity: { value: 0.98 },
      uScaleBoost: { value: 2.8 },
      uMaxSize: { value: 9.5 },
    },
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const backgroundStars = new THREE.Points(bgGeo, bgMat);
  backgroundStars.frustumCulled = false;

  // 7. LOCAL 3D PARALLAX STARFIELD + BRIGHT ORION LANDMARK STARS
  const LOCAL_COUNT = 4800;
  const locPos = new Float32Array(LOCAL_COUNT * 3);
  const locCol = new Float32Array(LOCAL_COUNT * 3);
  const locSize = new Float32Array(LOCAL_COUNT);
  const locAlpha = new Float32Array(LOCAL_COUNT);
  const locPhase = new Float32Array(LOCAL_COUNT);

  for (let i = 0; i < LOCAL_COUNT; i++) {
    const i3 = i * 3;
    const isLandmark = i < 80;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = isLandmark ? 18 + rand() * 58 : 16 + Math.pow(rand(), 0.72) * 160;

    locPos[i3] = r * Math.sin(phi) * Math.cos(theta);
    locPos[i3 + 1] = r * Math.cos(phi) * (isLandmark ? 0.55 : 0.68);
    locPos[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const temp = rand();
    if (temp < 0.36) {
      tmpColor.set('#8EC2FF');
    } else if (temp < 0.72) {
      tmpColor.set('#F5F8FF');
    } else {
      tmpColor.set('#FFC680');
    }

    locCol[i3] = tmpColor.r;
    locCol[i3 + 1] = tmpColor.g;
    locCol[i3 + 2] = tmpColor.b;

    if (isLandmark) {
      locSize[i] = 2.4 + rand() * 3.0;
      locAlpha[i] = 0.85 + rand() * 0.15;
    } else {
      locSize[i] = 0.55 + Math.pow(rand(), 2.8) * 1.6;
      locAlpha[i] = 0.36 + rand() * 0.54;
    }
    locPhase[i] = rand() * Math.PI * 2;
  }

  const locGeo = new THREE.BufferGeometry();
  locGeo.setAttribute('position', new THREE.BufferAttribute(locPos, 3));
  locGeo.setAttribute('color', new THREE.BufferAttribute(locCol, 3));
  locGeo.setAttribute('aSize', new THREE.BufferAttribute(locSize, 1));
  locGeo.setAttribute('aAlpha', new THREE.BufferAttribute(locAlpha, 1));
  locGeo.setAttribute('aPhase', new THREE.BufferAttribute(locPhase, 1));

  const locMat = new THREE.ShaderMaterial({
    vertexShader: STAR_VERTEX_SHADER,
    fragmentShader: STAR_FRAGMENT_SHADER,
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uTime: { value: 0 },
      uOpacity: { value: 0.0 },
      uScaleBoost: { value: 1.05 },
      uMaxSize: { value: 15.0 },
    },
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const localStars = new THREE.Points(locGeo, locMat);
  localStars.frustumCulled = false;

  // 8. WARM GOLDEN SOL TARGET BEACON (anchors camera trajectory at t=0.45 in Orion Arm!)
  const solMat = new THREE.ShaderMaterial({
    vertexShader: SOL_BEACON_VERTEX_SHADER,
    fragmentShader: SOL_BEACON_FRAGMENT_SHADER,
    uniforms: {
      uOpacity: { value: 0.0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const solBeacon = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 5.5), solMat);
  solBeacon.position.set(0, 0, 0);

  const smoothstep = (e0: number, e1: number, x: number): number => {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  const update = (elapsed: number, zoomT: number, camera: THREE.Camera) => {
    const rotWeight = 1.0 - smoothstep(0.2, 0.65, zoomT);
    pivot.rotation.y = elapsed * 0.0045 * rotWeight;

    const expandT = smoothstep(0.06, 0.82, zoomT);
    const scale = Math.pow(20.0, expandT);
    group.scale.setScalar(scale);

    const galaxyFade = 1.0 - smoothstep(0.46, 0.80, zoomT);
    const gasFade = 1.0 - smoothstep(0.16, 0.38, zoomT);
    const dustFade = 1.0 - smoothstep(0.14, 0.36, zoomT);

    starMat.uniforms.uTime.value = elapsed;
    starMat.uniforms.uOpacity.value = galaxyFade;
    starMat.uniforms.uScaleBoost.value = 1.0 + expandT * 0.25;

    gasMat.uniforms.uOpacity.value = gasFade;
    dustMat.uniforms.uOpacity.value = dustFade;
    coreMat.uniforms.uOpacity.value = 1.0 - smoothstep(0.24, 0.56, zoomT);

    group.visible = galaxyFade > 0.002;

    const localFadeIn = smoothstep(0.14, 0.44, zoomT);
    locMat.uniforms.uTime.value = elapsed;
    locMat.uniforms.uOpacity.value = localFadeIn * 0.92;
    localStars.visible = localFadeIn > 0.002;

    // Warm Sol beacon shines ahead during Orion Arm approach, then hands off seamlessly to Earth!
    const solIn = smoothstep(0.24, 0.42, zoomT);
    const solOut = 1.0 - smoothstep(0.50, 0.62, zoomT);
    const solAlpha = solIn * solOut;
    solMat.uniforms.uOpacity.value = solAlpha;
    solBeacon.visible = solAlpha > 0.002;
    solBeacon.quaternion.copy(camera.quaternion);

    skyMat.uniforms.uBandOpacity.value = 0.20 + smoothstep(0.42, 0.85, zoomT) * 0.80;

    bgMat.uniforms.uTime.value = elapsed;
    bgMat.uniforms.uOpacity.value = 0.92 + smoothstep(0.35, 0.9, zoomT) * 0.08;
  };

  return {
    group,
    skyBackdrop,
    backgroundStars,
    localStars,
    solBeacon,
    orionOffset,
    update,
  };
}
