import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createGalaxySystem } from './galaxy';
import {
  createSolarSystem,
  GALILEAN_MOONS,
  MAIN_BODIES,
  SOLAR_BODIES,
  type BodyId,
} from './solarSystem';

type ViewMode = 'galaxy' | 'solar' | 'body';

const canvas = document.getElementById('scene') as HTMLCanvasElement;
const locationLabel = document.getElementById('location-label') as HTMLElement;
const distanceReadout = document.getElementById('distance-readout') as HTMLElement;
const planetBar = document.getElementById('planet-bar') as HTMLElement;
const moonBar = document.getElementById('moon-bar') as HTMLElement;
const scaleButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.scale-btn'));

const bodyCard = document.getElementById('body-card') as HTMLElement;
const cardDot = document.getElementById('card-dot') as HTMLElement;
const cardName = document.getElementById('card-name') as HTMLElement;
const cardSummary = document.getElementById('card-summary') as HTMLElement;
const cardDistance = document.getElementById('card-distance') as HTMLElement;
const cardRadius = document.getElementById('card-radius') as HTMLElement;
const cardPeriod = document.getElementById('card-period') as HTMLElement;

const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(pixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.02;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#020308');

const camera = new THREE.PerspectiveCamera(
  44,
  window.innerWidth / window.innerHeight,
  0.05,
  2600,
);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.40,
  0.40,
  0.78,
);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

// Cosmic systems
const galaxy = createGalaxySystem(pixelRatio);
const solarSystem = createSolarSystem();

scene.add(galaxy.skyBackdrop);
scene.add(galaxy.backgroundStars);
scene.add(galaxy.group);
scene.add(galaxy.localStars);
scene.add(galaxy.solBeacon);
scene.add(solarSystem.group);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.enablePan = false;
controls.minDistance = 1.4;
controls.maxDistance = 260;

// Build planet selector pills (Sun + 8 planets) & Galilean moons sub-bar
const planetButtons = new Map<BodyId, HTMLButtonElement>();
for (const body of MAIN_BODIES) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'planet-pill';
  btn.dataset.body = body.id;

  const dot = document.createElement('span');
  dot.className = 'planet-pill-dot';
  dot.style.background = body.accent;

  const text = document.createTextNode(body.name);
  btn.append(dot, text);

  btn.addEventListener('click', () => focusBody(body.id));
  planetBar.appendChild(btn);
  planetButtons.set(body.id, btn);
}

const moonLabel = document.createElement('span');
moonLabel.className = 'moon-bar-label';
moonLabel.textContent = 'LUNES GALILÉENNES';
moonBar.appendChild(moonLabel);

for (const moon of GALILEAN_MOONS) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'planet-pill';
  btn.dataset.body = moon.id;

  const dot = document.createElement('span');
  dot.className = 'planet-pill-dot';
  dot.style.background = moon.accent;

  const text = document.createTextNode(moon.name);
  btn.append(dot, text);

  btn.addEventListener('click', () => focusBody(moon.id));
  moonBar.appendChild(btn);
  planetButtons.set(moon.id, btn);
}

// View state & smooth camera flight controller
let currentMode: ViewMode = 'galaxy';
let focusedBody: BodyId | null = null;

// Macro-scale factor: 0 = Milky Way, 1 = inside Solar System
let macroT = 0;
let targetMacroT = 0;

// Smooth camera flight interpolation
interface CameraFlight {
  active: boolean;
  startTime: number;
  duration: number;
  startPos: THREE.Vector3;
  startTarget: THREE.Vector3;
  endPos: THREE.Vector3;
  endTarget: THREE.Vector3;
  startMacroT: number;
  endMacroT: number;
}

const flight: CameraFlight = {
  active: false,
  startTime: 0,
  duration: 2.2,
  startPos: new THREE.Vector3(),
  startTarget: new THREE.Vector3(),
  endPos: new THREE.Vector3(),
  endTarget: new THREE.Vector3(),
  startMacroT: 0,
  endMacroT: 0,
};

