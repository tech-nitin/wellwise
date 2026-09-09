"use client";

import React from "react";
import { History, CheckCircle2, AlertOctagon, FileText } from "lucide-react";

interface HistoricalMitigationCardProps {
  historicalEvent?: string;
  historicalResponse?: string;
  usedInWellsCount?: number;
  evidenceRecordsCount?: number;
  historicalOutcome?: string;
  topSourceRef?: string;
}

export const HistoricalMitigationCard: React.FC<HistoricalMitigationCardProps> = ({
  historicalEvent = "Elevated Torque & Bit Stick-Slip in Jurassic Formation",
  historicalResponse = "Reduced drilling parameters (WOB -15%, RPM adjusted to 85) and pumped 30 bbl high-viscosity lubricant sweep pill during affected interval.",
  usedInWellsCount = 2,
  evidenceRecordsCount = 4,
  historicalOutcome = "Circulation stabilized, torque normalized within 45 minutes, and drilling continued to section TD with zero non-productive time.",
  topSourceRef = "NHK-119 • DDR • 3,120 m",
}) => {
  return (
    <div className="bg-[#FAF7F2] border-2 border-[#DDD2C0] rounded-xl p-4 sm:p-5 shadow-sm space-y-3.5 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD2C0]/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2F8068]" />
          <h3 className="text-sm font-bold tracking-wider uppercase text-[#142B3A]">
            WHAT WORKED IN PREVIOUS WELLS
          </h3>
        </div>
        <span className="text-xs font-mono text-[#5A6572]">
          DOCUMENTED IN {evidenceRecordsCount} HISTORICAL ARTIFACTS
        </span>
      </div>

      {/* Main Content Box */}
      <div className="bg-white border border-[#DDD2C0] rounded-xl p-4 space-y-3.5">
        {/* Top Context & Source Reference */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DDD2C0]/60 pb-2 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[#8B877D] uppercase font-bold text-[10px]">HISTORICAL EVENT:</span>
            <span className="font-bold text-[#142B3A]">{historicalEvent}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#DDD2C0]">
            <FileText className="w-3.5 h-3.5 text-[#245463]" />
            <span className="text-[#245463] font-bold">SOURCE: {topSourceRef}</span>
          </div>
        </div>

        {/* HISTORICAL PRACTICE */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-[#245463] uppercase tracking-wider block">
            HISTORICAL PRACTICE:
          </span>
          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#DDD2C0] font-serif text-xs sm:text-sm text-[#142B3A] leading-relaxed">
            &ldquo;{historicalResponse}&rdquo;
          </div>
        </div>

        {/* OBSERVED OUTCOME */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#2F8068]/10 border border-[#2F8068]/25 text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#2F8068] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#2F8068] uppercase tracking-wider block text-[10px] font-mono">
              OBSERVED OUTCOME IN RECORD:
            </span>
            <p className="text-[#142B3A] mt-0.5 leading-relaxed font-medium">
              &ldquo;{historicalOutcome}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Operational Disclaimer Note */}
      <div className="flex items-center gap-2 text-[11px] text-[#6B7280] bg-[#E4DDD0]/50 p-2.5 rounded-lg border border-[#DDD2C0]">
        <AlertOctagon className="w-3.5 h-3.5 text-[#D96B3B] shrink-0" />
        <span>
          <strong>HISTORICAL PRACTICE — NOT AN AUTOMATED RECOMMENDATION:</strong> Provided as factual historical reference from offset Daily Drilling Reports. All operational changes require Toolpusher and Rig Superintendent approval.
        </span>
      </div>
    </div>
  );
};
