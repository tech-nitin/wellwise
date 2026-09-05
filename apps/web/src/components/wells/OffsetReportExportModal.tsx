"use client";

import React from "react";
import {
  X,
  Printer,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  Compass,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { Well } from "@/components/dashboard/data/wells";
import { OffsetWellCalculated, RadiusKm } from "./types";
import { formatTimestampIST } from "@/lib/formatters";

interface OffsetReportExportModalProps {
  targetWell: Well;
  offsetWells: OffsetWellCalculated[];
  locationName: string;
  radiusKm: RadiusKm;
  onClose: () => void;
}

export function OffsetReportExportModal({
  targetWell,
  offsetWells,
  locationName,
  radiusKm,
  onClose,
}: OffsetReportExportModalProps) {
  const timestamp = formatTimestampIST();

  // Summary Metrics
  const totalOffsets = offsetWells.length;
  const highestRisk = offsetWells.reduce(
    (max, w) => Math.max(max, w.riskScore || 0),
    0
  );
  const avgMatch =
    totalOffsets > 0
      ? Math.round(
          offsetWells.reduce((acc, w) => acc + (w.historicalMatch || 0), 0) /
            totalOffsets
        )
      : 0;
  const closestWell = [...offsetWells].sort(
    (a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm
  )[0];

  // Group historical hazards
  const hazardList: {
    category: string;
    wellId: string;
    depthM: number;
    event: string;
    mitigation: string;
    severity: string;
  }[] = [];

  offsetWells.forEach((w) => {
    (w.events || []).forEach((ev) => {
      let cat = "Other Anomaly";
      const evLower = ev.event.toLowerCase();
      if (evLower.includes("loss") || evLower.includes("circulation")) cat = "Lost Circulation";
      else if (evLower.includes("kick") || evLower.includes("gas")) cat = "Kick / Gas Influx";
      else if (evLower.includes("stuck") || evLower.includes("differential")) cat = "Stuck Pipe";
      else if (evLower.includes("torque") || evLower.includes("drag")) cat = "Torque / Drag";
      else if (evLower.includes("cement") || evLower.includes("shoe")) cat = "Casing & Cementing";

      hazardList.push({
        category: cat,
        wellId: w.id,
        depthM: ev.depthM,
        event: ev.event,
        mitigation: w.recommendedAction || "Monitor trip tank, circulate bottoms-up, and adjust mud weight as indicated.",
        severity: ev.severity,
      });
    });
  });

  // Handle CSV Download
  const handleDownloadCSV = () => {
    const headers = [
      "Well ID",
      "Field",
      "Status",
      "Distance (km)",
      "Bearing",
      "Match (%)",
      "Risk Score",
      "Total Depth (m)",
      "Formation",
      "Latitude",
      "Longitude",
    ];

    const rows = offsetWells.map((w) => [
      w.id,
      `"${w.field}"`,
      w.status,
      w.calculatedDistanceKm.toFixed(2),
      `"${w.bearingFormatted}"`,
      w.historicalMatch ?? "",
      w.riskScore ?? "",
      w.depthM,
      `"${w.formation}"`,
      w.latitude,
      w.longitude,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `WellWise_PreSpud_Offset_Report_${targetWell.id}_${radiusKm}km.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0D1B24]/75 backdrop-blur-md font-sans select-none overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#FAF8F5] rounded-3xl border border-[#DDD2C0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Action Bar (Hidden on print) */}
        <div className="p-4 sm:p-5 border-b border-[#DDD2C0] bg-[#FAF8F5] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#142B3A] text-[#D96B3B] flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-mono font-black text-sm text-[#0D1B24]">
                PRE-SPUD OFFSET HAZARD & SUMMARY REPORT
              </h3>
              <p className="text-[11px] text-[#142B3A]/70 font-mono">
                Oil India Limited (OIL) SIH26121 &bull; Export Dossier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#142B3A] text-xs font-mono font-bold text-[#0D1B24] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#D96B3B] hover:bg-[#c45a2c] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl text-[#142B3A]/60 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 font-mono text-xs space-y-6 bg-white text-[#0D1B24] print:p-0">
          {/* Official Document Header */}
          <div className="border-b-2 border-[#142B3A] pb-4 flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D96B3B]">
                OIL INDIA LIMITED &bull; eRTMAC-NWIS
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0D1B24] tracking-tight mt-0.5">
                WELLWISE PRE-SPUD OFFSET HAZARD & WELL SUMMARY
              </h1>
              <p className="text-xs text-[#142B3A]/70 mt-1 font-sans">
                Comprehensive engineering offset synthesis for planned/active wellsite operations.
              </p>
            </div>
            <div className="text-right text-[10px] space-y-0.5">
              <div><strong>Generated:</strong> {timestamp}</div>
              <div><strong>Scope:</strong> {locationName}</div>
              <div><strong>Radius:</strong> {radiusKm} km Buffer</div>
              <div className="text-[#2F8068] font-bold">STATUS: OFFICIAL PRE-SPUD DOSSIER</div>
            </div>
          </div>

          {/* Reference Well & Top-Level Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#DDD2C0]">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#142B3A]/60 block font-bold">
                Active Reference Well
              </span>
              <span className="text-base font-extrabold text-[#0D1B24] block mt-0.5">
                {targetWell.id}
              </span>
              <span className="text-[10px] text-[#142B3A]/70">
                {targetWell.field} &bull; {targetWell.depthM}m TD
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#142B3A]/60 block font-bold">
                Offset Wells in Radius
              </span>
              <span className="text-base font-extrabold text-[#142B3A] block mt-0.5">
                {totalOffsets} Assets
              </span>
              <span className="text-[10px] text-[#142B3A]/70">Avg Match: <strong className="text-[#245463]">{avgMatch}%</strong></span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#142B3A]/60 block font-bold">
                Peak Hazard Risk
              </span>
              <span className={`text-base font-extrabold block mt-0.5 ${highestRisk > 70 ? "text-[#843D35]" : "text-[#D96B3B]"}`}>
                {highestRisk}/100
              </span>
              <span className="text-[10px] text-[#142B3A]/70">Critical offset alerts</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#142B3A]/60 block font-bold">
                Closest Offset Asset
              </span>
              <span className="text-base font-extrabold text-[#245463] block mt-0.5">
                {closestWell ? `${closestWell.calculatedDistanceKm.toFixed(2)} km` : "None"}
              </span>
              <span className="text-[10px] text-[#142B3A]/70">{closestWell ? closestWell.id : "—"}</span>
            </div>
          </div>

          {/* Section 1: Offset Well Table */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-extrabold text-[#0D1B24] tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#DDD2C0]">
              <Compass className="h-4 w-4 text-[#D96B3B]" />
              <span>1. REGIONAL OFFSET WELL INVENTORY</span>
            </h3>
            <div className="border border-[#DDD2C0] rounded-xl overflow-hidden">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead className="bg-[#EFE9DC] text-[#142B3A] text-[9px] uppercase font-bold border-b border-[#DDD2C0]">
                  <tr>
                    <th className="py-2 px-3">Well ID</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Distance</th>
                    <th className="py-2 px-2">Bearing</th>
                    <th className="py-2 px-2">Match %</th>
                    <th className="py-2 px-2">Risk</th>
                    <th className="py-2 px-2">TD (m)</th>
                    <th className="py-2 px-3">Key Formation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD2C0]">
                  {offsetWells.map((w) => (
                    <tr key={w.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-1.5 px-3 font-bold">{w.id}</td>
                      <td className="py-1.5 px-2 uppercase text-[9px] font-bold">{w.status}</td>
                      <td className="py-1.5 px-2 font-bold">{w.calculatedDistanceKm.toFixed(2)} km</td>
                      <td className="py-1.5 px-2 text-[#142B3A]/70">{w.bearingFormatted}</td>
                      <td className="py-1.5 px-2 font-bold text-[#245463]">{w.historicalMatch ?? 85}%</td>
                      <td className="py-1.5 px-2 font-bold">{w.riskScore ?? 45}/100</td>
                      <td className="py-1.5 px-2">{w.depthM.toLocaleString()}</td>
                      <td className="py-1.5 px-3 truncate max-w-[140px]">{w.formation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Historical Hazard Matrix */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-extrabold text-[#0D1B24] tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#DDD2C0]">
              <AlertTriangle className="h-4 w-4 text-[#843D35]" />
              <span>2. HISTORICAL DRILLING HAZARD LOG</span>
            </h3>
            {hazardList.length === 0 ? (
              <p className="text-xs text-[#142B3A]/60 italic">No significant hazards recorded in offset wells.</p>
            ) : (
              <div className="border border-[#DDD2C0] rounded-xl overflow-hidden">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead className="bg-[#EFE9DC] text-[#142B3A] text-[9px] uppercase font-bold border-b border-[#DDD2C0]">
                    <tr>
                      <th className="py-2 px-3">Anomaly Category</th>
                      <th className="py-2 px-2">Offset Well</th>
                      <th className="py-2 px-2">Recorded Depth</th>
                      <th className="py-2 px-3">Event Summary</th>
                      <th className="py-2 px-4">Historical Mitigation Applied</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD2C0]">
                    {hazardList.map((h, i) => (
                      <tr key={i} className="hover:bg-[#FAF8F5]">
                        <td className="py-2 px-3 font-bold text-[#843D35]">{h.category}</td>
                        <td className="py-2 px-2 font-bold">{h.wellId}</td>
                        <td className="py-2 px-2 font-mono font-bold text-[#D96B3B]">{h.depthM.toLocaleString()} m</td>
                        <td className="py-2 px-3 font-sans">{h.event}</td>
                        <td className="py-2 px-4 font-sans text-[#142B3A]/80 text-[10px]">{h.mitigation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 3: Mitigation Watchlist */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-extrabold text-[#0D1B24] tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#DDD2C0]">
              <ShieldAlert className="h-4 w-4 text-[#2F8068]" />
              <span>3. PRE-SPUD MITIGATION WATCHLIST</span>
            </h3>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] text-xs font-sans space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-[#2F8068] shrink-0 mt-0.5" />
                <span>
                  <strong>Depleted Sand Loss Zones:</strong> Offset records indicate severe losses in the upper pay section. Prepare 120 bbl LCM pill with sized calcium carbonate (medium & coarse blend) prior to penetrating 3,100 m.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-[#2F8068] shrink-0 mt-0.5" />
                <span>
                  <strong>Hydraulic Window Management:</strong> Maintain ECD within 0.4 ppg of static mud weight. Monitor trip tank level on all connection breaks.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-[#2F8068] shrink-0 mt-0.5" />
                <span>
                  <strong>Differential Sticking Mitigation:</strong> Limit static toolstring dwell time to &lt; 3 minutes across permeable sand packages. Pre-spot lubricant in mud system.
                </span>
              </div>
            </div>
          </div>

          {/* Synthetic Data Honesty Watermark */}
          <div className="pt-4 border-t border-[#DDD2C0] text-[9px] text-[#142B3A]/60 flex items-center justify-between font-mono">
            <span>SYNTHETIC DEMO DATA — NOT VERIFIED OIL ASSET LOCATIONS (SIH26121)</span>
            <span>WellWise Control Room System &bull; Confidential & Internal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
