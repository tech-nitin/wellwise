"use client";

import React, { useState } from "react";
import { Info, ChevronUp } from "lucide-react";

export function WellMapLegend() {
  const [collapsed, setCollapsed] = useState(false);

  const legendItems = [
    { label: "Active Target Well", color: "bg-[#2F8068] ring-2 ring-[#2F8068]/30", pulse: true },
    { label: "Warning / Advisory", color: "bg-[#D96B3B]", pulse: false },
    { label: "Critical Hazard", color: "bg-[#843D35] ring-2 ring-[#843D35]/30", pulse: true },
    { label: "Historical Offset", color: "bg-[#245463]", pulse: false },
  ];

  return (
    <div className="flex flex-col gap-1.5 select-none font-sans max-w-[260px] sm:max-w-[290px] text-left">
      <div className="p-3 rounded-2xl bg-[#FAF8F5]/95 backdrop-blur-md border border-[#DDD2C0] shadow-lg space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-[#DDD2C0]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#D96B3B]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#0D1B24] font-extrabold">
              WELL STATUS LEGEND
            </span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[#142B3A]/60 hover:text-[#0D1B24] transition-colors p-0.5"
            aria-label="Toggle Legend Collapse"
          >
            <ChevronUp className={`h-3.5 w-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Legend Items */}
        {!collapsed && (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-0.5 text-[11px] font-mono">
            {legendItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0 ${item.pulse ? "animate-pulse" : ""}`} />
                <span className="text-[#142B3A]/85 truncate text-[10px] font-bold">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Synthetic Data Honesty Pill */}
      <div className="px-3 py-1 rounded-xl bg-[#FAF8F5]/90 backdrop-blur-md border border-[#DDD2C0] shadow-sm flex items-center gap-1.5 text-[10px] font-mono text-[#142B3A]/75">
        <Info className="h-3 w-3 text-[#D96B3B] shrink-0" />
        <span className="truncate">Demo data &bull; Synthetic coordinates for SIH 2026</span>
      </div>
    </div>
  );
}
