"use client";

import React from "react";
import { RadiusKm } from "./types";
import { CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

interface RadiusControlProps {
  radiusKm: RadiusKm;
  onRadiusChange: (radius: RadiusKm) => void;
}

export function RadiusControl({ radiusKm, onRadiusChange }: RadiusControlProps) {
  const options: RadiusKm[] = [1, 3, 5, 10, 20];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#FAF8F5]/95 backdrop-blur-md border border-[#DDD2C0] shadow-md font-mono text-xs select-none">
      <div className="flex items-center gap-1 pl-2 pr-1 text-[#142B3A]/70 text-[10px] uppercase font-bold tracking-wider">
        <CircleDot className="h-3 w-3 text-[#D96B3B]" />
        <span className="hidden sm:inline">RADIUS</span>
      </div>

      <div className="flex items-center gap-1">
        {options.map((opt) => {
          const isActive = radiusKm === opt;

          return (
            <button
              key={opt}
              onClick={() => onRadiusChange(opt)}
              className={cn(
                "px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer text-xs",
                isActive
                  ? "bg-[#142B3A] text-[#D96B3B] shadow-2xs border border-[#D96B3B]/40"
                  : "text-[#142B3A]/70 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40"
              )}
            >
              {opt} km
            </button>
          );
        })}
      </div>
    </div>
  );
}
