"use client";

import React from "react";
import { Compass, Flame, Droplets, Clock, Layers, Activity, Cpu, Shield } from "lucide-react";
import { OperationalContextData } from "./types";
import { cn } from "@/lib/utils";

interface LiveOperationsPanelProps {
  data: OperationalContextData;
  rigId: string;
}

export function LiveOperationsPanel({ data, rigId }: LiveOperationsPanelProps) {
  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-2xl p-4 sm:p-5 shadow-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-xl bg-[#142B3A] text-white flex items-center justify-center shrink-0">
            <Compass className="h-3.5 w-3.5 text-[#D96B3B]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
              CURRENT OPERATIONS
            </h3>
            <p className="text-[11px] text-[#8B877D]">
              Active section parameters & rig mechanical tally.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#DDD2C0]/40 text-[#142B3A]">
          {rigId}
        </span>
      </div>

      {/* Primary Activity Callout */}
      <div className="my-3 p-3 rounded-xl bg-[#142B3A] text-white flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#DDD2C0] uppercase tracking-wider block">
            Operational Activity
          </span>
          <strong className="text-base font-mono font-extrabold text-white tracking-tight mt-0.5 block">
            {data.activity}
          </strong>
        </div>

        <div className="text-right font-mono">
          <span className="text-[10px] text-[#DDD2C0] block">Rotating Time</span>
          <strong className="text-sm font-bold text-[#D96B3B]">{data.elapsedDrilling}</strong>
        </div>
      </div>

      {/* Compact Operational Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-white border border-[#DDD2C0]">
          <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Bit Assembly</span>
          <strong className="text-xs text-[#0D1B24] font-bold mt-0.5 block truncate">
            {data.bitModel}
          </strong>
          <span className="text-[10px] text-[#8B877D]">Bit #{data.bitNo}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-[#DDD2C0]">
          <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Hole Section</span>
          <strong className="text-xs text-[#0D1B24] font-bold mt-0.5 block">
            {data.holeSection}
          </strong>
          <span className="text-[10px] text-[#D96B3B]">{data.formation}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-[#DDD2C0]">
          <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Rig Mud Pumps</span>
          <strong className="text-xs text-[#2F8068] font-bold mt-0.5 block">
            {data.pumpStatus}
          </strong>
          <span className="text-[10px] text-[#8B877D]">{data.pumpStrokesSpm} SPM active</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-[#DDD2C0]">
          <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Circulation</span>
          <strong className="text-xs text-[#142B3A] font-bold mt-0.5 block">
            {data.circulationStatus}
          </strong>
          <span className="text-[10px] text-[#8B877D]">Trip Tank: {data.tripTankLevelBbl} bbl</span>
        </div>
      </div>
    </div>
  );
}
