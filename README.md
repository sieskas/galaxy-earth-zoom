# Milky Way → Solar System → Earth (Three.js + GLSL)

Interactive 3D web experience built with **Vite + TypeScript + Three.js + custom GLSL shaders**, iteratively refined through an automated **Generator–Evaluator** visual QA loop.

**Live Demo:** https://www.romain-godard.com/demos/galaxy/index.html

## Features

- **Spiral Milky Way**: 175,000 anti-aliased stars (zero sub-pixel shimmer), Gaussian volumetric gas clouds, dark dust lanes, golden-amber galactic bar, and `#020308` linear-calibrated deep space.
- **Full Solar System**:
  - **Living Sun**: 3D Voronoi cellular lava/plasma granulation (NASA DKIST / SDO inspired), sunspots, additive magnetic filaments, volumetric 3D chromosphere, and **7 animated 3D solar prominence flare arches**.
  - **All 8 Planets with real 2K textures**: Mercury, Venus, Earth (5 HD textures: day, city night lights, clouds + cast shadows, normal, ocean specular + Fresnel limb + Moon), Mars, Jupiter, Saturn (Cassini Division rings + analytic shadows), Uranus (97.8° axial tilt + icy rings), and Neptune.
  - **4 Galilean Moons** orbiting Jupiter: **Io, Europa, Ganymede, and Callisto** (clickable & explorable).
  - **Asteroid Belt** between Mars and Jupiter.
- **Cinematic Navigation**:
  - Scale switcher (`Milky Way` | `Solar System` | `Earth`), planet bar, Galilean moons sub-bar, and **direct 3D click** on any celestial body.
  - Shortcuts: `Space` (switch scale), `Esc` (return to Solar System), mouse (orbit + zoom).
  - Direct deep links: `?view=galaxy`, `?view=solar`, `?view=sun`, `?view=saturn`, `?view=jupiter`, `?view=io`, `?view=earth`, `?view=mars`, etc.

## Local Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Texture Credits

- 2K planetary textures: [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0) & NASA / Three.js examples.
