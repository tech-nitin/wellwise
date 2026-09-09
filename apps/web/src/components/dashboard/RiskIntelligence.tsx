"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Activity,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";

export function RiskIntelligence() {
  const supportingEvidence = [
    {
      source: "NHK-119",
      depth: "3,160 m MD",
      event: "Differential sticking",
      relevance: "Lead Precedent (94.6% match)",
      description: "Pipe stuck after 14-min connection pause in high-permeability sandstone. Required 48 hrs jarring to free.",
      tag: "Historical Event Match",
      critical: true,
    },
    {
      source: "DDR #84-2023",
      depth: "3,180 m MD",
      event: "Historical torque increase",
      relevance: "Precursor Signature (+38%)",
      description: "Cyclic torque oscillations and erratic drag preceded tight hole by 45 minutes across Barail contact.",
      tag: "Precursor Trend",
      critical: false,
    },
    {
      source: "NHK-121",
      depth: "3,190 m MD",
      event: "Similar formation response",
      relevance: "Lithology Overbalance (+1.2 ppg)",
      description: "Tipam sandstone interval demonstrated high differential filtration cake thickness and high wall contact.",
      tag: "Basin Correlation",
      critical: false,
    },
    {
      source: "Mitigation Record",
      depth: "3,220 m MD",
      event: "Mud-weight adjustment & soak pill",
      relevance: "Resolution Protocol",
      description: "Spotting 40-bbl glycol-oil lubricant pill with continuous string oscillation freed assembly without sidetrack.",
      tag: "Mitigation Record",
      critical: false,
    },
  ];

  return (
    <section
      id="risk-intelligence"
      className="relative w-full py-12 lg:py-16 overflow-hidden border-b border-[#DDD2C0] select-none"
    >
      {/* Ambient Geological Background System - Predictive Risk Subsurface Depth Variant */}
      <GeologicalBackground variant="risk" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-7 relative z-10">
        {/* Section Heading & Flow Indicator */}
        <div className="max-w-3xl text-left space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#843D35] bg-[#843D35]/10 px-2.5 py-0.5 rounded-full border border-[#843D35]/30">
              04 &bull; DETECT EARLY-WARNING PATTERNS
            </span>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A9533D] font-extrabold">
            <ShieldAlert className="h-3.5 w-3.5 text-[#D96B3B]" />
            <span>EARLY-WARNING RISK INTELLIGENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B24] leading-[1.08]">
            Detect the Pattern<br />
            <span className="text-[#D96B3B]">Before It Becomes an Incident.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#142B3A]/80 leading-relaxed max-w-2xl">
            Correlate active drilling signals with offset hazard catalogs to identify abnormal trends and retrieve proven engineering mitigations.
          </p>
        </div>

        {/* Workflow Strip: Signal → Detected → Match → Evidence → Attention */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] shadow-2xs font-mono text-xs text-[#142B3A]/80 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="px-2.5 py-0.5 rounded bg-[#142B3A] text-[#D96B3B] font-bold uppercase text-[10px]">
              DECISION PIPELINE
            </span>
            <span className="font-semibold text-[#0D1B24]">REAL-TIME SIGNAL</span>
            <span className="text-[#D96B3B] font-bold">&rarr;</span>
            <span className="font-semibold text-[#0D1B24]">PATTERN DETECTED</span>
            <span className="text-[#D96B3B] font-bold">&rarr;</span>
            <span className="font-semibold text-[#0D1B24]">OFFSET MATCH</span>
            <span className="text-[#D96B3B] font-bold">&rarr;</span>
            <span className="font-semibold text-[#0D1B24]">HISTORICAL EVIDENCE</span>
            <span className="text-[#D96B3B] font-bold">&rarr;</span>
            <span className="font-extrabold text-[#843D35] bg-[#843D35]/10 px-2 py-0.5 rounded border border-[#843D35]/30">
              ENGINEERING ATTENTION
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#245463] font-bold hidden md:inline">
            Deterministic Signal Matching
          </span>
        </div>

        {/* Operational Intelligence Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Panel: Primary Early-Warning Risk Indicator (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] shadow-md text-left flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header: Title & Indicator Score */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#DDD2C0]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A9533D] font-extrabold block mb-1">
                    EARLY-WARNING RISK INDICATOR
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0D1B24] tracking-tight font-mono">
                    DIFFERENTIAL STICKING HAZARD
                  </h3>
                  <span className="text-xs font-mono text-[#142B3A]/70 mt-0.5 block">
                    Formation Interval: Tipam Sandstone (3,240 m – 3,310 m MD)
                  </span>
                </div>

                {/* Score */}
                <div className="text-right flex flex-col items-end shrink-0">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-[#843D35] tracking-tight">
                    78<span className="text-xl text-[#843D35]/65 font-bold">/100</span>
                  </span>
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-[#843D35] text-white font-mono text-[9px] font-extrabold uppercase tracking-wider shadow-2xs">
                    HIGH ATTENTION
                  </span>
                </div>
              </div>

              {/* Why is this being flagged? */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-[#0D1B24] tracking-wide block">
                  Why is this being flagged?
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-[#142B3A]/85 leading-relaxed font-medium">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D96B3B] mt-2 shrink-0" />
                    <span>Torque drag is currently <strong>+34% above</strong> the local operating baseline.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D96B3B] mt-2 shrink-0" />
                    <span>Historical offset wells recorded sticking events in a comparable interval.</span>
                  </li>
                </ul>
              </div>

              {/* Lead Evidence Summary */}
              <div className="p-4 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#142B3A]/70 font-semibold">Lead Precedent:</span>
                  <span className="font-bold text-[#0D1B24]">NHK-119 &bull; 3,160–3,220 m</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#142B3A]/70 font-semibold">Historical Event:</span>
                  <span className="text-[#843D35] font-bold">Differential sticking</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#DDD2C0]/60">
                  <span className="text-[#142B3A]/70 font-semibold">Similarity:</span>
                  <span className="text-[#2F8068] font-bold">High (94.6% signature match)</span>
                </div>
              </div>

              {/* Suggested Precedent Mitigation Protocols */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#0D1B24] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2F8068]" />
                    Recommended Investigation
                  </span>
                  <span className="text-[10px] text-[#142B3A]/60">Action Checklist</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#142B3A]/80 font-mono">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D96B3B] font-bold">&bull;</span>
                    <span>Maintain string rotation &gt;60 RPM during connection pauses.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D96B3B] font-bold">&bull;</span>
                    <span>Verify mud filtration cake thickness across permeable sandstone.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Panel CTA */}
            <div className="mt-5 pt-4 border-t border-[#DDD2C0] flex items-center justify-between text-xs font-mono">
              <span className="text-[#2F8068] font-bold flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-[#2F8068]" />
                Early-Warning Decision Support
              </span>
              <Link
                href="/risks?well=NHK-124"
                className="inline-flex items-center gap-1.5 text-[#0D1B24] font-bold hover:text-[#D96B3B] transition-all group"
              >
                <span>Inspect Risk Engine</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#D96B3B] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Panel: Supporting Field Evidence in Deep Petroleum (#142B3A) (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#142B3A] text-[#F5F0E6] shadow-xl text-left flex flex-col justify-between border border-[#245463]/50">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#245463]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D96B3B] font-extrabold block mb-1">
                    HISTORICAL CONTEXT
                  </span>
                  <h4 className="text-xl font-bold tracking-tight text-[#F5F0E6] font-mono">
                    SUPPORTING FIELD EVIDENCE
                  </h4>
                </div>
                <span className="text-xs font-mono text-[#D96B3B] font-bold bg-[#245463] px-3 py-1 rounded-full border border-[#D96B3B]/30">
                  4 matches &bull; 3 historical precedents
                </span>
              </div>

              {/* 4 Evidence Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                {supportingEvidence.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#245463]/30 border border-[#245463]/70 hover:border-[#D96B3B]/50 transition-all flex flex-col justify-between space-y-1.5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#D96B3B] font-bold">
                          {item.tag}
                        </span>
                        {item.critical && (
                          <span className="h-2 w-2 rounded-full bg-[#843D35] ring-2 ring-[#843D35]/40" />
                        )}
                      </div>
                      <div className="flex items-baseline justify-between gap-1">
                        <h5 className="text-xs font-bold font-mono text-[#F5F0E6]">
                          {item.source}
                        </h5>
                        <span className="text-[10px] font-mono text-[#DDD2C0]/70">
                          {item.depth}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold font-mono text-[#D96B3B] block mt-0.5">
                        {item.event}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#F5F0E6]/75 leading-relaxed pt-1.5 border-t border-[#245463]/60">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Citation & Link to RAG Evidence */}
            <div className="mt-5 pt-4 border-t border-[#245463] flex items-center justify-between text-xs font-mono text-[#F5F0E6]/70">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#D96B3B]" />
                <span>Source: Oil India Limited Offset Logs</span>
              </span>
              <Link
                href="/knowledge?well=NHK-124&depth=3180"
                className="inline-flex items-center gap-1 text-[#D96B3B] font-bold hover:underline"
              >
                <span>Open Evidence</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
