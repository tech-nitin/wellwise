"use client";

import React from "react";
import { CheckSquare, Info, ShieldCheck } from "lucide-react";

interface EngineeringInterpretationProps {
  wellId: string;
  formation: string;
}

export function EngineeringInterpretation({
  wellId,
  formation,
}: EngineeringInterpretationProps) {
  const checklist = [
    "Review offset torque/drag behavior in NHK-119 and adjacent wells",
    "Review historical drilling response and wiper trip interval in this zone",
    "Check current drilling parameters and mud motor differential pressure against recent baseline",
    "Review relevant mitigation records, shaker return volume, and lubricant pill inventory",
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3.5 sm:p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD2C0]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#245463]" />
          <h3 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight">
            ENGINEERING INTERPRETATION &amp; INVESTIGATION
          </h3>
        </div>
        <span className="text-[9px] font-mono text-[#8B877D]">
          DECISION SUPPORT
        </span>
      </div>

      <div className="pt-2.5 space-y-2.5 text-xs">
        {/* Interpretation Narrative */}
        <p className="font-sans text-[#142B3A] leading-relaxed">
          Current telemetry shows increasing torque while ROP is declining during penetration into <strong>{formation}</strong>.
          Similar behavior appears in three nearby offset wells around the <strong>3,050–3,200 m</strong> interval.
        </p>

        {/* What to Investigate Checklist */}
        <div className="p-3 rounded-lg bg-white border border-[#DDD2C0] space-y-1.5 font-mono">
          <div className="flex items-center gap-1.5 text-[#0D1B24] font-bold text-xs mb-1">
            <CheckSquare className="h-3.5 w-3.5 text-[#D96B3B]" />
            <span>WHAT TO INVESTIGATE:</span>
          </div>

          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] font-sans text-[#142B3A]">
              <span className="font-mono text-[#D96B3B] font-bold shrink-0">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Advisory Note */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8B877D]">
          <Info className="h-3 w-3 text-[#245463]" />
          <span>WellWise decision support assists supervisory analysis; it does not replace rig engineering judgment.</span>
        </div>
      </div>
    </div>
  );
}
