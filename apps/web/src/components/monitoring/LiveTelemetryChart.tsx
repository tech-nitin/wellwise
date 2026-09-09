"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { LiveTelemetryPoint, TelemetryParameterKey } from "./types";
import { PARAMETER_CONFIGS, WellBaselineParameters } from "./telemetryEngine";
import { cn } from "@/lib/utils";

interface LiveTelemetryChartProps {
  points: LiveTelemetryPoint[];
  activeParameter: TelemetryParameterKey;
  onSelectParameter: (key: TelemetryParameterKey) => void;
  baseline: WellBaselineParameters;
  highlightedTimestampMs: number | null;
}

const SELECTABLE_PARAMETERS: TelemetryParameterKey[] = [
  "torque",
  "rop",
  "wob",
  "rpm",
  "spp",
  "flowRate",
  "mudWeight",
];

export function LiveTelemetryChart({
  points,
  activeParameter,
  onSelectParameter,
  baseline,
  highlightedTimestampMs,
}: LiveTelemetryChartProps) {
  const config = PARAMETER_CONFIGS[activeParameter];
  const currentPoint = points[points.length - 1];

  const baselineValue = useMemo(() => {
    switch (activeParameter) {
      case "rop":
        return baseline.rop;
      case "wob":
        return baseline.wob;
      case "rpm":
        return baseline.rpm;
      case "torque":
        return baseline.torque;
      case "flowRate":
        return baseline.flowRate;
      case "spp":
        return baseline.spp;
      case "mudWeight":
        return baseline.mudWeight;
      default:
        return 0;
    }
  }, [activeParameter, baseline]);

  const currentValue = useMemo(() => {
    if (!currentPoint) return 0;
    switch (activeParameter) {
      case "rop":
        return currentPoint.ropMh;
      case "wob":
        return currentPoint.wobKlbf;
      case "rpm":
        return currentPoint.rpm;
      case "torque":
        return currentPoint.torqueKftLb;
      case "flowRate":
        return currentPoint.flowRateGpm;
      case "spp":
        return currentPoint.sppPsi;
      case "mudWeight":
        return currentPoint.mudWeightPpg;
      default:
        return 0;
    }
  }, [activeParameter, currentPoint]);

  const deltaPercent = useMemo(() => {
    if (!baselineValue) return 0;
    return +(((currentValue - baselineValue) / baselineValue) * 100).toFixed(1);
  }, [currentValue, baselineValue]);

  const chartData = useMemo(() => {
    return points.map((p) => {
      let val = p.torqueKftLb;
      if (activeParameter === "rop") val = p.ropMh;
      if (activeParameter === "wob") val = p.wobKlbf;
      if (activeParameter === "rpm") val = p.rpm;
      if (activeParameter === "flowRate") val = p.flowRateGpm;
      if (activeParameter === "spp") val = p.sppPsi;
      if (activeParameter === "mudWeight") val = p.mudWeightPpg;

      return {
        ...p,
        value: val,
        baseline: baselineValue,
      };
    });
  }, [points, activeParameter, baselineValue]);

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return ["auto", "auto"];
    const values = chartData.map((d) => d.value);
    const minVal = Math.min(...values, baselineValue, config.demoThresholdMin ?? Infinity);
    const maxVal = Math.max(...values, baselineValue, config.demoThresholdMax ?? -Infinity);
    const padding = (maxVal - minVal) * 0.15 || 1.5;
    return [Math.max(0, +(minVal - padding).toFixed(1)), +(maxVal + padding).toFixed(1)];
  }, [chartData, baselineValue, config]);

  const highlightedMinuteLabel = useMemo(() => {
    if (!highlightedTimestampMs) return null;
    const pt = points.find((p) => Math.abs(p.timestamp - highlightedTimestampMs) < 90000);
    return pt ? pt.minuteLabel : null;
  }, [highlightedTimestampMs, points]);

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none flex flex-col justify-between">
      {/* Header: Title & Parameter Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-extrabold font-mono text-[#0D1B24] tracking-tight">
            LIVE TELEMETRY
          </h2>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#142B3A] text-white">
            45-MIN WINDOW
          </span>
        </div>

        {/* Compact Parameter Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          {SELECTABLE_PARAMETERS.map((key) => {
            const p = PARAMETER_CONFIGS[key];
            const isSelected = activeParameter === key;
            return (
              <button
                key={key}
                onClick={() => onSelectParameter(key)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer whitespace-nowrap",
                  isSelected
                    ? "bg-[#142B3A] text-white"
                    : "bg-white text-[#142B3A]/80 border border-[#DDD2C0] hover:bg-[#DDD2C0]/40"
                )}
              >
                {p.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameter Value Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 my-2 px-3 py-2 rounded-xl bg-white border border-[#DDD2C0]">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[9px] font-mono font-bold text-[#8B877D] uppercase block">
              {config.fullName}
            </span>
            <div className="flex items-baseline gap-1.5">
              <strong className="text-xl sm:text-2xl font-extrabold font-mono text-[#0D1B24]">
                {currentValue}
              </strong>
              <span className="text-xs font-mono text-[#8B877D]">{config.unit}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-[#DDD2C0]" />

          <div className="text-xs font-mono">
            <span className="text-[9px] text-[#8B877D] block">Baseline</span>
            <span className="text-[#142B3A] font-bold">{baselineValue} {config.unit}</span>
          </div>

          <div className="hidden sm:block text-xs font-mono">
            <span className="text-[9px] text-[#8B877D] block">Current Depth</span>
            <span className="text-[#0D1B24] font-bold">{currentPoint?.depthM} m</span>
          </div>
        </div>

        {/* Delta Badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px]",
              deltaPercent > 5
                ? "bg-[#D96B3B]/15 text-[#D96B3B] border border-[#D96B3B]/30"
                : deltaPercent < -5
                ? "bg-[#245463]/15 text-[#245463] border border-[#245463]/30"
                : "bg-[#2F8068]/15 text-[#2F8068] border border-[#2F8068]/30"
            )}
          >
            {deltaPercent > 0 ? <TrendingUp className="h-3 w-3" /> : deltaPercent < 0 ? <TrendingDown className="h-3 w-3" /> : null}
            <span>{deltaPercent >= 0 ? `+${deltaPercent}%` : `${deltaPercent}%`} vs baseline</span>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas - Full Height Without Wasted Space */}
      <div className="h-[250px] sm:h-[280px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E9E4DA" vertical={false} />

            <XAxis
              dataKey="minuteLabel"
              stroke="#8B877D"
              tick={{ fill: "#8B877D", fontSize: 10, fontFamily: "monospace" }}
              tickLine={{ stroke: "#DDD2C0" }}
              axisLine={{ stroke: "#DDD2C0" }}
              interval="preserveStartEnd"
              minTickGap={25}
            />

            <YAxis
              stroke="#8B877D"
              domain={yDomain}
              tick={{ fill: "#8B877D", fontSize: 10, fontFamily: "monospace" }}
              tickLine={{ stroke: "#DDD2C0" }}
              axisLine={{ stroke: "#DDD2C0" }}
              tickFormatter={(v) => `${v}`}
            />

            <RechartsTooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as LiveTelemetryPoint & { value: number };
                const variance = +(d.value - baselineValue).toFixed(1);
                const variancePct = +((variance / (baselineValue || 1)) * 100).toFixed(1);

                return (
                  <div className="p-2.5 rounded-xl bg-[#0D1B24] text-white font-mono text-xs shadow-xl border border-white/10 space-y-1 select-none">
                    <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-1 text-[#DDD2C0] text-[10px]">
                      <span className="font-bold text-[#D96B3B]">{d.timeLabel}</span>
                      <span>Depth: {d.depthM} m</span>
                    </div>

                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[#8B877D] uppercase text-[10px]">{config.shortLabel}:</span>
                      <strong className="text-white text-sm font-extrabold">
                        {d.value} {config.unit}
                      </strong>
                    </div>

                    <div className="text-[10px] text-[#DDD2C0] flex items-center justify-between gap-3">
                      <span>Baseline ({baselineValue}):</span>
                      <span className={variance > 0 ? "text-[#D96B3B] font-bold" : "text-[#2F8068]"}>
                        {variance >= 0 ? `+${variance}` : variance} ({variancePct >= 0 ? `+${variancePct}%` : `${variancePct}%`})
                      </span>
                    </div>
                  </div>
                );
              }}
            />

            <ReferenceLine
              y={baselineValue}
              stroke="#8B877D"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Baseline: ${baselineValue} ${config.unit}`,
                fill: "#8B877D",
                fontSize: 9,
                fontFamily: "monospace",
                position: "insideTopRight",
              }}
            />

            {config.demoThresholdMax && (
              <ReferenceLine
                y={config.demoThresholdMax}
                stroke="#D96B3B"
                strokeDasharray="2 2"
                strokeWidth={1}
                label={{
                  value: `Demo Threshold: ${config.demoThresholdMax}`,
                  fill: "#D96B3B",
                  fontSize: 9,
                  fontFamily: "monospace",
                  position: "insideBottomRight",
                }}
              />
            )}

            {highlightedMinuteLabel && (
              <ReferenceLine
                x={highlightedMinuteLabel}
                stroke="#D96B3B"
                strokeWidth={2}
                label={{
                  value: "EVENT",
                  fill: "#D96B3B",
                  fontSize: 9,
                  fontFamily: "monospace",
                  position: "top",
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: config.color, stroke: "#FFFFFF", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Subtitle / Legend */}
      <div className="flex items-center justify-between pt-1.5 border-t border-[#DDD2C0]/60 text-[10px] font-mono text-[#8B877D]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="h-2 w-3 rounded-xs" style={{ backgroundColor: config.color }} />
            <span className="text-[#0D1B24]">Live {config.shortLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-0.5 w-3 border-t border-dashed border-[#8B877D]" />
            <span>Operating Baseline</span>
          </div>
        </div>

        <span className="hidden sm:inline">Click events below to jump crosshair</span>
      </div>
    </div>
  );
}
