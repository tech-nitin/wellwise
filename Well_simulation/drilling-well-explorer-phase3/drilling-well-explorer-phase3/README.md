# Drilling Well Explorer — Phase 2

A procedural Three.js recreation of the dark engineering visualization style in the provided reference video.

## Run

```powershell
npm install
npm run dev
```

Open the local URL shown by Vite.

## What's included

- Six stage states inspired by the reference sequence
- Procedural formations, wellbore, casing, BHA, bit, wellhead and mast
- Directional camera transitions using GSAP
- Engineering-grid backdrop
- CSS technical labels attached to 3D positions
- View presets, explode/section toggles and display controls
- Timeline navigation and auto-tour

The geometry is intentionally procedural so the project runs without external CAD assets. Replace the procedural parts with GLB/GLTF models later for higher fidelity.


## Phase 3
Visual-fidelity pass: translucent borehole wall, reservoir highlight, staged BHA reveal, directional marker, improved camera targets, technical depth/angle labels, and section-view polish.
