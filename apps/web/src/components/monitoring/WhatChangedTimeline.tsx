"use client";

import React from "react";
import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { WhatChangedItem } from "./types";
import { cn } from "@/lib/utils";

interface WhatChangedTimelineProps {
  items: WhatChangedItem[];
  selectedItemId: string | null;
  onSelectItem: (item: WhatChangedItem) => void;
}

export function WhatChangedTimeline({
  items,
  selectedItemId,
  onSelectItem,
}: WhatChangedTimelineProps) {
  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3 sm:p-3.5 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-[#D96B3B]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            WHAT CHANGED — LAST 30 MINUTES
          </h3>
        </div>
        <span className="text-[9px] font-mono text-[#8B877D]">
          Click to highlight on chart
        </span>
      </div>

      {/* 4 Compact Event Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5">
        {items.map((item) => {
          const isSelected = selectedItemId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={cn(
                "p-2.5 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between group",
                isSelected
                  ? "bg-[#142B3A] text-white border-[#142B3A] shadow-xs"
                  : "bg-white border-[#DDD2C0] hover:border-[#D96B3B]"
              )}
            >
              <div className="flex items-center justify-between gap-1 mb-1 font-mono text-xs">
                <strong className={cn("font-bold text-xs", isSelected ? "text-[#D96B3B]" : "text-[#0D1B24]")}>
                  {item.timestampLabel}
                </strong>

                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded text-[9px] font-bold flex items-center gap-0.5",
                    isSelected
                      ? "bg-[#D96B3B] text-white"
                      : item.direction === "up"
                      ? "bg-[#D96B3B]/15 text-[#D96B3B]"
                      : item.direction === "down"
                      ? "bg-[#245463]/15 text-[#245463]"
                      : "bg-[#2F8068]/15 text-[#2F8068]"
                  )}
                >
                  {item.direction === "up" && <TrendingUp className="h-2 w-2" />}
                  {item.direction === "down" && <TrendingDown className="h-2 w-2" />}
                  {item.direction === "neutral" && <Minus className="h-2 w-2" />}
                  <span>{item.deltaValue}</span>
                </span>
              </div>

              <span className={cn("text-xs font-sans font-medium line-clamp-1", isSelected ? "text-white" : "text-[#0D1B24]")}>
                {item.changeSummary}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
