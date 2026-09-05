"use client";

import React from "react";
import { GeologicalGrain } from "./GeologicalGrain";

export type GeologicalVariant =
  | "hero"
  | "map"
  | "intelligence"
  | "telemetry"
  | "risk"
  | "knowledge"
  | "metrics"
  | "footer";

interface GeologicalBackgroundProps {
  variant?: GeologicalVariant;
  className?: string;
  children?: React.ReactNode;
  showGrain?: boolean;
}

/**
 * WellWise Ambient Geological Background System.
 * Source of truth: WellWise Style-Board & Aura Ambient Reference.
 *
 * PALETTE:
 * - Ivory Field: #F5F0E6 (Base page canvas, 60%)
 * - Warm Sand: #DDD2C0 (Secondary surface, sedimentary strata, 20%)
 * - Deep Petroleum: #142B3A (Primary brand, technological depth, 10%)
 * - Petrol Blue: #245463 (Secondary brand, GIS & subsurface)
 * - Copper Flame: #D96B3B (Primary accent, warm ambient energy, 5%)
 * - Burnt Earth: #A9533D (Geological formations, risk, 5%)
 * - Ink: #0D1B24 (High-contrast text, footer base)
 * - Mist: #E9E4DA (Subtle UI & borders)
 *
 * MULTI-LAYER STACK:
 * - Layer 1: Base grounding (#F5F0E6 / #0D1B24)
 * - Layer 2: Ambient Warmth (Copper Flame #D96B3B soft radial fields, 8%–18%)
 * - Layer 3: Geological Strata (Warm Sand #DDD2C0 & Burnt Earth #A9533D, 4%–12%)
 * - Layer 4: Technological Depth (Petrol Blue #245463 & Deep Petroleum #142B3A, 3%–8%)
 * - Layer 5: Micro Grain (tactile procedural SVG turbulence texture)
 */
