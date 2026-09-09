"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { GitCompare, AlertTriangle, Sparkles, Layers, Info } from "lucide-react";
import { LiveTelemetryPoint } from "./types";
import { PARAMETER_CONFIGS, WellBaselineParameters } from "./telemetryEngine";
import { cn } from "@/lib/utils";

interface MultiParameterCorrelationProps {
  points: LiveTelemetryPoint[];
  baseline: WellBaselineParameters;
  wellName: string;
}

interface TrackConfig {
  key: keyof LiveTelemetryPoint;
  label: string;
  unit: string;
  color: string;
  decimals: number;
}

export function MultiParameterCorrelation({
  points,
  baseline,
  wellName,
}: MultiParameterCorrelationProps) {
  const currentPoint = points[points.length - 1];

  const tracks: TrackConfig[] = [
    { key: "depthM", label: "DEPTH", unit: "m", color: "#142B3A", decimals: 1 },
    { key: "ropMh", label: "ROP", unit: "m/h", color: "#245463", decimals: 1 },
    { key: "torqueKftLb", label: "TORQUE", unit: "kft-lb", color: "#A9533D", decimals: 1 },
    { key: "wobKlbf", label: "WOB", unit: "klbf", color: "#D96B3B", decimals: 1 },
    { key: "sppPsi", label: "SPP", unit: "psi", color: "#843D35", decimals: 0 },
    { key: "rpm", label: "RPM", unit: "rpm", color: "#8B877D", decimals: 0 },
  ];

  // Pattern detection check
  const isTorqueSpike = currentPoint?.torqueKftLb > baseline.torque * 1.08;
  const isRopDrop = currentPoint?.ropMh < baseline.rop * 0.9;
  const isSppRise = currentPoint?.sppPsi > baseline.spp + 60;
  const isMultiPattern = isTorqueSpike && (isRopDrop || isSppRise);

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-2xl p-4 sm:p-6 shadow-xs select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0">
            <GitCompare className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold font-mono text-[#0D1B24] tracking-tight">
                DRILLING PARAMETER CORRELATION
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#245463] text-white">
                SYNCHRONIZED TRACKS
              </span>
            </div>
            <p className="text-xs text-[#8B877D] mt-0.5">
              Hover across any strip to correlate simultaneous mechanical and hydraulic events.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-[#8B877D] self-start sm:self-auto flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          <span>Shared 45-min Time Axis</span>
        </div>
      </div>

      {/* Pattern Detection Banner */}
      {isMultiPattern && (
        <div className="my-3 p-3 rounded-xl bg-[#D96B3B]/10 border border-[#D96B3B]/30 flex items-start gap-3">
          <div className="h-6 w-6 rounded-lg bg-[#D96B3B] text-white flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <strong className="text-[#A9533D] uppercase font-bold tracking-wider text-[11px]">
                PATTERN DETECTED
              </strong>
              <span className="text-[10px] text-[#8B877D]">· Early-Warning Signature</span>
            </div>
            <p className="text-[#0D1B24] mt-0.5 font-sans leading-relaxed">
              Torque increased while ROP decreased and SPP rose relative to the recent operating baseline.
              This multi-parameter signature aligns with lithological transition into higher-drag sandstone.
            </p>
            <span className="text-[10px] font-mono text-[#8B877D] mt-1 block">
              Note: This is an explainable pattern detection indicator, not an automated prediction.
            </span>
          </div>
        </div>
      )}

      {/* Synchronized Multi-Track Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {tracks.map((t) => {
          const val = currentPoint ? (currentPoint[t.key] as number) : 0;

          return (
            <div
              key={t.key}
              className="p-3 rounded-xl bg-white border border-[#DDD2C0] flex flex-col justify-between"
            >
              {/* Track Title */}
              <div className="flex items-center justify-between gap-2 mb-1 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="font-bold text-[#0D1B24]">{t.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <strong className="text-sm text-[#0D1B24] font-extrabold">{val}</strong>
                  <span className="text-[10px] text-[#8B877D]">{t.unit}</span>
                </div>
              </div>

              {/* Mini Sparkline Chart */}
              <div className="h-16 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={points}
                    syncId="drillingCorrelation"
                    margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke="#F5F0E6" vertical={false} />
                    <XAxis dataKey="minuteLabel" hide />
                    <YAxis hide domain={["auto", "auto"]} />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const d = payload[0].payload as LiveTelemetryPoint;
                        return (
                          <div className="p-1.5 rounded-lg bg-[#0D1B24] text-white text-[10px] font-mono shadow-md border border-white/10">
                            <div>{d.timeLabel}</div>
                            <div className="font-bold text-[#D96B3B]">
                              {d[t.key] as number} {t.unit}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={t.key}
                      stroke={t.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
