"use client";

import React from "react";
import { BookOpen, CheckSquare, ExternalLink, ArrowRight, ShieldCheck, HelpCircle, Layers, Sparkles, AlertTriangle } from "lucide-react";
import { KnowledgeAnswer, KnowledgeEvidenceItem } from "./types";

interface FieldIntelligenceAnswerProps {
  answer: KnowledgeAnswer;
  onOpenEvidence: (evidence: KnowledgeEvidenceItem) => void;
  onFollowUpQuery: (q: string) => void;
  currentWellId?: string;
  currentDepthM?: number;
  formation?: string;
}

export function FieldIntelligenceAnswer({
  answer,
  onOpenEvidence,
  onFollowUpQuery,
  currentWellId = "NHK-124",
  currentDepthM = 3180,
  formation = "Jurassic T3",
}: FieldIntelligenceAnswerProps) {
  return (
    <div className="w-full bg-[#FAF8F5] border-2 border-[#DDD2C0] rounded-xl p-4 sm:p-5 shadow-sm select-none space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0">
            <BookOpen className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm sm:text-base font-extrabold font-mono text-[#0D1B24] tracking-tight uppercase">
            FIELD INTELLIGENCE
          </h2>
        </div>

        <span className="text-[10px] font-mono font-bold text-[#2F8068] bg-[#2F8068]/15 px-2.5 py-0.5 rounded-full border border-[#2F8068]/30 self-start sm:self-auto">
          AI-SYNTHESIZED • {answer.evidenceRecordsCount || 5} SOURCES
        </span>
      </div>

      {/* QUESTION Frame */}
      <div className="p-3 rounded-lg bg-white border border-[#DDD2C0] space-y-0.5">
        <span className="text-[9px] text-[#8B877D] font-mono uppercase font-bold tracking-wider block">
          QUESTION:
        </span>
        <p className="text-xs sm:text-sm font-bold text-[#0D1B24] font-sans">
          &ldquo;{answer.query}&rdquo;
        </p>
      </div>

      {/* ANSWER (Visual Hero Highlight) */}
      <div className="p-4 rounded-xl bg-white border-l-4 border-l-[#245463] border-y border-r border-[#DDD2C0] shadow-2xs space-y-2">
        <span className="text-[10px] font-mono font-bold text-[#245463] uppercase tracking-wider block">
          SYNTHESIZED FIELD ANSWER:
        </span>
        <p className="text-sm sm:text-base font-medium text-[#0D1B24] leading-relaxed">
          {answer.directAnswer}
        </p>
      </div>

      {/* WHY THIS MATTERS Callout */}
      <div className="p-3 rounded-lg bg-[#FAF0E6] border border-[#DDD2C0] flex items-start gap-2.5 text-xs">
        <AlertTriangle className="h-4 w-4 text-[#D96B3B] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#843D35] uppercase tracking-wider block text-[10px] font-mono">
            WHY THIS MATTERS FOR ACTIVE OPERATIONS:
          </span>
          <p className="text-[#142B3A] mt-0.5 leading-relaxed font-medium">
            Current drilling depth is <strong>{currentDepthM.toLocaleString()} m</strong> in <strong>{formation}</strong>, placing the active well directly inside the historically affected offset difficulty interval (3,000–3,220 m).
          </p>
        </div>
      </div>

      {/* REASONING CHAIN: WHY THIS ANSWER? */}
      <div className="p-3.5 rounded-xl bg-white border border-[#DDD2C0] space-y-2.5">
        <div className="flex items-center justify-between border-b border-[#DDD2C0]/60 pb-1.5">
          <span className="text-[10px] font-mono font-bold text-[#142B3A] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#245463]" />
            <span>WHY THIS ANSWER? — REASONING CHAIN</span>
          </span>
          <span className="text-[10px] font-mono text-[#2F8068] font-bold">
            EVIDENCE MATCH: STRONG
          </span>
        </div>

        {/* Horizontal Reasoning Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#DDD2C0] flex flex-col items-center">
            <span className="text-[8px] text-[#8B877D] uppercase font-bold">CURRENT WELL</span>
            <strong className="text-[11px] text-[#0D1B24] mt-0.5">{currentWellId}</strong>
            <span className="text-[10px] text-[#5A6572]">{currentDepthM.toLocaleString()} m</span>
          </div>

          <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#DDD2C0] flex flex-col items-center">
            <span className="text-[8px] text-[#8B877D] uppercase font-bold">SAME DEPTH</span>
            <strong className="text-[11px] text-[#245463] mt-0.5">3,000–3,200 m</strong>
            <span className="text-[10px] text-[#2F8068] font-bold">±100 m Match</span>
          </div>

          <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#DDD2C0] flex flex-col items-center">
            <span className="text-[8px] text-[#8B877D] uppercase font-bold">SAME FORMATION</span>
            <strong className="text-[11px] text-[#0D1B24] mt-0.5 truncate max-w-full">{formation}</strong>
            <span className="text-[10px] text-[#2F8068] font-bold">Top Correlated</span>
          </div>

          <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#DDD2C0] flex flex-col items-center">
            <span className="text-[8px] text-[#8B877D] uppercase font-bold">MATCHING OFFSETS</span>
            <strong className="text-[11px] text-[#0D1B24] mt-0.5">{answer.offsetWellsCount || 3} Wells</strong>
            <span className="text-[10px] text-[#5A6572]">&lt; 15 km Radius</span>
          </div>

          <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#DDD2C0] flex flex-col items-center">
            <span className="text-[8px] text-[#8B877D] uppercase font-bold">SUPPORTING EVIDENCE</span>
            <strong className="text-[11px] text-[#245463] mt-0.5">{answer.evidenceRecordsCount || 5} Records</strong>
            <span className="text-[10px] text-[#5A6572]">DDRs &amp; Incidents</span>
          </div>

          <div className="p-2 rounded-lg bg-[#2F8068]/15 border border-[#2F8068]/40 flex flex-col items-center justify-center">
            <span className="text-[8px] text-[#2F8068] uppercase font-bold">HISTORICAL PATTERN</span>
            <strong className="text-[11px] text-[#2F8068] font-extrabold mt-0.5">STRONG MATCH</strong>
          </div>
        </div>
      </div>

      {/* Key Findings with Inline Evidence Citations */}
      <div className="p-3.5 rounded-xl bg-white border border-[#DDD2C0] space-y-2">
        <span className="text-[10px] font-mono font-bold text-[#8B877D] uppercase tracking-wider block">
          Key Findings &amp; Evidence Citations:
        </span>

        <div className="space-y-1.5 text-xs font-sans text-[#142B3A]">
          {answer.keyFindings.map((finding, idx) => {
            const matchedEv = answer.evidenceItems[idx % answer.evidenceItems.length];

            return (
              <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#DDD2C0]/50">
                <span className="font-mono text-[#D96B3B] font-bold shrink-0 mt-0.5">
                  0{idx + 1}.
                </span>
                <div className="flex-1 text-[11px] sm:text-xs leading-relaxed">
                  <span>{finding}</span>
                  {matchedEv && (
                    <button
                      onClick={() => onOpenEvidence(matchedEv)}
                      className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-[#245463] hover:text-[#D96B3B] bg-white px-1.5 py-0.2 rounded border border-[#DDD2C0] cursor-pointer"
                    >
                      <span>Source: {matchedEv.offsetWellId}</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engineering Follow-Up: Investigate Next */}
      <div className="p-3 rounded-xl bg-white border border-[#DDD2C0] space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0D1B24]">
          <CheckSquare className="h-3.5 w-3.5 text-[#245463]" />
          <span>INVESTIGATE NEXT — RECOMMENDED DRILLING ACTIONS:</span>
        </div>

        <div className="space-y-1.5 text-xs font-mono">
          {answer.investigateNext.map((act, idx) => (
            <button
              key={idx}
              onClick={() => onFollowUpQuery(act)}
              className="w-full text-left p-2 rounded-lg bg-[#FAF8F5] border border-[#DDD2C0]/50 hover:border-[#D96B3B] text-[11px] font-sans text-[#142B3A] flex items-center justify-between gap-2 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[#245463] font-bold shrink-0">→</span>
                <span className="truncate">{act}</span>
              </div>
              <span className="text-[10px] font-mono text-[#8B877D] group-hover:text-[#D96B3B] shrink-0 font-bold">
                QUERY
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
