"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  X,
  Compass,
  ArrowRight,
  AlertTriangle,
  Activity,
  Layers,
  ShieldCheck,
  Flame,
  Droplets,
  Anchor,
  Zap,
} from "lucide-react";
import { Well } from "./data/wells";

interface WellIntelligencePanelProps {
  well: Well;
  onClose: () => void;
  onSelectSimilarWell?: (wellId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mlPrediction?: any;
  mlLoading?: boolean;
}

const HAZARD_ICONS: Record<string, { icon: string; color: string; label: string }> = {
  KICK: { icon: "⚠️", color: "#843D35", label: "Gas / Kick & Blowout" },
  MUD_LOSS: { icon: "🛑", color: "#D96B3B", label: "Circulation Mud Loss" },
  STUCK_PIPE: { icon: "⚓", color: "#D96B3B", label: "Differential Stuck Pipe" },
  WELLBORE_INSTABILITY: { icon: "💥", color: "#6B21A8", label: "Shale Pack-Off & Breakout" },
  NONE: { icon: "🔵", color: "#2F8068", label: "Normal Baseline" },
};

export const WellIntelligencePanel: React.FC<WellIntelligencePanelProps> = ({
  well,
  onClose,
  onSelectSimilarWell,
  mlPrediction,
  mlLoading = false,
}) => {
  if (!well) return null;

  const formattedDepth =
    typeof well.depthM === "number"
      ? well.depthM.toLocaleString()
      : well.depthM || "3,870";

  const primaryHazard = mlPrediction?.primary_hazard || well.hazardType || "NONE";
  const hazardScore = mlPrediction?.hazard_score !== undefined
    ? Math.round(mlPrediction.hazard_score * 100)
    : well.riskScore || 75;
  const hazardLevel = mlPrediction?.hazard_level || (hazardScore > 65 ? "CRITICAL" : hazardScore > 40 ? "HIGH" : "MODERATE");

  const hazardMeta = HAZARD_ICONS[primaryHazard] || HAZARD_ICONS.NONE;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 12 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-3 right-3 bottom-3 w-full sm:w-[390px] max-h-[96%] bg-[#FAF8F5]/98 backdrop-blur-md rounded-2xl border-2 border-[#DDD2C0] shadow-xl p-4 sm:p-5 z-40 text-left font-sans select-none flex flex-col justify-between overflow-hidden"
    >
      {/* Scrollable Body */}
      <div className="overflow-y-auto pr-1 space-y-3.5 scrollbar-none flex-1">
        {/* Top Header Row */}
        <div className="flex items-start justify-between pb-2.5 border-b border-[#DDD2C0]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0 shadow-2xs">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#0D1B24] font-mono tracking-tight">
                  {well.id}
                </h3>
                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.2 rounded-full border font-bold ${
                    well.isDemo === false
                      ? "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/40"
                      : "bg-[#D96B3B]/15 text-[#A9533D] border-[#D96B3B]/40"
                  }`}
                >
                  {well.isDemo === false ? "REAL OIL/ONGC WELL" : "DEMO WELL"}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#142B3A]/75 mt-0.5">
                {well.name || well.field} &bull; <strong className="text-[#0D1B24]">{formattedDepth} m</strong> TVD
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-7 w-7 rounded-lg text-[#142B3A]/60 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ML Look-Ahead Hazard Hero Card */}
        <div
          className={`p-3 rounded-xl border ${
            hazardScore > 65
              ? "bg-[#843D35]/10 border-[#843D35]/30 text-[#843D35]"
              : hazardScore > 40
              ? "bg-[#D96B3B]/10 border-[#D96B3B]/30 text-[#D96B3B]"
              : "bg-[#2F8068]/10 border-[#2F8068]/30 text-[#2F8068]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#142B3A]/70 flex items-center gap-1.5">
              <span>{hazardMeta.icon}</span>
              <span>ML LOOK-AHEAD HAZARD:</span>
            </span>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#142B3A] text-white">
              {hazardLevel}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-sm font-extrabold font-mono text-[#0D1B24]">
              {hazardMeta.label}
            </span>
            <span className="text-base font-extrabold font-mono">
              {hazardScore}%
            </span>
          </div>

          {mlLoading && (
            <div className="text-[10px] font-mono text-[#D96B3B] mt-1 flex items-center gap-1">
              <span className="animate-spin h-2.5 w-2.5 border border-current border-t-transparent rounded-full" />
              <span>Analyzing stratigraphy & offset logs...</span>
            </div>
          )}
        </div>

        {/* 4-Hazard ML Probability Radar Breakdown */}
        {mlPrediction?.all_risks && (
          <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#8B877D] tracking-wider block">
              MULTI-HAZARD RISK BREAKDOWN:
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              {Object.entries(mlPrediction.all_risks).map(([k, val]: [string, any]) => {
                const cfg = HAZARD_ICONS[k] || HAZARD_ICONS.NONE;
                const score = val.percentage ?? Math.round(val.score * 100);
                return (
                  <div key={k} className="space-y-0.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#0D1B24] font-medium flex items-center gap-1">
                        <span>{cfg.icon}</span>
                        <span>{val.label || k}</span>
                      </span>
                      <span className="font-bold text-[#142B3A]">
                        {score}% <span className="text-[9px] text-[#5A6572]">({val.level})</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#DDD2C0]/50">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${score}%`,
                          backgroundColor:
                            score > 65 ? "#843D35" : score > 40 ? "#D96B3B" : "#2F8068",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Formation Depth Correlation Rail */}
        <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-[#8B877D] tracking-wider block">
              STRATIGRAPHIC TOPS:
            </span>
            <span className="text-[10px] font-mono text-[#5A6572]">
              {well.formationInterval || `${formattedDepth} m TD`}
            </span>
          </div>

          <div className="space-y-1 text-xs font-mono text-[#142B3A] pl-2 border-l-2 border-[#245463]/40">
            {well.tops && Object.keys(well.tops).length > 0 ? (
              Object.entries(well.tops).slice(0, 5).map(([topName, depth]) => (
                <div key={topName} className="flex items-center justify-between py-0.5">
                  <span className={topName.toLowerCase().includes(well.formation.toLowerCase()) ? "font-bold text-[#D96B3B]" : "text-[#5A6572]"}>
                    &bull; {topName}
                  </span>
                  <span className="font-bold text-[#0D1B24]">{depth} m</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[#5A6572]">SURFACE</span>
                  <span className="font-bold">0 m</span>
                </div>
                <div className="flex items-center justify-between bg-[#FAF8F5] p-1 rounded border border-[#DDD2C0]/60">
                  <span className="font-bold text-[#D96B3B]">{well.formation || "Langpar"}</span>
                  <span className="font-bold text-[#245463]">{well.formationInterval || "3,847–3,898 m"}</span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[#5A6572]">TOTAL DEPTH</span>
                  <span className="font-bold text-[#0D1B24]">{formattedDepth} m</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Historical Events & Engineering Mitigations */}
        <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-[#8B877D] tracking-wider block">
            HISTORICAL PRECEDENTS &amp; MITIGATION:
          </span>

          {well.narrative ? (
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-[#843D35]/10 border border-[#843D35]/30 text-[#843D35]">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <span>⚠️</span>
                  <span>{well.hazardType || "INCIDENT"} RECORD</span>
                </div>
                <p className="text-[11px] leading-relaxed italic text-[#142B3A]">
                  "{well.narrative}"
                </p>
              </div>

              {well.mitigation && (
                <div className="p-2 rounded-lg bg-[#2F8068]/10 border border-[#2F8068]/30 text-[#0D1B24]">
                  <span className="font-bold text-[#2F8068] block mb-0.5 text-[10px] uppercase tracking-wider">
                    Recommended Action / Mitigation:
                  </span>
                  <p className="text-[11px] leading-relaxed text-[#142B3A]">
                    {well.mitigation}
                  </p>
                </div>
              )}
            </div>
          ) : well.events && well.events.length > 0 ? (
            <div className="space-y-1.5 text-xs font-mono">
              {well.events.map((evt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-1.5 rounded bg-[#FAF8F5] border border-[#DDD2C0]/50"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        evt.severity === "critical"
                          ? "bg-[#843D35]"
                          : evt.severity === "high"
                          ? "bg-[#D96B3B]"
                          : "bg-[#2F8068]"
                      }`}
                    />
                    <span className="font-semibold text-[#0D1B24] truncate max-w-[200px]" title={evt.event}>
                      {evt.event}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      evt.severity === "critical"
                        ? "bg-[#843D35]/15 text-[#843D35]"
                        : evt.severity === "high"
                        ? "bg-[#D96B3B]/15 text-[#D96B3B]"
                        : "bg-[#2F8068]/15 text-[#2F8068]"
                    }`}
                  >
                    {evt.severity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 rounded bg-[#FAF8F5] text-xs font-mono text-[#2F8068]">
              ✓ Baseline Normal Historical Log — No critical influx recorded
            </div>
          )}
        </div>

        {/* Similar Offset Correlation Ranking */}
        <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] space-y-1.5">
          <span className="text-[10px] font-mono uppercase font-bold text-[#8B877D] tracking-wider block">
            TOP SIMILAR OFFSET WELLS (OWSS):
          </span>

          <div className="grid grid-cols-3 gap-1.5 text-xs font-mono text-center">
            {mlPrediction?.candidate_offsets && mlPrediction.candidate_offsets.length > 0 ? (
              mlPrediction.candidate_offsets.slice(0, 3).map((candidate: any) => (
                <div
                  key={candidate.well_id}
                  onClick={() => onSelectSimilarWell?.(candidate.well_id)}
                  className="p-1.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#245463] cursor-pointer transition-colors"
                  title={`${candidate.name || candidate.well_id} - ${candidate.distance_km} km`}
                >
                  <strong className="text-[#0D1B24] block truncate text-[11px]">
                    {candidate.well_id}
                  </strong>
                  <span className="text-[10px] text-[#2F8068] font-bold block">
                    {Math.round(candidate.relevance_score * 100)}%
                  </span>
                  <span className="text-[9px] text-[#5A6572] block">
                    {candidate.distance_km} km
                  </span>
                </div>
              ))
            ) : well.similarWells && well.similarWells.length > 0 ? (
              well.similarWells.slice(0, 3).map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => onSelectSimilarWell?.(sim.id)}
                  className="p-1.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#245463] cursor-pointer transition-colors"
                >
                  <strong className="text-[#0D1B24] block truncate text-[11px]">
                    {sim.id}
                  </strong>
                  <span className="text-[10px] text-[#2F8068] font-bold block">
                    {sim.matchPercent}% Match
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-[11px] font-mono text-[#5A6572] py-1">
                Local offset correlation calibrated.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-3 border-t border-[#DDD2C0] flex items-center justify-between gap-2 shrink-0">
        <Link
          href={`/wells/${well.id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#142B3A] hover:bg-[#245463] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-2xs"
        >
          <span>OPEN WELL INTELLIGENCE</span>
          <ArrowRight className="h-3.5 w-3.5 text-[#D96B3B]" />
        </Link>
      </div>
    </motion.div>
  );
};
