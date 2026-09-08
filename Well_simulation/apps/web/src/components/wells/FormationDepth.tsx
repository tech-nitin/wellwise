"use client";

import React from "react";
import { Layers, AlertTriangle } from "lucide-react";
import { Well } from "@/components/dashboard/data/wells";
import { getWellStratigraphy } from "./wellEngineeringData";

interface FormationDepthProps {
  well: Well;
  currentDepth?: number;
  highlightTarget?: boolean;
}

export function FormationDepth({
  well,
  currentDepth,
  highlightTarget = true,
}: FormationDepthProps) {
  const strata = getWellStratigraphy(well);
  const totalDepth = well.depthM || 3200;
  const current = currentDepth ?? Math.round(totalDepth - 60);
  const events = well.events || [];

  return (
    <div className="p-4 rounded-2xl bg-[#DDD2C0]/20 border border-[#DDD2C0] select-none text-left font-sans">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-[#0D1B24] font-extrabold font-mono flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-[#D96B3B]" />
          <span>PROPORTIONAL STRATIGRAPHIC COLUMN</span>
        </span>
        <span className="text-[10px] font-bold text-[#A9533D] bg-[#D96B3B]/15 px-2 py-0.5 rounded-full border border-[#D96B3B]/30 font-mono">
          Depth-Scaled
        </span>
      </div>

      {/* Surface Header */}
      <div className="flex items-center justify-between text-xs text-[#142B3A]/70 pb-1.5 mb-1.5 border-b border-[#DDD2C0]/60 font-mono">
        <span className="font-bold flex items-center gap-1.5 text-[#0D1B24]">
          <span className="h-2 w-2 rounded-full bg-[#142B3A]" />
          Surface Ground Level
        </span>
        <span className="font-bold">0 m</span>
      </div>

      {/* Proportional Stacked Stratigraphic Column */}
      <div className="relative border border-[#DDD2C0] rounded-xl overflow-hidden my-2 bg-white/70 shadow-inner">
        {strata.map((stratum, idx) => {
          const thickness = stratum.baseDepthM - stratum.topDepthM;
          const pct = Math.max(18, Math.min(65, (thickness / totalDepth) * 100));
          const isCurrentHorizon =
            current >= stratum.topDepthM && current <= stratum.baseDepthM;

          let bgStyle = "bg-[#FAF8F5] text-[#0D1B24] border-b border-[#DDD2C0]";
          if (stratum.isTargetZone && highlightTarget) {
            bgStyle = "bg-[#D96B3B]/15 text-[#0D1B24] border-y border-[#D96B3B] font-bold";
          } else if (idx % 2 === 1) {
            bgStyle = "bg-[#DDD2C0]/30 text-[#142B3A] border-b border-[#DDD2C0]";
          }

          return (
            <div
              key={idx}
              style={{ minHeight: `${Math.round(pct * 0.95)}px` }}
              className={`relative px-3 py-2 flex items-center justify-between transition-colors ${bgStyle}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`h-2.5 w-2.5 rounded-xs shrink-0 ${
                    stratum.isTargetZone
                      ? "bg-[#D96B3B]"
                      : isCurrentHorizon
                      ? "bg-[#245463]"
                      : "bg-[#142B3A]/40"
                  }`}
                />
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs font-mono block truncate">
                      {stratum.name}
                    </span>
                    {isCurrentHorizon && (
                      <span className="text-[9px] bg-[#245463] text-white px-1.5 py-0.2 rounded font-mono font-bold shrink-0">
                        ACTIVE HORIZON
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#142B3A]/70 font-sans block truncate">
                    {stratum.lithology}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono text-[10px] text-[#142B3A]/80 pl-2">
                <span className="font-bold">
                  {stratum.topDepthM.toLocaleString()}–{stratum.baseDepthM.toLocaleString()} m
                </span>
                {stratum.isTargetZone && (
                  <span className="block text-[#D96B3B] font-extrabold text-[9px] uppercase tracking-wider">
                    TARGET PAY ZONE
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Current Depth Overlay Marker */}
        {current > 0 && current <= totalDepth && (
          <div
            style={{
              top: `${Math.min(94, Math.max(6, (current / totalDepth) * 100))}%`,
            }}
            className="absolute left-0 right-0 h-0.5 bg-[#D96B3B] flex items-center justify-between px-1.5 pointer-events-none -translate-y-1/2 z-10 shadow-xs"
          >
            <span className="h-3 w-3 rounded-full bg-[#D96B3B] ring-2 ring-white shadow-sm -translate-x-1 animate-pulse" />
            <span className="text-[9px] font-extrabold font-mono bg-[#D96B3B] text-white px-2 py-0.5 rounded shadow-xs whitespace-nowrap">
              CURRENT DEPTH: {current.toLocaleString()} m
            </span>
          </div>
        )}

        {/* Hazard Depth Pins Overlaid on the Column */}
        {events.map((evt, idx) => {
          const posPct = Math.min(94, Math.max(6, (evt.depthM / totalDepth) * 100));

          return (
            <div
              key={idx}
              style={{ top: `${posPct}%` }}
              className="absolute left-0 right-0 h-px bg-[#843D35]/80 flex items-center justify-between px-1 pointer-events-none -translate-y-1/2 z-5"
            >
              <span className="h-2 w-2 rounded-full bg-[#843D35] ring-2 ring-white shadow-xs -translate-x-1" />
              <span className="text-[8px] font-bold font-mono bg-[#843D35] text-white px-1.5 py-0.2 rounded shadow-xs whitespace-nowrap">
                {evt.event.split(" ")[0]} @ {evt.depthM}m
              </span>
            </div>
          );
        })}
      </div>

      {/* TD Footer */}
      <div className="flex items-center justify-between text-xs pt-1.5 mt-1 border-t border-[#DDD2C0]/60 font-bold text-[#0D1B24] font-mono">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#D96B3B]" />
          Total Depth (TD)
        </span>
        <span className="text-[#D96B3B]">{totalDepth.toLocaleString()} m MD</span>
      </div>

      {/* Hazard Count Legend */}
      {events.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-[#DDD2C0]/60 flex items-center justify-between text-[11px] text-[#843D35]">
          <span className="flex items-center gap-1 font-bold">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{events.length} Historical Hazard Intervals</span>
          </span>
          <span className="text-[#142B3A]/70 font-mono text-[10px]">Documented in offset logs</span>
        </div>
      )}
    </div>
  );
}
