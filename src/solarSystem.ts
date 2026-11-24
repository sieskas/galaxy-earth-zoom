import * as THREE from 'three';

export type BodyId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'io'
  | 'europa'
  | 'ganymede'
  | 'callisto';

export interface BodyInfo {
  id: BodyId;
  name: string;
  accent: string;
  parent?: BodyId;
  orbitRadius: number;
  radius: number;
  orbitSpeed: number;
  initialAngle: number;
  distanceLabel: string;
  radiusLabel: string;
  periodLabel: string;
  summary: string;
}

export interface SolarSystem {
  group: THREE.Group;
  bodies: BodyInfo[];
  pickables: THREE.Object3D[];
  getBodyWorldPosition: (id: BodyId, target: THREE.Vector3) => THREE.Vector3;
  getBodyInfo: (id: BodyId) => BodyInfo;
  update: (
    elapsed: number,
    visibility: number,
    camera: THREE.Camera,
    showOrbits?: boolean,
    showJupiterMoonOrbits?: boolean,
  ) => void;
}

export const SOLAR_BODIES: BodyInfo[] = [
  {
    id: 'sun',
    name: 'Sun',
    accent: '#FFBE5C',
    orbitRadius: 0,
    radius: 3.4,
    orbitSpeed: 0,
    initialAngle: 0,
    distanceLabel: '0.00 AU',
    radiusLabel: '696,340 km',
    periodLabel: '25.4 d (rot.)',
    summary: 'G2V Yellow Dwarf · 5,500 °C Photosphere',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    accent: '#A9A29A',
    orbitRadius: 9.5,
    radius: 0.46,
    orbitSpeed: 0.095,
    initialAngle: 0.7,
    distanceLabel: '0.39 AU',
    radiusLabel: '2,440 km',
    periodLabel: '88 days',
    summary: 'Terrestrial · MESSENGER cratered surface',
  },
  {
    id: 'venus',
    name: 'Venus',
    accent: '#E3B97A',
    orbitRadius: 14.2,
    radius: 0.88,
    orbitSpeed: 0.068,
    initialAngle: 2.35,
    distanceLabel: '0.72 AU',
    radiusLabel: '6,052 km',
    periodLabel: '225 days',
    summary: 'Dense atmosphere · Sulfuric acid clouds',
  },
  {
    id: 'earth',
    name: 'Earth',
    accent: '#5CA9FF',
    orbitRadius: 20.5,
    radius: 1.25,
    orbitSpeed: 0.048,
    initialAngle: -0.62,
    distanceLabel: '1.00 AU',
    radiusLabel: '6,371 km',
    periodLabel: '365.25 days',
    summary: 'Liquid oceans · Nitrogen-oxygen atmosphere',
  },
  {
    id: 'mars',
    name: 'Mars',
    accent: '#D4724E',
    orbitRadius: 27.5,
    radius: 0.74,
    orbitSpeed: 0.036,
    initialAngle: 1.18,
    distanceLabel: '1.52 AU',
    radiusLabel: '3,390 km',
    periodLabel: '687 days',
    summary: 'Terrestrial · Valles Marineris & polar ice caps',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    accent: '#D8A878',
    orbitRadius: 43.0,
    radius: 2.65,
    orbitSpeed: 0.022,
    initialAngle: -2.65,
    distanceLabel: '5.20 AU',
    radiusLabel: '69,911 km',
    periodLabel: '11.9 yrs',
    summary: 'Gas giant · 4 Galilean moons in orbit',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    accent: '#E2C68A',
    orbitRadius: 56.5,
    radius: 2.2,
    orbitSpeed: 0.015,
    initialAngle: 0.42,
    distanceLabel: '9.54 AU',
    radiusLabel: '58,232 km',
    periodLabel: '29.5 yrs',
    summary: 'Gas giant · Ice rings & Cassini Division',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    accent: '#82DCE8',
    orbitRadius: 68.0,
    radius: 1.48,
    orbitSpeed: 0.010,
    initialAngle: 2.72,
    distanceLabel: '19.2 AU',
    radiusLabel: '25,362 km',
    periodLabel: '84 yrs',
    summary: 'Ice giant · 97.8° axial tilt',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    accent: '#4674F0',
    orbitRadius: 78.5,
    radius: 1.44,
    orbitSpeed: 0.0075,
    initialAngle: -1.15,
    distanceLabel: '30.1 AU',
    radiusLabel: '24,622 km',
    periodLabel: '165 yrs',
    summary: 'Ice giant · Supersonic methane winds',
  },
  // 4 Galilean Moons orbiting Jupiter
  {
    id: 'io',
    name: 'Io',
    accent: '#E6C35A',
    parent: 'jupiter',
    orbitRadius: 4.3,
    radius: 0.22,
    orbitSpeed: 0.42,
    initialAngle: 0.55,
    distanceLabel: '421,700 km',
    radiusLabel: '1,822 km',
    periodLabel: '1.77 days',
    summary: 'Moon of Jupiter · Most volcanically active world',
  },
  {
    id: 'europa',
    name: 'Europa',
    accent: '#D8CFC2',
    parent: 'jupiter',
    orbitRadius: 5.7,
    radius: 0.19,
    orbitSpeed: 0.27,
    initialAngle: 2.05,
    distanceLabel: '671,034 km',
    radiusLabel: '1,561 km',
    periodLabel: '3.55 days',
    summary: 'Moon of Jupiter · Fractured ice shell & subsurface ocean',
  },
  {
    id: 'ganymede',
    name: 'Ganymede',
    accent: '#A69D91',
    parent: 'jupiter',
    orbitRadius: 7.4,
    radius: 0.30,
    orbitSpeed: 0.17,
    initialAngle: -0.95,
    distanceLabel: '1,070,400 km',
    radiusLabel: '2,634 km',
    periodLabel: '7.15 days',
    summary: 'Moon of Jupiter · Largest moon in the Solar System',
  },
  {
    id: 'callisto',
    name: 'Callisto',
    accent: '#7D7369',
    parent: 'jupiter',
    orbitRadius: 9.4,
    radius: 0.27,
    orbitSpeed: 0.11,
    initialAngle: -2.45,
    distanceLabel: '1,882,700 km',
    radiusLabel: '2,410 km',
    periodLabel: '16.7 days',
    summary: 'Moon of Jupiter · Ancient heavily cratered ice crust',
  },
];

export const MAIN_BODIES = SOLAR_BODIES.filter((b) => !b.parent);
export const GALILEAN_MOONS = SOLAR_BODIES.filter((b) => b.parent === 'jupiter');

