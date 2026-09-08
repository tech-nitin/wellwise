"use client";

import React, { useState } from "react";
import {
  X,
  GitCompare,
  Layers,
  AlertTriangle,
  Droplets,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Well } from "@/components/dashboard/data/wells";
import {
  getWellStratigraphy,
  getWellMudWeightProfile,
  enrichWellWithCalculations,
} from "./wellEngineeringData";

interface WellComparisonModalProps {
  targetWell: Well;
  offsetWell: Well;
  allWells?: Well[];
  onSelectOffsetWell?: (well: Well) => void;
  onClose: () => void;
}

export function WellComparisonModal({
  targetWell,
  offsetWell,
  allWells = [],
  onSelectOffsetWell,
  onClose,
}: WellComparisonModalProps) {
  const [activeTab, setActiveTab] = useState<"stratigraphy" | "hazards" | "mud" | "advisory">("stratigraphy");

  const targetStrat = getWellStratigraphy(targetWell);
  const offsetStrat = getWellStratigraphy(offsetWell);

  const targetMud = getWellMudWeightProfile(targetWell);
  const offsetMud = getWellMudWeightProfile(offsetWell);

  const enrichedOffset = enrichWellWithCalculations(offsetWell, targetWell);

  // Derive stratigraphic correlation rows with delta in meters
  const correlationRows = targetStrat.map((tStrat, idx) => {
    const oStrat = offsetStrat[idx] || offsetStrat[offsetStrat.length - 1];
    const targetTop = tStrat.topDepthM;
    const offsetTop = oStrat.topDepthM;
    const deltaM = offsetTop - targetTop;

    return {
      formation: tStrat.name,
      targetDepth: targetTop,
      targetBase: tStrat.baseDepthM,
      offsetDepth: offsetTop,
      offsetBase: oStrat.baseDepthM,
      deltaM,
      isTargetZone: tStrat.isTargetZone || oStrat.isTargetZone,
      lithology: tStrat.lithology,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0D1B24]/75 backdrop-blur-md font-sans select-none overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#FAF8F5] rounded-3xl border border-[#DDD2C0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#DDD2C0] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0 shadow-sm">
              <GitCompare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-mono font-black text-[#0D1B24] tracking-tight">
                  OFFSET CORRELATION ENGINE
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#D96B3B]/15 text-[#A9533D] px-2 py-0.5 rounded-full border border-[#D96B3B]/30">
                  SIH26121
                </span>
              </div>
              <p className="text-xs text-[#142B3A]/70 font-mono mt-0.5">
                Multi-Well Lithological, Hazard & Mud Density Correlation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl text-[#142B3A]/60 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Comparison Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Well Selection Comparison Chips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#EFE9DC] border-b border-[#DDD2C0] text-xs font-mono">
          {/* Target Well Box */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border-2 border-[#2F8068] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2F8068] animate-pulse shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-[#2F8068] tracking-wider block">
                  Active Reference Target
                </span>
                <span className="text-sm font-extrabold text-[#0D1B24] block truncate">
                  {targetWell.id} &bull; {targetWell.name}
                </span>
                <span className="text-[10px] text-[#142B3A]/70">
                  {targetWell.field} &bull; {targetWell.depthM.toLocaleString()} m TD
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#2F8068]/15 text-[#2F8068]">
              ORIGIN (0.00 km)
            </span>
          </div>

          {/* Offset Well Box */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border-2 border-[#D96B3B] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D96B3B] shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-[#D96B3B] tracking-wider block">
                  Offset Comparison Well
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-[#0D1B24] truncate">
                    {offsetWell.id}
                  </span>
                  {/* Optional selector to change offset well */}
                  {allWells.length > 0 && onSelectOffsetWell && (
                    <select
                      value={offsetWell.id}
                      onChange={(e) => {
                        const w = allWells.find((item) => item.id === e.target.value);
                        if (w) onSelectOffsetWell(w);
                      }}
                      className="text-[10px] bg-[#DDD2C0]/40 border border-[#DDD2C0] rounded px-1.5 py-0.5 text-[#0D1B24] cursor-pointer"
                    >
                      {allWells
                        .filter((w) => w.id !== targetWell.id)
                        .map((w) => (
                          <option key={w.id} value={w.id}>
                            Switch to {w.id}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                <span className="text-[10px] text-[#142B3A]/70">
                  {offsetWell.field} &bull; {offsetWell.depthM.toLocaleString()} m TD
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-[#D96B3B] block">
                {enrichedOffset.calculatedDistanceKm.toFixed(2)} km
              </span>
              <span className="text-[9px] text-[#142B3A]/70 font-bold block">
                {enrichedOffset.bearingFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#DDD2C0] bg-[#FAF8F5] px-4 pt-2 gap-2 overflow-x-auto scrollbar-none font-mono text-xs">
          {[
            { id: "stratigraphy", label: "A. Stratigraphic Tops", icon: Layers },
            { id: "hazards", label: "B. Drilling Hazards", icon: AlertTriangle },
            { id: "mud", label: "C. Mud Weight Envelope", icon: Droplets },
            { id: "advisory", label: "D. Operational Advisory", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-[#D96B3B] text-[#D96B3B] bg-[#D96B3B]/5"
                    : "border-transparent text-[#142B3A]/70 hover:text-[#0D1B24]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 font-mono text-xs space-y-4">
          {/* TAB A: STRATIGRAPHIC CORRELATION */}
          {activeTab === "stratigraphy" && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] text-[11px] text-[#142B3A]/80 flex items-center justify-between">
                <span>
                  Stratigraphic tops aligned vertically by depth with structural elevation delta (&Delta;Z).
                </span>
                <span className="text-[#245463] font-bold">
                  Offset Distance: {enrichedOffset.calculatedDistanceKm.toFixed(2)} km
                </span>
              </div>

              {/* Table of Formation Tops */}
              <div className="border border-[#DDD2C0] rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#EFE9DC] border-b border-[#DDD2C0] text-[10px] uppercase font-black text-[#142B3A]">
                    <tr>
                      <th className="py-2.5 px-3">Formation Stratum</th>
                      <th className="py-2.5 px-3">Target ({targetWell.id})</th>
                      <th className="py-2.5 px-3">Offset ({offsetWell.id})</th>
                      <th className="py-2.5 px-3">Structural Delta</th>
                      <th className="py-2.5 px-3">Lithology Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD2C0]">
                    {correlationRows.map((row, i) => (
                      <tr
                        key={i}
                        className={row.isTargetZone ? "bg-[#D96B3B]/10 font-bold" : "hover:bg-[#DDD2C0]/20"}
                      >
                        <td className="py-2.5 px-3 font-extrabold text-[#0D1B24]">
                          {row.formation}
                          {row.isTargetZone && (
                            <span className="ml-1.5 text-[8px] bg-[#D96B3B] text-white px-1.5 py-0.2 rounded font-mono">
                              PAY
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">{row.targetDepth.toLocaleString()} m</td>
                        <td className="py-2.5 px-3">{row.offsetDepth.toLocaleString()} m</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                              row.deltaM > 0
                                ? "bg-[#A9533D]/15 text-[#A9533D]"
                                : row.deltaM < 0
                                ? "bg-[#245463]/15 text-[#245463]"
                                : "bg-[#DDD2C0] text-[#142B3A]"
                            }`}
                          >
                            {row.deltaM > 0 ? `+${row.deltaM} m (Dipping)` : `${row.deltaM} m (Rising)`}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans text-[11px] text-[#142B3A]/70 truncate max-w-[200px]">
                          {row.lithology}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB B: DRILLING HAZARDS */}
          {activeTab === "hazards" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Hazards */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
                    <span className="font-extrabold text-[#2F8068] flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#2F8068]" />
                      {targetWell.id} Operational Events
                    </span>
                    <span className="text-[10px] text-[#142B3A]/60">
                      {(targetWell.events || []).length} Logged
                    </span>
                  </div>

                  {(targetWell.events || []).length === 0 ? (
                    <p className="text-[#142B3A]/60 text-xs italic py-4 text-center">
                      No operational hazards logged for target well.
                    </p>
                  ) : (
                    targetWell.events.map((ev, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#DDD2C0]/25 border border-[#DDD2C0] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0D1B24]">{ev.event}</span>
                          <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-[#FAF8F5] border border-[#DDD2C0]">
                            {ev.severity}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#D96B3B] font-bold block">
                          Recorded Depth: {ev.depthM.toLocaleString()} m MD
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Offset Hazards */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
                    <span className="font-extrabold text-[#D96B3B] flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#D96B3B]" />
                      {offsetWell.id} Historical Hazards
                    </span>
                    <span className="text-[10px] text-[#142B3A]/60">
                      {(offsetWell.events || []).length} Logged
                    </span>
                  </div>

                  {(offsetWell.events || []).length === 0 ? (
                    <p className="text-[#142B3A]/60 text-xs italic py-4 text-center">
                      No historical hazard anomalies recorded in offset logs.
                    </p>
                  ) : (
                    offsetWell.events.map((ev, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#843D35]/10 border border-[#843D35]/25 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#843D35] flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {ev.event}
                          </span>
                          <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-white text-[#843D35] border border-[#843D35]/30">
                            {ev.severity}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#142B3A]/80 font-bold block">
                          Offset Hazard Depth: {ev.depthM.toLocaleString()} m MD
                        </span>
                        <p className="text-[10px] font-sans text-[#142B3A]/70 pt-0.5">
                          Cross-correlation alert: Anticipate equivalent thief zone in target well near{" "}
                          <strong>{Math.round(ev.depthM - 25)}–{Math.round(ev.depthM + 30)} m</strong>.
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB C: MUD WEIGHT */}
          {activeTab === "mud" && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] text-[11px] text-[#142B3A]/80 flex items-center justify-between">
                <span>
                  Hydraulic window and mud density (ppg) program comparison across depth sections.
                </span>
                <span className="text-[#2F8068] font-bold">Safe Drilling Margin &plusmn;0.5 ppg</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Mud Program */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-2">
                  <h4 className="font-bold text-xs text-[#2F8068] uppercase pb-1 border-b border-[#DDD2C0]">
                    {targetWell.id} Mud Density Program
                  </h4>
                  {targetMud.map((m, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#DDD2C0]/20 border border-[#DDD2C0] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0D1B24]">{m.fromDepthM}–{m.toDepthM} m</span>
                        <span className="font-extrabold text-[#2F8068] bg-[#2F8068]/10 px-2 py-0.5 rounded">
                          {m.mudWeightPpg.toFixed(1)} ppg
                        </span>
                      </div>
                      <span className="text-[10px] text-[#142B3A]/70 font-sans block truncate">{m.mudType}</span>
                    </div>
                  ))}
                </div>

                {/* Offset Mud Program */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-2">
                  <h4 className="font-bold text-xs text-[#D96B3B] uppercase pb-1 border-b border-[#DDD2C0]">
                    {offsetWell.id} Offset Actual Mud Program
                  </h4>
                  {offsetMud.map((m, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#DDD2C0]/20 border border-[#DDD2C0] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0D1B24]">{m.fromDepthM}–{m.toDepthM} m</span>
                        <span className="font-extrabold text-[#D96B3B] bg-[#D96B3B]/15 px-2 py-0.5 rounded">
                          {m.mudWeightPpg.toFixed(1)} ppg
                        </span>
                      </div>
                      <span className="text-[10px] text-[#142B3A]/70 font-sans block truncate">{m.mudType}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB D: MITIGATION ADVISORY */}
          {activeTab === "advisory" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#142B3A] text-white space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#D96B3B]" />
                  <h4 className="font-extrabold text-xs tracking-wider uppercase text-[#D96B3B]">
                    AI EVIDENCE-BASED OFFSET DRILLING ADVISORY
                  </h4>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-sans">
                  {offsetWell.recommendedAction ||
                    `Offset well ${offsetWell.id} located ${enrichedOffset.calculatedDistanceKm.toFixed(2)} km away indicates elevated risk of mud loss and pack-off in the target interval. Maintain controlled penetration rate and verify LCM pill inventory on rig site before spudding the pay zone.`}
                </p>
                <div className="pt-2 text-[10px] text-white/60 font-mono">
                  Confidence Score: {offsetWell.historicalMatch ?? 92}% Match &bull; Basis: Offset DDR Records
                </div>
              </div>

              {/* Data Honesty Disclaimer */}
              <div className="p-3 rounded-2xl bg-[#DDD2C0]/30 border border-[#DDD2C0] text-[10px] text-[#142B3A]/80 font-mono">
                <strong>ENGINEERING DISCLAIMER:</strong> This is historical evidence-based decision support compiled from synthetic offset logs for SIH26121. It does not replace live real-time mud-logging telemetry, MWD/LWD telemetry, or official Oil India Limited wellsite supervision.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DDD2C0] bg-[#FAF8F5] flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#142B3A]/60">
            Comparing: <strong>{targetWell.id}</strong> &times; <strong>{offsetWell.id}</strong> ({enrichedOffset.calculatedDistanceKm.toFixed(2)} km)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#142B3A] hover:bg-[#245463] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Close Correlation Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
