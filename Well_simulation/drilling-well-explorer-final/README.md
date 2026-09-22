# Drilling Well Explorer

A browser-based 3D drilling visualization built with Three.js, Vite, and GSAP. It presents an interactive well construction and reservoir review scene showing the wellbore, casing strings, directional bottom-hole assembly (BHA), stratigraphy, and engineering-style drill simulation.

This project is designed for technical presentations, concept review, and visual explanation of drilling and well construction workflows in a clean, interactive format.

## Features

- Interactive 3D well model with orbit camera controls
- Wellbore, casing strings, and directional BHA visualization
- Layered formation and reservoir visualization
- Stage-based engineering review sequence
- Dark and light theme toggle
- HUD panels for depth, inclination, azimuth, and phase status
- High-detail drilling components such as couplings, stabilizers, casing shoe, and bit details
- Self-contained front-end project with no external 3D asset dependency

## Tech Stack

- Vite
- Three.js
- GSAP
- HTML, CSS, and JavaScript

## Project Structure

```text
drilling-well-explorer-final/
├── index.html
├── package.json
├── README.md
├── src/
│   ├── main.js
│   └── style.css
└── public/ (if added later)
```

## Getting Started

1. Open a terminal in the project folder.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local URL shown in the terminal (typically Vite's localhost port).

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run check
```

### Script descriptions

- `npm run dev` — starts the local Vite development server
- `npm run build` — creates a production build
- `npm run preview` — previews the production build locally
- `npm run check` — validates the JavaScript file syntax

## Usage Notes

- The application is front-end only and runs in the browser.
- It is suited for concept demonstration, engineering review, and presentation use.
- The simulation is designed to be visually readable rather than physically exact, with a focus on clear engineering communication.

## Notes

This project acts as a polished visual exploration of a drilling well system and is intended as a demonstration tool for presenting casing, formation, and BHA relationships in a simplified but informative way.

## License

This project is provided for educational and demonstration use. See the repository license file if included in the broader project structure.

