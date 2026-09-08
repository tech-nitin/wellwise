"use client";

import React from "react";

export function WellMapLegend() {
  const legendItems = [
    { label: "Active Well", color: "bg-[#2F8068]", ring: "ring-2 ring-[#2F8068]/30" },
    { label: "Warning", color: "bg-[#D96B3B]", ring: "ring-2 ring-[#D96B3B]/30" },
    { label: "Critical", color: "bg-[#843D35]", ring: "ring-2 ring-[#843D35]/30" },
    { label: "Historical", color: "bg-[#245463]", ring: "" },
  ];

  return (
    <div className="bg-[#F5F0E6]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#DDD2C0] shadow-xs font-mono text-[11px] text-[#0D1B24] flex items-center gap-3.5 flex-wrap select-none">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${item.color} ${item.ring}`} />
          <span className="font-semibold">{item.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5 text-[#142B3A]/60 border-l border-[#DDD2C0] pl-3 hidden sm:flex">
        <span>Upper Assam Basin</span>
      </div>
    </div>
  );
}