const galaxyCenterTarget = galaxy.orionOffset.clone().negate();
const lastTrackedBodyPos = new THREE.Vector3();
const tmpBodyPos = new THREE.Vector3();
const tmpDelta = new THREE.Vector3();

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function getGalaxyPose(): { pos: THREE.Vector3; target: THREE.Vector3 } {
  const dist = 116;
  const phi = THREE.MathUtils.degToRad(52);
  const theta = THREE.MathUtils.degToRad(-24);
  const sinPhi = Math.sin(phi);
  return {
    target: galaxyCenterTarget.clone(),
    pos: new THREE.Vector3(
      galaxyCenterTarget.x + dist * sinPhi * Math.sin(theta),
      galaxyCenterTarget.y + dist * Math.cos(phi),
      galaxyCenterTarget.z + dist * sinPhi * Math.cos(theta),
    ),
  };
}

function getSolarOverviewPose(): { pos: THREE.Vector3; target: THREE.Vector3 } {
  // Generous 3/4 panoramic view so Neptune's entire outer orbit clears the bottom planet bar
  return {
    target: new THREE.Vector3(0, -11.5, 0),
    pos: new THREE.Vector3(0, 82, 152),
  };
}

function getBodyPose(id: BodyId): { pos: THREE.Vector3; target: THREE.Vector3 } {
  const info = solarSystem.getBodyInfo(id);
  const bodyPos = solarSystem.getBodyWorldPosition(id, new THREE.Vector3());

  // Slight downward target offset lifts the planet gently above the bottom planet bar
  const target = bodyPos.clone().add(new THREE.Vector3(0, -info.radius * (id === 'saturn' ? 0.42 : 0.18), 0));

  // Generous distance for Saturn rings & Jupiter Galilean system
  const distMultiplier =
    id === 'saturn' ? 6.2 : id === 'jupiter' ? 4.4 : id === 'sun' ? 4.0 : 3.8;
  const dist = info.radius * distMultiplier;

  if (id === 'sun') {
    return {
      target,
      pos: bodyPos.clone().add(new THREE.Vector3(dist * 0.45, dist * 0.25, dist * 0.85)),
    };
  }

  // Position camera at ~82° grazing angle relative to the Sun vector -> guaranteed dramatic day/night terminator!
  const toSun = bodyPos.clone().negate().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const tangent = new THREE.Vector3().crossVectors(up, toSun).normalize();

  // Blend slightly behind tangent so ~55% sunlit + ~45% night hemisphere with glowing city lights / ring shadow
  const camDir = tangent
    .clone()
    .multiplyScalar(0.95)
    .addScaledVector(toSun, 0.16)
    .addScaledVector(up, id === 'saturn' ? 0.34 : 0.18)
    .normalize();

  return {
    target,
    pos: bodyPos.clone().addScaledVector(camDir, dist),
  };
}

function startFlight(
  endPos: THREE.Vector3,
  endTarget: THREE.Vector3,
  endMacroT: number,
  duration: number,
) {
  flight.active = true;
  flight.startTime = performance.now() * 0.001;
  flight.duration = duration;
  flight.startPos.copy(camera.position);
  flight.startTarget.copy(controls.target);
  flight.endPos.copy(endPos);
  flight.endTarget.copy(endTarget);
  flight.startMacroT = macroT;
  flight.endMacroT = endMacroT;
  targetMacroT = endMacroT;
}

function isJupiterFamily(id: BodyId | null): boolean {
  return id === 'jupiter' || id === 'io' || id === 'europa' || id === 'ganymede' || id === 'callisto';
}

