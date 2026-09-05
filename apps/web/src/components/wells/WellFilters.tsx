"use client";

import React from "react";
import { WellFilterType } from "./types";
import { cn } from "@/lib/utils";

interface WellFiltersProps {
  activeFilter: WellFilterType;
  onFilterChange: (filter: WellFilterType) => void;
  counts: Record<WellFilterType, number>;
}

export function WellFilters({
  activeFilter,
  onFilterChange,
  counts,
}: WellFiltersProps) {
  const filterOptions: { key: WellFilterType; label: string }[] = [
    { key: "ALL", label: "ALL" },
    { key: "ACTIVE", label: "ACTIVE" },
    { key: "NEARBY", label: "NEARBY" },
    { key: "HIGH_RISK", label: "HIGH RISK" },
    { key: "HISTORICAL_MATCH", label: "HISTORICAL" },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#FAF8F5]/95 backdrop-blur-md border border-[#DDD2C0] shadow-md overflow-x-auto scrollbar-none font-mono text-xs select-none">
      {filterOptions.map((opt) => {
        const isActive = activeFilter === opt.key;
        const count = counts[opt.key] ?? 0;

        return (
          <button
            key={opt.key}
            onClick={() => onFilterChange(opt.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap",
              isActive
                ? "bg-[#D96B3B] text-white shadow-2xs"
                : "text-[#142B3A]/70 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40"
            )}
          >
            <span>{opt.label}</span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.2 rounded font-extrabold",
                isActive
                  ? "bg-white/25 text-white"
                  : "bg-[#DDD2C0]/60 text-[#142B3A]"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
