"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";

const TELEMETRY_DATA = [
  { time: "14:00", depth: 3220, rop: 16.2, pressure: 17.8, temp: 83, rpm: 810 },
  { time: "14:15", depth: 3224, rop: 17.5, pressure: 18.0, temp: 84, rpm: 815 },
  { time: "14:30", depth: 3228, rop: 18.1, pressure: 18.2, temp: 84, rpm: 820 },
  { time: "14:45", depth: 3231, rop: 17.8, pressure: 18.3, temp: 85, rpm: 820 },
  { time: "15:00", depth: 3234, rop: 19.4, pressure: 18.6, temp: 85, rpm: 825 },
  { time: "15:15", depth: 3237, rop: 18.9, pressure: 18.4, temp: 85, rpm: 820 },
  { time: "15:30", depth: 3240, rop: 18.5, pressure: 18.5, temp: 85, rpm: 820 },
];

export function LiveTelemetry() {
  const [timeWindow, setTimeWindow] = useState<"1h" | "6h" | "12h" | "24h">("1h");

  return (
    <section className="relative w-full py-16 lg:py-20 overflow-hidden border-b border-[#DDD2C0] select-none">
      {/* Ambient Geological Background System - Live Drilling Telemetry Variant */}
      <GeologicalBackground variant="telemetry" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A9533D] font-extrabold">
              <Radio className="h-3.5 w-3.5 text-[#D96B3B] animate-pulse" />
              <span>REAL-TIME MWD SENSOR STREAM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B24] leading-[1.08]">
              Live Drilling<br />
              <span className="text-[#D96B3B]">Intelligence.</span>
            </h2>
            <p className="text-base text-[#142B3A]/80 max-w-xl leading-relaxed">
              Continuous surface and downhole sensor streams calibrated against Nahorkatiya offset baselines.
            </p>
          </div>

          {/* Time Window Selector (Selected: Copper Flame #D96B3B with white text) */}
          <div className="flex items-center gap-1.5 bg-[#DDD2C0]/30 p-1.5 rounded-2xl border border-[#DDD2C0] shadow-2xs">
            {(["1h", "6h", "12h", "24h"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeWindow(t)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer",
                  timeWindow === t
                    ? "bg-[#D96B3B] text-white shadow-2xs"
                    : "text-[#142B3A]/70 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Large Telemetry Metric Values: 3,240 m, 18.5 MPa, 85°C, 820 rpm */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Metric 1: Depth */}
          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] text-left hover:border-[#142B3A]/40 transition-all shadow-2xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
              Bit Depth (MD)
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-[#0D1B24] tracking-tight">
                3,240
              </span>
              <span className="text-lg font-mono text-[#142B3A]/60 font-semibold">m</span>
            </div>
            <span className="text-xs font-mono text-[#2F8068] font-bold mt-2 block">
              Target: 3,850 m TD
            </span>
          </div>

          {/* Metric 2: Pressure */}
          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] text-left hover:border-[#142B3A]/40 transition-all shadow-2xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
              Standpipe Pressure
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-[#0D1B24] tracking-tight">
                18.5
              </span>
              <span className="text-lg font-mono text-[#142B3A]/60 font-semibold">MPa</span>
            </div>
            <span className="text-xs font-mono text-[#2F8068] font-bold mt-2 block">
              Hydrostatic Balanced
            </span>
          </div>

          {/* Metric 3: Temp */}
          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] text-left hover:border-[#142B3A]/40 transition-all shadow-2xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
              Downhole Temp
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-[#0D1B24] tracking-tight">
                85
              </span>
              <span className="text-lg font-mono text-[#142B3A]/60 font-semibold">°C</span>
            </div>
            <span className="text-xs font-mono text-[#A9533D] font-bold mt-2 block">
              Geothermal Gradient: +2.8°C/100m
            </span>
          </div>

          {/* Metric 4: RPM */}
          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] text-left hover:border-[#142B3A]/40 transition-all shadow-2xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
              Rotary Speed
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-[#0D1B24] tracking-tight">
                820
              </span>
              <span className="text-lg font-mono text-[#142B3A]/60 font-semibold">rpm</span>
            </div>
            <span className="text-xs font-mono text-[#2F8068] font-bold mt-2 block">
              Stable Bit Dynamics
            </span>
          </div>
        </div>

        {/* Contextual Intelligence Strip: Telemetry vs Offset Baseline vs Threshold vs Pattern Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] font-mono text-xs shadow-2xs">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase text-[#142B3A]/70 font-bold">CURRENT SIGNAL</span>
            <span className="text-base font-extrabold text-[#0D1B24] mt-0.5">18.5 MPa</span>
            <span className="text-[10px] text-[#142B3A]/60">Standpipe Pressure</span>
          </div>
          <div className="flex flex-col text-left sm:border-l border-[#DDD2C0] sm:pl-4">
            <span className="text-[10px] uppercase text-[#142B3A]/70 font-bold">HISTORICAL BASELINE</span>
            <span className="text-base font-extrabold text-[#245463] mt-0.5">16.8 MPa</span>
            <span className="text-[10px] text-[#142B3A]/60">Nahorkatiya Offset Avg</span>
          </div>
          <div className="flex flex-col text-left lg:border-l border-[#DDD2C0] lg:pl-4">
            <span className="text-[10px] uppercase text-[#142B3A]/70 font-bold">OPERATING THRESHOLD</span>
            <span className="text-base font-extrabold text-[#A9533D] mt-0.5">19.0 MPa</span>
            <span className="text-[10px] text-[#142B3A]/60">Sticking Risk Boundary</span>
          </div>
          <div className="flex flex-col text-left sm:border-l border-[#DDD2C0] sm:pl-4">
            <span className="text-[10px] uppercase text-[#142B3A]/70 font-bold">PATTERN STATUS</span>
            <span className="text-base font-extrabold text-[#2F8068] mt-0.5 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2F8068]" />
              No Escalation Detected
            </span>
            <span className="text-[10px] text-[#142B3A]/60">Safe Hydrostatic Window</span>
          </div>
        </div>

        {/* Large Telemetry Chart Canvas */}
        <div className="relative w-full h-[400px] sm:h-[460px] rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] p-5 sm:p-8 shadow-sm">
          {/* Floating Chart Parameter Indicator */}
          <div className="absolute top-6 left-6 z-10 hidden sm:flex items-center gap-3 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-2 rounded-xl border border-[#DDD2C0] shadow-2xs">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D96B3B] animate-pulse" />
            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-[#142B3A]/60">PARAMETER: </span>
                <span className="font-bold text-[#0D1B24]">Standpipe Pressure (MPa)</span>
              </div>
              <div className="text-[#142B3A]/60 border-l border-[#DDD2C0] pl-3">
                <span>THRESHOLD: </span>
                <span className="font-bold text-[#A9533D]">19.0 MPa</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TELEMETRY_DATA} margin={{ top: 40, right: 20, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="telemetryOrangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D96B3B" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#D96B3B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDD2C0" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#142B3A"
                fontSize={11}
                fontFamily="monospace"
                tickLine={false}
              />
              <YAxis
                stroke="#142B3A"
                fontSize={11}
                fontFamily="monospace"
                tickLine={false}
                axisLine={false}
                domain={[15.5, 20.0]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F5F0E6",
                  borderColor: "#DDD2C0",
                  borderRadius: "14px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  color: "#0D1B24",
                  boxShadow: "0 4px 16px rgba(20,43,58,0.12)",
                }}
              />
              {/* Historical Baseline Line */}
              <ReferenceLine
                y={16.8}
                stroke="#245463"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: "Offset Baseline (16.8 MPa)",
                  fill: "#245463",
                  fontSize: 10,
                  position: "insideBottomRight",
                }}
              />
              {/* Operating Threshold Line */}
              <ReferenceLine
                y={19.0}
                stroke="#A9533D"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: "Operating Threshold (19.0 MPa)",
                  fill: "#A9533D",
                  fontSize: 10,
                  position: "insideTopRight",
                }}
              />
              <Area
                type="monotone"
                dataKey="pressure"
                stroke="#D96B3B"
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#telemetryOrangeGradient)"
                dot={{ r: 4, fill: "#D96B3B", stroke: "#142B3A", strokeWidth: 1.5 }}
                activeDot={{ r: 7, fill: "#D96B3B", stroke: "#142B3A", strokeWidth: 2 }}
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