// 1. LIVING 2K + 3D DOMAIN-WARPED PLASMA SUN SHADER (NASA SDO / Sunshine grade, 100% NaN-safe)
const SUN_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vLocalPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vLocalPos = normalize(position);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const SUN_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vLocalPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  float sHash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float sNoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(sHash(i + vec3(0,0,0)), sHash(i + vec3(1,0,0)), f.x),
          mix(sHash(i + vec3(0,1,0)), sHash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(sHash(i + vec3(0,0,1)), sHash(i + vec3(1,0,1)), f.x),
          mix(sHash(i + vec3(0,1,1)), sHash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float sFbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * sNoise(p);
      p = p * 2.08 + vec3(9.2, 4.1, 7.3);
      a *= 0.5;
    }
    return v;
  }

  vec3 sHash33(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.xxy + p.yxx) * p.zyx);
  }

  // 3D Worley / Voronoi cellular noise: returns vec2(F1 cell center, F2-F1 lava vein edge)
  vec2 voronoi3D(vec3 x, float t) {
    vec3 n = floor(x);
    vec3 f = fract(x);
    float f1 = 8.0;
    float f2 = 8.0;
    for (int k = -1; k <= 1; k++) {
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec3 g = vec3(float(i), float(j), float(k));
          vec3 o = sHash33(n + g);
          // Smooth organic boiling motion inside each convection cell
          o = 0.5 + 0.42 * sin(t + 6.2831 * o);
          vec3 r = g + o - f;
          float d = dot(r, r);
          if (d < f1) {
            f2 = f1;
            f1 = d;
          } else if (d < f2) {
            f2 = d;
          }
        }
      }
    }
    return vec2(sqrt(max(f1, 0.0001)), sqrt(max(f2, 0.0001)) - sqrt(max(f1, 0.0001)));
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPosition);
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float safeNdv = max(ndv, 0.0001);

    // 3D domain-warped boiling lava/plasma convection currents
    vec3 p = vLocalPos * 4.4;
    vec3 drift = vec3(uTime * 0.06, -uTime * 0.035, uTime * 0.045);
    vec3 warp = vec3(
      sFbm(p + drift),
      sFbm(p + vec3(5.2, 1.3, 2.8) - drift * 0.7),
      sFbm(p + vec3(1.7, 9.2, 4.4) + drift * 0.5)
    );
    vec3 warpedPos = p + (warp - 0.5) * 1.45;

    // Layer 1: Macro cellular lava/granulation (NASA DKIST boiling honeycomb!)
    vec2 cellMacro = voronoi3D(warpedPos * 1.65, uTime * 0.42);
    // Layer 2: Fine turbulent plasma cells
    vec2 cellMicro = voronoi3D(warpedPos * 4.2 - drift * 1.4, uTime * 0.65);

    // Crisp dark/molten inter-granular veins (F2 - F1 near 0 = cell border)
    float veinMacro = smoothstep(0.02, 0.24, cellMacro.y);
    float veinMicro = smoothstep(0.02, 0.22, cellMicro.y);
    float cellCore = 1.0 - smoothstep(0.08, 0.78, cellMacro.x);

    // Real 2K solar photosphere texture blended subtly for authentic macro-structure
    vec2 uvFlow = vec2(
      vUv.x + uTime * 0.003 + (warp.x - 0.5) * 0.014,
      clamp(vUv.y + (warp.y - 0.5) * 0.010, 0.002, 0.998)
    );
    float texLuma = dot(texture2D(uMap, uvFlow).rgb, vec3(0.299, 0.587, 0.114));

    // Combine cellular lava/granulation + swirling plasma filaments + dark sunspots
    float plasma = sFbm(warpedPos * 2.1 + drift * 0.8);
    float lavaHeat = clamp(
      cellCore * 0.44 + veinMacro * 0.34 + veinMicro * 0.16 + texLuma * 0.24 - 0.12,
      0.0,
      1.0
    );

    // Incandescent molten cracks where plasma surges through active magnetic regions
    float crackGlow = (1.0 - veinMacro) * smoothstep(0.46, 0.82, plasma);
    float spotField = sFbm(vLocalPos * 3.2 + vec3(2.1, -1.4, 3.7));
    float penumbra = smoothstep(0.33, 0.23, spotField);
    float umbra = smoothstep(0.25, 0.18, spotField);

    // Lava/Plasma blackbody palette (deep obsidian-crimson veins -> molten magma orange -> blazing gold -> white plasma)
    vec3 cCrustDark = vec3(0.14, 0.012, 0.002);
    vec3 cMagmaRed = vec3(0.68, 0.08, 0.005);
    vec3 cLavaOrange = vec3(1.00, 0.32, 0.015);
    vec3 cPlasmaGold = vec3(1.00, 0.70, 0.12);
    vec3 cWhiteHot = vec3(1.00, 0.96, 0.78);

    vec3 col = mix(cCrustDark, cMagmaRed, smoothstep(0.05, 0.32, lavaHeat));
    col = mix(col, cLavaOrange, smoothstep(0.28, 0.62, lavaHeat));
    col = mix(col, cPlasmaGold, smoothstep(0.58, 0.86, lavaHeat));
    col = mix(col, cWhiteHot, smoothstep(0.82, 0.98, lavaHeat) * 0.72);
    // Additive blazing golden-orange plasma surges (never turns grey/smoky over dark veins!)
    col += vec3(1.15, 0.56, 0.08) * crackGlow * 0.85;

    // Sunspots (cool dark magnetic depressions)
    col = mix(col, vec3(0.06, 0.006, 0.001), penumbra * 0.68);
    col = mix(col, vec3(0.02, 0.002, 0.0005), umbra * 0.92);

    // Seamless fiery orange-red limb darkening & chromospheric rim (zero dark gap against BackSide shell!)
    float limbFactor = pow(safeNdv, 0.58);
    vec3 limbTint = mix(vec3(1.0, 0.26, 0.02), vec3(1.0, 0.94, 0.84), limbFactor);
    float rimEdge = pow(clamp(1.0 - ndv, 0.0001, 1.0), 2.4);
    vec3 chromoRim = vec3(1.0, 0.34, 0.03) * rimEdge * (0.85 + 0.55 * plasma);

    vec3 finalColor = max(vec3(0.0), col * limbTint * (0.52 + 0.62 * limbFactor) + chromoRim);
    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

// Volumetric 3D fiery solar chromosphere / prominence shell (BackSide, smooth 0.0 outer edge!)
const SUN_ATMOS_VERTEX = /* glsl */ `
  varying vec3 vLocalPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vLocalPos = normalize(position);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const SUN_ATMOS_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;

  varying vec3 vLocalPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  float aHash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float aNoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(aHash(i + vec3(0,0,0)), aHash(i + vec3(1,0,0)), f.x),
          mix(aHash(i + vec3(0,1,0)), aHash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(aHash(i + vec3(0,0,1)), aHash(i + vec3(1,0,1)), f.x),
          mix(aHash(i + vec3(0,1,1)), aHash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPosition);
    float viewDot = clamp(dot(-N, V), 0.0, 1.0);
    // Steep falloff reaches strict 0.0 well inside the outer silhouette -> ZERO outer bubble edge!
    float falloffStep = smoothstep(0.24, 0.74, viewDot);
    float falloff = falloffStep > 0.0001 ? pow(falloffStep, 4.4) : 0.0;

    // Animated fiery orange-red solar prominence licks around the 3D limb
    vec3 p = vLocalPos * 5.6 + vec3(uTime * 0.10, -uTime * 0.06, uTime * 0.08);
    float prom = aNoise(p) * 0.58 + aNoise(p * 2.5 - uTime * 0.14) * 0.42;
    float flareBoost = 0.55 + 0.95 * smoothstep(0.36, 0.82, prom);

    vec3 innerFire = vec3(1.0, 0.38, 0.03);
    vec3 outerFire = vec3(0.92, 0.12, 0.008);
    vec3 col = mix(outerFire, innerFire, smoothstep(0.32, 0.68, viewDot));

    float alpha = falloff * flareBoost * 0.92 * uOpacity;
    gl_FragColor = vec4(col * alpha * 1.55, alpha);
  }
`;

