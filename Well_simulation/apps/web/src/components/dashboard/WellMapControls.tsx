"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type WellFilterType = "ALL" | "ACTIVE" | "NEARBY" | "HIGH_RISK" | "HISTORICAL_MATCH";

interface WellMapControlsProps {
  activeFilter: WellFilterType;
  onFilterChange: (filter: WellFilterType) => void;
  radiusKm: number;
  onRadiusChange: (radius: number) => void;
  wellCount: number;
}

const FILTER_OPTIONS: { id: WellFilterType; label: string }[] = [
  { id: "ALL", label: "ALL" },
  { id: "ACTIVE", label: "ACTIVE" },
  { id: "NEARBY", label: "NEARBY" },
  { id: "HIGH_RISK", label: "HIGH RISK" },
  { id: "HISTORICAL_MATCH", label: "HISTORICAL MATCH" },
];

const RADIUS_OPTIONS = [1, 3, 5, 10, 20];

export function WellMapControls({
  activeFilter,
  onFilterChange,
  radiusKm,
  onRadiusChange,
  wellCount,
}: WellMapControlsProps) {
  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-[#F5F0E6]/95 backdrop-blur-md border border-[#DDD2C0] shadow-xs select-none">
      {/* Category Filters Ribbon */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/75 font-bold">
            Filter View:
          </span>
          <span className="text-[10px] font-mono text-[#0D1B24] font-bold bg-[#DDD2C0]/40 px-2 py-0.5 rounded-md border border-[#DDD2C0]">
            {wellCount} Wells
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_OPTIONS.map((f) => {
            const isSelected = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap border",
                  isSelected
                    ? "bg-[#142B3A] text-[#D96B3B] border-[#142B3A] shadow-2xs"
                    : "bg-[#F5F0E6] text-[#142B3A]/75 border-[#DDD2C0] hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radius Controls: 1km, 3km, 5km, 10km, 20km */}
      <div className="flex items-center justify-between gap-2 border-t border-[#DDD2C0]/70 pt-2.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/75 font-bold">
          Radius Buffer:
        </span>
        <div className="flex items-center gap-1.5">
          {RADIUS_OPTIONS.map((r) => {
            const isSelected = radiusKm === r;
            return (
              <button
                key={r}
                onClick={() => onRadiusChange(r)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all duration-200 cursor-pointer border",
                  isSelected
                    ? "bg-[#D96B3B] text-white border-[#D96B3B] shadow-2xs"
                    : "bg-[#F5F0E6] text-[#142B3A]/75 border-[#DDD2C0] hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40"
                )}
              >
                {r}km
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
