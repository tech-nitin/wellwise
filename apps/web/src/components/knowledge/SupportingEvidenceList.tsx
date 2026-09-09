"use client";

import React from "react";
import { ChevronRight, FileText, Calendar, ExternalLink } from "lucide-react";
import { KnowledgeEvidenceItem } from "./types";

interface SupportingEvidenceListProps {
  evidenceItems: KnowledgeEvidenceItem[];
  onViewSource: (item: KnowledgeEvidenceItem) => void;
}

export const SupportingEvidenceList: React.FC<SupportingEvidenceListProps> = ({
  evidenceItems,
  onViewSource,
}) => {
  if (!evidenceItems || evidenceItems.length === 0) return null;

  return (
    <div className="bg-[#FAF7F2] border-2 border-[#DDD2C0] rounded-xl p-4 sm:p-5 shadow-sm space-y-3.5 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD2C0]/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#245463]" />
          <h3 className="text-sm font-bold tracking-wider uppercase text-[#142B3A]">
            SUPPORTING EVIDENCE
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E4DDD0] text-[#142B3A] border border-[#DDD2C0]">
            {evidenceItems.length} RECORDS RETRIEVED
          </span>
        </div>
        <div className="text-xs text-[#6B7280] font-mono flex items-center gap-2">
          <span>VECTOR + FTS RANKED</span>
          <span className="text-[#DDD2C0]">|</span>
          <span className="text-[#2F8068] font-semibold">100% TRACEABLE</span>
        </div>
      </div>

      {/* Scannable Evidence Items Grid/List */}
      <div className="space-y-3">
        {evidenceItems.map((item, idx) => {
          const isStrong = item.matchLevel === "STRONG";
          const isDdr = item.sourceType === "Daily Drilling Report";
          const isIncident = item.sourceType === "Incident Report";

          return (
            <div
              key={item.id || idx}
              className="bg-white border border-[#DDD2C0] hover:border-[#245463]/70 rounded-xl p-4 transition-all hover:shadow-md group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 sm:gap-4">
                {/* Left Content Area */}
                <div className="space-y-2 flex-1 min-w-0">
                  {/* Top Metadata Line: SOURCE TYPE | Well / Document | Depth */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span
                      className={`font-bold px-2 py-0.5 rounded border text-[11px] ${
                        isDdr
                          ? "bg-[#245463]/10 text-[#245463] border-[#245463]/30"
                          : isIncident
                          ? "bg-[#D96B3B]/10 text-[#843D35] border-[#D96B3B]/30"
                          : "bg-[#E4DDD0] text-[#142B3A] border-[#DDD2C0]"
                      }`}
                    >
                      {item.sourceType === "Daily Drilling Report" ? "DDR" : item.sourceType}
                    </span>

                    <span className="font-bold text-[#0D1B24] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#DDD2C0]">
                      {item.offsetWellName}
                    </span>

                    <span className="text-[#5A6572] font-semibold">
                      {item.documentTitle}
                    </span>

                    <span className="text-[#DDD2C0] hidden sm:inline">•</span>

                    <span className="font-bold text-[#142B3A]">
                      {item.depthIntervalM}
                    </span>

                    <span className="text-[#DDD2C0] hidden sm:inline">•</span>

                    <span className="text-[#6B7280] flex items-center gap-1 font-sans">
                      <Calendar className="w-3 h-3" />
                      {item.dateLogged}
                    </span>
                  </div>

                  {/* EVENT / FINDING Summary */}
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#0D1B24] leading-snug group-hover:text-[#245463] transition-colors">
                      {item.eventSummary}
                    </h4>
                    <p className="text-xs text-[#4B5563] mt-1 font-serif italic bg-[#FAF8F5] p-2.5 rounded-lg border border-[#DDD2C0]/50 leading-relaxed">
                      &ldquo;{item.snippetExcerpt}&rdquo;
                    </p>
                  </div>

                  {/* WHY RELEVANT Tagline */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs font-mono text-[#5A6572]">
                    <span className="text-[10px] font-bold uppercase text-[#8B877D] tracking-wider">
                      WHY RELEVANT:
                    </span>
                    <span className="text-[#0D1B24] font-semibold bg-[#E4DDD0]/60 px-2 py-0.5 rounded">
                      Same {item.formation}
                    </span>
                    <span>•</span>
                    <span className="text-[#0D1B24] font-semibold bg-[#E4DDD0]/60 px-2 py-0.5 rounded">
                      Similar Depth ({item.depthIntervalM})
                    </span>
                    <span>•</span>
                    <span className="text-[#0D1B24] font-semibold bg-[#E4DDD0]/60 px-2 py-0.5 rounded">
                      Same Event Class
                    </span>
                  </div>
                </div>

                {/* Right Action Area */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#DDD2C0]/60 shrink-0">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                      isStrong
                        ? "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/30"
                        : "bg-[#D96B3B]/15 text-[#D96B3B] border-[#D96B3B]/30"
                    }`}
                  >
                    MATCH: {item.matchLevel}
                  </span>

                  <button
                    onClick={() => onViewSource(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#142B3A] hover:bg-[#245463] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>VIEW SOURCE</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