const SUN_CORONA_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// 3D Magnetic Solar Prominence / Flare Arch Shader (flowing plasma along arched field lines, 100% NaN-safe)
const PROMINENCE_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const PROMINENCE_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uSpeed;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  float pHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float pNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(pHash(i), pHash(i + vec2(1.0, 0.0)), f.x),
      mix(pHash(i + vec2(0.0, 1.0)), pHash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float pFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * pNoise(p);
      p = p * 2.1 + vec2(4.7, 8.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPosition);
    // Steep cylindrical edge falloff on FrontSide -> pure wispy magnetic plasma, ZERO tube outline or fold!
    float radialSoft = clamp(dot(N, V), 0.0, 1.0);
    float edgeMask = radialSoft > 0.0001 ? pow(radialSoft, 3.2) : 0.0;

    // Smooth taper at both anchor footpoints entering the photosphere
    float archMask = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);

    // Organic eruption surge cycle (each prominence flares up & subsides on its own staggered rhythm)
    float cycleRaw = 0.5 + 0.5 * sin(uTime * uSpeed + uPhase);
    float flareCycle = 0.30 + 0.70 * pow(max(cycleRaw, 0.0001), 1.7);

    // Plasma streaming rapidly along the magnetic field arch
    vec2 flowUv = vec2(vUv.x * 4.5 - uTime * (0.45 + uSpeed * 0.6), vUv.y * 2.6 + uPhase);
    float stream = pFbm(flowUv);
    float wisps = pFbm(flowUv * 2.2 + vec2(0.0, uTime * 0.25));
    float density = smoothstep(0.24, 0.86, stream * 0.65 + wisps * 0.35);

    // Hot incandescent core at flare peak -> fiery orange -> deep crimson edges
    vec3 cCrimson = vec3(0.92, 0.14, 0.01);
    vec3 cOrange = vec3(1.00, 0.44, 0.04);
    vec3 cGold = vec3(1.00, 0.84, 0.34);

    vec3 col = mix(cCrimson, cOrange, smoothstep(0.15, 0.65, density));
    col = mix(col, cGold, smoothstep(0.62, 0.94, density) * flareCycle);

    float alpha = edgeMask * archMask * density * flareCycle * 0.82 * uOpacity;
    gl_FragColor = vec4(col * alpha * 1.65, alpha);
  }
`;

const SUN_CORONA_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    if (r >= 0.999) discard;

    // Strict radial window guarantees ZERO visible square quad edge
    float window = smoothstep(0.95, 0.18, r);
    float angle = atan(p.y, p.x);

    // Crisp radial coronal streamers extending smoothly outward into deep space
    float ray1 = 0.5 + 0.5 * sin(angle * 9.0 + uTime * 0.15);
    float ray2 = 0.5 + 0.5 * cos(angle * 17.0 - uTime * 0.11);
    float ray3 = 0.5 + 0.5 * sin(angle * 29.0 + uTime * 0.22);
    float rays = 0.45 + 0.55 * (pow(max(ray1, 0.0001), 2.2) * 0.55 + pow(max(ray2, 0.0001), 2.8) * 0.30 + ray3 * 0.15);

    float inner = exp(-r * r * 11.5) * 0.55 * window;
    float outer = exp(-r * r * 3.0) * 0.38 * rays * window;
    float streak = exp(-abs(p.y) * 28.0) * exp(-abs(p.x) * 2.2) * 0.16 * window;

    vec3 col = vec3(1.0, 0.72, 0.26) * inner
             + vec3(0.98, 0.38, 0.06) * outer
             + vec3(1.0, 0.82, 0.52) * streak;

    float alpha = clamp(inner + outer + streak, 0.0, 1.0) * window * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

// 2. REAL 2K TEXTURED PLANET SHADER (micro-relief bump from texture gradients, atmospheric Fresnel, optional Saturn ring shadow!)
const TEXTURED_PLANET_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const TEXTURED_PLANET_FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uSunDirection;
  uniform vec3 uRimColor;
  uniform float uRimStrength;
  uniform float uBumpStrength;
  uniform float uOpacity;

  // Optional ring shadow onto planet (for Saturn)
  uniform int uHasRingShadow;
  uniform vec3 uPlanetCenter;
  uniform vec3 uRingNormal;
  uniform float uRingInner;
  uniform float uRingOuter;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  float luma(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(uSunDirection);
    vec3 V = normalize(cameraPosition - vWorldPosition);

    vec3 albedo = texture2D(uMap, vUv).rgb;

    // Subtle micro-relief normal perturbation derived from 2K texture luminance gradients (pole-safe!)
    vec3 perturbedN = N;
    if (uBumpStrength > 0.001) {
      float eps = 0.0009;
      float hL = luma(texture2D(uMap, vec2(clamp(vUv.x - eps, 0.001, 0.999), vUv.y)).rgb);
      float hR = luma(texture2D(uMap, vec2(clamp(vUv.x + eps, 0.001, 0.999), vUv.y)).rgb);
      float hD = luma(texture2D(uMap, vec2(vUv.x, clamp(vUv.y - eps, 0.0, 1.0))).rgb);
      float hU = luma(texture2D(uMap, vec2(vUv.x, clamp(vUv.y + eps, 0.0, 1.0))).rgb);
      vec3 upRef = abs(N.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
      vec3 tangent = normalize(cross(upRef, N));
      vec3 bitangent = normalize(cross(N, tangent));
      perturbedN = normalize(N + (tangent * (hL - hR) + bitangent * (hD - hU)) * uBumpStrength);
    }

    float rawNdl = dot(N, L);
    float ndl = dot(perturbedN, L);
    float day = smoothstep(-0.08, 0.20, rawNdl);
    float diffuse = ndl > 0.0 ? pow(max(ndl, 0.0001), 0.90) : 0.0;

    // Analytic ring shadow cast onto Saturn's cloud tops
    float ringShadow = 1.0;
    if (uHasRingShadow == 1 && rawNdl > -0.05) {
      vec3 rn = normalize(uRingNormal);
      float denom = dot(L, rn);
      if (abs(denom) > 0.001) {
        float tHit = dot(uPlanetCenter - vWorldPosition, rn) / denom;
        if (tHit > 0.0) {
          vec3 hitPos = vWorldPosition + L * tHit;
          float rHit = length(hitPos - uPlanetCenter);
          if (rHit > uRingInner && rHit < uRingOuter) {
            float rt = (rHit - uRingInner) / (uRingOuter - uRingInner);
            // Cassini Division lets sunlight through!
            float cassini = smoothstep(0.58, 0.62, rt) * (1.0 - smoothstep(0.65, 0.69, rt));
            float ringDens = smoothstep(0.0, 0.14, rt) * smoothstep(1.0, 0.88, rt) * (1.0 - cassini * 0.85);
            ringShadow = 1.0 - ringDens * 0.62;
          }
        }
      }
    }

    float fresnelBase = clamp(1.0 - max(dot(N, V), 0.0), 0.0001, 1.0);
    float fresnel = pow(fresnelBase, 3.4);
    vec3 rim = uRimColor * fresnel * smoothstep(-0.20, 0.45, rawNdl) * uRimStrength;

    vec3 ambientNight = albedo * vec3(0.005, 0.007, 0.013);
    vec3 litColor = albedo * (0.015 + diffuse * 1.18 * ringShadow);

    vec3 finalColor = max(vec3(0.0), mix(ambientNight, litColor, day) + rim);
    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

// 3. GALILEAN MOONS PROCEDURAL HIGH-DETAIL SHADER (Io volcanic sulfur, Europa cracked ice, Ganymede grooves, Callisto craters)
const MOON_NOISE_GLSL = /* glsl */ `
  float hash3(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise3(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash3(i + vec3(0,0,0)), hash3(i + vec3(1,0,0)), f.x),
          mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
          mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise3(p);
      p = p * 2.06 + vec3(11.3, 6.7, 4.9);
      a *= 0.5;
    }
    return v;
  }
