"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";

export function RiskIntelligence() {
  const supportingEvidence = [
    {
      title: "Rising Torque",
      value: "+34% over 8m",
      description: "Progressive cyclic torque drag detected in permeable Tipam sandstone zone.",
      tag: "Live Sensor Anomaly",
      critical: false,
    },
    {
      title: "Low ROP",
      value: "14.2 m/h",
      description: "Drilling rate reduced from 22.5 to 14.2 m/h indicating differential wall friction.",
      tag: "MWD Telemetry",
      critical: false,
    },
    {
      title: "Historical Matching Events",
      value: "NHK-119 Precedent",
      description: "Stuck pipe occurred at 3,265 m after 14-min pump pause; required 48 hrs NPT to jar free.",
      tag: "Offset Log Match",
      critical: true,
    },
    {
      title: "Similar Offset Wells",
      value: "7 Offset Wells",
      description: "Geological fault block OIL-NAH-04 displays high differential overbalance risk across 3,240–3,310m.",
      tag: "Basin Correlation",
      critical: false,
    },
  ];

  return (
    <section
      id="risk-intelligence"
      className="relative w-full py-16 lg:py-20 overflow-hidden border-b border-[#DDD2C0] select-none"
    >
      {/* Ambient Geological Background System - Predictive Risk Subsurface Depth Variant */}
      <GeologicalBackground variant="risk" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Section Heading */}
        <div className="max-w-3xl text-left space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A9533D] font-extrabold">
            <ShieldAlert className="h-3.5 w-3.5 text-[#D96B3B]" />
            <span>EARLY-WARNING HAZARD INTELLIGENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B24] leading-[1.08]">
            Detect the Pattern<br />
            <span className="text-[#D96B3B]">Before It Becomes an Incident.</span>
          </h2>
          <p className="text-base text-[#142B3A]/80 leading-relaxed max-w-2xl">
            Continuous historical pattern matching correlates active MWD telemetry streams against 142 offset wells to surface operational hazards before NPT occurs.
          </p>
        </div>

        {/* Workflow Strip: Evidence-Backed Decision Support */}
        <div className="flex items-center gap-2.5 flex-wrap text-xs font-mono text-[#142B3A]/70 pt-1">
          <span className="px-3 py-1 rounded-full bg-[#142B3A] text-[#D96B3B] font-bold uppercase tracking-wider text-[10px]">
            EVIDENCE-BACKED DECISION SUPPORT
          </span>
          <span className="hidden sm:inline text-[#DDD2C0]">&bull;</span>
          <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
            <span>LIVE SIGNALS</span>
            <span className="text-[#A9533D] font-bold">&rarr;</span>
            <span>HISTORICAL PATTERN MATCH</span>
            <span className="text-[#A9533D] font-bold">&rarr;</span>
            <span className="text-[#843D35] font-extrabold">RISK INDICATOR</span>
            <span className="text-[#A9533D] font-bold">&rarr;</span>
            <span>SUPPORTING EVIDENCE</span>
            <span className="text-[#A9533D] font-bold">&rarr;</span>
            <span className="text-[#2F8068] font-bold">SUGGESTED MITIGATION</span>
          </div>
        </div>

        {/* Operational Intelligence Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Risk Panel: Differential Sticking Hazard (6 cols) */}
          <div className="lg:col-span-6 p-7 sm:p-9 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] shadow-md text-left flex flex-col justify-between">
            <div>
              {/* Eyebrow & Status Badge */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#DDD2C0]">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#A9533D] font-extrabold block mb-1">
                    ACTIVE DRILLING HAZARD SCENARIO
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0D1B24] tracking-tight font-mono">
                    DIFFERENTIAL STICKING HAZARD
                  </h3>
                  <span className="text-xs font-mono text-[#142B3A]/70 mt-1 block">
                    Formation Interval: Tipam Sandstone (3,240 m – 3,310 m MD)
                  </span>
                </div>

                {/* Risk Indicator 78/100 Badge */}
                <div className="text-right flex flex-col items-end shrink-0">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-[#843D35] tracking-tight">
                    78<span className="text-2xl text-[#843D35]/65 font-bold">/100</span>
                  </span>
                  <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[#843D35] text-white font-mono text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                    Risk Indicator
                  </span>
                </div>
              </div>

              {/* Operational Intelligence Statement */}
              <div className="py-5 space-y-3">
                <p className="text-sm sm:text-base text-[#0D1B24] leading-relaxed font-semibold">
                  &ldquo;Overbalance differential pressure (+1.2 ppg) combined with torque oscillations matches the precursor signature seen before pipe stuck in 7 offset wells.&rdquo;
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-[#142B3A]/70 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#2F8068]" />
                    <span>Evidence Match: 94.6%</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-[#DDD2C0] pl-4">
                    <span>Lead Precedent: NHK-119</span>
                  </div>
                </div>
              </div>

              {/* Suggested Mitigation Protocols (Historical Precedent-Based) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#0D1B24] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2F8068]" />
                    Suggested Mitigation (Precedent-Based)
                  </span>
                  <span className="text-[10px] font-mono text-[#142B3A]/60">
                    Decision Support
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-[#142B3A]/85 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-[#A9533D] font-bold">01.</span>
                    <span><strong>Maintain rotation:</strong> Keep drillstring rotating &gt;60 RPM during connection pauses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#A9533D] font-bold">02.</span>
                    <span><strong>Circulate high-rate:</strong> Boost annular flow to 860 L/min to prevent cuttings pack-off.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#A9533D] font-bold">03.</span>
                    <span><strong>Standby soak pill:</strong> Pre-mix 40-bbl glycol-oil lubricant pill at suction pit.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DDD2C0] flex items-center justify-between text-xs font-mono">
              <span className="text-[#2F8068] font-bold">
                Audit-Ready Evidence &bull; Rule #DS-14
              </span>
              <Link
                href="/risks"
                className="inline-flex items-center gap-1.5 text-[#0D1B24] font-bold hover:text-[#A9533D] hover:translate-x-0.5 transition-all"
              >
                <span>Full Risk Analysis</span>
                <ArrowRight className="h-4 w-4 text-[#D96B3B]" />
              </Link>
            </div>
          </div>

          {/* Supporting Evidence in Deep Petroleum (#142B3A) (6 cols) */}
          <div className="lg:col-span-6 p-7 sm:p-9 rounded-3xl bg-[#142B3A] text-[#F5F0E6] shadow-xl text-left flex flex-col justify-between border border-[#245463]/50">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#245463]">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#D96B3B] font-extrabold block mb-1">
                    CORROBORATING EVIDENCE
                  </span>
                  <h4 className="text-xl font-bold tracking-tight text-[#F5F0E6] font-mono">
                    Supporting Field Evidence
                  </h4>
                </div>
                <span className="text-xs font-mono text-[#D96B3B] font-bold bg-[#245463] px-3 py-1 rounded-full border border-[#D96B3B]/30">
                  4 signals &bull; 3 historical matches
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                {supportingEvidence.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#245463]/35 border border-[#245463]/70 hover:border-[#D96B3B]/50 transition-all flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#D96B3B] font-bold">
                          {item.tag}
                        </span>
                        {item.critical && (
                          <span className="h-2 w-2 rounded-full bg-[#843D35] ring-2 ring-[#843D35]/30" />
                        )}
                      </div>
                      <h5 className="text-sm font-bold font-mono text-[#F5F0E6]">
                        {item.title}
                      </h5>
                      <span className="text-base font-extrabold font-mono text-[#D96B3B] block mt-1">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-xs text-[#F5F0E6]/75 leading-relaxed pt-2 border-t border-[#245463]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#245463] flex items-center justify-between text-xs font-mono text-[#F5F0E6]/60">
              <span>Source: Oil India Limited Offset Logs</span>
              <span className="text-[#D96B3B] font-bold">Source Traceable</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
