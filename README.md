# Sapin de Noel 3D

Application web interactive affichant un sapin de Noel en 3D avec animations et effets visuels.

## Description

Ce projet presente une scene de Noel immersive construite avec React et Three.js. L'utilisateur peut explorer la scene en deplacant sa souris pour changer l'angle de vue de la camera.

### Fonctionnalites

- Sapin de Noel 3D compose de plusieurs couches de cones et d'un tronc
- Etoile doree scintillante au sommet avec effet de lueur
- Boules de decoration colorees avec animation de pulsation
- Guirlandes lumineuses multicolores disposees en spirale avec effet de clignotement
- Neige tombante en continu
- Cadeaux emballes au pied du sapin
- Rotation automatique du sapin
- Interaction souris pour explorer la scene sous differents angles
- Eclairage ambiant avec halo lumineux au sol

## Technologies utilisees

- React 19
- Vite 7
- Three.js
- Tailwind CSS 4

## Installation

### Prerequis

- Node.js (version 18 ou superieure recommandee)
- npm ou yarn

### Etapes

1. Cloner le repository

```bash
git clone https://github.com/komiifo/sapin-noel-threejs
cd sapin-noel-threejs
```

2. Installer les dependances

```bash
npm install
```

3. Lancer le serveur de developpement

```bash
npm run dev
```

4. Ouvrir le navigateur a l'adresse indiquee (par defaut http://localhost:5173)

## Scripts disponibles

| Commande            | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`     | Lance le serveur de developpement avec Hot Module Replacement |
| `npm run build`   | Compile l'application pour la production                      |
| `npm run preview` | Previsualise la version de production                         |
| `npm run lint`    | Execute ESLint pour verifier le code                          |

## Structure du projet

```
sapin-noel/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   └── ChristmasTree.jsx    # Composant principal avec la scene Three.js
│   ├── App.jsx                   # Composant racine
│   ├── main.jsx                  # Point d'entree React
│   └── index.css                 # Styles globaux avec Tailwind
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Architecture technique

### Composant ChristmasTree

Le composant `ChristmasTree.jsx` contient l'integralite de la logique Three.js :

**Configuration de la scene**

- Scene avec fond sombre et effet de brouillard
- Camera perspective avec position initiale ajustable
- Renderer WebGL avec antialiasing et shadow mapping

**Eclairage**

- Lumiere ambiante pour l'eclairage global
- Lumiere directionnelle simulant la lune
- Lumieres ponctuelles pour le halo au sol
- Lumieres colorees sur les guirlandes

**Objets 3D**

- Tronc : cylindre avec materiau brun
- Feuillage : 4 cones superposes avec materiau vert
- Etoile : forme extrudee avec materiau emissif dore
- Boules : spheres metalliques colorees
- Guirlandes : petites spheres lumineuses en spirale
- Neige : spheres blanches animees
- Cadeaux : boites avec rubans et noeuds

**Animations**

- Rotation continue du sapin
- Pulsation des boules de decoration
- Clignotement des guirlandes lumineuses
- Scintillement de l'etoile
- Chute des flocons de neige
- Mouvement de camera base sur la position de la souris

### Gestion des evenements

- `mousemove` : mise a jour de la position cible de la camera
- `resize` : ajustement du viewport et de l'aspect ratio

### Nettoyage

Le composant implemente un cleanup complet dans le useEffect pour :

- Supprimer les event listeners
- Retirer le canvas du DOM
- Liberer les ressources Three.js
- Reinitialiser les refs pour la compatibilite avec React StrictMode

## Configuration

### Vite

Le fichier `vite.config.js` configure :

- Le plugin React avec Babel pour Fast Refresh
- Le plugin Tailwind CSS pour le traitement des styles

### ESLint

Configuration avec :

- Regles recommandees pour JavaScript
- Plugin React Hooks
- Plugin React Refresh pour Vite
- Regle personnalisee : les variables commencant par une majuscule ou underscore sont ignorees par `no-unused-vars`

## Utilisation

Une fois l'application lancee :

1. La scene se charge automatiquement avec le sapin en rotation
2. Deplacer la souris horizontalement pour tourner autour du sapin
3. Deplacer la souris verticalement pour changer l'elevation de la vue
4. Observer les animations automatiques des decorations et de la neige

## Personnalisation

### Modifier les couleurs des decorations

Dans `ChristmasTree.jsx`, modifier le tableau `ornamentColors` :

```javascript
const ornamentColors = [
  0xff0044, 0x0066ff, 0xffd700, 0xff6600, 0x00ff88, 0xff00ff,
];
```

### Modifier les couleurs des guirlandes

Modifier le tableau `lightColors` :

```javascript
const lightColors = [
  0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff,
];
```

### Ajuster la vitesse de rotation

Modifier la valeur dans la fonction `animate` :

```javascript
treeGroup.rotation.y += 0.003; // Augmenter pour plus rapide
```

### Modifier la quantite de neige

Changer la valeur dans la boucle de creation des flocons :

```javascript
for (let i = 0; i < 500; i++) { // Modifier 500 pour plus ou moins de flocons
```

## Compatibilite navigateur

L'application necessite un navigateur supportant WebGL :

- Chrome (recommande)
- Firefox
- Safari
- Edge

## Performances

Pour de meilleures performances :

- La scene utilise des geometries optimisees avec un nombre limite de segments
- Les flocons de neige sont recycles au lieu d'etre recrees
- Le renderer utilise `requestAnimationFrame` pour une animation fluide

## Licence

Projet prive - Tous droits reserves

## Auteur

Projet realise dans le cadre du CP6 CDA
