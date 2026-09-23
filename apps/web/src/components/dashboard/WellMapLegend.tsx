"use client";

import React from "react";

export function WellMapLegend() {
  const legendItems = [
    { label: "Active Target", icon: "🎯", color: "bg-[#2F8068]" },
    { label: "Kick / Blowout", icon: "⚠️", color: "bg-[#843D35]" },
    { label: "Mud Loss", icon: "🛑", color: "bg-[#D96B3B]" },
    { label: "Stuck Pipe", icon: "⚓", color: "bg-[#D96B3B]" },
    { label: "Shale Pack-Off", icon: "💥", color: "bg-[#6B21A8]" },
    { label: "Normal Offset", icon: "🔵", color: "bg-[#245463]" },
  ];

  return (
    <div className="bg-[#F5F0E6]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#DDD2C0] shadow-xs font-mono text-[11px] text-[#0D1B24] flex items-center gap-3 flex-wrap select-none">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="text-[10px]">{item.icon}</span>
          <span className="font-semibold text-[10px] sm:text-[11px]">{item.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1 text-[#142B3A]/70 border-l border-[#DDD2C0] pl-2.5 hidden md:flex text-[10px]">
        <span>ML Radius Buffer: <b>25 km</b></span>
      </div>
    </div>
  );
}
