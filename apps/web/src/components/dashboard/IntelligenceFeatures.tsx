"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  AlertTriangle,
  Bot,
  ArrowRight,
  Activity,
  Search,
  MapPin,
} from "lucide-react";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";

export function IntelligenceFeatures() {
  return (
    <section
      id="engineering-capabilities"
      className="relative w-full py-16 lg:py-20 overflow-hidden border-b border-[#DDD2C0] select-none"
    >
      {/* Ambient Geological Background System - Historical Formations Variant */}
      <GeologicalBackground variant="intelligence" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading with Editorial Scale */}
        <div className="max-w-3xl mb-12 text-left space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#A9533D] font-extrabold block">
            ENGINEERING CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B24] leading-[1.08]">
            Turn Historical Data<br />
            <span className="text-[#D96B3B]">Into Intelligence.</span>
          </h2>
          <p className="text-base text-[#142B3A]/80 leading-relaxed max-w-2xl pt-1">
            An engineering framework purpose-built to convert decades of legacy well files, mud logs, and high-frequency sensor streams into defensible downhole decisions.
          </p>
        </div>

        {/* 3 Distinct Primary Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Capability 01 — Nearby Well Intelligence (Spatial/Map Language) */}
          <div className="h-full">
            <Link
              href="/nearby-wells"
              className="group block h-full p-7 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#142B3A]/50 transition-all duration-300 shadow-2xs hover:shadow-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-[#142B3A] text-[#D96B3B] flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                      <Compass className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A9533D] font-extrabold">
                        Spatial &amp; Historical Offset
                      </span>
                      <h3 className="text-xl font-extrabold text-[#0D1B24] tracking-tight">
                        01 — Nearby Well Intelligence
                      </h3>
                    </div>
                  </div>
                  <span className="text-3xl font-mono font-black text-[#DDD2C0] group-hover:text-[#D96B3B] transition-colors">
                    01
                  </span>
                </div>

                <p className="text-sm text-[#142B3A]/80 leading-relaxed mb-6">
                  Continuously benchmark active drilling parameters, formation depths, casing seats, and lost circulation zones against historical offset wells within your operational basin radius.
                </p>

                {/* Spatial/Map Specialized UI Widget */}
                <div className="p-3.5 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] font-mono text-xs space-y-2 mb-6">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#142B3A]/70 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#D96B3B]" />
                      <span>Assam &bull; Nahorkatiya Shelf</span>
                    </span>
                    <span className="text-[10px] text-[#2F8068] font-bold bg-[#2F8068]/15 px-2 py-0.5 rounded border border-[#2F8068]/30">
                      Active Sync
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#DDD2C0]/60 text-[11px]">
                    <span className="text-[#0D1B24] font-bold">24 Offset Wells</span>
                    <span className="text-[#142B3A]/60">5.0 km Radius</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DDD2C0]/60 flex items-center justify-between text-xs font-mono">
                <span className="text-[#142B3A]/70 font-semibold">OFFSET BENCHMARKING</span>
                <span className="inline-flex items-center gap-1.5 text-[#0D1B24] font-bold group-hover:text-[#A9533D] group-hover:translate-x-1 transition-all">
                  <span>Explore Well Network</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#D96B3B]" />
                </span>
              </div>
            </Link>
          </div>

          {/* Capability 02 — Early-Warning Risk Detection (Risk/Signal Language) */}
          <div className="h-full">
            <Link
              href="/risks"
              className="group block h-full p-7 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#142B3A]/50 transition-all duration-300 shadow-2xs hover:shadow-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-[#D96B3B]/15 text-[#A9533D] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#D96B3B]/35 shadow-2xs">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A9533D] font-extrabold">
                        Live Signals + Pattern Match
                      </span>
                      <h3 className="text-xl font-extrabold text-[#0D1B24] tracking-tight">
                        02 — Early-Warning Risk Detection
                      </h3>
                    </div>
                  </div>
                  <span className="text-3xl font-mono font-black text-[#DDD2C0] group-hover:text-[#A9533D] transition-colors">
                    02
                  </span>
                </div>

                <p className="text-sm text-[#142B3A]/80 leading-relaxed mb-6">
                  Correlate real-time surface and MWD telemetry against offset hazard catalogs to identify stuck pipe, kicks, and abnormal pressure ramps before NPT occurs.
                </p>

                {/* Risk/Signal Specialized UI Widget */}
                <div className="p-3.5 rounded-2xl bg-[#D96B3B]/10 border border-[#D96B3B]/30 font-mono text-xs space-y-1.5 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#843D35] flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-[#D96B3B] animate-pulse" />
                      Differential Sticking Hazard
                    </span>
                    <span className="text-[11px] font-extrabold text-[#843D35] bg-[#843D35]/15 px-2 py-0.5 rounded border border-[#843D35]/30">
                      78/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#142B3A]/75 pt-1 border-t border-[#D96B3B]/20">
                    <span>Precursor: Torque Drag +34%</span>
                    <span>Lead Precedent: NHK-119</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DDD2C0]/60 flex items-center justify-between text-xs font-mono">
                <span className="text-[#A9533D] font-bold">PRECURSOR SURFACING</span>
                <span className="inline-flex items-center gap-1.5 text-[#0D1B24] font-bold group-hover:text-[#A9533D] group-hover:translate-x-1 transition-all">
                  <span>Inspect Risk Engine</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#D96B3B]" />
                </span>
              </div>
            </Link>
          </div>

          {/* Capability 03 — AI Knowledge Search (Conversation/RAG Language) */}
          <div className="h-full">
            <Link
              href="/knowledge"
              className="group block h-full p-7 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#142B3A]/50 transition-all duration-300 shadow-2xs hover:shadow-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-[#245463] text-[#F5F0E6] flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A9533D] font-extrabold">
                        Drilling Archives &amp; RAG
                      </span>
                      <h3 className="text-xl font-extrabold text-[#0D1B24] tracking-tight">
                        03 — AI Knowledge Search
                      </h3>
                    </div>
                  </div>
                  <span className="text-3xl font-mono font-black text-[#DDD2C0] group-hover:text-[#245463] transition-colors">
                    03
                  </span>
                </div>

                <p className="text-sm text-[#142B3A]/80 leading-relaxed mb-6">
                  Natural-language access to drilling archives, daily drilling reports (DDRs), mud logs, and casing tallies for instant operational precedent and mitigation history.
                </p>

                {/* Conversation/RAG Specialized UI Widget */}
                <div className="p-3.5 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] font-mono text-xs space-y-1.5 mb-6">
                  <div className="flex items-center gap-2 text-[11px] text-[#0D1B24]">
                    <Search className="h-3.5 w-3.5 text-[#245463] shrink-0" />
                    <span className="truncate">&ldquo;NHK-187 stuck pipe resolution&rdquo;</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#DDD2C0]/60 text-[10px] text-[#142B3A]/70">
                    <span className="text-[#2F8068] font-bold">4 Sources Retrieved</span>
                    <span>Citation: DDR #84-2023</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DDD2C0]/60 flex items-center justify-between text-xs font-mono">
                <span className="text-[#142B3A]/70 font-semibold">NATURAL-LANGUAGE RAG</span>
                <span className="inline-flex items-center gap-1.5 text-[#0D1B24] font-bold group-hover:text-[#A9533D] group-hover:translate-x-1 transition-all">
                  <span>Ask Domain AI</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#D96B3B]" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
