"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  FileText,
  Compass,
  Layers,
  Shield,
  Activity,
  ExternalLink,
  Printer,
} from "lucide-react";
import { Well } from "@/components/dashboard/data/wells";
import {
  getWellStratigraphy,
  getWellCasingProgram,
  getWellNPTEvents,
} from "./wellEngineeringData";

interface WellDossierModalProps {
  well: Well;
  onClose: () => void;
}

export function WellDossierModal({ well, onClose }: WellDossierModalProps) {
  const [activeTab, setActiveTab] = useState<"specs" | "casing" | "geology" | "npt">("specs");

  const stratigraphy = getWellStratigraphy(well);
  const casingProgram = getWellCasingProgram(well);
  const nptEvents = getWellNPTEvents(well);

  const formattedDepth =
    typeof well.depthM === "number" ? well.depthM.toLocaleString() : well.depthM;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0D1B24]/75 backdrop-blur-md font-sans select-none overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#FAF8F5] rounded-3xl border border-[#DDD2C0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#DDD2C0] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-mono font-black text-[#0D1B24] tracking-tight">
                  WELL ENGINEERING DOSSIER — {well.id}
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#2F8068]/15 text-[#2F8068] px-2 py-0.5 rounded-full border border-[#2F8068]/30 uppercase">
                  {well.status}
                </span>
              </div>
              <p className="text-xs text-[#142B3A]/70 font-mono mt-0.5">
                {well.field || "Main Field"} &bull; {well.basin || "Upper Assam Basin"} &bull; {formattedDepth} m TD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print Dossier"
              className="h-8 w-8 rounded-xl text-[#142B3A]/70 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl text-[#142B3A]/60 hover:text-[#0D1B24] hover:bg-[#DDD2C0]/40 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Dossier Modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#DDD2C0] bg-[#FAF8F5] px-4 pt-2 gap-2 overflow-x-auto scrollbar-none font-mono text-xs">
          {[
            { id: "specs", label: "Specifications & Rig Data", icon: Compass },
            { id: "casing", label: "Casing Program", icon: Shield },
            { id: "geology", label: "Stratigraphic Column", icon: Layers },
            { id: "npt", label: "NPT & Incident History", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-[#D96B3B] text-[#D96B3B] bg-[#D96B3B]/5"
                    : "border-transparent text-[#142B3A]/70 hover:text-[#0D1B24]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 font-mono text-xs space-y-4">
          {/* TAB 1: SPECIFICATIONS */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0]">
                  <span className="text-[10px] text-[#142B3A]/70 uppercase font-bold block">Operator</span>
                  <span className="text-sm font-extrabold text-[#0D1B24] block mt-0.5">Oil India Limited</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0]">
                  <span className="text-[10px] text-[#142B3A]/70 uppercase font-bold block">Lease Block</span>
                  <span className="text-sm font-extrabold text-[#0D1B24] block mt-0.5">{well.leaseBlock || "OIL-NAH-04"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0]">
                  <span className="text-[10px] text-[#142B3A]/70 uppercase font-bold block">Drilling Rig</span>
                  <span className="text-sm font-extrabold text-[#0D1B24] block mt-0.5">RIG-OIL-{well.id.slice(-3) || "08"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0]">
                  <span className="text-[10px] text-[#142B3A]/70 uppercase font-bold block">Spud Date</span>
                  <span className="text-sm font-extrabold text-[#0D1B24] block mt-0.5">14-Jan-2025</span>
                </div>
              </div>

              {/* Geographic Coordinates Card */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-2">
                <h4 className="font-extrabold text-xs text-[#0D1B24] uppercase">Geographic & Elevation Parameters</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#142B3A]/60 block text-[10px]">Surface Latitude</span>
                    <strong className="text-[#0D1B24] font-bold">{well.latitude.toFixed(5)}° N</strong>
                  </div>
                  <div>
                    <span className="text-[#142B3A]/60 block text-[10px]">Surface Longitude</span>
                    <strong className="text-[#0D1B24] font-bold">{well.longitude.toFixed(5)}° E</strong>
                  </div>
                  <div>
                    <span className="text-[#142B3A]/60 block text-[10px]">Ground Elevation</span>
                    <strong className="text-[#0D1B24] font-bold">112.4 m MSL</strong>
                  </div>
                  <div>
                    <span className="text-[#142B3A]/60 block text-[10px]">Target Depth (MD)</span>
                    <strong className="text-[#D96B3B] font-bold">{formattedDepth} m</strong>
                  </div>
                  <div>
                    <span className="text-[#142B3A]/60 block text-[10px]">Target Depth (TVD)</span>
                    <strong className="text-[#D96B3B] font-bold">{Math.round((well.depthM || 3200) * 0.98)} m</strong>
                  </div>
                  <div>
                    <span className="text-[#142B3A]/60 block text-[10px]">Well Type</span>
                    <strong className="text-[#0D1B24] font-bold capitalize">{well.type} Well</strong>
                  </div>
                </div>
              </div>

              {/* Advisory note */}
              <div className="p-3.5 rounded-2xl bg-[#DDD2C0]/30 border border-[#DDD2C0] text-xs">
                <span className="text-[10px] font-bold text-[#A9533D] uppercase block mb-1">
                  Advisory Drilling Consideration
                </span>
                <p className="text-[#142B3A]/85 text-xs font-sans leading-relaxed">
                  {well.recommendedAction}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CASING PROGRAM */}
          {activeTab === "casing" && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] text-[11px] text-[#142B3A]/80">
                Wellbore casing program designed to isolate shallow aquifers and provide pressure containment across depleted sand formations.
              </div>

              <div className="border border-[#DDD2C0] rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#EFE9DC] border-b border-[#DDD2C0] text-[10px] uppercase font-black text-[#142B3A]">
                    <tr>
                      <th className="py-2.5 px-3">Casing String</th>
                      <th className="py-2.5 px-3">Outer Diameter</th>
                      <th className="py-2.5 px-3">Shoe Depth (MD)</th>
                      <th className="py-2.5 px-3">Weight / Grade</th>
                      <th className="py-2.5 px-3">Test Pressure</th>
                      <th className="py-2.5 px-3">TOC (Top of Cement)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD2C0]">
                    {casingProgram.map((cs, idx) => (
                      <tr key={idx} className="hover:bg-[#DDD2C0]/20">
                        <td className="py-2.5 px-3 font-bold text-[#0D1B24]">{cs.type} Casing</td>
                        <td className="py-2.5 px-3 font-extrabold text-[#D96B3B]">{cs.outerDiameterInch}</td>
                        <td className="py-2.5 px-3">{cs.settingDepthMD.toLocaleString()} m</td>
                        <td className="py-2.5 px-3">{cs.weightLbPerFt}# {cs.grade}</td>
                        <td className="py-2.5 px-3">{cs.testPressurePsi?.toLocaleString()} psi</td>
                        <td className="py-2.5 px-3 text-[#2F8068] font-bold">
                          {cs.cementTopM === 0 ? "Surface" : `${cs.cementTopM} m`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GEOLOGY */}
          {activeTab === "geology" && (
            <div className="space-y-4">
              <div className="border border-[#DDD2C0] rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#EFE9DC] border-b border-[#DDD2C0] text-[10px] uppercase font-black text-[#142B3A]">
                    <tr>
                      <th className="py-2.5 px-3">Formation</th>
                      <th className="py-2.5 px-3">Top Depth</th>
                      <th className="py-2.5 px-3">Base Depth</th>
                      <th className="py-2.5 px-3">Thickness</th>
                      <th className="py-2.5 px-3">Lithology Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD2C0]">
                    {stratigraphy.map((st, idx) => (
                      <tr
                        key={idx}
                        className={st.isTargetZone ? "bg-[#D96B3B]/10 font-bold" : "hover:bg-[#DDD2C0]/20"}
                      >
                        <td className="py-2.5 px-3 text-[#0D1B24]">
                          {st.name}
                          {st.isTargetZone && (
                            <span className="ml-1.5 text-[8px] bg-[#D96B3B] text-white px-1.5 py-0.2 rounded font-mono">
                              PAY
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">{st.topDepthM.toLocaleString()} m</td>
                        <td className="py-2.5 px-3">{st.baseDepthM.toLocaleString()} m</td>
                        <td className="py-2.5 px-3">{(st.baseDepthM - st.topDepthM).toLocaleString()} m</td>
                        <td className="py-2.5 px-3 font-sans text-[11px] text-[#142B3A]/75">{st.lithology}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: NPT & INCIDENTS */}
          {activeTab === "npt" && (
            <div className="space-y-3">
              {nptEvents.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#0D1B24]">{ev.event}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#843D35]/15 text-[#843D35]">
                        {ev.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#D96B3B]">
                      {ev.durationHours} hrs NPT
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#142B3A]/70">
                    <span>Depth: <strong>{ev.depthM.toLocaleString()} m MD</strong></span>
                    <span>&bull;</span>
                    <span>Date: {ev.date}</span>
                  </div>
                  <p className="text-xs font-sans text-[#142B3A]/85 pt-1">{ev.description}</p>
                  <div className="p-2 rounded-xl bg-[#DDD2C0]/25 border border-[#DDD2C0] text-[11px] font-sans text-[#0D1B24]">
                    <strong>Mitigation applied:</strong> {ev.mitigation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DDD2C0] bg-[#FAF8F5] flex items-center justify-between">
          <Link
            href={`/wells/${well.id}`}
            className="text-xs font-mono font-bold text-[#D96B3B] hover:underline flex items-center gap-1"
          >
            <span>Open Dedicated Dossier Page</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#142B3A] hover:bg-[#245463] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
