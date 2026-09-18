# Drilling Well Explorer

This workspace contains a multi-phase interactive 3D drilling well visualization project built with Vite, Three.js, and GSAP. It demonstrates a drill string, well construction sequence, reservoir visualization, and engineering-style telemetry overlays in a browser-based experience.

## Project structure

- `drilling-well-explorer-final/` — final polished version of the app
- `drilling-well-explorer-phase1/` — initial build
- `drilling-well-explorer-phase2/` — extended well explorer with additional scene elements
- `drilling-well-explorer-phase3/` — more detailed drilling and visualization improvements
- `drilling-well-explorer-phase4/` — enhanced rendering and stage features
- `drilling-well-explorer-phase5/` — cinematic construction sequence and detail polish
- `drilling-well-explorer-phase6/` — advanced presentation with capture, telemetry, and performance controls

## Main app

The most complete version is located in:

- `drilling-well-explorer-final/`

## Features

- Interactive 3D well construction scene
- Drill string and BHA detail visualization
- Layered stratigraphic geology bands
- Reservoir and halo effects
- Telemetry-style engineering overlays
- Depth gauge, inspection views, and cinematic motion
- High-detail and performance rendering toggles
- PNG viewport export support in later phases

## Prerequisites

- Node.js 18 or newer
- npm

## Install dependencies

From the project folder you want to run:

```bash
npm install
```

## Run the app

```bash
npm run dev
```

Then open the local URL shown in the terminal (usually Vite's localhost address such as `http://localhost:5173`).

## Build for production

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Notes

- Each phase is a standalone project directory with its own `package.json`.
- The final version is the best starting point if you want to explore the finished result.
- No external 3D asset downloads are required for the included project workflow.

## License

This project is provided for educational and demonstration purposes.