`;

const GALILEAN_VERTEX_SHADER = /* glsl */ `
  varying vec3 vLocalPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vLocalPos = normalize(position);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const GALILEAN_FRAGMENT_SHADER = /* glsl */ `
  uniform int uMoonType; // 0=Io, 1=Europa, 2=Ganymede, 3=Callisto
  uniform vec3 uSunDirection;
  uniform float uOpacity;

  varying vec3 vLocalPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  ${MOON_NOISE_GLSL}

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(uSunDirection);
    float ndl = dot(N, L);
    float day = smoothstep(-0.08, 0.20, ndl);
    float diffuse = ndl > 0.0 ? pow(max(ndl, 0.0001), 0.90) : 0.0;

    vec3 p = vLocalPos;
    vec3 albedo = vec3(0.5);

    if (uMoonType == 0) {
      // IO: sulfur yellow-gold plains, orange silicate flows & dark volcanic calderas
      float n1 = fbm(p * 4.5);
      float n2 = fbm(p * 12.0);
      float calderas = smoothstep(0.68, 0.82, noise3(p * 14.0));
      albedo = mix(vec3(0.76, 0.50, 0.16), vec3(0.95, 0.85, 0.38), smoothstep(0.28, 0.74, n1));
      albedo = mix(albedo, vec3(0.96, 0.94, 0.78), smoothstep(0.66, 0.85, n2) * 0.5);
      albedo = mix(albedo, vec3(0.14, 0.08, 0.05), calderas * 0.85);
    } else if (uMoonType == 1) {
      // EUROPA: bright water-ice crust crisscrossed by reddish-brown tectonic lineae cracks
      float base = fbm(p * 4.0);
      float crack1 = 1.0 - smoothstep(0.0, 0.055, abs(fbm(p * 6.5) - 0.50));
      float crack2 = 1.0 - smoothstep(0.0, 0.04, abs(fbm(p * 11.0 + vec3(4.2)) - 0.52));
      albedo = mix(vec3(0.78, 0.74, 0.68), vec3(0.92, 0.90, 0.86), base);
      albedo = mix(albedo, vec3(0.46, 0.28, 0.18), clamp(crack1 * 0.65 + crack2 * 0.45, 0.0, 0.85));
    } else if (uMoonType == 2) {
      // GANYMEDE: dark ancient cratered regions + brighter grooved icy terrain
      float regions = fbm(p * 3.2);
      float grooves = 0.5 + 0.5 * sin(fbm(p * 7.5) * 18.0);
      vec3 darkReg = vec3(0.30, 0.27, 0.24);
      vec3 lightGroove = vec3(0.68, 0.65, 0.60);
      albedo = mix(darkReg, lightGroove, smoothstep(0.38, 0.66, regions));
      albedo *= (0.86 + 0.22 * grooves);
    } else {
      // CALLISTO: dark ancient icy-rock surface peppered with bright impact crater rays
      float base = fbm(p * 5.0);
      float brightCraters = smoothstep(0.74, 0.86, noise3(p * 19.0));
      albedo = mix(vec3(0.22, 0.20, 0.18), vec3(0.42, 0.39, 0.35), base);
      albedo = mix(albedo, vec3(0.84, 0.82, 0.78), brightCraters * 0.75);
    }

    vec3 ambientNight = albedo * vec3(0.008, 0.010, 0.018);
    vec3 litColor = albedo * (0.015 + diffuse * 1.16);
    gl_FragColor = vec4(mix(ambientNight, litColor, day), uOpacity);
  }
`;

// 4. SATURN / URANUS RING SHADER (Cassini division + real planet shadow cast onto rings)
const RING_VERTEX_SHADER = /* glsl */ `
  varying vec3 vLocalPos;
  varying vec3 vWorldPos;

  void main() {
    vLocalPos = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const RING_FRAGMENT_SHADER = /* glsl */ `
  uniform float uInnerRadius;
  uniform float uOuterRadius;
  uniform float uPlanetRadius;
  uniform vec3 uPlanetCenter;
  uniform vec3 uSunDirection;
  uniform int uIsUranus;
  uniform float uOpacity;

  varying vec3 vLocalPos;
  varying vec3 vWorldPos;

  void main() {
    float r = length(vLocalPos.xy);
    float t = (r - uInnerRadius) / (uOuterRadius - uInnerRadius);
    if (t < 0.0 || t > 1.0) discard;

    vec3 rel = vWorldPos - uPlanetCenter;
    vec3 L = normalize(uSunDirection);
    float proj = dot(rel, L);
    float shadow = 1.0;
    if (proj < 0.0) {
      vec3 perp = rel - L * proj;
      float distToAxis = length(perp);
      shadow = smoothstep(uPlanetRadius * 0.96, uPlanetRadius * 1.04, distToAxis);
    }

    vec3 col;
    float alpha;

    if (uIsUranus == 1) {
      float ringlets = 0.5 + 0.5 * sin(t * 48.0);
      col = vec3(0.66, 0.84, 0.90);
      alpha = smoothstep(0.0, 0.15, t) * smoothstep(1.0, 0.85, t) * (0.10 + 0.14 * ringlets);
    } else {
      float fineRinglets = 0.65 + 0.35 * sin(t * 145.0) * cos(t * 53.0);
      float cRing = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.18, 0.24, t)) * 0.28;
      float bRing = smoothstep(0.18, 0.24, t) * (1.0 - smoothstep(0.56, 0.60, t)) * 0.88;
      float aRing = smoothstep(0.66, 0.70, t) * (1.0 - smoothstep(0.95, 1.0, t)) * 0.62;
      float encke = 1.0 - smoothstep(0.86, 0.875, t) * (1.0 - smoothstep(0.875, 0.89, t)) * 0.75;

      alpha = clamp((cRing + bRing + aRing) * fineRinglets * encke, 0.0, 0.92);
      vec3 warmIce = vec3(0.88, 0.80, 0.64);
      vec3 coolDust = vec3(0.62, 0.56, 0.48);
      col = mix(coolDust, warmIce, smoothstep(0.18, 0.52, t) * 0.85 + fineRinglets * 0.15);
    }

    col *= (0.08 + 0.92 * shadow);
    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`;

// 5. HD EARTH SHADERS (5 real NASA textures: day, night lights, specular, normal, clouds + Fresnel)
const EARTH_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const EARTH_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform sampler2D uSpecularMap;
  uniform sampler2D uNormalMap;
  uniform sampler2D uCloudMap;
  uniform float uCloudOffset;
  uniform vec3 uSunDirection;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(uSunDirection);
    vec3 V = normalize(cameraPosition - vWorldPosition);

    vec3 nSample = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
    vec3 upRef = abs(N.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent = normalize(cross(upRef, N));
    vec3 bitangent = normalize(cross(N, tangent));
    vec3 perturbedN = normalize(N + (tangent * nSample.x + bitangent * nSample.y) * 0.16);

    float ndl = dot(perturbedN, L);
    float rawNdl = dot(N, L);

    float dayFactor = smoothstep(-0.08, 0.24, rawNdl);
    float diffuse = ndl > 0.0 ? pow(max(ndl, 0.0001), 0.92) : 0.0;

    vec3 dayTex = texture2D(uDayMap, vUv).rgb;
    vec3 nightTex = texture2D(uNightMap, vUv).rgb;
    float specMask = texture2D(uSpecularMap, vUv).r;

    vec2 cloudShadowUv = vec2(vUv.x - uCloudOffset + 0.0045, clamp(vUv.y - 0.0020, 0.0, 1.0));
    float cloudShadow = texture2D(uCloudMap, cloudShadowUv).a;
    float shadowAtten = 1.0 - smoothstep(0.10, 0.65, cloudShadow) * 0.58 * dayFactor;

    vec3 H = normalize(L + V);
    float ndh = max(dot(perturbedN, H), 0.0);
    float specBroad = ndh > 0.001 ? pow(ndh, 90.0) * 0.05 : 0.0;
    float specSharp = ndh > 0.001 ? pow(ndh, 260.0) * 0.34 : 0.0;
    float spec = (specBroad + specSharp) * specMask * dayFactor * (1.0 - cloudShadow * 0.92);

    float twDelta = (rawNdl - 0.05) / 0.065;
    float twilight = exp(-(twDelta * twDelta));
    vec3 warmSunTint = mix(vec3(1.0), vec3(1.18, 0.88, 0.72), twilight * 0.55);

    float fresnelBase = clamp(1.0 - max(dot(N, V), 0.0), 0.0001, 1.0);
    float fresnel = pow(fresnelBase, 3.6);
    vec3 rimScatter = vec3(0.32, 0.68, 1.0) * fresnel * smoothstep(-0.20, 0.45, rawNdl) * 0.58;

    float nightFactor = smoothstep(0.04, -0.16, rawNdl);
    vec3 cityClamped = max(nightTex - vec3(0.115), vec3(0.0));
    vec3 cityRaw = vec3(
      cityClamped.r > 0.0001 ? pow(cityClamped.r, 1.32) : 0.0,
      cityClamped.g > 0.0001 ? pow(cityClamped.g, 1.32) : 0.0,
      cityClamped.b > 0.0001 ? pow(cityClamped.b, 1.32) : 0.0
    );
    vec3 cityLights = cityRaw * vec3(1.12, 0.84, 0.46) * nightFactor * 3.15;

    vec3 ambientNight = (vec3(0.0025, 0.0048, 0.010) + dayTex * vec3(0.004, 0.007, 0.014)) * (1.0 - dayFactor);

    vec3 dayColor = dayTex * warmSunTint * (0.015 + diffuse * 1.18) * shadowAtten
                  + vec3(1.0, 0.96, 0.90) * spec;
    vec3 finalColor = max(vec3(0.0), dayColor * dayFactor + ambientNight + cityLights + rimScatter);

    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

const CLOUDS_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;

  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CLOUDS_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uCloudMap;
  uniform vec3 uSunDirection;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vWorldNormal;

  void main() {
    vec4 cloudSample = texture2D(uCloudMap, vUv);
    float rawDens = clamp(cloudSample.r * cloudSample.a, 0.0, 1.0);
    if (rawDens < 0.01) discard;
    float density = pow(rawDens, 0.85);

    float rawNdl = dot(normalize(vWorldNormal), normalize(uSunDirection));
    float lit = smoothstep(-0.08, 0.28, rawNdl);

    vec3 nightCloud = vec3(0.004, 0.007, 0.014);
    vec3 dayCloud = vec3(0.96, 0.97, 1.0);
    vec3 cloudColor = mix(nightCloud, dayCloud, lit);
    float ssDelta = (rawNdl - 0.04) / 0.055;
    float sunsetKiss = exp(-(ssDelta * ssDelta)) * smoothstep(-0.04, 0.08, rawNdl);
    cloudColor = mix(cloudColor, vec3(1.0, 0.72, 0.48), sunsetKiss * 0.42);

    float alpha = density * (0.08 + 0.78 * lit) * uOpacity;
    gl_FragColor = vec4(cloudColor, alpha);
  }
`;

