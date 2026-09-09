"use client";

import React, { useState } from "react";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LiveTelemetryPoint, TelemetryParameterKey } from "./types";
import { WellBaselineParameters } from "./telemetryEngine";
import { cn } from "@/lib/utils";

interface TopStatusBarProps {
  currentPoint: LiveTelemetryPoint;
  baseline: WellBaselineParameters;
  onSelectParameterTab?: (key: TelemetryParameterKey) => void;
  activeParameter?: TelemetryParameterKey;
}

interface MetricItem {
  id: TelemetryParameterKey | "depth";
  label: string;
  fullName: string;
  value: string | number;
  unit: string;
  trendText?: string;
  trendDirection?: "up" | "down" | "flat";
  isWarning?: boolean;
  tooltipText: string;
}

export function TopStatusBar({
  currentPoint,
  baseline,
  onSelectParameterTab,
  activeParameter,
}: TopStatusBarProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const ropDelta = +(((currentPoint.ropMh - baseline.rop) / baseline.rop) * 100).toFixed(1);
  const wobDelta = +(((currentPoint.wobKlbf - baseline.wob) / baseline.wob) * 100).toFixed(1);
  const rpmDelta = +(((currentPoint.rpm - baseline.rpm) / baseline.rpm) * 100).toFixed(1);
  const torqueDelta = +(((currentPoint.torqueKftLb - baseline.torque) / baseline.torque) * 100).toFixed(1);
  const flowDelta = +(((currentPoint.flowRateGpm - baseline.flowRate) / baseline.flowRate) * 100).toFixed(1);
  const sppDelta = +(((currentPoint.sppPsi - baseline.spp) / baseline.spp) * 100).toFixed(1);

  const metrics: MetricItem[] = [
    {
      id: "depth",
      label: "DEPTH",
      fullName: "Current Measured Depth",
      value: currentPoint.depthM,
      unit: "m",
      trendText: "Active",
      trendDirection: "up",
      tooltipText: "MD: Total length of wellbore drilled from surface.",
    },
    {
      id: "rop",
      label: "ROP",
      fullName: "Rate of Penetration",
      value: currentPoint.ropMh,
      unit: "m/h",
      trendText: `${ropDelta >= 0 ? "+" : ""}${ropDelta}%`,
      trendDirection: ropDelta > 2 ? "up" : ropDelta < -2 ? "down" : "flat",
      tooltipText: "ROP: Drilling penetration speed through rock.",
    },
    {
      id: "wob",
      label: "WOB",
      fullName: "Weight on Bit",
      value: currentPoint.wobKlbf,
      unit: "klbf",
      trendText: `${wobDelta >= 0 ? "+" : ""}${wobDelta}%`,
      trendDirection: "flat",
      tooltipText: "WOB: Axial compressive weight applied to bit.",
    },
    {
      id: "rpm",
      label: "RPM",
      fullName: "Rotations per Minute",
      value: currentPoint.rpm,
      unit: "rpm",
      trendText: `${rpmDelta >= 0 ? "+" : ""}${rpmDelta}%`,
      trendDirection: "flat",
      tooltipText: "RPM: Rotary speed of drill string.",
    },
    {
      id: "torque",
      label: "TORQUE",
      fullName: "Rotary Torque",
      value: currentPoint.torqueKftLb,
      unit: "kft-lb",
      trendText: `${torqueDelta >= 0 ? "+" : ""}${torqueDelta}%`,
      trendDirection: "up",
      isWarning: true, // Visual prominence for warning parameter
      tooltipText: "TORQUE: Rotary resistance (Elevated above baseline).",
    },
    {
      id: "mudWeight",
      label: "MUD WT",
      fullName: "Active Mud Weight",
      value: currentPoint.mudWeightPpg,
      unit: "ppg",
      trendText: "Nominal",
      trendDirection: "flat",
      tooltipText: "Mud Density: Fluid hydrostatic overbalance.",
    },
    {
      id: "flowRate",
      label: "FLOW RATE",
      fullName: "Pump Flow Rate",
      value: currentPoint.flowRateGpm,
      unit: "gpm",
      trendText: `${flowDelta >= 0 ? "+" : ""}${flowDelta}%`,
      trendDirection: "flat",
      tooltipText: "Flow Rate: Active mud circulation volume.",
    },
    {
      id: "spp",
      label: "SPP",
      fullName: "Standpipe Pressure",
      value: currentPoint.sppPsi,
      unit: "psi",
      trendText: `${sppDelta >= 0 ? "+" : ""}${sppDelta}%`,
      trendDirection: sppDelta > 3 ? "up" : "flat",
      tooltipText: "SPP: Total hydraulic circulation pressure.",
    },
  ];

  return (
    <div className="w-full select-none">
      {/* Compact 8-cell Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
        {metrics.map((m) => {
          const isSelected = activeParameter === m.id;
          const isClickable = m.id !== "depth" && onSelectParameterTab;

          return (
            <div
              key={m.id}
              onClick={() => {
                if (isClickable && m.id !== "depth") {
                  onSelectParameterTab(m.id as TelemetryParameterKey);
                }
              }}
              onMouseEnter={() => setHoveredMetric(m.id)}
              onMouseLeave={() => setHoveredMetric(null)}
              className={cn(
                "relative px-2.5 py-2 rounded-xl border transition-all flex flex-col justify-between group",
                isSelected
                  ? "bg-[#142B3A] border-[#142B3A] text-white shadow-xs"
                  : m.isWarning
                  ? "bg-[#FAF8F5] border-[#D96B3B] ring-1 ring-[#D96B3B]/40 hover:bg-white"
                  : "bg-[#FAF8F5] border-[#DDD2C0] hover:bg-white hover:border-[#8B877D]",
                isClickable ? "cursor-pointer" : "cursor-default"
              )}
            >
              {/* Header Label */}
              <div className="flex items-center justify-between gap-1">
                <span
                  className={cn(
                    "text-[10px] font-mono font-bold tracking-wider uppercase truncate",
                    isSelected
                      ? "text-[#DDD2C0]"
                      : m.isWarning
                      ? "text-[#D96B3B]"
                      : "text-[#8B877D]"
                  )}
                >
                  {m.label}
                </span>

                {m.isWarning && !isSelected && (
                  <span className="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-[#D96B3B]/15 text-[#D96B3B] uppercase">
                    WATCH
                  </span>
                )}
              </div>

              {/* Main Metric Value + Unit */}
              <div className="flex items-baseline gap-1 my-0.5">
                <span
                  className={cn(
                    "text-base sm:text-lg font-extrabold font-mono tracking-tight",
                    isSelected
                      ? "text-white"
                      : m.isWarning
                      ? "text-[#0D1B24]"
                      : "text-[#0D1B24]"
                  )}
                >
                  {typeof m.value === "number" ? m.value.toLocaleString() : m.value}
                </span>
                <span
                  className={cn(
                    "text-[9px] font-mono",
                    isSelected ? "text-[#DDD2C0]" : "text-[#8B877D]"
                  )}
                >
                  {m.unit}
                </span>
              </div>

              {/* Trend line */}
              <div className="flex items-center justify-between text-[9px] font-mono text-[#8B877D] pt-1 border-t border-[#DDD2C0]/40">
                <span className={m.isWarning && !isSelected ? "text-[#D96B3B] font-bold" : isSelected ? "text-[#DDD2C0]" : ""}>
                  {m.trendText}
                </span>
                <Info className="h-2.5 w-2.5 opacity-40 group-hover:opacity-100" />
              </div>

              {/* Tooltip on hover */}
              {hoveredMetric === m.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 p-2 rounded-lg bg-[#0D1B24] text-white text-[10px] font-mono shadow-lg z-50 pointer-events-none">
                  <div className="font-bold text-[#D96B3B]">{m.fullName}</div>
                  <div className="text-[#DDD2C0] mt-0.5">{m.tooltipText}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
