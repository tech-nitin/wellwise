"use client";

import React from "react";
import { Zap, TrendingUp, TrendingDown, Minus, Activity, Shield } from "lucide-react";
import { LiveTelemetryPoint } from "./types";
import { WellBaselineParameters } from "./telemetryEngine";
import { cn } from "@/lib/utils";

interface DrillingPerformanceProps {
  currentPoint: LiveTelemetryPoint;
  baseline: WellBaselineParameters;
}

export function DrillingPerformance({ currentPoint, baseline }: DrillingPerformanceProps) {
  const ropAvg = +(baseline.rop * 0.96).toFixed(1);
  const ropDelta = +(((currentPoint.ropMh - ropAvg) / ropAvg) * 100).toFixed(1);

  const torqueAvg = +(baseline.torque * 1.02).toFixed(1);
  const torqueDelta = +(((currentPoint.torqueKftLb - torqueAvg) / torqueAvg) * 100).toFixed(1);

  const wobAvg = +(baseline.wob * 0.98).toFixed(1);
  const wobDelta = +(((currentPoint.wobKlbf - wobAvg) / wobAvg) * 100).toFixed(1);

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-2xl p-4 sm:p-5 shadow-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-xl bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
              DRILLING PERFORMANCE
            </h3>
            <p className="text-[11px] text-[#8B877D]">
              Mechanical efficiency and penetration rate index.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-[#8B877D] border border-[#DDD2C0]">
          MSE NOMINAL
        </span>
      </div>

      {/* 3 Performance Parameters */}
      <div className="space-y-2.5 pt-3 text-xs font-mono">
        {/* ROP */}
        <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] flex items-center justify-between gap-3">
          <div>
            <span className="text-[9px] text-[#8B877D] uppercase font-bold block">
              Rate of Penetration (ROP)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <strong className="text-base font-extrabold text-[#0D1B24]">
                {currentPoint.ropMh} m/h
              </strong>
              <span className="text-[10px] text-[#8B877D]">Avg: {ropAvg} m/h</span>
            </div>
          </div>

          <div
            className={cn(
              "px-2 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-1",
              ropDelta >= 0
                ? "bg-[#2F8068]/15 text-[#2F8068]"
                : "bg-[#D96B3B]/15 text-[#D96B3B]"
            )}
          >
            {ropDelta >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            <span>{ropDelta >= 0 ? `+${ropDelta}%` : `${ropDelta}%`}</span>
          </div>
        </div>

        {/* Rotary Torque */}
        <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] flex items-center justify-between gap-3">
          <div>
            <span className="text-[9px] text-[#8B877D] uppercase font-bold block">
              Surface Rotary Torque
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <strong className="text-base font-extrabold text-[#0D1B24]">
                {currentPoint.torqueKftLb} kft-lb
              </strong>
              <span className="text-[10px] text-[#8B877D]">Avg: {torqueAvg} kft-lb</span>
            </div>
          </div>

          <div
            className={cn(
              "px-2 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-1",
              torqueDelta > 5
                ? "bg-[#D96B3B]/15 text-[#D96B3B]"
                : "bg-[#2F8068]/15 text-[#2F8068]"
            )}
          >
            {torqueDelta > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
            <span>{torqueDelta >= 0 ? `+${torqueDelta}%` : `${torqueDelta}%`}</span>
          </div>
        </div>

        {/* Weight on Bit */}
        <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] flex items-center justify-between gap-3">
          <div>
            <span className="text-[9px] text-[#8B877D] uppercase font-bold block">
              Weight on Bit (WOB)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <strong className="text-base font-extrabold text-[#0D1B24]">
                {currentPoint.wobKlbf} klbf
              </strong>
              <span className="text-[10px] text-[#8B877D]">Avg: {wobAvg} klbf</span>
            </div>
          </div>

          <div className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-[#DDD2C0]/40 text-[#142B3A] flex items-center gap-1">
            <span>{wobDelta >= 0 ? `+${wobDelta}%` : `${wobDelta}%`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
