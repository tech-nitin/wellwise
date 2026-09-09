"use client";

import React from "react";
import { CheckCircle2, BookOpen } from "lucide-react";
import { MitigationPracticeItem } from "./types";

interface MitigationPracticesProps {
  practices: MitigationPracticeItem[];
}

export function MitigationPractices({ practices }: MitigationPracticesProps) {
  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#2F8068]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            HISTORICAL MITIGATION PRACTICES &amp; REMEDIATION
          </h3>
        </div>
        <span className="text-[9px] font-mono text-[#8B877D]">
          OFFSET DRILLING RECORD RECAPS
        </span>
      </div>

      {/* List */}
      <div className="space-y-2.5 pt-2.5 text-xs font-mono">
        {practices.map((prac) => (
          <div
            key={prac.id}
            className="p-3 rounded-lg bg-white border border-[#DDD2C0] space-y-1.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <strong className="text-xs text-[#0D1B24] font-bold">
                {prac.practiceTitle}
              </strong>
              <div className="flex items-center gap-2 text-[10px] text-[#8B877D]">
                <span>Used in: <strong className="text-[#142B3A]">{prac.usedInOffsetCount} offset wells</strong></span>
                <span>·</span>
                <span>Evidence: <strong className="text-[#2F8068]">{prac.evidenceRecordCount} records</strong></span>
              </div>
            </div>

            <p className="font-sans text-[11px] text-[#142B3A] leading-relaxed">
              {prac.description}
            </p>

            <div className="text-[10px] text-[#2F8068] font-bold pt-1 border-t border-[#DDD2C0]/50 flex items-center gap-1">
              <span>Historical Outcome:</span>
              <span className="font-sans font-medium text-[#142B3A]">{prac.outcomeSummary}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
