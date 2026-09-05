"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  X,
  Compass,
  ArrowRight,
  Sparkles,
  History,
  Activity,
  GitCompare,
  FileText,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Well } from "@/components/dashboard/data/wells";
import { FormationDepth } from "./FormationDepth";
import { calculateHaversineDistanceKm, calculateAzimuthBearing, formatBearingWithCardinal } from "@/lib/geo";

interface SelectedWellPanelProps {
  well: Well;
  activeTargetWell: Well;
  onClose: () => void;
  onSetAsTargetWell?: (well: Well) => void;
  onCompareWithTarget?: (well: Well) => void;
  onOpenDossier?: (well: Well) => void;
  onSelectSimilarWell?: (wellId: string) => void;
}

export function SelectedWellPanel({
  well,
  activeTargetWell,
  onClose,
  onSetAsTargetWell,
  onCompareWithTarget,
  onOpenDossier,
  onSelectSimilarWell,
}: SelectedWellPanelProps) {
  const [collapsedMobile, setCollapsedMobile] = useState(false);

  if (!well) return null;

  const isTarget = activeTargetWell.id === well.id;

  const distanceKm = isTarget
    ? 0
    : calculateHaversineDistanceKm(
        activeTargetWell.latitude,
        activeTargetWell.longitude,
        well.latitude,
        well.longitude
      );

  const bearingDeg = isTarget
    ? 0
    : calculateAzimuthBearing(
        activeTargetWell.latitude,
        activeTargetWell.longitude,
        well.latitude,
        well.longitude
      );

  const bearingFormatted = isTarget ? "Origin" : formatBearingWithCardinal(bearingDeg);

  const getStatusBadge = (status: Well["status"] = "healthy") => {
    switch (status) {
      case "active":
        return "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/40";
      case "warning":
        return "bg-[#D96B3B]/20 text-[#A9533D] border-[#D96B3B]/50";
      case "critical":
        return "bg-[#843D35]/15 text-[#843D35] border-[#843D35]/40";
      case "historical":
        return "bg-[#245463]/15 text-[#245463] border-[#245463]/40";
      default:
        return "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/40";
    }
  };

  const formattedDepth =
    typeof well.depthM === "number"
      ? well.depthM.toLocaleString()
      : well.depthM || "3,240";

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`fixed sm:absolute bottom-0 sm:bottom-4 right-0 sm:right-4 left-0 sm:left-auto sm:top-4 w-full sm:w-[390px] ${
        collapsedMobile ? "h-auto max-h-[120px]" : "max-h-[82vh] sm:max-h-[calc(100%-32px)]"
      } bg-[#FAF8F5]/98 backdrop-blur-md rounded-t-3xl sm:rounded-3xl border-t sm:border border-[#DDD2C0] shadow-2xl p-4 sm:p-5 z-40 text-left font-sans select-none flex flex-col justify-between overflow-hidden transition-all duration-200`}
      aria-label={`Well intelligence preview for ${well.id}`}
    >
      {/* Mobile drag / collapse bar */}
      <div className="flex sm:hidden items-center justify-between pb-2 border-b border-[#DDD2C0] mb-2">
        <span className="text-[10px] font-mono font-bold uppercase text-[#142B3A]/60">
          Well Inspector &bull; {well.id}
        </span>
        <button
          onClick={() => setCollapsedMobile(!collapsedMobile)}
          className="text-[#142B3A]/70 p-1 flex items-center gap-1 text-[11px] font-mono font-bold"
        >
          <span>{collapsedMobile ? "Expand" : "Collapse"}</span>
          {collapsedMobile ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Scrollable Intelligence Body */}
      <div className="overflow-y-auto pr-1 space-y-3.5 scrollbar-none flex-1">
        {/* Top Header: Well ID, Status & Distance */}
        <div className="flex items-start justify-between pb-3 border-b border-[#DDD2C0]">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                isTarget ? "bg-[#2F8068] text-white" : "bg-[#142B3A] text-[#D96B3B]"
              }`}
            >
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#0D1B24] font-mono tracking-tight">
                  {well.id}
                </h3>
                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.2 rounded-full border font-extrabold ${getStatusBadge(
                    well.status
                  )}`}
                >
                  {isTarget ? "ACTIVE TARGET" : well.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs font-mono text-[#142B3A]/75 mt-0.5">
                {well.field || "Main Field"} &bull; <strong className="text-[#0D1B24]">{formattedDepth} m TD</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl text-[#142B3A]/60 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close intelligence panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Proximity from Active Target Well Banner */}
        <div className="p-2.5 rounded-2xl bg-[#DDD2C0]/35 border border-[#DDD2C0] flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-[9px] uppercase font-bold text-[#142B3A]/60 block">
              {isTarget ? "GEOGRAPHIC STATUS" : `DISTANCE FROM TARGET (${activeTargetWell.id})`}
            </span>
            <span className="text-sm font-extrabold text-[#0D1B24] block">
              {isTarget ? "Active Reference Origin" : `${distanceKm.toFixed(2)} km`}
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] text-[#142B3A]">
            {bearingFormatted}
          </span>
        </div>

        {/* 3 Metric Chips: Risk Indicator, Match %, Formation */}
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          {/* Risk Indicator */}
          <div className="bg-[#DDD2C0]/30 p-2 rounded-2xl border border-[#DDD2C0]">
            <span className="text-[9px] uppercase tracking-wider text-[#142B3A]/70 block font-bold">
              Risk Index
            </span>
            <span
              className={`text-base font-extrabold block mt-0.5 ${
                (well.riskScore || 0) > 70
                  ? "text-[#843D35]"
                  : (well.riskScore || 0) > 50
                  ? "text-[#D96B3B]"
                  : "text-[#2F8068]"
              }`}
            >
              {well.riskScore ?? 45}
              <span className="text-[10px] text-[#142B3A]/60 font-normal">/100</span>
            </span>
          </div>

          {/* Match % */}
          <div className="bg-[#DDD2C0]/30 p-2 rounded-2xl border border-[#DDD2C0]">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-wider text-[#142B3A]/70 block font-bold">
                Match
              </span>
              <Sparkles className="h-3 w-3 text-[#245463]" />
            </div>
            <span className="text-base font-extrabold text-[#245463] block mt-0.5">
              {well.historicalMatch ?? 88}%
            </span>
          </div>

          {/* Formation */}
          <div className="bg-[#DDD2C0]/30 p-2 rounded-2xl border border-[#DDD2C0]">
            <span className="text-[9px] uppercase tracking-wider text-[#142B3A]/70 block font-bold">
              Formation
            </span>
            <span className="text-[11px] font-bold text-[#0D1B24] truncate block mt-0.5" title={well.formation}>
              {well.formation || "JURASSIC T13"}
            </span>
          </div>
        </div>

        {/* Subsurface Formation Depth Profile */}
        <FormationDepth well={well} />

        {/* Historical Operational Events */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/80 font-extrabold flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-[#A9533D]" />
              <span>HISTORICAL OPERATIONAL EVENTS</span>
            </span>
            <span className="text-[9px] font-mono text-[#142B3A]/60 font-bold">
              {(well.events || []).length} Records
            </span>
          </div>

          <div className="space-y-1.5">
            {(well.events || []).map((evt, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-2.5 rounded-2xl bg-[#DDD2C0]/20 border border-[#DDD2C0]/70 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`h-2 w-2 rounded-full mt-1 shrink-0 ${
                      evt.severity === "critical"
                        ? "bg-[#843D35] ring-2 ring-[#843D35]/30"
                        : evt.severity === "high"
                        ? "bg-[#D96B3B]"
                        : evt.severity === "medium"
                        ? "bg-[#D96B3B]"
                        : "bg-[#2F8068]"
                    }`}
                  />
                  <div>
                    <span className="font-bold text-[#0D1B24] block">{evt.event}</span>
                    <span className="text-[10px] font-mono text-[#142B3A]/70">
                      Depth: {evt.depthM != null ? evt.depthM.toLocaleString() : "—"} m
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] text-[#142B3A]">
                  {evt.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Offset Wells */}
        {(well.similarWells || []).length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/80 font-extrabold flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#245463]" />
              <span>SIMILAR OFFSET WELLS (5 KM RADIUS)</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(well.similarWells || []).map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => onSelectSimilarWell?.(sim.id)}
                  className="px-2.5 py-1 rounded-xl bg-[#DDD2C0]/30 border border-[#DDD2C0] hover:border-[#142B3A] text-xs font-mono text-[#0D1B24] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="font-bold">{sim.name}</span>
                  <span className="text-[#245463] font-bold">{sim.matchPercent}% Match</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advisory Mitigation Note */}
        {well.recommendedAction && (
          <div className="p-3 rounded-2xl bg-[#DDD2C0]/30 border border-[#DDD2C0] text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A9533D] font-extrabold block mb-1">
              Advisory Mitigation Note
            </span>
            <p className="text-[#142B3A]/85 text-[11px] leading-relaxed">
              {well.recommendedAction}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-[#DDD2C0] mt-2 space-y-2">
        {/* Dynamic target well / compare actions */}
        {!isTarget && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSetAsTargetWell?.(well)}
              className="px-3 py-2 rounded-xl bg-[#142B3A] hover:bg-[#245463] text-white font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Target className="h-3.5 w-3.5 text-[#D96B3B]" />
              <span>Set as Target</span>
            </button>

            <button
              onClick={() => onCompareWithTarget?.(well)}
              className="px-3 py-2 rounded-xl bg-[#D96B3B] hover:bg-[#c45a2c] text-white font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <GitCompare className="h-3.5 w-3.5" />
              <span>Compare</span>
            </button>
          </div>
        )}

        {/* Full Dossier Modal trigger */}
        <button
          onClick={() => onOpenDossier?.(well)}
          className="w-full py-2 px-3 rounded-xl bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#142B3A] text-[#0D1B24] font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <FileText className="h-4 w-4 text-[#245463]" />
          <span>OPEN FULL ENGINEERING DOSSIER</span>
        </button>

        {/* Link to Dedicated Dossier Route */}
        <Link href={`/wells/${well.id}`} className="block text-center">
          <span className="text-[10px] font-mono text-[#142B3A]/70 hover:text-[#D96B3B] hover:underline flex items-center justify-center gap-1">
            <span>View standalone intelligence page</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </div>
    </motion.aside>
  );
}
