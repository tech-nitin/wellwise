"use client";

import React from "react";
import { FileText, BookOpen, ArrowRight, ExternalLink } from "lucide-react";
import { RiskEvidenceRecord } from "./types";
import { cn } from "@/lib/utils";

interface HistoricalEvidenceListProps {
  records: RiskEvidenceRecord[];
  onSelectRecord: (record: RiskEvidenceRecord) => void;
}

export function HistoricalEvidenceList({
  records,
  onSelectRecord,
}: HistoricalEvidenceListProps) {
  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#D96B3B]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            HISTORICAL EVIDENCE &amp; OFFSET DDR TRANSCRIPTS
          </h3>
        </div>
        <span className="text-[9px] font-mono text-[#8B877D]">
          SYNTHETIC DEMO RECORDS
        </span>
      </div>

      {/* List of Evidence Records */}
      <div className="space-y-2 pt-2.5 text-xs font-mono">
        {records.map((rec) => {
          const isHigh = rec.relevance === "HIGH";

          return (
            <div
              key={rec.id}
              className="p-3 rounded-lg bg-white border border-[#DDD2C0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#8B877D] transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#142B3A] text-white">
                    {rec.sourceType}
                  </span>
                  <strong className="text-xs text-[#0D1B24] font-bold truncate">
                    {rec.documentTitle}
                  </strong>
                  <span
                    className={cn(
                      "text-[9px] px-1.5 py-0.2 rounded font-bold",
                      isHigh ? "bg-[#2F8068]/15 text-[#2F8068]" : "bg-[#DDD2C0]/40 text-[#142B3A]"
                    )}
                  >
                    {rec.relevanceScore}% Match
                  </span>
                </div>

                <p className="font-sans text-xs text-[#142B3A] leading-snug line-clamp-1">
                  {rec.eventDescription}
                </p>

                <div className="flex items-center gap-3 text-[10px] text-[#8B877D]">
                  <span>Offset Well: <strong className="text-[#0D1B24]">{rec.offsetWellId}</strong></span>
                  <span>Interval: <strong className="text-[#D96B3B]">{rec.depthIntervalM}</strong></span>
                  <span>Date: {rec.dateLogged}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectRecord(rec)}
                className="px-3 py-1.5 rounded-lg bg-[#142B3A] text-white text-[10px] font-mono font-bold hover:bg-[#245463] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-2xs"
              >
                <FileText className="h-3 w-3 text-[#D96B3B]" />
                <span>VIEW SOURCE</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
