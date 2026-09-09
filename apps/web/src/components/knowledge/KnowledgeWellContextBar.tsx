"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Search, Check, ExternalLink, Activity } from "lucide-react";
import { SYNTHETIC_WELLS, Well } from "@/components/dashboard/data/wells";
import { cn } from "@/lib/utils";

interface KnowledgeWellContextBarProps {
  selectedWell: Well;
  onSelectWell: (well: Well) => void;
  currentDepthM: number;
  activity?: string;
  topic?: string;
}

export function KnowledgeWellContextBar({
  selectedWell,
  onSelectWell,
  currentDepthM,
  activity = "Drilling Ahead",
}: KnowledgeWellContextBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredWells = SYNTHETIC_WELLS.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.formation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.field?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full select-none" ref={dropdownRef}>
      {/* Context Strip */}
      <div className="bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl px-3 py-2 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          {/* Left: Section Label & Key Telemetry Context */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7280] bg-[#E4DDD0] px-2 py-0.5 rounded border border-[#DDD2C0]">
              CURRENT WELL CONTEXT
            </span>

            {/* Well Name */}
            <div className="flex items-center gap-1 font-mono">
              <span className="text-[#8B877D]">Well:</span>
              <strong className="text-[#0D1B24] font-bold">{selectedWell.id}</strong>
            </div>

            <span className="text-[#DDD2C0] hidden sm:inline">•</span>

            {/* Current Depth */}
            <div className="flex items-center gap-1 font-mono">
              <span className="text-[#8B877D]">Current Depth:</span>
              <strong className="text-[#0D1B24] font-bold">{currentDepthM.toLocaleString()} m</strong>
            </div>

            <span className="text-[#DDD2C0] hidden sm:inline">•</span>

            {/* Formation */}
            <div className="flex items-center gap-1 font-mono">
              <span className="text-[#8B877D]">Formation:</span>
              <strong className="text-[#0D1B24] font-bold truncate max-w-[140px] sm:max-w-none">
                {selectedWell.formation || "Jurassic T3"}
              </strong>
            </div>

            <span className="text-[#DDD2C0] hidden sm:inline">•</span>

            {/* Drilling Status */}
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[#8B877D]">Status:</span>
              <span className="flex items-center gap-1 text-[#2F8068] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2F8068]" />
                {activity}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-white text-[#142B3A] border border-[#DDD2C0] hover:bg-[#DDD2C0]/40 transition-colors cursor-pointer"
            >
              <span>CHANGE WELL</span>
              <ChevronDown className="h-3 w-3 text-[#8B877D]" />
            </button>

            <Link
              href={`/wells/${selectedWell.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-white text-[#245463] border border-[#DDD2C0] hover:bg-[#245463] hover:text-white transition-colors"
            >
              <span>VIEW DOSSIER</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-[#DDD2C0] rounded-xl shadow-lg p-2 space-y-2 animate-in fade-in duration-100 max-h-72 overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8B877D]" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by well name, ID, or formation..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-sans bg-[#FAF8F5] border border-[#DDD2C0] rounded-md focus:outline-none focus:border-[#245463] text-[#0D1B24]"
            />
          </div>

          <div className="space-y-1">
            {filteredWells.map((well) => (
              <button
                key={well.id}
                type="button"
                onClick={() => {
                  onSelectWell(well);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors cursor-pointer",
                  selectedWell.id === well.id
                    ? "bg-[#245463]/10 text-[#245463] font-bold"
                    : "hover:bg-[#FAF8F5] text-[#0D1B24]"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold">{well.id}</span>
                  <span className="text-[#8B877D]">({well.field})</span>
                  <span className="text-[10px] text-[#5A6572] font-mono font-normal">
                    {well.formation} • {well.depthM ? Math.round(well.depthM - 60) : 3180} m
                  </span>
                </div>
                {selectedWell.id === well.id && <Check className="h-3.5 w-3.5 text-[#245463]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
