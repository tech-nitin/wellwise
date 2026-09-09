"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Search,
  Sparkles,
  FileText,
  ArrowRight,
  CornerDownLeft,
  BookOpen,
} from "lucide-react";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";

export function AIKnowledge() {
  const [query, setQuery] = useState(
    "How was differential sticking handled in NHK-119 near 3,200 m?"
  );

  const suggestedQueries = [
    "How was lost circulation handled here?",
    "What happened around 3,200 m?",
    "Which offset well had the closest match?",
    "What mitigation was used?",
  ];

  return (
    <section
      id="ask-the-field"
      className="relative w-full py-12 lg:py-16 overflow-hidden border-b border-[#DDD2C0] select-none"
    >
      {/* Ambient Geological Background System - Domain AI Knowledge Variant */}
      <GeologicalBackground variant="knowledge" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-7 text-left relative z-10">
        {/* Section Header & Flow Indicator */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#245463] bg-[#245463]/10 px-2.5 py-0.5 rounded-full border border-[#245463]/30">
              05 &bull; INVESTIGATE HISTORICAL EVIDENCE
            </span>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A9533D] font-extrabold">
            <BookOpen className="h-3.5 w-3.5 text-[#D96B3B]" />
            <span>ASK THE FIELD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B24] leading-[1.08]">
            Search historical drilling knowledge.
          </h2>
          <p className="text-sm sm:text-base text-[#142B3A]/80 leading-relaxed max-w-2xl">
            Ask natural-language engineering questions across historical daily drilling reports (DDRs), mud logs, casing tallies, and incident mitigation records.
          </p>
        </div>

        {/* 1. QUESTION: Engineering Investigation Query Workspace */}
        <div className="relative max-w-4xl rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] p-3 sm:p-4 shadow-sm focus-within:border-[#142B3A] transition-colors">
          <div className="flex items-center gap-3 px-3 py-2">
            <Search className="h-5 w-5 text-[#142B3A]/70 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="How was differential sticking handled in NHK-119 near 3,200 m?"
              className="w-full bg-transparent text-sm sm:text-base text-[#0D1B24] placeholder:text-[#142B3A]/50 focus:outline-none font-medium"
            />
            <Link
              href={`/knowledge?well=NHK-124&depth=3180&q=${encodeURIComponent(query)}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D96B3B] text-white text-xs font-mono font-bold hover:bg-[#c45a2c] transition-all cursor-pointer shadow-xs border border-[#D96B3B]/30 shrink-0"
            >
              <span>Query Field</span>
              <CornerDownLeft className="h-3.5 w-3.5 text-white" />
            </Link>
          </div>

          {/* Suggested Query Chips */}
          <div className="pt-3 px-3 pb-1 border-t border-[#DDD2C0]/60 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase text-[#142B3A]/70 font-bold">
              Suggested Queries:
            </span>
            {suggestedQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(item)}
                className="text-[11px] font-mono text-[#0D1B24] hover:text-[#0D1B24] bg-[#DDD2C0]/25 hover:bg-[#D96B3B]/15 px-3 py-1.5 rounded-xl border border-[#DDD2C0] hover:border-[#142B3A]/40 transition-all cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 2. RETRIEVAL: Explicit RAG Retrieval Summary Strip */}
        <div className="max-w-4xl p-3.5 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] flex items-center justify-between gap-4 font-mono text-xs shadow-2xs flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#2F8068] animate-pulse" />
            <span className="text-[#0D1B24] font-bold">
              4 Sources Retrieved &bull; 3 Historical Precedents &bull; 2 Relevant Offset Wells
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#245463] font-bold uppercase bg-[#FAF8F5] px-2.5 py-0.5 rounded-md border border-[#DDD2C0]">
            Evidence Retrieved
          </span>
        </div>

        {/* 3. FIELD ANSWER: Synthesized Engineering Precedent Response */}
        <div className="max-w-4xl bg-[#FAF8F5] rounded-3xl border border-[#DDD2C0] p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD2C0]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#D96B3B]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wide text-[#0D1B24]">
                FIELD ANSWER
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#0D1B24] bg-[#D96B3B]/15 px-3 py-1 rounded-full border border-[#D96B3B]/35 font-bold">
              VERIFIED ARCHIVE RECORD &bull; NHK-119 &bull; DDR #84
            </span>
          </div>

          <p className="text-sm sm:text-base text-[#0D1B24] leading-relaxed">
            Historical records indicate that comparable sticking events in <strong>NHK-119</strong> near <strong>3,160–3,220 m</strong> were handled through spotting a 40-bbl glycol lubricant pill, jarring downward with 110 klbf overpull, and increasing annular circulation rate to 860 L/min to prevent cuttings pack-off. Post-incident protocol enforced limiting static connection intervals to under 3 minutes.
          </p>

          {/* 4. EVIDENCE: Verbatim Evidence Chips */}
          <div className="pt-3 border-t border-[#DDD2C0] flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold mr-1">
                EVIDENCE:
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0D1B24] bg-[#F5F0E6] px-3 py-1 rounded-xl border border-[#DDD2C0] font-bold">
                <FileText className="h-3.5 w-3.5 text-[#A9533D]" />
                NHK-119
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0D1B24] bg-[#F5F0E6] px-3 py-1 rounded-xl border border-[#DDD2C0]">
                DDR #84
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0D1B24] bg-[#D96B3B]/15 px-3 py-1 rounded-xl border border-[#D96B3B]/35 font-bold">
                3,160–3,220 m
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0D1B24] bg-[#F5F0E6] px-3 py-1 rounded-xl border border-[#DDD2C0] font-bold">
                Tipam Sandstone
              </span>
            </div>

            {/* CTA: Open Evidence Workspace */}
            <Link
              href="/knowledge?well=NHK-124&depth=3180"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0D1B24] hover:text-[#D96B3B] transition-colors"
            >
              <span>Open Evidence Workspace</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#D96B3B]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