export function GeologicalBackground({
  variant = "hero",
  className = "",
  children,
  showGrain = true,
}: GeologicalBackgroundProps) {
  const isFooter = variant === "footer";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden select-none ${
        isFooter ? "bg-[#0D1B24]" : "bg-[#F5F0E6]"
      } ${className}`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO VARIANT (High atmospheric warmth + 3D rig focal glow)      */}
      {/* ------------------------------------------------------------------ */}
      {variant === "hero" && (
        <>
          {/* Layer 4 (Deep): Opposite Technological Petrol Blue depth (top-left) */}
          <div
            className="geo-layer-deep absolute -top-24 -left-20 w-[640px] h-[640px] rounded-full opacity-[0.055] pointer-events-none blur-[140px]"
            style={{
              background:
                "radial-gradient(circle, #245463 0%, rgba(36, 84, 99, 0) 70%)",
            }}
          />

          {/* Layer 3 (Mid): Abstract Geological Strata Dipping Band (Warm Sand + Burnt Earth) */}
          <div
            className="geo-layer-mid absolute top-1/3 -left-1/4 w-[160%] h-[320px] -rotate-6 opacity-[0.11] pointer-events-none blur-[90px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(221, 210, 192, 0) 0%, #DDD2C0 35%, #A9533D 70%, rgba(169, 83, 61, 0) 100%)",
            }}
          />

          {/* Layer 3 (Mid): Earthy Burnt Earth Subsurface Field (bottom-right) */}
          <div
            className="geo-layer-mid absolute -bottom-20 right-[15%] w-[580px] h-[520px] rounded-full opacity-[0.08] pointer-events-none blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, #A9533D 0%, rgba(169, 83, 61, 0) 65%)",
            }}
          />

          {/* Layer 2 (Fore): Primary Copper Flame Glow BEHIND 3D Drilling Rig (right-center) */}
          <div
            className="geo-layer-fore absolute top-[6%] right-[3%] w-[740px] h-[740px] rounded-full opacity-[0.16] pointer-events-none blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, #D96B3B 0%, rgba(217, 107, 59, 0.45) 45%, rgba(217, 107, 59, 0) 75%)",
            }}
          />

          {/* Secondary ambient warmth fill near hero CTA */}
          <div
            className="geo-layer-mid absolute top-1/2 left-[10%] w-[440px] h-[440px] rounded-full opacity-[0.065] pointer-events-none blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, #D96B3B 0%, rgba(217, 107, 59, 0) 70%)",
            }}
          />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. WELL MAP VARIANT (Cartographic, restrained, aerial framing)     */}
      {/* ------------------------------------------------------------------ */}
      {variant === "map" && (
        <>
          {/* Layer 4 (Deep): Cool Petrol Blue Cartographic Rim (top-right) */}
          <div
            className="geo-layer-deep absolute -top-16 -right-16 w-[560px] h-[560px] rounded-full opacity-[0.045] pointer-events-none blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, #245463 0%, rgba(36, 84, 99, 0) 70%)",
            }}
          />

          {/* Layer 3 (Mid): Planar Warm Sand Sedimentary Margins */}
          <div
            className="geo-layer-mid absolute bottom-0 left-0 w-[680px] h-[480px] rounded-full opacity-[0.16] pointer-events-none blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, #DDD2C0 0%, rgba(221, 210, 192, 0) 70%)",
            }}
          />

          {/* Layer 2 (Fore): Subtle warm Copper beacon near active well NHK-124 */}
          <div
            className="geo-layer-fore absolute top-1/4 left-[8%] w-[420px] h-[420px] rounded-full opacity-[0.065] pointer-events-none blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, #D96B3B 0%, rgba(217, 107, 59, 0) 65%)",
            }}
          />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. HISTORICAL INTELLIGENCE (Barail & Tipam geological ribbons)     */}
      {/* ------------------------------------------------------------------ */}
      {variant === "intelligence" && (
        <>
          {/* Layer 3 (Mid): Flowing sedimentary strata diagonal ribbons */}
          <div
            className="geo-layer-mid absolute top-1/4 -right-1/4 w-[140%] h-[340px] -rotate-3 opacity-[0.13] pointer-events-none blur-[100px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(221, 210, 192, 0) 0%, #DDD2C0 40%, #A9533D 65%, rgba(169, 83, 61, 0) 100%)",
            }}
          />

          {/* Layer 3 (Deep): Lower alluvial strata bed (Warm Sand) */}
          <div
            className="geo-layer-deep absolute -bottom-24 left-1/4 w-[760px] h-[460px] rounded-full opacity-[0.15] pointer-events-none blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, #DDD2C0 0%, rgba(221, 210, 192, 0) 70%)",
            }}
          />

          {/* Layer 2 (Fore): Subtle Burnt Earth warmth behind feature 01 */}
          <div
            className="geo-layer-fore absolute top-12 left-[12%] w-[480px] h-[480px] rounded-full opacity-[0.065] pointer-events-none blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, #A9533D 0%, rgba(169, 83, 61, 0) 65%)",
            }}
          />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. LIVE DRILLING TELEMETRY (Warm MWD sensor pulse & energy aura)    */}
      {/* ------------------------------------------------------------------ */}
      {variant === "telemetry" && (
        <>
          {/* Layer 2 (Fore): Primary Copper Flame energy aura behind chart */}
          <div
            className="geo-layer-fore absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[460px] rounded-full opacity-[0.085] pointer-events-none blur-[120px]"
            style={{
              background:
                "radial-gradient(ellipse at center, #D96B3B 0%, rgba(217, 107, 59, 0.35) 40%, rgba(217, 107, 59, 0) 75%)",
            }}
          />

          {/* Layer 4 (Deep): Deep Petroleum anchoring beneath the chart */}
          <div
            className="geo-layer-deep absolute -bottom-16 right-[10%] w-[520px] h-[360px] rounded-full opacity-[0.045] pointer-events-none blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, #142B3A 0%, rgba(20, 43, 58, 0) 70%)",
            }}
          />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. RISK INTELLIGENCE (Restrained Burnt Earth + Petrol Blue depth)   */}
      {/* ------------------------------------------------------------------ */}
      {variant === "risk" && (
        <>
          {/* Layer 4 (Deep): Petrol Blue Flank (left) */}
          <div
            className="geo-layer-deep absolute top-12 -left-20 w-[580px] h-[580px] rounded-full opacity-[0.065] pointer-events-none blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, #245463 0%, rgba(36, 84, 99, 0) 70%)",
            }}
          />

          {/* Layer 3 (Mid): Deep Earthy Burnt Earth Strata (right / center) */}
          <div
            className="geo-layer-mid absolute bottom-0 right-[5%] w-[680px] h-[520px] rounded-full opacity-[0.08] pointer-events-none blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, #A9533D 0%, rgba(169, 83, 61, 0) 65%)",
            }}
          />

          {/* Layer 2 (Fore): Subtle warning Copper accent beneath prediction card */}
          <div
            className="geo-layer-fore absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.055] pointer-events-none blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, #D96B3B 0%, rgba(217, 107, 59, 0) 60%)",
            }}
          />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 6. AI KNOWLEDGE / ASK THE FIELD (Navy depth + warm radiant spark)   */}
      {/* ------------------------------------------------------------------ */}
      {variant === "knowledge" && (
        <>
          {/* Layer 4 (Deep): Deep Petroleum ambient frame */}
          <div
            className="geo-layer-deep absolute -top-24 left-[5%] w-[600px] h-[500px] rounded-full opacity-[0.06] pointer-events-none blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, #142B3A 0%, rgba(20, 43, 58, 0) 70%)",
            }}
          />

          {/* Layer 2 (Fore): Radiant warm Copper intelligence focus BEHIND search */}
          <div
            className="geo-layer-fore absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[380px] rounded-full opacity-[0.10] pointer-events-none blur-[110px]"
            style={{
              background:
                "radial-gradient(ellipse at center, #D96B3B 0%, rgba(217, 107, 59, 0.4) 40%, rgba(217, 107, 59, 0) 75%)",
            }}
          />

          {/* Layer 3 (Mid): Subtle Warm Sand grounding */}
          <div
            className="geo-layer-mid absolute bottom-0 right-[10%] w-[500px] h-[360px] rounded-full opacity-[0.12] pointer-events-none blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, #DDD2C0 0%, rgba(221, 210, 192, 0) 70%)",
            }}
          />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 7. KEY METRICS (Clean, architectural, subtle Warm Sand grounding)  */}
      {/* ------------------------------------------------------------------ */}
      {variant === "metrics" && (
        <>
          <div
            className="geo-layer-deep absolute inset-x-0 top-0 h-full opacity-[0.11] pointer-events-none blur-[100px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, #DDD2C0 0%, rgba(221, 210, 192, 0) 75%)",
            }}
          />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 8. FOOTER (Ink #0D1B24 + Deep Petroleum & Petrol Blue bedrock)      */}
      {/* ------------------------------------------------------------------ */}
      {variant === "footer" && (
        <>
          {/* Layer 4 (Deep): Large Deep Petroleum Bedrock Shapes */}
          <div
            className="geo-layer-deep absolute -top-32 -left-24 w-[750px] h-[650px] rounded-full opacity-[0.22] pointer-events-none blur-[140px]"
            style={{
              background:
                "radial-gradient(circle, #142B3A 0%, rgba(20, 43, 58, 0) 75%)",
            }}
          />

          <div
            className="geo-layer-mid absolute bottom-0 right-0 w-[800px] h-[500px] rounded-full opacity-[0.18] pointer-events-none blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, #245463 0%, rgba(36, 84, 99, 0) 70%)",
            }}
          />

          {/* Layer 3: Flowing geological contour strata ribbons */}
          <div
            className="geo-layer-mid absolute top-10 inset-x-0 h-[260px] opacity-[0.12] pointer-events-none blur-[80px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(20, 43, 58, 0) 0%, #142B3A 45%, #245463 75%, rgba(36, 84, 99, 0) 100%)",
            }}
          />

          {/* Layer 2 (Fore): Subtle warm Copper Flame ember pulse at bedrock horizon */}
          <div
            className="geo-layer-fore absolute bottom-4 left-1/3 w-[450px] h-[220px] rounded-full opacity-[0.03] pointer-events-none blur-[90px]"
            style={{
              background:
                "radial-gradient(circle, #D96B3B 0%, rgba(217, 107, 59, 0) 70%)",
            }}
          />
        </>
      )}

      {/* Layer 5: Procedural SVG Micro-Grain across all variants */}
      {showGrain && <GeologicalGrain opacity={isFooter ? 0.035 : 0.025} />}

      {/* Optional Children wrapper */}
      {children}
    </div>
  );
}
