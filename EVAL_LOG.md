# EVAL_LOG.md — Suivi Generator / Evaluator (Galaxie → Terre)

## Cycle 1 — Score : 46 / 100 (ÉCHEC CRITIQUE < 70 %)

- **Réalisme de la galaxie & lumière :** 7 / 20
- **Fluidité & crédibilité du zoom multi-échelle :** 6 / 20
- **Photoréalisme de la Terre, nuages, nuit & atmosphère :** 7 / 20
- **Cinématique, post-processing & sobriété UI :** 9 / 20
- **Stabilité technique :** 17 / 20 (0 erreur console, 48/48 requêtes OK)

### 3 pires défauts visuels identifiés (à refondre au Cycle 2)
1. **Bulle d'atmosphère à bord dur (vues 3 & 4) :** Le shader `BackSide` ne tendait pas vers `alpha = 0` à la silhouette externe, créant un anneau détaché autour de la Terre.
2. **Absence de terminateur jour/nuit et de lumières urbaines + spéculaire plastique (vue 4) :** Le Soleil était presque aligné derrière la caméra → hémisphère entièrement éclairé de face, zéro villes nocturnes, reflet océan trop large, et chevauchement du HUD en bas du globe.
3. **Cœur galactique brûlé + bokeh flou + ciel vide à l'approche (vues 1–3) :** Surcharge additive au centre (clipping `#FFFFFF`), gros sprites circulaires flous visibles au mi-zoom, télémétrie `SYSTÈME SOLAIRE` prématurée sans Soleil visible, et disparition totale de la Voie Lactée en orbite terrestre.

## Cycle 2 — Score : 63 / 100 (INSUFFISANT — +17 pts vs Cycle 1)

- **Réalisme de la galaxie & lumière :** 10 / 20
- **Fluidité & crédibilité du zoom multi-échelle :** 9 / 20
- **Photoréalisme de la Terre, nuages, nuit & atmosphère :** 12 / 20
- **Cinématique, post-processing & sobriété UI :** 13 / 20
- **Stabilité technique :** 19 / 20 (0 erreur console/réseau)

### Gains validés
- Halo Fresnel atmosphérique parfaitement fondu (zéro anneau bulle).
- Lumières de villes dorées nettes (Méditerranée, Nil, Moyen-Orient, Afrique).
- Dégagement propre du HUD sous le globe à `1280×800`.

### 3 pires défauts visuels à corriger au Cycle 3
1. **Bande orange-marron opaque sur le terminateur + nuages découpés non assombris (vues 3 & 4) :** Réduire drastiquement le tint crépusculaire additif, assouplir l'alpha des nuages et les assombrir côté nuit, affiner le reflet spéculaire océan.
2. **Galaxie sous-exposée / clairsemée + skybox bleu-gris floue (vues 1–4) :** Densifier le disque stellaire, réchauffer le cœur doré + nœuds H-II roses, restaurer le noir profond `#020308` sur la skybox et renforcer la netteté des étoiles de fond.
3. **Mi-zoom plat (`t=0.45`) & repères d'approche (`t=0.78`) :** Ajouter des étoiles brillantes de premier plan avec hiérarchie dans le bras d'Orion, ajouter une Lune réaliste en arrière-plan et caler la télémétrie sur l'échelle visuelle réelle.

## Cycle 3 — Score : 79 / 100 (PROGRESSION FORTE — +16 pts vs Cycle 2)

- **Réalisme de la galaxie & lumière :** 13 / 20
- **Fluidité & crédibilité du zoom multi-échelle :** 14 / 20
- **Photoréalisme de la Terre, nuages, nuit & atmosphère :** 16 / 20
- **Cinématique, post-processing & sobriété UI :** 16 / 20
- **Stabilité technique :** 20 / 20 (0 erreur console/réseau)

### Gains validés
- Terminateur naturel sans bande orange artificielle.
- Terre + Lune cohérentes à l'approche (`126 900 km`) et en orbite basse (`680 km`), nuages doux, spéculaire océan serré, halo Fresnel propre.

### 3 finitions chirurgicales pour le Cycle 4
1. **Inversion de contraste nuit terrestre + ombres de nuages (vues 3 & 4) :** Seuiller le bruit indigo de `earth_lights_2048.png` pour un côté nuit homogène, corriger le décalage UV des ombres de nuages et ajouter un très léger reflet crépusculaire uniquement sur les sommets de nuages.
2. **Noir spatial `#020308` linéaire exact + fenêtrage radial des étoiles + balise Sol (`t=0.45`) :** Corriger la conversion linéaire→sRGB du fond skybox, supprimer la tache floue en haut à gauche, annuler tout bord carré de sprite étoile (`smoothstep(1.0, 0.35, r)`) et placer une balise dorée **Sol** au centre du Bras d'Orion.
3. **Gaz galactique gaussien sans flocons + disque inter-bras dense (vue 1) :** Remplacer les sprites ovales par des nuages gaussiens doux superposés, densifier le disque stellaire inter-bras (175k étoiles) et réchauffer le cœur doré-ambré.

## Cycle 4 — Score : 92 / 100 (VALIDÉ — +13 pts vs Cycle 3, +46 pts depuis Cycle 1)

- **Réalisme de la galaxie & lumière :** 17 / 20
- **Fluidité & crédibilité du zoom multi-échelle :** 18 / 20
- **Photoréalisme de la Terre, nuages, nuit & atmosphère :** 19 / 20
- **Cinématique, post-processing & sobriété UI :** 18 / 20
- **Stabilité technique :** 20 / 20 (0 erreur console/réseau, transition `#zoom-toggle` vérifiée)

### Gains validés
- Noir spatial `#020308` pur en espace linéaire, zéro tache floue skybox, zéro bord carré de sprite étoile.
- Balise dorée **Sol** visible dans le Bras d'Orion (`14,9 al`) + Lune réaliste à l'approche (`126 900 km`).
- Côté nuit terrestre parfaitement uniforme (Afrique + océan Indien), ombres portées des nuages visibles, fine touche crépusculaire dorée sur les sommets de nuages du terminateur, halo Fresnel Rayleigh fluide et dégagement HUD propre.
- Gaz galactique gaussien sans flocons ovales, cœur doré-ambré riche et disque inter-bras continu.

<promise>DONE</promise>

## Cycle 5 (Système Solaire 2K + Lunes Galiléennes + Correctif Z-order/UV) — Score : 98 / 100 (VALIDÉ)

- **Propreté couronne / billboards / étoiles / astéroïdes :** 20 / 20
- **Intégrité UV & surfaces 2K (zéro couture) :** 19 / 20
- **Stabilité Depth-Sorting & Z-order planètes/anneaux :** 20 / 20
- **Fluidité caméra & transitions (`Saturne → Jupiter → Io → Terre → Système Solaire`) :** 20 / 20
- **Vue panoramique, UI & stabilité technique :** 19 / 20 (0 erreur console/réseau, 50/50 requêtes OK)

### Correctifs vérifiés
- Sphères planétaires strictement opaques (`transparent: false, depthWrite: true`) + `renderOrder` dédiés sur nuages/anneaux/atmosphère/couronne → **zéro saut Z-order** même en orbite horizontale/verticale autour de Saturne.
- Suppression de `fract()` dans les shaders Soleil et Terre + clamp UV micro-bump → **zéro couture verticale ni glitch mipmap** sur le Soleil et Mars.
- Fenêtrage radial strict + taille couronne solaire `15,5 × 15,5` → **zéro bord carré**.
- Purge de l'inertie `OrbitControls` à l'arrivée → **zéro saut de caméra** en fin de vol.

<promise>DONE</promise>
