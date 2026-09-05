"use client";

import React, { useState } from "react";
import {
  Compass,
  FileText,
  GitCompare,
  MapPin,
  AlertTriangle,
  Sparkles,
  Filter,
} from "lucide-react";
import { Well } from "@/components/dashboard/data/wells";
import { OffsetWellCalculated, RadiusKm } from "./types";

interface OffsetWellsListProps {
  activeTargetWell: Well;
  offsetWells: OffsetWellCalculated[];
  selectedWell: Well | null;
  radiusKm: RadiusKm;
  onSelectWell: (well: Well) => void;
  onLocateWell: (well: Well) => void;
  onInspectDossier: (well: Well) => void;
  onCompareWell: (well: Well) => void;
  viewMode?: "split" | "table";
}

type SortField = "proximity" | "match" | "risk" | "depth";

export function OffsetWellsList({
  activeTargetWell,
  offsetWells,
  selectedWell,
  radiusKm,
  onSelectWell,
  onLocateWell,
  onInspectDossier,
  onCompareWell,
  viewMode = "split",
}: OffsetWellsListProps) {
  const [sortField, setSortField] = useState<SortField>("proximity");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === "proximity" ? true : false); // default proximity ascending, others descending
    }
  };

  const sortedWells = [...offsetWells].sort((a, b) => {
    let diff = 0;
    if (sortField === "proximity") {
      diff = a.calculatedDistanceKm - b.calculatedDistanceKm;
    } else if (sortField === "match") {
      diff = (b.historicalMatch || 0) - (a.historicalMatch || 0);
    } else if (sortField === "risk") {
      diff = (b.riskScore || 0) - (a.riskScore || 0);
    } else if (sortField === "depth") {
      diff = (b.depthM || 0) - (a.depthM || 0);
    }
    return sortAsc ? diff : -diff;
  });

  const getStatusBadge = (status: Well["status"]) => {
    switch (status) {
      case "active":
        return "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/40";
      case "warning":
        return "bg-[#D96B3B]/20 text-[#A9533D] border-[#D96B3B]/50";
      case "critical":
        return "bg-[#843D35]/15 text-[#843D35] border-[#843D35]/40";
      case "historical":
        return "bg-[#245463]/15 text-[#245463] border-[#245463]/40";
      default:
        return "bg-[#2F8068]/15 text-[#2F8068] border-[#2F8068]/40";
    }
  };

  if (viewMode === "table") {
    return (
      <div className="w-full h-full bg-[#FAF8F5] flex flex-col font-sans select-none overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-4 border-b border-[#DDD2C0] flex items-center justify-between flex-wrap gap-3 bg-[#FAF8F5]/90">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0D1B24] font-mono">
                Offset Wells Engineering Matrix
              </h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#142B3A] text-white">
                {offsetWells.length} Offset Wells ({radiusKm} km radius)
              </span>
            </div>
            <p className="text-xs text-[#142B3A]/70 font-mono mt-0.5">
              Active Reference Target: <strong className="text-[#0D1B24]">{activeTargetWell.id}</strong> ({activeTargetWell.name}) &bull; Dynamic Spherical Geodesic Distances
            </p>
          </div>

          {/* Quick Sort Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#DDD2C0]/40 font-mono text-xs">
            <span className="text-[10px] text-[#142B3A]/70 font-bold px-2 uppercase">Sort By:</span>
            {(["proximity", "match", "risk", "depth"] as SortField[]).map((f) => (
              <button
                key={f}
                onClick={() => handleSort(f)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                  sortField === f
                    ? "bg-[#142B3A] text-white shadow-2xs"
                    : "text-[#142B3A]/80 hover:bg-[#DDD2C0]/60"
                }`}
              >
                {f} {sortField === f && (sortAsc ? "↑" : "↓")}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Table View */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="sticky top-0 bg-[#EFE9DC] border-b border-[#DDD2C0] text-[10px] text-[#142B3A] uppercase tracking-wider font-extrabold z-10">
              <tr>
                <th className="py-3 px-4">Well Asset</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 cursor-pointer hover:bg-[#DDD2C0]/50" onClick={() => handleSort("proximity")}>
                  Distance / Bearing {sortField === "proximity" && (sortAsc ? "↑" : "↓")}
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-[#DDD2C0]/50" onClick={() => handleSort("match")}>
                  Formation Match {sortField === "match" && (sortAsc ? "↑" : "↓")}
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-[#DDD2C0]/50" onClick={() => handleSort("risk")}>
                  Risk Indicator {sortField === "risk" && (sortAsc ? "↑" : "↓")}
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-[#DDD2C0]/50" onClick={() => handleSort("depth")}>
                  Total Depth {sortField === "depth" && (sortAsc ? "↑" : "↓")}
                </th>
                <th className="py-3 px-4">Key Historical Hazards</th>
                <th className="py-3 px-4 text-right">Engineering Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD2C0]">
              {sortedWells.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-[#142B3A]/60 font-sans">
                    No offset wells found within {radiusKm} km of {activeTargetWell.id}.
                  </td>
                </tr>
              ) : (
                sortedWells.map((well) => {
                  const isSelected = selectedWell?.id === well.id;
                  const isTarget = activeTargetWell.id === well.id;

                  return (
                    <tr
                      key={well.id}
                      onClick={() => onSelectWell(well)}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#D96B3B]/10 hover:bg-[#D96B3B]/15"
                          : isTarget
                          ? "bg-[#2F8068]/10 hover:bg-[#2F8068]/15"
                          : "hover:bg-[#DDD2C0]/20"
                      }`}
                    >
                      {/* Well ID & Name */}
                      <td className="py-3 px-4 font-bold text-[#0D1B24]">
                        <div className="flex items-center gap-2">
                          <Compass className={`h-4 w-4 ${isTarget ? "text-[#2F8068]" : "text-[#D96B3B]"}`} />
                          <div>
                            <span className="block">{well.id}</span>
                            <span className="text-[10px] text-[#142B3A]/60 font-sans font-normal block truncate max-w-[160px]">
                              {well.field} &bull; {well.state}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(
                            well.status
                          )}`}
                        >
                          {isTarget ? "ACTIVE TARGET" : well.status}
                        </span>
                      </td>

                      {/* Distance / Bearing */}
                      <td className="py-3 px-3">
                        <span className="font-extrabold text-[#0D1B24] block">
                          {well.calculatedDistanceKm.toFixed(2)} km
                        </span>
                        <span className="text-[10px] text-[#142B3A]/70">
                          {well.bearingFormatted}
                        </span>
                      </td>

                      {/* Match % */}
                      <td className="py-3 px-3">
                        <span className="text-sm font-extrabold text-[#245463]">
                          {well.historicalMatch ?? 85}%
                        </span>
                        <div className="w-16 h-1.5 bg-[#DDD2C0] rounded-full overflow-hidden mt-0.5">
                          <div
                            className="h-full bg-[#245463]"
                            style={{ width: `${well.historicalMatch ?? 85}%` }}
                          />
                        </div>
                      </td>

                      {/* Risk */}
                      <td className="py-3 px-3">
                        <span
                          className={`font-extrabold ${
                            (well.riskScore || 0) > 70
                              ? "text-[#843D35]"
                              : (well.riskScore || 0) > 50
                              ? "text-[#D96B3B]"
                              : "text-[#2F8068]"
                          }`}
                        >
                          {well.riskScore ?? 45}/100
                        </span>
                      </td>

                      {/* TD */}
                      <td className="py-3 px-3 font-mono">
                        <span className="font-bold">{well.depthM.toLocaleString()} m</span>
                        <span className="text-[9px] text-[#142B3A]/60 block">{well.formation}</span>
                      </td>

                      {/* Hazards */}
                      <td className="py-3 px-4">
                        {(well.events || []).length === 0 ? (
                          <span className="text-[10px] text-[#142B3A]/50 italic">No critical anomalies logged</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {well.events.slice(0, 2).map((ev, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-[#DDD2C0]/40 px-2 py-0.5 rounded border border-[#DDD2C0] font-sans truncate max-w-[240px] text-[#0D1B24]"
                                title={`${ev.event} at ${ev.depthM}m`}
                              >
                                <strong>{ev.depthM}m:</strong> {ev.event}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onLocateWell(well)}
                            title="Locate on Map"
                            className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#142B3A] text-[#142B3A] transition-colors cursor-pointer"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onInspectDossier(well)}
                            title="Inspect Well Dossier"
                            className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#142B3A] text-[#142B3A] transition-colors cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                          {!isTarget && (
                            <button
                              onClick={() => onCompareWell(well)}
                              title="Compare with Active Target"
                              className="px-2 py-1 rounded-lg bg-[#D96B3B] text-white hover:bg-[#c45a2c] text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <GitCompare className="h-3 w-3" />
                              <span>Compare</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // DEFAULT / SPLIT VIEW: Card-based Side Drawer
  return (
    <div className="w-full h-full bg-[#FAF8F5]/98 backdrop-blur-md border-l border-[#DDD2C0] flex flex-col font-sans select-none overflow-hidden">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-[#DDD2C0] bg-[#DDD2C0]/20 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#D96B3B]" />
            <h3 className="text-xs font-mono font-extrabold text-[#0D1B24] uppercase tracking-wider">
              OFFSET WELLS ({radiusKm} KM RADIUS)
            </h3>
          </div>
          <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-[#142B3A] text-white">
            {offsetWells.length} Wells
          </span>
        </div>

        {/* Active Target Banner */}
        <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#DDD2C0] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-6 w-6 rounded-lg bg-[#2F8068] text-white flex items-center justify-center shrink-0">
              <Compass className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono uppercase text-[#142B3A]/60 font-bold block">
                ACTIVE TARGET WELL
              </span>
              <span className="font-mono font-bold text-[#0D1B24] truncate block">
                {activeTargetWell.id} &bull; {activeTargetWell.depthM}m TD
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#2F8068] font-bold px-1.5 py-0.5 rounded bg-[#2F8068]/15">
            ORIGIN
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-[#142B3A]/70 uppercase font-bold flex items-center gap-1">
            <Filter className="h-3 w-3" />
            <span>SORT:</span>
          </span>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            {(["proximity", "match", "risk", "depth"] as SortField[]).map((f) => (
              <button
                key={f}
                onClick={() => handleSort(f)}
                className={`px-2 py-0.5 rounded-md font-bold capitalize transition-colors cursor-pointer ${
                  sortField === f
                    ? "bg-[#142B3A] text-white"
                    : "text-[#142B3A]/70 hover:bg-[#DDD2C0]/50"
                }`}
              >
                {f} {sortField === f && (sortAsc ? "↑" : "↓")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Offset Cards */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 scrollbar-none">
        {sortedWells.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#142B3A]/70 font-mono space-y-1.5">
            <Compass className="h-8 w-8 text-[#DDD2C0] mx-auto" />
            <p className="font-bold">No offset wells within {radiusKm} km.</p>
            <p className="text-[10px]">Expand the radius filter to 10 km or 20 km to discover more regional offset assets.</p>
          </div>
        ) : (
          sortedWells.map((well) => {
            const isSelected = selectedWell?.id === well.id;
            const isTarget = activeTargetWell.id === well.id;

            return (
              <div
                key={well.id}
                onClick={() => onSelectWell(well)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                  isSelected
                    ? "bg-[#FAF8F5] border-[#D96B3B] ring-2 ring-[#D96B3B]/30 shadow-md"
                    : isTarget
                    ? "bg-[#2F8068]/10 border-[#2F8068]/40"
                    : "bg-[#FAF8F5] border-[#DDD2C0] hover:border-[#142B3A] hover:shadow-2xs"
                }`}
              >
                {/* Header: ID, Distance & Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-xs text-[#0D1B24]">
                        {well.id}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full border ${getStatusBadge(
                          well.status
                        )}`}
                      >
                        {isTarget ? "TARGET" : well.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#142B3A]/70 font-mono block mt-0.5">
                      {well.field || "Main Field"} &bull; {well.depthM.toLocaleString()} m TD
                    </span>
                  </div>

                  {/* Geodesic Proximity Badge */}
                  <div className="text-right font-mono">
                    <span className="text-xs font-black text-[#D96B3B] block">
                      {well.calculatedDistanceKm.toFixed(2)} km
                    </span>
                    <span className="text-[9px] text-[#142B3A]/60 block">
                      {well.bearingFormatted}
                    </span>
                  </div>
                </div>

                {/* Metrics: Match % and Risk Score */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                  <div className="p-1.5 rounded-xl bg-[#DDD2C0]/25 border border-[#DDD2C0]/50 flex items-center justify-between">
                    <span className="text-[#142B3A]/70 font-bold">Match:</span>
                    <span className="font-extrabold text-[#245463] flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {well.historicalMatch ?? 88}%
                    </span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#DDD2C0]/25 border border-[#DDD2C0]/50 flex items-center justify-between">
                    <span className="text-[#142B3A]/70 font-bold">Risk:</span>
                    <span
                      className={`font-extrabold ${
                        (well.riskScore || 0) > 70
                          ? "text-[#843D35]"
                          : (well.riskScore || 0) > 50
                          ? "text-[#D96B3B]"
                          : "text-[#2F8068]"
                      }`}
                    >
                      {well.riskScore ?? 42}/100
                    </span>
                  </div>
                </div>

                {/* Key Historical Hazard Tag */}
                {(well.events || []).length > 0 && (
                  <div className="text-[10px] font-mono text-[#843D35] bg-[#843D35]/10 p-1.5 rounded-xl border border-[#843D35]/20 flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {well.events[0].event} ({well.events[0].depthM}m)
                    </span>
                  </div>
                )}

                {/* Card Action Buttons */}
                <div className="pt-1 flex items-center justify-between border-t border-[#DDD2C0]/50 font-mono text-[10px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLocateWell(well);
                    }}
                    className="flex items-center gap-1 text-[#142B3A] hover:text-[#D96B3B] font-bold transition-colors cursor-pointer py-1"
                  >
                    <MapPin className="h-3 w-3" />
                    <span>Locate</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectDossier(well);
                      }}
                      className="flex items-center gap-1 text-[#245463] hover:underline font-bold transition-colors cursor-pointer px-1.5 py-0.5 rounded"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Dossier</span>
                    </button>

                    {!isTarget && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompareWell(well);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-[#D96B3B] text-white hover:bg-[#c45a2c] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      >
                        <GitCompare className="h-3 w-3" />
                        <span>Compare</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
