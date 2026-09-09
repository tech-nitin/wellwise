"use client";

import React from "react";
import Link from "next/link";
import { X, FileText, CheckCircle2, Compass } from "lucide-react";
import { RiskEvidenceRecord } from "./types";

interface EvidenceDocumentModalProps {
  document: RiskEvidenceRecord;
  currentDepthM: number;
  onClose: () => void;
}

export function EvidenceDocumentModal({
  document,
  currentDepthM,
  onClose,
}: EvidenceDocumentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0D1B24]/75 backdrop-blur-md font-sans select-none overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#FAF8F5] rounded-2xl border border-[#DDD2C0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#DDD2C0] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.2 rounded-full bg-[#142B3A] text-white">
                  {document.sourceType}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#2F8068] bg-[#2F8068]/15 px-2 py-0.2 rounded-full border border-[#2F8068]/30">
                  {document.relevanceScore}% Evidence Match
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#0D1B24] font-mono mt-0.5 truncate max-w-[320px] sm:max-w-md">
                {document.documentTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-[#142B3A]/60 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close document preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 font-mono text-xs space-y-3.5">
          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-2 bg-[#DDD2C0]/25 p-3 rounded-xl border border-[#DDD2C0]">
            <div>
              <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Offset Well</span>
              <strong className="text-xs text-[#0D1B24]">{document.offsetWellId}</strong>
            </div>
            <div>
              <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Interval</span>
              <strong className="text-xs text-[#D96B3B]">{document.depthIntervalM}</strong>
            </div>
            <div>
              <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Date Logged</span>
              <strong className="text-xs text-[#0D1B24]">{document.dateLogged}</strong>
            </div>
          </div>

          {/* Operational Context */}
          <div>
            <span className="text-[9px] text-[#8B877D] uppercase font-bold block mb-1">
              Historical Operational Summary
            </span>
            <div className="p-2.5 rounded-lg bg-white border border-[#DDD2C0] font-sans text-xs text-[#0D1B24] leading-relaxed">
              {document.eventDescription}
            </div>
          </div>

          {/* Document Transcript Excerpt */}
          <div>
            <span className="text-[9px] text-[#8B877D] uppercase font-bold block mb-1">
              Primary DDR Transcript Excerpt
            </span>
            <div className="p-3.5 rounded-lg bg-[#142B3A] text-[#F5F0E6] font-mono text-xs leading-relaxed border-l-4 border-[#D96B3B]">
              &ldquo;{document.snippetExcerpt}&rdquo;
            </div>
          </div>

          {/* Mitigation Protocol */}
          {document.mitigationReferenced && (
            <div>
              <span className="text-[9px] text-[#8B877D] uppercase font-bold block mb-1">
                Applied Mitigation Protocol in Historical Record
              </span>
              <div className="p-2.5 rounded-lg bg-[#2F8068]/10 border border-[#2F8068]/30 flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2F8068] shrink-0 mt-0.5" />
                <span className="font-sans text-xs text-[#0D1B24]">
                  {document.mitigationReferenced}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[#DDD2C0] bg-[#FAF8F5] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#8B877D]">
            Source: WellWise Multi-Basin DDR Ingestion Database
          </span>

          <div className="flex items-center gap-2">
            <Link
              href={`/wells/${document.offsetWellId}`}
              className="px-3 py-1.5 rounded-lg bg-[#142B3A] text-white font-mono text-xs font-bold hover:bg-[#245463] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Compass className="h-3.5 w-3.5 text-[#D96B3B]" />
              <span>OFFSET WELL DOSSIER</span>
            </Link>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#DDD2C0]/50 text-[#142B3A] font-mono text-xs font-bold hover:bg-[#DDD2C0] transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
