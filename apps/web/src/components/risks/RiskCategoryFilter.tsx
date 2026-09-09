"use client";

import React from "react";
import { Filter } from "lucide-react";
import { RiskCategory } from "./types";
import { cn } from "@/lib/utils";

interface RiskCategoryFilterProps {
  selectedCategory: RiskCategory;
  onSelectCategory: (cat: RiskCategory) => void;
  signalCountsByCategory: Record<string, number>;
}

const CATEGORIES: RiskCategory[] = [
  "ALL",
  "TORQUE / DRAG",
  "PRESSURE",
  "LOST CIRCULATION",
  "STUCK PIPE",
  "WELL CONTROL",
  "DRILLING PERFORMANCE",
  "CEMENTING",
  "NPT",
];

export function RiskCategoryFilter({
  selectedCategory,
  onSelectCategory,
  signalCountsByCategory,
}: RiskCategoryFilterProps) {
  return (
    <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none text-xs font-mono">
      <div className="flex items-center gap-1 text-[#8B877D] shrink-0 pr-1.5 border-r border-[#DDD2C0]">
        <Filter className="h-3 w-3 text-[#D96B3B]" />
        <span className="text-[10px] font-bold uppercase">Filter:</span>
      </div>

      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = cat === "ALL" ? undefined : signalCountsByCategory[cat];

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs",
              isSelected
                ? "bg-[#142B3A] text-white"
                : "bg-white text-[#142B3A]/80 border border-[#DDD2C0] hover:bg-[#DDD2C0]/40"
            )}
          >
            <span>{cat}</span>
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  "px-1 py-0.2 rounded text-[9px] font-extrabold",
                  isSelected ? "bg-white/20 text-white" : "bg-[#DDD2C0]/50 text-[#142B3A]"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