function updateUI() {
  const showSolarBar = currentMode === 'solar' || currentMode === 'body';
  planetBar.dataset.visible = String(showSolarBar);
  moonBar.dataset.visible = String(currentMode === 'body' && isJupiterFamily(focusedBody));

  for (const btn of scaleButtons) {
    const mode = btn.dataset.mode;
    const active =
      (mode === 'galaxy' && currentMode === 'galaxy') ||
      (mode === 'solar' && currentMode === 'solar') ||
      (mode === 'earth' && currentMode === 'body' && focusedBody === 'earth');
    btn.dataset.active = String(active);
  }

  for (const [id, btn] of planetButtons.entries()) {
    const isActive =
      currentMode === 'body' &&
      (focusedBody === id || (id === 'jupiter' && isJupiterFamily(focusedBody)));
    btn.dataset.active = String(isActive);
  }

  if (currentMode === 'galaxy') {
    locationLabel.textContent = 'VOIE LACTÉE';
    distanceReadout.textContent = '52 000 al';
    bodyCard.dataset.visible = 'false';
  } else if (currentMode === 'solar') {
    locationLabel.textContent = 'SYSTÈME SOLAIRE';
    distanceReadout.textContent = '8 PLANÈTES · 30 UA';
    bodyCard.dataset.visible = 'false';
  } else if (focusedBody) {
    const info = solarSystem.getBodyInfo(focusedBody);
    locationLabel.textContent = info.name.toUpperCase();
    distanceReadout.textContent = info.distanceLabel;

    cardDot.style.background = info.accent;
    cardName.textContent = info.name;
    cardSummary.textContent = info.summary;
    cardDistance.textContent = info.distanceLabel;
    cardRadius.textContent = info.radiusLabel;
    cardPeriod.textContent = info.periodLabel;
    bodyCard.dataset.visible = 'true';
  }
}

function goToGalaxy(instant = false) {
  currentMode = 'galaxy';
  focusedBody = null;
  controls.minDistance = 24;
  controls.maxDistance = 240;
  const pose = getGalaxyPose();
  if (instant) {
    flight.active = false;
    macroT = 0;
    targetMacroT = 0;
    camera.position.copy(pose.pos);
    controls.target.copy(pose.target);
    camera.lookAt(pose.target);
  } else {
    startFlight(pose.pos, pose.target, 0, 3.2);
  }
  updateUI();
}

function goToSolarSystem(instant = false) {
  const fromGalaxy = macroT < 0.5;
  currentMode = 'solar';
  focusedBody = null;
  controls.minDistance = 12;
  controls.maxDistance = 240;
  const pose = getSolarOverviewPose();
  if (instant) {
    flight.active = false;
    macroT = 1;
    targetMacroT = 1;
    camera.position.copy(pose.pos);
    controls.target.copy(pose.target);
    camera.lookAt(pose.target);
  } else {
    startFlight(pose.pos, pose.target, 1, fromGalaxy ? 3.4 : 1.9);
  }
  updateUI();
}

function focusBody(id: BodyId, instant = false) {
  const fromGalaxy = macroT < 0.5;
  currentMode = 'body';
  focusedBody = id;
  const info = solarSystem.getBodyInfo(id);
  controls.minDistance = info.radius * 1.75;
  controls.maxDistance = Math.max(40, info.radius * 28);

  const pose = getBodyPose(id);
  solarSystem.getBodyWorldPosition(id, lastTrackedBodyPos);

  if (instant) {
    flight.active = false;
    macroT = 1;
    targetMacroT = 1;
    camera.position.copy(pose.pos);
    controls.target.copy(pose.target);
    camera.lookAt(pose.target);
  } else {
    startFlight(pose.pos, pose.target, 1, fromGalaxy ? 3.8 : 1.75);
  }
  updateUI();
}

// Wire scale buttons
for (const btn of scaleButtons) {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (mode === 'galaxy') goToGalaxy();
    else if (mode === 'solar') goToSolarSystem();
    else if (mode === 'earth') focusBody('earth');
  });
}

// Keyboard shortcuts: Space toggles Galaxy <-> Solar System, Escape returns to Solar System
window.addEventListener('keydown', (e) => {
  if (e.target !== document.body) return;
  if (e.code === 'Space') {
    e.preventDefault();
    if (currentMode === 'galaxy') goToSolarSystem();
    else if (currentMode === 'solar') focusBody('earth');
    else goToSolarSystem();
  } else if (e.code === 'Escape' && currentMode === 'body') {
    goToSolarSystem();
  }
});

// 3D Raycasting: click directly on any planet or the Sun to fly to it!
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerDownPos = { x: 0, y: 0 };

