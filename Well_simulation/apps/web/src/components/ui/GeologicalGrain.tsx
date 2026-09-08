import React from "react";

interface GeologicalGrainProps {
  opacity?: number;
  className?: string;
}

/**
 * Procedural SVG turbulence micro-grain texture.
 * Mimics organic geological sedimentary medium and tactile editorial paper.
 * Completely static (zero runtime CPU rendering cost), pointer-events: none.
 */
export function GeologicalGrain({
  opacity = 0.028,
  className = "",
}: GeologicalGrainProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden select-none ${className}`}
      style={{
        opacity,
        mixBlendMode: "overlay",
      }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <filter id="geological-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#geological-grain-filter)"
        />
      </svg>
    </div>
  );
}
