"use client";

import React from "react";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface OffsetWellExperienceItem {
  wellId: string;
  wellName: string;
  distanceKm: string;
  relevantEvent: string;
  depthM: string;
  matchLevel: "STRONG" | "MODERATE" | "LOW";
  evidenceRecordsCount: number;
  formation: string;
  outcomeNote: string;
}

const DEFAULT_OFFSET_EXPERIENCE: OffsetWellExperienceItem[] = [
  {
    wellId: "NHK-119",
    wellName: "NHK-119",
    distanceKm: "4.2 km NW",
    relevantEvent: "Torque escalation & stick-slip vibrations",
    depthM: "3,120 m",
    matchLevel: "STRONG",
    evidenceRecordsCount: 5,
    formation: "Jurassic T3",
    outcomeNote: "Reduced WOB and pumped lubricant sweep to normalize torque.",
  },
  {
    wellId: "NHK-127",
    wellName: "NHK-127",
    distanceKm: "11.3 km SE",
    relevantEvent: "Partial lost circulation (18 bbl/hr)",
    depthM: "3,180 m",
    matchLevel: "STRONG",
    evidenceRecordsCount: 4,
    formation: "Jurassic T3",
    outcomeNote: "CaCO3 bridging pill successfully healed permeable loss zone.",
  },
  {
    wellId: "NHK-121",
    wellName: "NHK-121",
    distanceKm: "7.8 km E",
    relevantEvent: "Annular ECD surge & pressure flutter",
    depthM: "3,090 m",
    matchLevel: "MODERATE",
    evidenceRecordsCount: 3,
    formation: "Jurassic T3",
    outcomeNote: "Conditioned mud weight and increased flow rate to 510 gpm.",
  },
  {
    wellId: "NHK-112",
    wellName: "NHK-112",
    distanceKm: "14.6 km W",
    relevantEvent: "Tight hole on connection survey stop",
    depthM: "3,240 m",
    matchLevel: "MODERATE",
    evidenceRecordsCount: 2,
    formation: "Jurassic T3",
    outcomeNote: "Restricted stationary time to <3.5 minutes to avoid sticking.",
  },
];

interface OffsetExperienceTableProps {
  offsetItems?: OffsetWellExperienceItem[];
}

export const OffsetExperienceTable: React.FC<OffsetExperienceTableProps> = ({
  offsetItems = DEFAULT_OFFSET_EXPERIENCE,
}) => {
  return (
    <div className="bg-[#FAF7F2] border-2 border-[#DDD2C0] rounded-xl p-4 sm:p-5 shadow-sm space-y-3.5 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD2C0]/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#245463]" />
          <h3 className="text-sm font-bold tracking-wider uppercase text-[#142B3A]">
            RELEVANT OFFSET WELL EXPERIENCE
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E4DDD0] text-[#142B3A] border border-[#DDD2C0]">
            {offsetItems.length} NEARBY WELLS
          </span>
        </div>
        <Link
          href="/nearby-wells"
          className="text-xs text-[#245463] hover:text-[#142B3A] font-mono font-bold flex items-center gap-1 transition-colors"
        >
          <span>OPEN OFFSET WELLS MAP</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto border border-[#DDD2C0] rounded-lg bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2] text-[#5A6572] font-mono uppercase border-b border-[#DDD2C0]">
            <tr>
              <th className="py-2.5 px-3">OFFSET</th>
              <th className="py-2.5 px-3">DISTANCE</th>
              <th className="py-2.5 px-3">HISTORICAL MATCH</th>
              <th className="py-2.5 px-3">DEPTH</th>
              <th className="py-2.5 px-3">FORMATION</th>
              <th className="py-2.5 px-3">MATCH</th>
              <th className="py-2.5 px-3">EVIDENCE</th>
              <th className="py-2.5 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD2C0]/70 text-[#142B3A]">
            {offsetItems.map((offset) => {
              const isStrong = offset.matchLevel === "STRONG";
              return (
                <tr key={offset.wellId} className="hover:bg-[#FAF7F2]/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#142B3A]">
                    {offset.wellName}
                  </td>
                  <td className="py-2.5 px-3 text-[#5A6572] font-mono whitespace-nowrap">
                    {offset.distanceKm}
                  </td>
                  <td className="py-2.5 px-3 max-w-xs">
                    <p className="font-semibold text-[#0D1B24] truncate">{offset.relevantEvent}</p>
                    <p className="text-[10px] text-[#6B7280] italic truncate">&ldquo;{offset.outcomeNote}&rdquo;</p>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold whitespace-nowrap">
                    {offset.depthM}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-[#5A6572] font-mono">
                    {offset.formation}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        isStrong
                          ? "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/30"
                          : "bg-[#D96B3B]/15 text-[#D96B3B] border-[#D96B3B]/30"
                      }`}
                    >
                      {offset.matchLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold whitespace-nowrap text-[#245463]">
                    {offset.evidenceRecordsCount} records
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <Link
                      href={`/wells/${offset.wellId}`}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#245463] hover:text-[#142B3A] transition-colors"
                    >
                      <span>Dossier</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-2.5">
        {offsetItems.map((offset) => (
          <div
            key={offset.wellId}
            className="bg-white border border-[#DDD2C0] rounded-lg p-3 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-[#142B3A]">
                  {offset.wellName}
                </span>
                <span className="text-[11px] text-[#5A6572] font-mono">
                  ({offset.distanceKm})
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  offset.matchLevel === "STRONG"
                    ? "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/30"
                    : "bg-[#D96B3B]/15 text-[#D96B3B] border-[#D96B3B]/30"
                }`}
              >
                {offset.matchLevel}
              </span>
            </div>

            <p className="text-xs font-semibold text-[#142B3A]">
              {offset.relevantEvent}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-[#DDD2C0]/50 text-xs">
              <div className="flex items-center gap-2 font-mono text-[#5A6572] text-[11px]">
                <span>{offset.depthM}</span>
                <span>•</span>
                <span>{offset.formation}</span>
              </div>

              <Link
                href={`/wells/${offset.wellId}`}
                className="inline-flex items-center gap-1 font-mono font-bold text-[#245463] text-xs"
              >
                <span>Dossier</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
