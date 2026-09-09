"use client";

import React from "react";
import { Activity, Compass, ArrowDown, Droplets, CheckCircle2 } from "lucide-react";
import { DrillingState, OperationalContextData } from "./types";
import { cn } from "@/lib/utils";

interface LiveDepthStatusProps {
  currentDepthM: number;
  targetTdM: number;
  formation: string;
  drillingState: DrillingState;
  operationalContext: OperationalContextData;
  rigId: string;
}

export function LiveDepthStatus({
  currentDepthM,
  targetTdM,
  formation,
  drillingState,
  operationalContext,
  rigId,
}: LiveDepthStatusProps) {
  const remainingM = Math.max(0, +(targetTdM - currentDepthM).toFixed(1));
  const progressPercent = Math.min(100, Math.max(0, +((currentDepthM / targetTdM) * 100).toFixed(1)));

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3 sm:p-4 shadow-2xs select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* LEFT COLUMN (~52%): Depth Progress & Rail */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-2.5 lg:border-r lg:border-[#DDD2C0]/70 lg:pr-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#0D1B24] tracking-tight">
                DRILLING PROGRESS
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white text-[#8B877D] border border-[#DDD2C0]">
                8½&quot; HOLE
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-[#8B877D]">Progress:</span>
              <strong className="text-[#2F8068] font-bold">{progressPercent}%</strong>
            </div>
          </div>

          {/* 4 Small Metrics */}
          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            <div className="p-1.5 rounded-lg bg-white border border-[#DDD2C0]">
              <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Current</span>
              <strong className="text-xs sm:text-sm text-[#0D1B24] block">{currentDepthM} m</strong>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-[#DDD2C0]">
              <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Target TD</span>
              <strong className="text-xs sm:text-sm text-[#142B3A] block">{targetTdM} m</strong>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-[#DDD2C0]">
              <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Remaining</span>
              <strong className="text-xs sm:text-sm text-[#D96B3B] block">{remainingM} m</strong>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-[#DDD2C0]">
              <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Interval</span>
              <strong className="text-xs sm:text-sm text-[#245463] block truncate">{formation}</strong>
            </div>
          </div>

          {/* Compact Depth Progress Bar */}
          <div>
            <div className="relative h-3 bg-[#DDD2C0]/40 rounded-full border border-[#DDD2C0] overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#142B3A] via-[#245463] to-[#D96B3B] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono text-[#8B877D] mt-1">
              <span>0 m (Surface)</span>
              <span className="text-[#D96B3B] font-bold">● Bit @ {currentDepthM} m</span>
              <span>{targetTdM} m TD</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (~48%): Operational Rig Context */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#0D1B24] tracking-tight">
              OPERATIONAL CONTEXT
            </span>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2F8068]/15 text-[#2F8068] border border-[#2F8068]/30">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2F8068] animate-pulse" />
              <span>{operationalContext.activity}</span>
            </div>
          </div>

          {/* 6-Grid Compact Spec Cells */}
          <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
            <div className="p-1.5 rounded-lg bg-white border border-[#DDD2C0]">
              <span className="text-[8px] text-[#8B877D] uppercase font-bold block">Formation</span>
              <strong className="text-[11px] text-[#D96B3B] block truncate">{formation}</strong>
            </div>

            <div className="p-1.5 rounded-lg bg-white border border-[#DDD2C0]">
              <span className="text-[8px] text-[#8B877D] uppercase font-bold block">Hole Section</span>
              <strong className="text-[11px] text-[#0D1B24] block">{operationalContext.holeSection}</strong>
            </div>

            <div className="p-1.5 rounded-lg bg-white border border-[#DDD2C0]">
              <span className="text-[8px] text-[#8B877D] uppercase font-bold block">Bit Assembly</span>
              <strong className="text-[11px] text-[#142B3A] block truncate">{operationalContext.bitNo} PDC</strong>
            </div>

            <div className="p-1.5 rounded-lg bg-white border border-[#DDD2C0]">
              <span className="text-[8px] text-[#8B877D] uppercase font-bold block">Circulation</span>
              <strong className="text-[11px] text-[#2F8068] block">{operationalContext.circulationStatus}</strong>
            </div>

            <div className="p-1.5 rounded-lg bg-white border border-[#DDD2C0]">
              <span className="text-[8px] text-[#8B877D] uppercase font-bold block">Rig Mud Pumps</span>
              <strong className="text-[11px] text-[#2F8068] block">ACTIVE (2x)</strong>
            </div>

            <div className="p-1.5 rounded-lg bg-white border border-[#DDD2C0]">
              <span className="text-[8px] text-[#8B877D] uppercase font-bold block">Rotating Time</span>
              <strong className="text-[11px] text-[#0D1B24] block">{operationalContext.elapsedDrilling}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
