"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, Compass, Layers, Radio } from "lucide-react";
import { SYNTHETIC_WELLS, Well } from "@/components/dashboard/data/wells";
import { cn } from "@/lib/utils";

interface MonitoringWellSelectorProps {
  selectedWell: Well;
  onSelectWell: (well: Well) => void;
  currentDepthM: number;
  drillingActivity: string;
}

export function MonitoringWellSelector({
  selectedWell,
  onSelectWell,
  currentDepthM,
  drillingActivity,
}: MonitoringWellSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBasinFilter, setSelectedBasinFilter] = useState<string>("ALL");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const basins = ["ALL", "Upper Assam Basin", "Cambay Basin", "Barmer Basin", "Krishna-Godavari Basin", "Madhya Pradesh"];

  const filteredWells = SYNTHETIC_WELLS.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.formation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.field?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.state?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBasin =
      selectedBasinFilter === "ALL" ||
      (selectedBasinFilter === "Madhya Pradesh" && w.state === "Madhya Pradesh") ||
      w.basin?.toLowerCase().includes(selectedBasinFilter.toLowerCase());

    return matchesSearch && matchesBasin;
  });

  const rigId = `RIG-OIL-${selectedWell.id.replace(/[^0-9]/g, "") || "124"}`;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Compact Well Selector Strip */}
      <div className="bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl px-3.5 py-2.5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Well ID & Context */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-[#142B3A] text-white flex items-center justify-center shrink-0">
              <Compass className="h-4 w-4 text-[#D96B3B]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#8B877D] uppercase">
                  MONITORING WELL
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#2F8068]/15 text-[#2F8068] border border-[#2F8068]/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2F8068] animate-pulse" />
                  ACTIVE
                </span>
                <span className="text-[10px] font-mono font-bold text-[#142B3A] bg-[#DDD2C0]/40 px-1.5 py-0.2 rounded">
                  {rigId}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <h2 className="text-lg font-extrabold font-mono text-[#0D1B24] tracking-tight truncate">
                  {selectedWell.id}
                </h2>
                <span className="text-xs text-[#142B3A]/80 truncate">
                  {selectedWell.field || "Naharkatiya Main"} · {selectedWell.basin || selectedWell.state || "Upper Assam Basin"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Context & Switcher Button */}
          <div className="flex items-center gap-2.5 self-start md:self-auto justify-between md:justify-end shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="px-2 py-0.5 rounded-lg bg-white border border-[#DDD2C0]">
                <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Depth</span>
                <strong className="text-xs text-[#0D1B24] font-bold">
                  {currentDepthM} m
                </strong>
              </div>

              <div className="px-2 py-0.5 rounded-lg bg-white border border-[#DDD2C0]">
                <span className="text-[9px] text-[#8B877D] uppercase font-bold block">Formation</span>
                <strong className="text-xs text-[#D96B3B] font-bold truncate max-w-[100px] block">
                  {selectedWell.formation || "Jurassic T13"}
                </strong>
              </div>
            </div>

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer",
                isOpen
                  ? "bg-[#D96B3B] text-white"
                  : "bg-[#142B3A] text-white hover:bg-[#245463]"
              )}
              aria-expanded={isOpen}
            >
              <span>Change Well</span>
              <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Modal/Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-100">
          <div className="p-3 border-b border-[#DDD2C0] bg-[#F5F0E6] space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8B877D]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search well by identifier, field, formation, or basin..."
                className="w-full pl-9 pr-3 py-1.5 text-xs font-sans bg-white border border-[#DDD2C0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D96B3B] text-[#0D1B24]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs font-mono no-scrollbar">
              {basins.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBasinFilter(b)}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer",
                    selectedBasinFilter === b
                      ? "bg-[#142B3A] text-white"
                      : "bg-[#DDD2C0]/40 text-[#142B3A]/80 hover:bg-[#DDD2C0]"
                  )}
                >
                  {b === "ALL" ? "All Basins" : b.replace(" Basin", "")}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[260px] overflow-y-auto p-1.5 space-y-1 font-sans">
            {filteredWells.map((w) => {
              const isCurrent = w.id === selectedWell.id;
              return (
                <button
                  key={w.id}
                  onClick={() => {
                    onSelectWell(w);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs",
                    isCurrent
                      ? "bg-[#142B3A] text-white"
                      : "hover:bg-[#DDD2C0]/40 bg-white border border-[#DDD2C0]/40"
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <strong className={cn("font-mono font-bold", isCurrent ? "text-white" : "text-[#0D1B24]")}>
                        {w.id}
                      </strong>
                      <span className={cn("text-[9px] px-1 py-0.2 rounded font-mono", isCurrent ? "bg-white/20 text-white" : "bg-[#DDD2C0]/40 text-[#142B3A]")}>
                        {w.type.toUpperCase()}
                      </span>
                    </div>
                    <span className={cn("text-[11px] truncate block mt-0.5", isCurrent ? "text-[#DDD2C0]" : "text-[#8B877D]")}>
                      {w.field} · {w.basin || w.state} · {w.formation}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                    <span className={isCurrent ? "text-white font-bold" : "text-[#0D1B24]"}>
                      {w.depthM} m
                    </span>
                    {isCurrent && <Check className="h-3.5 w-3.5 text-[#D96B3B]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
