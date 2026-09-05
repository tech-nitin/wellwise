"use client";

import React from "react";
import { X, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { EvidenceDocumentItem } from "./types";

interface EvidenceDocumentModalProps {
  document: EvidenceDocumentItem;
  onClose: () => void;
}

export function EvidenceDocumentModal({ document, onClose }: EvidenceDocumentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0D1B24]/75 backdrop-blur-md font-sans select-none overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FAF8F5] rounded-3xl border border-[#DDD2C0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#DDD2C0] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#142B3A] text-white">
                  {document.sourceType}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#2F8068] bg-[#2F8068]/15 px-2 py-0.5 rounded-full border border-[#2F8068]/30">
                  {document.relevanceScore}% Relevance Match
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0D1B24] font-mono mt-0.5 truncate max-w-[340px] sm:max-w-md">
                {document.documentTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl text-[#142B3A]/60 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close document preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-mono text-xs space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#DDD2C0]/25 p-3 rounded-2xl border border-[#DDD2C0]">
            <div>
              <span className="text-[10px] text-[#142B3A]/60 uppercase font-bold block">Originating Well</span>
              <strong className="text-sm text-[#0D1B24]">{document.wellId}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#142B3A]/60 uppercase font-bold block">Interval</span>
              <strong className="text-sm text-[#D96B3B]">{document.depthIntervalM}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#142B3A]/60 uppercase font-bold block">Logged Date</span>
              <strong className="text-sm text-[#0D1B24]">{document.dateLogged}</strong>
            </div>
          </div>

          {/* Event Context */}
          <div className="space-y-1">
            <span className="text-[10px] text-[#142B3A]/70 uppercase font-bold tracking-wider">
              Operational Anomaly Context
            </span>
            <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] font-sans text-xs font-bold text-[#0D1B24]">
              {document.eventSummary}
            </div>
          </div>

          {/* Original Record Excerpt (Simulated Document Scan / Text) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#142B3A]/70 uppercase font-bold tracking-wider">
                Verbatim Daily Report Excerpt
              </span>
              <span className="text-[9px] text-[#2F8068] font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Source Traceable &bull; OCR Verified</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#142B3A] text-white/95 font-mono text-xs leading-relaxed border-l-4 border-[#D96B3B] shadow-inner">
              &ldquo;{document.snippetExcerpt}&rdquo;
            </div>
          </div>

          {/* Mitigation Protocol Cited */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-1">
            <span className="text-[10px] text-[#A9533D] font-bold uppercase tracking-wider block">
              Historical Mitigation Protocol Applied
            </span>
            <p className="text-xs font-sans text-[#142B3A]/85">
              {document.mitigationReferenced}
            </p>
          </div>

          {/* Synthetic Document Citation Watermark */}
          <div className="p-3 rounded-xl bg-[#DDD2C0]/30 border border-[#DDD2C0] text-[10px] text-[#142B3A]/70 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#D96B3B] shrink-0" />
            <span>
              SYNTHETIC DEMO DATA — NOT VERIFIED OIL ASSET OR OPERATIONAL DATA (SIH26121)
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#DDD2C0] bg-[#FAF8F5] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#142B3A]/60">
            Document ID: {document.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#142B3A] hover:bg-[#245463] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
