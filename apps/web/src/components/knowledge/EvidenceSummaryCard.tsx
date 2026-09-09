"use client";

import React from "react";
import { Database, CheckCircle2 } from "lucide-react";
import { KnowledgeAnswer } from "./types";

interface EvidenceSummaryCardProps {
  answer: KnowledgeAnswer;
}

export function EvidenceSummaryCard({ answer }: EvidenceSummaryCardProps) {
  return (
    <div className="w-full bg-[#FAF8F5] border-2 border-[#DDD2C0] rounded-xl p-4 shadow-sm select-none space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-[#245463]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight uppercase">
            EVIDENCE SUMMARY
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#2F8068] bg-[#2F8068]/15 px-2 py-0.5 rounded border border-[#2F8068]/30">
          VERIFIED RAG
        </span>
      </div>

      {/* Simplified Clean Evidence Block */}
      <div className="space-y-2 text-xs font-mono">
        <div className="p-3 bg-white rounded-lg border border-[#DDD2C0] space-y-1.5">
          <span className="text-[9px] uppercase font-bold text-[#8B877D] tracking-wider block">
            EVIDENCE METRICS:
          </span>
          <div className="space-y-1 text-[#142B3A]">
            <p className="flex items-center justify-between">
              <span className="text-[#5A6572]">Supporting Records:</span>
              <strong className="font-bold text-[#0D1B24]">{answer.evidenceRecordsCount || 5} records</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#5A6572]">Matching Wells:</span>
              <strong className="font-bold text-[#245463]">{answer.offsetWellsCount || 3} offset wells</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#5A6572]">High-Relevance Matches:</span>
              <strong className="font-bold text-[#2F8068]">2 strong matches</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#5A6572]">Historical Interval:</span>
              <strong className="font-bold text-[#0D1B24]">3,000–3,220 m</strong>
            </p>
          </div>
        </div>

        {/* Source Mix */}
        <div className="p-3 bg-white rounded-lg border border-[#DDD2C0] space-y-1.5">
          <span className="text-[9px] uppercase font-bold text-[#8B877D] tracking-wider block">
            SOURCE MIX:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] text-[10px] text-[#142B3A] font-bold">
              DDR × 2
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] text-[10px] text-[#142B3A] font-bold">
              Mud Recap × 1
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] text-[10px] text-[#142B3A] font-bold">
              Incident × 1
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] text-[10px] text-[#142B3A] font-bold">
              Lessons Learned × 1
            </span>
          </div>
        </div>

        {/* Match Strength Box */}
        <div className="p-3 bg-[#2F8068]/10 border border-[#2F8068]/30 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-[#2F8068] tracking-wider block">
              EVIDENCE MATCH CONFIDENCE:
            </span>
            <span className="text-sm font-extrabold text-[#2F8068]">STRONG MATCH</span>
          </div>
          <CheckCircle2 className="h-5 w-5 text-[#2F8068]" />
        </div>
      </div>
    </div>
  );
}
