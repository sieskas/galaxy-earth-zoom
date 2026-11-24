# Milky Way → Solar System → Earth (Three.js + GLSL)

Expérience web 3D interactive construite avec **Vite + TypeScript + Three.js + shaders GLSL custom** et validée par une boucle visuelle **Generator – Evaluator**.

## Fonctionnalités

- **Voie Lactée spirale** : 175 000 étoiles anti-aliasées (zéro scintillement sous-pixel), gaz volumétrique gaussien, bandes de poussières sombres, cœur doré-ambré et ciel profond `#020308`.
- **Système Solaire complet** :
  - **Soleil vivant** : granulation cellulaire Voronoi 3D lave/plasma (façon NASA DKIST / SDO), taches solaires, filaments magnétiques additifs, chromosphère 3D volumétrique et **7 arches d'éruptions solaires 3D animées**.
  - **8 planètes en textures 2K réelles** : Mercure, Vénus, Terre (5 textures HD : jour, nuit/villes, nuages + ombres portées, relief, spéculaire + halo Fresnel + Lune), Mars, Jupiter, Saturne (anneaux avec division de Cassini + ombre réelle), Uranus (inclinée à 97,8° + anneaux) et Neptune.
  - **4 lunes galiléennes** en orbite autour de Jupiter : **Io, Europe, Ganymède et Callisto** (cliquables et explorables).
  - **Ceinture d'astéroïdes** entre Mars et Jupiter.
- **Navigation cinématique** :
  - Sélecteur d'échelle (`Voie Lactée` | `Système Solaire` | `Terre`), barre des planètes, sous-barre des lunes galiléennes et **clic direct en 3D** sur n'importe quel astre.
  - Raccourcis : `Espace` (changer d'échelle), `Échap` (retour Système Solaire), souris (orbite + zoom).
  - Accès direct par URL : `?view=galaxy`, `?view=solar`, `?view=sun`, `?view=saturn`, `?view=jupiter`, `?view=io`, `?view=earth`, `?view=mars`, etc.

## Lancer en local

```bash
npm install
npm run dev
```

Build de production :

```bash
npm run build
```

## Crédits textures

- Textures planétaires 2K : [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0) & NASA / Three.js examples.
