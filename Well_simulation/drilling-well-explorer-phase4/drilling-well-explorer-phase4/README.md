# Drilling Well Explorer — Phase 4

This phase adds a timed reference-sequence mode on top of the Phase 3 3D explorer.

## Run

```powershell
npm install
npm run dev
```

Open the Vite localhost URL.

## What changed

- Timed 6-part construction sequence.
- Continuous camera interpolation rather than only stage jumps.
- Progressive drill-string/BHA reveal.
- Progressive casing opacity.
- Reservoir reveal during the formation/lithology portion.
- Sequence HUD with progress bar, play/pause, replay.
- Bottom timeline now scrubs through the continuous sequence.
- Existing stage tabs, views, section/explode tools remain available.

This is a procedural recreation foundation; it does not contain proprietary CAD assets from the reference video.
