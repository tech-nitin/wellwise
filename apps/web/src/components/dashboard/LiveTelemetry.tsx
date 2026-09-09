"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { Radio, ArrowRight, Gauge, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";

type ParameterKey = "SPP" | "Torque" | "ROP" | "WOB" | "RPM" | "Flow" | "Mud Weight";

interface ParameterConfig {
  key: ParameterKey;
  label: string;
  unit: string;
  currentValue: number;
  baselineValue: number;
  thresholdValue: number;
  interpretation: string;
  domain: [number, number];
  data: { time: string; value: number; baseline: number }[];
}

const PARAMETERS: Record<ParameterKey, ParameterConfig> = {
  SPP: {
    key: "SPP",
    label: "Standpipe Pressure",
    unit: "MPa",
    currentValue: 18.5,
    baselineValue: 16.8,
    thresholdValue: 19.0,
    interpretation: "+1.7 MPa vs offset baseline",
    domain: [15.0, 20.5],
    data: [
      { time: "14:00", value: 17.2, baseline: 16.8 },
      { time: "14:15", value: 17.6, baseline: 16.8 },
      { time: "14:30", value: 18.0, baseline: 16.8 },
      { time: "14:45", value: 18.2, baseline: 16.8 },
      { time: "15:00", value: 18.6, baseline: 16.8 },
      { time: "15:15", value: 18.4, baseline: 16.8 },
      { time: "15:30", value: 18.5, baseline: 16.8 },
    ],
  },
  Torque: {
    key: "Torque",
    label: "Surface Torque",
    unit: "kft-lb",
    currentValue: 18.4,
    baselineValue: 15.2,
    thresholdValue: 21.0,
    interpretation: "+3.2 kft-lb vs offset baseline",
    domain: [12.0, 23.0],
    data: [
      { time: "14:00", value: 15.4, baseline: 15.2 },
      { time: "14:15", value: 16.1, baseline: 15.2 },
      { time: "14:30", value: 16.8, baseline: 15.2 },
      { time: "14:45", value: 17.5, baseline: 15.2 },
      { time: "15:00", value: 18.8, baseline: 15.2 },
      { time: "15:15", value: 18.1, baseline: 15.2 },
      { time: "15:30", value: 18.4, baseline: 15.2 },
    ],
  },
  ROP: {
    key: "ROP",
    label: "Rate of Penetration",
    unit: "m/h",
    currentValue: 18.5,
    baselineValue: 22.0,
    thresholdValue: 14.0,
    interpretation: "-3.5 m/h reduction in Tipam sandstone",
    domain: [10.0, 26.0],
    data: [
      { time: "14:00", value: 23.2, baseline: 22.0 },
      { time: "14:15", value: 21.8, baseline: 22.0 },
      { time: "14:30", value: 20.4, baseline: 22.0 },
      { time: "14:45", value: 19.1, baseline: 22.0 },
      { time: "15:00", value: 17.8, baseline: 22.0 },
      { time: "15:15", value: 18.2, baseline: 22.0 },
      { time: "15:30", value: 18.5, baseline: 22.0 },
    ],
  },
  WOB: {
    key: "WOB",
    label: "Weight on Bit",
    unit: "klbf",
    currentValue: 22.0,
    baselineValue: 20.5,
    thresholdValue: 28.0,
    interpretation: "+1.5 klbf within standard weight window",
    domain: [16.0, 30.0],
    data: [
      { time: "14:00", value: 20.1, baseline: 20.5 },
      { time: "14:15", value: 20.8, baseline: 20.5 },
      { time: "14:30", value: 21.4, baseline: 20.5 },
      { time: "14:45", value: 21.9, baseline: 20.5 },
      { time: "15:00", value: 22.4, baseline: 20.5 },
      { time: "15:15", value: 21.8, baseline: 20.5 },
      { time: "15:30", value: 22.0, baseline: 20.5 },
    ],
  },
  RPM: {
    key: "RPM",
    label: "Rotary Speed",
    unit: "rpm",
    currentValue: 820,
    baselineValue: 800,
    thresholdValue: 900,
    interpretation: "Stable top drive harmonics",
    domain: [750, 920],
    data: [
      { time: "14:00", value: 810, baseline: 800 },
      { time: "14:15", value: 815, baseline: 800 },
      { time: "14:30", value: 820, baseline: 800 },
      { time: "14:45", value: 820, baseline: 800 },
      { time: "15:00", value: 825, baseline: 800 },
      { time: "15:15", value: 820, baseline: 800 },
      { time: "15:30", value: 820, baseline: 800 },
    ],
  },
  Flow: {
    key: "Flow",
    label: "Annular Flow Rate",
    unit: "gpm",
    currentValue: 420,
    baselineValue: 400,
    thresholdValue: 460,
    interpretation: "+20 gpm active circulation",
    domain: [350, 480],
    data: [
      { time: "14:00", value: 398, baseline: 400 },
      { time: "14:15", value: 405, baseline: 400 },
      { time: "14:30", value: 412, baseline: 400 },
      { time: "14:45", value: 418, baseline: 400 },
      { time: "15:00", value: 425, baseline: 400 },
      { time: "15:15", value: 420, baseline: 400 },
      { time: "15:30", value: 420, baseline: 400 },
    ],
  },
  "Mud Weight": {
    key: "Mud Weight",
    label: "Mud Weight In",
    unit: "ppg",
    currentValue: 11.2,
    baselineValue: 10.8,
    thresholdValue: 11.8,
    interpretation: "+0.4 ppg over hydrostatic baseline",
    domain: [10.0, 12.5],
    data: [
      { time: "14:00", value: 10.8, baseline: 10.8 },
      { time: "14:15", value: 10.9, baseline: 10.8 },
      { time: "14:30", value: 11.0, baseline: 10.8 },
      { time: "14:45", value: 11.1, baseline: 10.8 },
      { time: "15:00", value: 11.3, baseline: 10.8 },
      { time: "15:15", value: 11.2, baseline: 10.8 },
      { time: "15:30", value: 11.2, baseline: 10.8 },
    ],
  },
};