const ATMOS_VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const ATMOS_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uSunDirection;
  uniform float uOpacity;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPosition);
    vec3 L = normalize(uSunDirection);

    float viewDot = clamp(dot(-N, V), 0.0, 1.0);
    float limbStep = smoothstep(0.02, 0.56, viewDot);
    float limbFalloff = limbStep > 0.0001 ? pow(limbStep, 3.4) : 0.0;
    float sunSide = smoothstep(-0.30, 0.42, dot(N, L));

    vec3 innerBlue = vec3(0.66, 0.86, 1.0);
    vec3 outerBlue = vec3(0.24, 0.58, 1.0);
    vec3 col = mix(outerBlue, innerBlue, smoothstep(0.15, 0.48, viewDot));

    float alpha = limbFalloff * (0.05 + 0.95 * sunSide) * 0.92 * uOpacity;
    gl_FragColor = vec4(col * alpha * 1.42, alpha);
  }
`;

interface BodyNode {
  info: BodyInfo;
  bodyGroup: THREE.Group;
  spinMesh: THREE.Mesh;
  materials: THREE.ShaderMaterial[];
  ringMaterial?: THREE.ShaderMaterial;
  saturnMainMaterial?: THREE.ShaderMaterial;
  tiltGroup?: THREE.Group;
  extraSpin?: (elapsed: number) => void;
}

export function createSolarSystem(): SolarSystem {
  const group = new THREE.Group();
  const pickables: THREE.Object3D[] = [];
  const nodeMap = new Map<BodyId, BodyNode>();
  const orbitLines: THREE.LineLoop[] = [];
  const jupiterMoonOrbitLines: THREE.LineLoop[] = [];

  const loader = new THREE.TextureLoader();
  const loadTex = (path: string, isSRGB: boolean) => {
    const tex = loader.load(path);
    tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    return tex;
  };

  // Real 2K NASA / Solar System Scope textures (relative paths for GitHub Pages compatibility)
  const texSun = loadTex('./textures/2k_sun.jpg', true);
  const texMercury = loadTex('./textures/2k_mercury.jpg', true);
  const texVenus = loadTex('./textures/2k_venus_atmosphere.jpg', true);
  const texMars = loadTex('./textures/2k_mars.jpg', true);
  const texJupiter = loadTex('./textures/2k_jupiter.jpg', true);
  const texSaturn = loadTex('./textures/2k_saturn.jpg', true);
  const texUranus = loadTex('./textures/2k_uranus.jpg', true);
  const texNeptune = loadTex('./textures/2k_neptune.jpg', true);
  const texMoon = loadTex('./textures/2k_moon.jpg', true);

  const dayMap = loadTex('./textures/earth_atmos_2048.jpg', true);
  const nightMap = loadTex('./textures/earth_lights_2048.png', true);
  const specMap = loadTex('./textures/earth_specular_2048.jpg', false);
  const normalMap = loadTex('./textures/earth_normal_2048.jpg', false);
  const cloudMap = loadTex('./textures/earth_clouds_1024.png', true);

  // 1. SUN AT ORIGIN (0,0,0) WITH 2K PHOTOSPHERE TEXTURE
  const sunInfo = SOLAR_BODIES[0];
  const sunGroup = new THREE.Group();
  const sunMat = new THREE.ShaderMaterial({
    vertexShader: SUN_VERTEX_SHADER,
    fragmentShader: SUN_FRAGMENT_SHADER,
    uniforms: {
      uMap: { value: texSun },
      uTime: { value: 0 },
      uOpacity: { value: 1.0 },
    },
    transparent: false,
    depthWrite: true,
  });
  const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(sunInfo.radius, 72, 72), sunMat);
  sunMesh.userData.bodyId = 'sun';
  sunGroup.add(sunMesh);
  pickables.push(sunMesh);

  // 3D volumetric fiery solar chromosphere / prominence shell
  const sunAtmosMat = new THREE.ShaderMaterial({
    vertexShader: SUN_ATMOS_VERTEX,
    fragmentShader: SUN_ATMOS_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 1.0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  });
  const sunAtmos = new THREE.Mesh(new THREE.SphereGeometry(sunInfo.radius * 1.34, 64, 64), sunAtmosMat);
  sunAtmos.renderOrder = 4;
  sunGroup.add(sunAtmos);

  // 7 Animated 3D Magnetic Solar Prominence / Flare Arches tightly hugging the solar corona
  const prominenceMaterials: THREE.ShaderMaterial[] = [];
  const prominenceSpecs = [
    { lat: 0.22, lon: 0.15, span: 0.36, height: 1.24, thickness: 0.18, phase: 0.0, speed: 0.55 },
    { lat: -0.35, lon: 1.25, span: 0.42, height: 1.32, thickness: 0.21, phase: 1.7, speed: 0.42 },
    { lat: 0.48, lon: 2.35, span: 0.32, height: 1.18, thickness: 0.15, phase: 3.1, speed: 0.68 },
    { lat: -0.18, lon: 3.45, span: 0.44, height: 1.34, thickness: 0.22, phase: 4.4, speed: 0.38 },
    { lat: 0.30, lon: 4.55, span: 0.35, height: 1.22, thickness: 0.17, phase: 5.2, speed: 0.60 },
    { lat: -0.46, lon: 5.40, span: 0.34, height: 1.20, thickness: 0.16, phase: 2.5, speed: 0.50 },
    { lat: 0.08, lon: -0.95, span: 0.38, height: 1.28, thickness: 0.19, phase: 0.9, speed: 0.48 },
  ];

  const sphPoint = (lat: number, lon: number, r: number) =>
    new THREE.Vector3(
      r * Math.cos(lat) * Math.cos(lon),
      r * Math.sin(lat),
      r * Math.cos(lat) * Math.sin(lon),
    );

  for (const spec of prominenceSpecs) {
    const rBase = sunInfo.radius * 0.96;
    const rPeak = sunInfo.radius * spec.height;
    const p0 = sphPoint(spec.lat - spec.span * 0.22, spec.lon - spec.span * 0.5, rBase);
    const p1 = sphPoint(spec.lat - spec.span * 0.10, spec.lon - spec.span * 0.25, rBase + (rPeak - rBase) * 0.82);
    const p2 = sphPoint(spec.lat + 0.05, spec.lon, rPeak);
    const p3 = sphPoint(spec.lat + spec.span * 0.12, spec.lon + spec.span * 0.26, rBase + (rPeak - rBase) * 0.78);
    const p4 = sphPoint(spec.lat + spec.span * 0.22, spec.lon + spec.span * 0.5, rBase);

    const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);
    const tubeGeo = new THREE.TubeGeometry(curve, 40, spec.thickness, 12, false);
    const promMat = new THREE.ShaderMaterial({
      vertexShader: PROMINENCE_VERTEX_SHADER,
      fragmentShader: PROMINENCE_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uPhase: { value: spec.phase },
        uSpeed: { value: spec.speed },
        uOpacity: { value: 1.0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
    const promMesh = new THREE.Mesh(tubeGeo, promMat);
    promMesh.renderOrder = 3;
    sunMesh.add(promMesh); // Attach to sunMesh so arches co-rotate with the solar surface!
    prominenceMaterials.push(promMat);
  }

  const coronaMat = new THREE.ShaderMaterial({
    vertexShader: SUN_CORONA_VERTEX,
    fragmentShader: SUN_CORONA_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 1.0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  // Keep corona quad cleanly inside Mercury's orbit (r=9.5) so it never clips planets
  const sunCorona = new THREE.Mesh(new THREE.PlaneGeometry(18.0, 18.0), coronaMat);
  sunCorona.renderOrder = 5;
  sunGroup.add(sunCorona);
  group.add(sunGroup);

  nodeMap.set('sun', {
    info: sunInfo,
    bodyGroup: sunGroup,
    spinMesh: sunMesh,
    materials: [sunMat, sunAtmosMat, coronaMat],
  });

  const orbitLineMat = new THREE.LineBasicMaterial({
    color: new THREE.Color('#7CC4FF'),
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
  });

  const moonOrbitLineMat = new THREE.LineBasicMaterial({
    color: new THREE.Color('#D8A878'),
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
  });

  const axialTilts: Partial<Record<BodyId, number>> = {
    mercury: 0.03,
    venus: 177.4,
    earth: 23.4,
    mars: 25.2,
    jupiter: 3.1,
    saturn: 26.7,
    uranus: 97.8,
    neptune: 28.3,
  };

  interface TexturedPlanetCfg {
    tex: THREE.Texture;
    rimColor: THREE.Color;
    rimStrength: number;
    bumpStrength: number;
    baseRotY?: number;
  }

  const planetConfigs: Partial<Record<BodyId, TexturedPlanetCfg>> = {
    mercury: { tex: texMercury, rimColor: new THREE.Color('#000000'), rimStrength: 0.0, bumpStrength: 1.35 },
    venus: { tex: texVenus, rimColor: new THREE.Color('#F5C470'), rimStrength: 0.44, bumpStrength: 0.2 },
    mars: { tex: texMars, rimColor: new THREE.Color('#E88254'), rimStrength: 0.28, bumpStrength: 1.15, baseRotY: 1.85 },
    // Orient 2k_jupiter.jpg so the real photographic Great Red Spot sits squarely on the sunlit face!
    jupiter: { tex: texJupiter, rimColor: new THREE.Color('#DEC29B'), rimStrength: 0.22, bumpStrength: 0.15, baseRotY: 2.35 },
    saturn: { tex: texSaturn, rimColor: new THREE.Color('#E6CE98'), rimStrength: 0.24, bumpStrength: 0.10 },
    uranus: { tex: texUranus, rimColor: new THREE.Color('#9AE8F5'), rimStrength: 0.40, bumpStrength: 0.05 },
    neptune: { tex: texNeptune, rimColor: new THREE.Color('#4B8BFF'), rimStrength: 0.46, bumpStrength: 0.12 },
  };

  // 2. BUILD ALL 8 MAIN PLANETS
  for (const info of MAIN_BODIES) {
    if (info.id === 'sun') continue;

    const segments = 160;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * info.orbitRadius, 0, Math.sin(a) * info.orbitRadius));
    }
    const orbitLine = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), orbitLineMat);
    group.add(orbitLine);
    orbitLines.push(orbitLine);

    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(
      Math.cos(info.initialAngle) * info.orbitRadius,
      0,
      Math.sin(info.initialAngle) * info.orbitRadius,
    );
    group.add(bodyGroup);

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = THREE.MathUtils.degToRad(axialTilts[info.id] ?? 0);
    bodyGroup.add(tiltGroup);

    if (info.id === 'earth') {
      const earthMat = new THREE.ShaderMaterial({
        vertexShader: EARTH_VERTEX_SHADER,
        fragmentShader: EARTH_FRAGMENT_SHADER,
        uniforms: {
          uDayMap: { value: dayMap },
          uNightMap: { value: nightMap },
          uSpecularMap: { value: specMap },
          uNormalMap: { value: normalMap },
          uCloudMap: { value: cloudMap },
          uCloudOffset: { value: 0.0 },
          uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
          uOpacity: { value: 1.0 },
        },
        transparent: false,
        depthWrite: true,
      });
      const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(info.radius, 88, 88), earthMat);
      earthMesh.rotation.y = -2.2;
      earthMesh.userData.bodyId = 'earth';
      tiltGroup.add(earthMesh);
      pickables.push(earthMesh);

      const cloudsMat = new THREE.ShaderMaterial({
        vertexShader: CLOUDS_VERTEX_SHADER,
        fragmentShader: CLOUDS_FRAGMENT_SHADER,
        uniforms: {
          uCloudMap: { value: cloudMap },
          uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
          uOpacity: { value: 1.0 },
        },
        transparent: true,
        depthWrite: false,
      });
      const cloudsMesh = new THREE.Mesh(
        new THREE.SphereGeometry(info.radius * 1.012, 72, 72),
        cloudsMat,
      );
      cloudsMesh.rotation.y = -2.0;
      cloudsMesh.renderOrder = 2;
      tiltGroup.add(cloudsMesh);

      const atmosMat = new THREE.ShaderMaterial({
        vertexShader: ATMOS_VERTEX_SHADER,
        fragmentShader: ATMOS_FRAGMENT_SHADER,
        uniforms: {
          uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
          uOpacity: { value: 1.0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const atmosMesh = new THREE.Mesh(
        new THREE.SphereGeometry(info.radius * 1.088, 72, 72),
        atmosMat,
      );
      atmosMesh.renderOrder = 4;
      tiltGroup.add(atmosMesh);

      // Real 2K Lunar texture for Earth's Moon!
      const moonMat = new THREE.ShaderMaterial({
        vertexShader: TEXTURED_PLANET_VERTEX,
        fragmentShader: TEXTURED_PLANET_FRAGMENT,
        uniforms: {
          uMap: { value: texMoon },
          uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
          uRimColor: { value: new THREE.Color('#000000') },
          uRimStrength: { value: 0.0 },
          uBumpStrength: { value: 1.3 },
          uOpacity: { value: 1.0 },
          uHasRingShadow: { value: 0 },
          uPlanetCenter: { value: new THREE.Vector3() },
          uRingNormal: { value: new THREE.Vector3(0, 1, 0) },
          uRingInner: { value: 0 },
          uRingOuter: { value: 0 },
        },
        transparent: false,
        depthWrite: true,
      });
      const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.26, 40, 40), moonMat);
      moonMesh.position.set(2.6, 0.32, 1.2);
      bodyGroup.add(moonMesh);

      nodeMap.set('earth', {
        info,
        bodyGroup,
        spinMesh: earthMesh,
        materials: [earthMat, cloudsMat, atmosMat, moonMat],
        extraSpin: (elapsed: number) => {
          const eRot = -2.2 + elapsed * 0.06;
          const cRot = -2.0 + elapsed * 0.082;
          earthMesh.rotation.y = eRot;
          cloudsMesh.rotation.y = cRot;
          earthMat.uniforms.uCloudOffset.value = (cRot - eRot) / (Math.PI * 2);
          const moonAngle = 2.35 + elapsed * 0.12;
          moonMesh.position.set(Math.cos(moonAngle) * 2.6, 0.32, Math.sin(moonAngle) * 2.6);
        },
      });
    } else {
      const cfg = planetConfigs[info.id]!;
      const isSaturn = info.id === 'saturn';
      const innerR = isSaturn ? info.radius * 1.32 : info.radius * 1.45;
      const outerR = isSaturn ? info.radius * 2.48 : info.radius * 1.92;

      const pMat = new THREE.ShaderMaterial({
        vertexShader: TEXTURED_PLANET_VERTEX,
        fragmentShader: TEXTURED_PLANET_FRAGMENT,
        uniforms: {
          uMap: { value: cfg.tex },
          uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
          uRimColor: { value: cfg.rimColor },
          uRimStrength: { value: cfg.rimStrength },
          uBumpStrength: { value: cfg.bumpStrength },
          uOpacity: { value: 1.0 },
          uHasRingShadow: { value: isSaturn ? 1 : 0 },
          uPlanetCenter: { value: new THREE.Vector3() },
          uRingNormal: { value: new THREE.Vector3(0, 1, 0) },
          uRingInner: { value: innerR },
          uRingOuter: { value: outerR },
        },
        transparent: false,
        depthWrite: true,
      });

      const mesh = new THREE.Mesh(new THREE.SphereGeometry(info.radius, 80, 80), pMat);
      if (info.id === 'jupiter') mesh.scale.set(1.0, 0.94, 1.0);
      if (info.id === 'saturn') mesh.scale.set(1.0, 0.91, 1.0);
      if (cfg.baseRotY !== undefined) mesh.rotation.y = cfg.baseRotY;
      mesh.userData.bodyId = info.id;
      tiltGroup.add(mesh);
      pickables.push(mesh);

      const mats: THREE.ShaderMaterial[] = [pMat];
      let ringMaterial: THREE.ShaderMaterial | undefined;

      if (info.id === 'saturn' || info.id === 'uranus') {
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 128);
        ringMaterial = new THREE.ShaderMaterial({
          vertexShader: RING_VERTEX_SHADER,
          fragmentShader: RING_FRAGMENT_SHADER,
          uniforms: {
            uInnerRadius: { value: innerR },
            uOuterRadius: { value: outerR },
            uPlanetRadius: { value: info.radius },
            uPlanetCenter: { value: new THREE.Vector3() },
            uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
            uIsUranus: { value: info.id === 'uranus' ? 1 : 0 },
            uOpacity: { value: 1.0 },
          },
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.renderOrder = 3;
        tiltGroup.add(ringMesh);
        mats.push(ringMaterial);
      }

      nodeMap.set(info.id, {
        info,
        bodyGroup,
        spinMesh: mesh,
        materials: mats,
        ringMaterial,
        saturnMainMaterial: isSaturn ? pMat : undefined,
        tiltGroup,
      });
    }
  }

  // 3. BUILD THE 4 GALILEAN MOONS ORBITING JUPITER (Io, Europa, Ganymede, Callisto)
  const jupiterNode = nodeMap.get('jupiter')!;
  const moonTypeMap: Record<string, number> = {
    io: 0,
    europa: 1,
    ganymede: 2,
    callisto: 3,
  };

  for (const mInfo of GALILEAN_MOONS) {
    // Hairline orbital ring around Jupiter
    const segs = 96;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * mInfo.orbitRadius, 0, Math.sin(a) * mInfo.orbitRadius));
    }
    const mOrbitLine = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      moonOrbitLineMat,
    );
    jupiterNode.bodyGroup.add(mOrbitLine);
    jupiterMoonOrbitLines.push(mOrbitLine);

    const moonGroup = new THREE.Group();
    moonGroup.position.set(
      Math.cos(mInfo.initialAngle) * mInfo.orbitRadius,
      0,
      Math.sin(mInfo.initialAngle) * mInfo.orbitRadius,
    );
    jupiterNode.bodyGroup.add(moonGroup);

    const mMat = new THREE.ShaderMaterial({
      vertexShader: GALILEAN_VERTEX_SHADER,
      fragmentShader: GALILEAN_FRAGMENT_SHADER,
      uniforms: {
        uMoonType: { value: moonTypeMap[mInfo.id] ?? 0 },
        uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
        uOpacity: { value: 1.0 },
      },
      transparent: false,
      depthWrite: true,
    });

    const mMesh = new THREE.Mesh(new THREE.SphereGeometry(mInfo.radius, 48, 48), mMat);
    mMesh.userData.bodyId = mInfo.id;
    moonGroup.add(mMesh);
    pickables.push(mMesh);

    nodeMap.set(mInfo.id, {
      info: mInfo,
      bodyGroup: moonGroup,
      spinMesh: mMesh,
      materials: [mMat],
    });
  }

  // 4. CIRCULAR ANTI-ALIASED ASTEROID BELT BETWEEN MARS AND JUPITER
  const ASTEROID_COUNT = 1600;
  const astGeo = new THREE.BufferGeometry();
  const astPos = new Float32Array(ASTEROID_COUNT * 3);
  const astCol = new Float32Array(ASTEROID_COUNT * 3);
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < ASTEROID_COUNT; i++) {
    const i3 = i * 3;
    const angle = rand() * Math.PI * 2;
    const r = 32.5 + rand() * 5.8;
    const y = (rand() - 0.5) * 1.25;
    astPos[i3] = Math.cos(angle) * r;
    astPos[i3 + 1] = y;
    astPos[i3 + 2] = Math.sin(angle) * r;
    const shade = 0.36 + rand() * 0.24;
    astCol[i3] = shade * 1.06;
    astCol[i3 + 1] = shade;
    astCol[i3 + 2] = shade * 0.92;
  }
  astGeo.setAttribute('position', new THREE.BufferAttribute(astPos, 3));
  astGeo.setAttribute('color', new THREE.BufferAttribute(astCol, 3));
  const astMat = new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float dist = max(2.0, -mvPosition.z);
        float nearFade = smoothstep(3.5, 14.0, dist);
        vAlpha = uOpacity * nearFade;
        gl_PointSize = clamp(24.0 / dist, 1.2, 4.2);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float r = length(uv) * 2.0;
        if (r > 1.0) discard;
        float alpha = smoothstep(1.0, 0.25, r) * vAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    uniforms: {
      uOpacity: { value: 0.55 },
    },
    vertexColors: true,
    transparent: true,
    depthWrite: false,
  });
  const asteroidBelt = new THREE.Points(astGeo, astMat);
  group.add(asteroidBelt);

  const tmpWorld = new THREE.Vector3();
  const tmpSunDir = new THREE.Vector3();
  const tmpRingNormal = new THREE.Vector3();
  const tmpQuat = new THREE.Quaternion();
  let orbitFade = 1.0;
  let jupMoonOrbitFade = 0.0;

  const getBodyWorldPosition = (id: BodyId, target: THREE.Vector3): THREE.Vector3 => {
    const node = nodeMap.get(id);
    if (!node) return target.set(0, 0, 0);
    // Compute unscaled logical position so camera flights during macro-bloom never jump
    if (node.info.parent) {
      const parentNode = nodeMap.get(node.info.parent);
      if (parentNode) {
        return target.copy(parentNode.bodyGroup.position).add(node.bodyGroup.position);
      }
    }
    return target.copy(node.bodyGroup.position);
  };

  const getBodyInfo = (id: BodyId): BodyInfo => {
    return SOLAR_BODIES.find((b) => b.id === id) ?? SOLAR_BODIES[0];
  };

  const update = (
    elapsed: number,
    visibility: number,
    camera: THREE.Camera,
    showOrbits = true,
    showJupiterMoonOrbits = false,
  ) => {
    group.visible = visibility > 0.002;
    // Blossom smoothly from the glowing Sol point (0.012 -> 1.0) during Galaxy <-> Solar System dive!
    const bloomScale = visibility >= 0.995 ? 1.0 : 0.012 + 0.988 * Math.pow(Math.max(visibility, 0.0001), 2.1);
    group.scale.setScalar(bloomScale);

    sunMat.uniforms.uTime.value = elapsed;
    sunMat.uniforms.uOpacity.value = visibility;
    sunAtmosMat.uniforms.uTime.value = elapsed;
    sunAtmosMat.uniforms.uOpacity.value = visibility;
    coronaMat.uniforms.uTime.value = elapsed;
    coronaMat.uniforms.uOpacity.value = visibility;
    for (const pm of prominenceMaterials) {
      pm.uniforms.uTime.value = elapsed;
      pm.uniforms.uOpacity.value = visibility;
    }
    sunMesh.rotation.y = elapsed * 0.025;
    sunCorona.quaternion.copy(camera.quaternion);

    const targetOrbitFade = showOrbits ? 1.0 : 0.0;
    orbitFade += (targetOrbitFade - orbitFade) * 0.14;
    orbitLineMat.opacity = 0.15 * visibility * orbitFade;
    for (const line of orbitLines) {
      line.visible = orbitLineMat.opacity > 0.004;
    }

    const targetJupFade = showJupiterMoonOrbits ? 1.0 : 0.0;
    jupMoonOrbitFade += (targetJupFade - jupMoonOrbitFade) * 0.14;
    moonOrbitLineMat.opacity = 0.24 * visibility * jupMoonOrbitFade;
    for (const line of jupiterMoonOrbitLines) {
      line.visible = moonOrbitLineMat.opacity > 0.004;
    }

    astMat.uniforms.uOpacity.value = (showOrbits ? 0.58 : 0.25) * visibility;
    asteroidBelt.rotation.y = elapsed * 0.005;

    // Update main planets first so Jupiter's world matrix is current before its moons
    for (const info of MAIN_BODIES) {
      if (info.id === 'sun') continue;
      const node = nodeMap.get(info.id)!;

      const angle = info.initialAngle + elapsed * info.orbitSpeed * 0.28;
      node.bodyGroup.position.set(
        Math.cos(angle) * info.orbitRadius,
        0,
        Math.sin(angle) * info.orbitRadius,
      );

      if (node.extraSpin) {
        node.extraSpin(elapsed);
      } else {
        const baseY = planetConfigs[info.id]?.baseRotY ?? 0;
        node.spinMesh.rotation.y =
          baseY + elapsed * (info.id === 'jupiter' || info.id === 'saturn' ? 0.09 : 0.05);
      }

      node.bodyGroup.getWorldPosition(tmpWorld);
      tmpSunDir.copy(tmpWorld).negate().normalize();

      for (const mat of node.materials) {
        if (mat.uniforms.uSunDirection) mat.uniforms.uSunDirection.value.copy(tmpSunDir);
        if (mat.uniforms.uOpacity) mat.uniforms.uOpacity.value = visibility;
      }

      if (node.ringMaterial) {
        node.ringMaterial.uniforms.uPlanetCenter.value.copy(tmpWorld);
      }
      if (node.saturnMainMaterial && node.tiltGroup) {
        node.saturnMainMaterial.uniforms.uPlanetCenter.value.copy(tmpWorld);
        node.tiltGroup.getWorldQuaternion(tmpQuat);
        tmpRingNormal.set(0, 1, 0).applyQuaternion(tmpQuat).normalize();
        node.saturnMainMaterial.uniforms.uRingNormal.value.copy(tmpRingNormal);
      }
    }

    // Update the 4 Galilean moons orbiting Jupiter
    jupiterNode.bodyGroup.updateWorldMatrix(true, false);
    for (const mInfo of GALILEAN_MOONS) {
      const mNode = nodeMap.get(mInfo.id)!;
      const angle = mInfo.initialAngle + elapsed * mInfo.orbitSpeed * 0.35;
      mNode.bodyGroup.position.set(
        Math.cos(angle) * mInfo.orbitRadius,
        0,
        Math.sin(angle) * mInfo.orbitRadius,
      );
      mNode.spinMesh.rotation.y = -angle; // Tidally locked to Jupiter!

      mNode.bodyGroup.getWorldPosition(tmpWorld);
      tmpSunDir.copy(tmpWorld).negate().normalize();
      for (const mat of mNode.materials) {
        if (mat.uniforms.uSunDirection) mat.uniforms.uSunDirection.value.copy(tmpSunDir);
        if (mat.uniforms.uOpacity) mat.uniforms.uOpacity.value = visibility;
      }
    }
  };

  return {
    group,
    bodies: SOLAR_BODIES,
    pickables,
    getBodyWorldPosition,
    getBodyInfo,
    update,
  };
}
