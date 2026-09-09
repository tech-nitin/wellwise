"use client";

import React, { useEffect, useState } from "react";
import { X, FileText, ExternalLink, Copy, Check, Database, Tag, Sparkles, ShieldCheck } from "lucide-react";
import { KnowledgeEvidenceItem } from "./types";
import Link from "next/link";

interface SourceViewerModalProps {
  item: KnowledgeEvidenceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SourceViewerModal: React.FC<SourceViewerModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `[Source: ${item.documentTitle} | Well: ${item.offsetWellName} | Depth: ${item.depthIntervalM}]\n${item.snippetExcerpt}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#142B3A]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#F5F0E6] border-2 border-[#142B3A] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="bg-[#142B3A] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#245463]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#245463] flex items-center justify-center text-white border border-[#DDD2C0]/30 shadow-inner">
              <FileText className="w-5 h-5 text-[#FAF7F2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-[#245463] px-2 py-0.5 rounded text-[#FAF7F2]">
                  EVIDENCE SOURCE VIEWER
                </span>
                <span className="text-xs font-mono text-[#DDD2C0]">
                  ID: {item.id}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide mt-0.5 font-mono">
                {item.documentTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#DDD2C0] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#F5F0E6]">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#DDD2C0]">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#6B7280]">SOURCE TYPE</span>
              <p className="text-xs font-bold text-[#142B3A] truncate">{item.sourceType}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#6B7280]">OFFSET WELL</span>
              <p className="text-xs font-bold text-[#245463] font-mono">{item.offsetWellName}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#6B7280]">DEPTH INTERVAL</span>
              <p className="text-xs font-bold text-[#142B3A] font-mono">{item.depthIntervalM}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#6B7280]">FORMATION</span>
              <p className="text-xs font-bold text-[#142B3A] truncate">{item.formation}</p>
            </div>
          </div>

          {/* Scanned/Digitized Excerpt Box */}
          <div className="bg-white border-2 border-[#DDD2C0] rounded-xl p-4 sm:p-5 shadow-inner space-y-3">
            <div className="flex items-center justify-between border-b border-[#DDD2C0]/70 pb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#245463]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#142B3A]">
                  OCR / VERBATIM EXCERPT
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E4DDD0] text-[#5A6572]">
                  PADDLE-OCR EXTRACTION
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-[#245463] hover:text-[#142B3A] font-semibold transition-colors cursor-pointer bg-[#FAF7F2] px-2.5 py-1 rounded border border-[#DDD2C0]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2F8068]" />
                    <span className="text-[#2F8068]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Document snippet with highlighted phrase */}
            <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#DDD2C0]/80 font-serif text-sm sm:text-base leading-relaxed text-[#142B3A]">
              {(() => {
                const fullText = item.snippetExcerpt;
                const highlight = item.highlightedPhrase;
                if (!highlight || !fullText.includes(highlight)) {
                  return <span>{fullText}</span>;
                }
                const parts = fullText.split(highlight);
                return (
                  <span>
                    {parts[0]}
                    <mark className="bg-[#D96B3B]/20 text-[#142B3A] font-semibold px-1 py-0.5 rounded border-b-2 border-[#D96B3B]">
                      {highlight}
                    </mark>
                    {parts[1]}
                  </span>
                );
              })()}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
              <Sparkles className="w-3.5 h-3.5 text-[#245463]" />
              <span>Highlighted phrase identified by RAG dense retrieval semantic matcher.</span>
            </div>
          </div>

          {/* Extracted Entities Table */}
          <div className="bg-[#FAF7F2] border border-[#DDD2C0] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#245463]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#142B3A]">
                EXTRACTED OPERATIONAL ENTITIES (NER)
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {item.extractedEntities && item.extractedEntities.length > 0 ? (
                item.extractedEntities.map((entity, eIdx) => (
                  <div
                    key={eIdx}
                    className="bg-white border border-[#DDD2C0] p-2 rounded-lg flex flex-col"
                  >
                    <span className="text-[10px] font-mono uppercase text-[#6B7280]">
                      {entity.label}
                    </span>
                    <span className="text-xs font-bold text-[#142B3A] mt-0.5 truncate font-mono">
                      {entity.value}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-white border border-[#DDD2C0] p-2 rounded-lg">
                    <span className="text-[10px] font-mono text-[#6B7280]">WELL</span>
                    <p className="text-xs font-bold text-[#142B3A]">{item.offsetWellName}</p>
                  </div>
                  <div className="bg-white border border-[#DDD2C0] p-2 rounded-lg">
                    <span className="text-[10px] font-mono text-[#6B7280]">DEPTH</span>
                    <p className="text-xs font-bold text-[#142B3A]">{item.depthIntervalM}</p>
                  </div>
                  <div className="bg-white border border-[#DDD2C0] p-2 rounded-lg">
                    <span className="text-[10px] font-mono text-[#6B7280]">EVENT</span>
                    <p className="text-xs font-bold text-[#142B3A]">{item.eventSummary}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Historical Mitigation Recorded */}
          {item.mitigationReferenced && (
            <div className="bg-[#245463]/5 border border-[#245463]/25 rounded-xl p-3.5 text-xs text-[#142B3A] space-y-1">
              <span className="font-bold text-[#245463] uppercase tracking-wider block text-[11px]">
                RECORDED HISTORICAL RESPONSE / MITIGATION:
              </span>
              <p className="italic text-[#245463] font-medium">&ldquo;{item.mitigationReferenced}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#FAF7F2] p-4 border-t border-[#DDD2C0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-xs text-[#6B7280]">
            <ShieldCheck className="w-4 h-4 text-[#2F8068]" />
            <span>Synthetic Demonstration Document — Verified Traceability Hash</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              href={`/wells/${item.offsetWellId}`}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#DDD2C0] hover:border-[#245463] text-xs font-bold text-[#142B3A] transition-colors"
            >
              <span>VIEW WELL DOSSIER</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#245463]" />
            </Link>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#142B3A] hover:bg-[#245463] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              DONE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
