"use client";

import React from "react";
import { Layers, AlertTriangle, ArrowDown } from "lucide-react";
import { DepthRiskRailEvent } from "./types";
import { cn } from "@/lib/utils";

interface DepthRiskMapProps {
  events: DepthRiskRailEvent[];
  currentDepthM: number;
  targetTdM: number;
}

export function DepthRiskMap({
  events,
  currentDepthM,
  targetTdM,
}: DepthRiskMapProps) {
  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#D96B3B]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            RISK BY DEPTH — STRATIGRAPHIC HAZARD RAIL
          </h3>
        </div>
        <span className="text-[9px] font-mono text-[#8B877D]">
          0 – {targetTdM} m MD
        </span>
      </div>

      {/* Rail Milestone List */}
      <div className="relative pl-5 pr-1 py-2.5 space-y-2 text-xs font-mono">
        <div className="absolute left-[8px] top-3 bottom-3 w-[2px] bg-linear-to-b from-[#142B3A] via-[#245463] to-[#DDD2C0]" />

        {events.map((ev, index) => {
          const isCurrent = ev.isCurrentDepth;
          const isIncident = ev.type === "incident";
          const isTarget = ev.type === "target";

          return (
            <div key={`${ev.depthM}-${index}`} className="relative flex items-center justify-between gap-2">
              <div
                className={cn(
                  "absolute -left-[14px] flex items-center justify-center rounded-full z-10",
                  isCurrent
                    ? "h-3.5 w-3.5 bg-[#D96B3B] ring-2 ring-[#D96B3B]/30"
                    : isIncident
                    ? "h-2.5 w-2.5 bg-[#843D35]"
                    : isTarget
                    ? "h-2.5 w-2.5 bg-[#142B3A]"
                    : "h-2 w-2 bg-[#8B877D]"
                )}
              />

              <div
                className={cn(
                  "flex-1 px-2.5 py-1.5 rounded-lg border flex items-center justify-between gap-2",
                  isCurrent
                    ? "bg-[#142B3A] text-white border-[#142B3A] font-bold shadow-xs"
                    : isIncident
                    ? "bg-white border-[#D96B3B]/40 text-[#843D35]"
                    : "bg-white border-[#DDD2C0]/70 text-[#142B3A]"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn("font-bold text-[11px] shrink-0", isCurrent ? "text-[#D96B3B]" : "text-[#0D1B24]")}>
                    {ev.depthM} m
                  </span>
                  <span className="text-[11px] truncate font-sans">
                    {ev.label}
                  </span>
                </div>

                {isCurrent && (
                  <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-[#D96B3B] text-white uppercase shrink-0">
                    ACTIVE BIT
                  </span>
                )}
                {isIncident && (
                  <span className="text-[8px] px-1.5 py-0.2 rounded bg-[#843D35]/15 text-[#843D35] uppercase shrink-0">
                    OFFSET INCIDENT
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
