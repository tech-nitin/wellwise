"use client";

import React, { useState } from "react";
import { Cpu, ChevronDown, ChevronUp, Layers, Sparkles, Search, CheckCircle2, FileScan, ArrowRight } from "lucide-react";

export const DocumentIntelligencePipeline: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#FAF7F2] border-2 border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-sm space-y-3 select-none">
      {/* Top Concise Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD2C0]/60 pb-2.5">
        <div>
          <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#142B3A] font-mono">
            HOW THIS ANSWER WAS BUILT
          </h3>
          <p className="text-[11px] text-[#5A6572] mt-0.5">
            Historical drilling documents are processed into searchable events and evidence used to support field intelligence.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#245463] hover:text-[#142B3A] transition-colors cursor-pointer bg-white px-2.5 py-1 rounded border border-[#DDD2C0] shadow-2xs self-start sm:self-auto"
        >
          <span>{expanded ? "COLLAPSE PIPELINE DETAILS" : "VIEW PIPELINE DETAILS"}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Concise Horizontal Pipeline Flow */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono text-[#142B3A] bg-white p-2.5 rounded-lg border border-[#DDD2C0]">
        <span className="font-bold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0]">
          OCR
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-[#8B877D]" />
        <span className="font-bold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0]">
          EVENT EXTRACTION
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-[#8B877D]" />
        <span className="font-bold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0]">
          EMBEDDINGS
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-[#8B877D]" />
        <span className="font-bold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD2C0]">
          SEARCH (VECTOR + FTS)
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-[#8B877D]" />
        <span className="font-bold px-2 py-0.5 rounded bg-[#2F8068]/15 text-[#2F8068] border border-[#2F8068]/30">
          EVIDENCE-LINKED ANSWER
        </span>
      </div>

      {/* Expandable Deep Technical Architecture Details */}
      {expanded && (
        <div className="p-3.5 bg-white border border-[#DDD2C0] rounded-lg text-xs font-mono space-y-2.5 text-[#5A6572] animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#142B3A] block">1. INGESTION &amp; OCR</span>
              <p className="text-[11px] text-[#5A6572] leading-relaxed font-sans">
                <strong>PaddleOCR</strong> extracts text, tabular bit runs, and mud logging sections from physical scanned reports with layout parsing.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#142B3A] block">2. DENSE &amp; LEXICAL INDEX</span>
              <p className="text-[11px] text-[#5A6572] leading-relaxed font-sans">
                <strong>FastEmbed (BGE-Large-EN)</strong> vectors stored in <strong>PostgreSQL pgvector (HNSW)</strong> blended with <strong>PostgreSQL Full-Text Search</strong>.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#DDD2C0] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#142B3A] block">3. RAG SYNTHESIS</span>
              <p className="text-[11px] text-[#5A6572] leading-relaxed font-sans">
                <strong>Llama 3.1 8B</strong> synthesizes evidence into traceable engineering findings with verbatim quotes and zero hallucinations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