export function LiveTelemetry() {
  const [selectedParam, setSelectedParam] = useState<ParameterKey>("SPP");
  const [timeWindow, setTimeWindow] = useState<"1h" | "6h" | "12h" | "24h">("1h");

  const activeConfig = PARAMETERS[selectedParam];

  return (
    <section className="relative w-full py-12 lg:py-16 overflow-hidden border-b border-[#DDD2C0] select-none">
      {/* Ambient Geological Background System - Live Drilling Telemetry Variant */}
      <GeologicalBackground variant="telemetry" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-7 relative z-10">
        {/* Section Header & Flow Indicator */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 text-left">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2F8068] bg-[#2F8068]/10 px-2.5 py-0.5 rounded-full border border-[#2F8068]/30">
                03 &bull; MONITOR REAL-TIME DRILLING SIGNALS
              </span>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A9533D] font-extrabold">
              <Radio className="h-3.5 w-3.5 text-[#D96B3B] animate-pulse" />
              <span>REAL-TIME MWD SENSOR STREAM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B24] leading-[1.08]">
              Live Drilling<br />
              <span className="text-[#D96B3B]">Intelligence.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#142B3A]/80 max-w-xl leading-relaxed">
              Continuous surface and downhole sensor streams calibrated against Nahorkatiya offset baselines.
            </p>
          </div>

          {/* Right Controls: Live Pulse & Time Window Selector */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Live Indicator Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DDD2C0] shadow-2xs font-mono text-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2F8068] animate-pulse" />
              <span className="text-[#0D1B24] font-bold">● LIVE</span>
              <span className="text-[#142B3A]/60 text-[11px]">Updated 4 sec ago</span>
            </div>

            {/* Time Window Selector */}
            <div className="flex items-center gap-1 bg-[#DDD2C0]/30 p-1 rounded-xl border border-[#DDD2C0] shadow-2xs">
              {(["1h", "6h", "12h", "24h"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeWindow(t)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer",
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
        </div>

        {/* 4 Large Primary Telemetry Values (Synced with NHK-124 Demo Data) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Metric 1: Depth */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] text-left hover:border-[#245463]/50 transition-all shadow-2xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
              BIT DEPTH
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-3xl sm:text-4xl font-black font-mono text-[#0D1B24] tracking-tight">
                3,240
              </span>
              <span className="text-base font-mono text-[#142B3A]/60 font-semibold">m</span>
            </div>
            <span className="text-xs font-mono text-[#2F8068] font-bold mt-2 block">
              Target: 3,850 m TD
            </span>
          </div>

          {/* Metric 2: Pressure */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] text-left hover:border-[#245463]/50 transition-all shadow-2xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
              STANDPIPE PRESSURE
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-3xl sm:text-4xl font-black font-mono text-[#0D1B24] tracking-tight">
                18.5
              </span>
              <span className="text-base font-mono text-[#142B3A]/60 font-semibold">MPa</span>
            </div>
            <span className="text-xs font-mono text-[#2F8068] font-bold mt-2 block">
              Hydrostatic Balanced
            </span>
          </div>

          {/* Metric 3: Temp */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] text-left hover:border-[#245463]/50 transition-all shadow-2xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
              DOWNHOLE TEMP
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-3xl sm:text-4xl font-black font-mono text-[#0D1B24] tracking-tight">
                85
              </span>
              <span className="text-base font-mono text-[#142B3A]/60 font-semibold">°C</span>
            </div>
            <span className="text-xs font-mono text-[#A9533D] font-bold mt-2 block">
              Geothermal Gradient: +2.8°C/100m
            </span>
          </div>

          {/* Metric 4: RPM */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] text-left hover:border-[#245463]/50 transition-all shadow-2xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
              ROTARY SPEED
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-3xl sm:text-4xl font-black font-mono text-[#0D1B24] tracking-tight">
                820
              </span>
              <span className="text-base font-mono text-[#142B3A]/60 font-semibold">rpm</span>
            </div>
            <span className="text-xs font-mono text-[#2F8068] font-bold mt-2 block">
              Stable Bit Dynamics
            </span>
          </div>
        </div>

        {/* Interpreted Context Intelligence Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] font-mono text-xs shadow-2xs">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase text-[#142B3A]/70 font-bold">CURRENT SIGNAL</span>
            <span className="text-base font-extrabold text-[#0D1B24] mt-0.5">18.5 MPa</span>
            <span className="text-[10px] text-[#A9533D] font-semibold">+1.7 MPa vs offset baseline</span>
          </div>
          <div className="flex flex-col text-left sm:border-l border-[#DDD2C0] sm:pl-4">
            <span className="text-[10px] uppercase text-[#142B3A]/70 font-bold">HISTORICAL BASELINE</span>
            <span className="text-base font-extrabold text-[#245463] mt-0.5">16.8 MPa</span>
            <span className="text-[10px] text-[#142B3A]/70">Nahorkatiya offset average</span>
          </div>
          <div className="flex flex-col text-left lg:border-l border-[#DDD2C0] lg:pl-4">
            <span className="text-[10px] uppercase text-[#142B3A]/70 font-bold">OPERATING THRESHOLD</span>
            <span className="text-base font-extrabold text-[#A9533D] mt-0.5">19.0 MPa</span>
            <span className="text-[10px] text-[#142B3A]/70">Investigation boundary</span>
          </div>
          <div className="flex flex-col text-left sm:border-l border-[#DDD2C0] sm:pl-4">
            <span className="text-[10px] uppercase text-[#142B3A]/70 font-bold">PATTERN STATUS</span>
            <span className="text-base font-extrabold text-[#2F8068] mt-0.5 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2F8068]" />
              ● Stable
            </span>
            <span className="text-[10px] text-[#142B3A]/70">No escalation detected</span>
          </div>
        </div>

        {/* Telemetry Chart Canvas with Parameter Switcher */}
        <div className="rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] p-5 sm:p-7 shadow-sm space-y-4">
          {/* Top Bar: Parameter Switcher Tabs + Last 90 Min indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#DDD2C0]">
            {/* Parameter Selector Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(Object.keys(PARAMETERS) as ParameterKey[]).map((paramKey) => {
                const isSelected = selectedParam === paramKey;
                return (
                  <button
                    key={paramKey}
                    onClick={() => setSelectedParam(paramKey)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer",
                      isSelected
                        ? "bg-[#142B3A] text-white shadow-2xs border border-[#142B3A]"
                        : "bg-[#DDD2C0]/25 text-[#142B3A]/80 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/50 border border-[#DDD2C0]"
                    )}
                  >
                    {paramKey}
                  </button>
                );
              })}
            </div>

            {/* Last 90 Min Badge & CTA */}
            <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#DDD2C0]/30 text-[#142B3A]/70 font-bold text-[11px] border border-[#DDD2C0]">
                LAST 90 MIN
              </span>
              <Link
                href="/live-monitoring"
                className="inline-flex items-center gap-1 text-[#0D1B24] font-bold hover:text-[#D96B3B] transition-colors"
              >
                <span>View Live Monitoring</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#D96B3B]" />
              </Link>
            </div>
          </div>

          {/* Active Parameter Header readout */}
          <div className="flex items-center justify-between font-mono text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D96B3B] animate-pulse" />
              <span className="font-bold text-[#0D1B24]">
                {activeConfig.label} ({activeConfig.unit})
              </span>
              <span className="text-[#142B3A]/60 hidden sm:inline">&bull;</span>
              <span className="text-[#D96B3B] font-bold hidden sm:inline">
                Current: {activeConfig.currentValue} {activeConfig.unit}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-[#245463]">
                Baseline: <strong>{activeConfig.baselineValue} {activeConfig.unit}</strong>
              </span>
              <span className="text-[#A9533D]">
                Threshold: <strong>{activeConfig.thresholdValue} {activeConfig.unit}</strong>
              </span>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="relative w-full h-[320px] sm:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeConfig.data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="telemetryGradient" x1="0" y1="0" x2="0" y2="1">
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
                  domain={activeConfig.domain}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value as number;
                      const delta = (val - activeConfig.baselineValue).toFixed(1);
                      const sign = Number(delta) >= 0 ? "+" : "";
                      return (
                        <div className="p-3 rounded-xl bg-[#F5F0E6] border border-[#DDD2C0] shadow-md font-mono text-xs space-y-1">
                          <span className="font-bold text-[#0D1B24] block">{label}</span>
                          <div className="text-sm font-black text-[#D96B3B]">
                            {activeConfig.label}: {val} {activeConfig.unit}
                          </div>
                          <div className="text-[10px] text-[#142B3A]/70 pt-1 border-t border-[#DDD2C0]">
                            {sign}{delta} {activeConfig.unit} vs baseline
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Historical Baseline Line */}
                <ReferenceLine
                  y={activeConfig.baselineValue}
                  stroke="#245463"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Baseline (${activeConfig.baselineValue} ${activeConfig.unit})`,
                    fill: "#245463",
                    fontSize: 10,
                    position: "insideBottomRight",
                  }}
                />
                {/* Operating Threshold Line */}
                <ReferenceLine
                  y={activeConfig.thresholdValue}
                  stroke="#A9533D"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Threshold (${activeConfig.thresholdValue} ${activeConfig.unit})`,
                    fill: "#A9533D",
                    fontSize: 10,
                    position: "insideTopRight",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#D96B3B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#telemetryGradient)"
                  dot={{ r: 4, fill: "#D96B3B", stroke: "#142B3A", strokeWidth: 1.5 }}
                  activeDot={{ r: 7, fill: "#D96B3B", stroke: "#142B3A", strokeWidth: 2 }}
                  animationDuration={600}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
