"use client";

import React from "react";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";

export function KeyMetrics() {
  const metrics = [
    {
      value: "24",
      label: "Nearby Offset Wells",
      detail: "Within 5 km operational radius",
    },
    {
      value: "17",
      label: "Historical Formations Matched",
      detail: "Barail, Tipam & Girujan stratigraphy",
    },
    {
      value: "08",
      label: "Precedent Hazard Events",
      detail: "Catalogued offset drilling incidents",
    },
    {
      value: "92%",
      label: "Evidence Match",
      detail: "Retrieved archive DDR precedent",
    },
  ];

  return (
    <section className="relative w-full py-12 lg:py-16 overflow-hidden border-b border-[#DDD2C0] select-none">
      {/* Ambient Geological Background System - High-Legibility Metrics Grounding */}
      <GeologicalBackground variant="metrics" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col text-left lg:border-r last:border-r-0 border-[#DDD2C0] lg:pr-8 group"
            >
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono text-[#0D1B24] tracking-tight group-hover:text-[#D96B3B] transition-colors">
                {item.value}
              </span>
              <span className="text-base font-extrabold text-[#0D1B24] mt-2">
                {item.label}
              </span>
              <span className="text-xs text-[#142B3A]/70 mt-1 leading-relaxed font-mono">
                {item.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
