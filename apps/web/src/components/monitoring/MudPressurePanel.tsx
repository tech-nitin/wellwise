"use client";

import React from "react";
import { Droplets } from "lucide-react";
import { LiveTelemetryPoint } from "./types";
import { WellBaselineParameters } from "./telemetryEngine";

interface MudPressurePanelProps {
  currentPoint: LiveTelemetryPoint;
  baseline: WellBaselineParameters;
}

export function MudPressurePanel({ currentPoint, baseline }: MudPressurePanelProps) {
  const sppVariance = currentPoint.sppPsi - baseline.spp;
  const sppDeltaPct = +((sppVariance / (baseline.spp || 1)) * 100).toFixed(1);
  const flowDeltaPct = +(((currentPoint.flowRateGpm - baseline.flowRate) / (baseline.flowRate || 1)) * 100).toFixed(1);

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3 sm:p-3.5 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <Droplets className="h-3.5 w-3.5 text-[#245463]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            MUD & PRESSURE
          </h3>
        </div>
        <span className="text-[9px] font-mono text-[#8B877D]">
          Hydraulics Balance
        </span>
      </div>

      {/* 4 Compact Rows / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 text-xs font-mono">
        <div className="p-2 rounded-lg bg-white border border-[#DDD2C0] flex items-center justify-between">
          <span className="text-[10px] text-[#8B877D]">Mud Weight</span>
          <span className="font-bold text-[#0D1B24]">{currentPoint.mudWeightPpg} ppg</span>
        </div>

        <div className="p-2 rounded-lg bg-white border border-[#DDD2C0] flex items-center justify-between">
          <span className="text-[10px] text-[#8B877D]">ECD</span>
          <span className="font-bold text-[#245463]">{currentPoint.ecdPpg} ppg</span>
        </div>

        <div className="p-2 rounded-lg bg-white border border-[#DDD2C0] flex items-center justify-between">
          <span className="text-[10px] text-[#8B877D]">Flow Rate</span>
          <span className="font-bold text-[#2F8068]">{currentPoint.flowRateGpm} gpm ({flowDeltaPct >= 0 ? `+${flowDeltaPct}%` : `${flowDeltaPct}%`})</span>
        </div>

        <div className="p-2 rounded-lg bg-white border border-[#DDD2C0] flex items-center justify-between">
          <span className="text-[10px] text-[#8B877D]">SPP</span>
          <span className="font-bold text-[#843D35]">{currentPoint.sppPsi} psi ({sppDeltaPct >= 0 ? `+${sppDeltaPct}%` : `${sppDeltaPct}%`})</span>
        </div>
      </div>
    </div>
  );
}