function updatePointer(e: PointerEvent) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

canvas.addEventListener('pointerdown', (e) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('pointermove', (e) => {
  if (macroT < 0.7) {
    canvas.dataset.hover = 'false';
    return;
  }
  updatePointer(e);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(solarSystem.pickables, false);
  canvas.dataset.hover = String(hits.length > 0);
});

canvas.addEventListener('pointerup', (e) => {
  if (macroT < 0.7) return;
  const dx = e.clientX - pointerDownPos.x;
  const dy = e.clientY - pointerDownPos.y;
  if (dx * dx + dy * dy > 25) return; // Ignore orbit drags

  updatePointer(e);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(solarSystem.pickables, false);
  if (hits.length > 0) {
    const id = hits[0].object.userData.bodyId as BodyId | undefined;
    if (id) focusBody(id);
  }
});

// Initialize positions before reading URL query (?view=galaxy|solar|saturn|earth|...)
solarSystem.update(0, 1, camera);

const params = new URLSearchParams(window.location.search);
const viewParam = params.get('view') as ('galaxy' | 'solar' | BodyId) | null;
if (viewParam === 'solar') {
  goToSolarSystem(true);
} else if (viewParam && SOLAR_BODIES.some((b) => b.id === viewParam)) {
  focusBody(viewParam as BodyId, true);
} else {
  goToGalaxy(true);
}

window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloomPass.setSize(w, h);
});

const startTime = performance.now() * 0.001;

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now() * 0.001;
  const elapsed = now - startTime;

  // Update Solar System first so live planet & Galilean moon world positions are up-to-date
  const solarVisibility = smoothstep(0.45, 0.85, macroT);
  const showJupMoonOrbits = currentMode === 'body' && focusedBody === 'jupiter';
  solarSystem.update(elapsed, solarVisibility, camera, currentMode === 'solar', showJupMoonOrbits);

  if (flight.active) {
    const raw = Math.min(1, (now - flight.startTime) / flight.duration);
    const eased = easeInOutCubic(raw);

    macroT = THREE.MathUtils.lerp(flight.startMacroT, flight.endMacroT, eased);

    // Keep flight destination locked onto the moving planet if targeting a body
    if (currentMode === 'body' && focusedBody) {
      const livePose = getBodyPose(focusedBody);
      flight.endPos.copy(livePose.pos);
      flight.endTarget.copy(livePose.target);
    }

    camera.position.lerpVectors(flight.startPos, flight.endPos, eased);
    controls.target.lerpVectors(flight.startTarget, flight.endTarget, eased);
    camera.lookAt(controls.target);

    if (raw >= 1) {
      flight.active = false;
      macroT = targetMacroT;
      if (currentMode === 'body' && focusedBody) {
        solarSystem.getBodyWorldPosition(focusedBody, lastTrackedBodyPos);
      }
      // Flush OrbitControls damping inertia so arrival never jumps/snaps
      controls.enableDamping = false;
      controls.update();
      controls.enableDamping = true;
    }
  } else {
    // Co-move camera smoothly with focused planet's orbital motion while preserving user OrbitControls!
    if (currentMode === 'body' && focusedBody && focusedBody !== 'sun') {
      solarSystem.getBodyWorldPosition(focusedBody, tmpBodyPos);
      tmpDelta.subVectors(tmpBodyPos, lastTrackedBodyPos);
      camera.position.add(tmpDelta);
      controls.target.add(tmpDelta);
      lastTrackedBodyPos.copy(tmpBodyPos);
    }
    controls.update();
  }

  // Dial bloom cleanly between galaxy, solar overview, and close-up planet inspection
  const targetBloom =
    currentMode === 'galaxy' ? 0.42 : currentMode === 'solar' ? 0.34 : focusedBody === 'sun' ? 0.32 : 0.22;
  bloomPass.strength = THREE.MathUtils.lerp(bloomPass.strength, targetBloom, 0.08);

  // Galaxy zooms & fades smoothly as macroT goes 0 -> 1
  galaxy.update(elapsed, macroT, camera);

  composer.render();
}

animate();
