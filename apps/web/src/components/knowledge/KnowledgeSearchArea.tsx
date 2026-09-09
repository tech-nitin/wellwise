"use client";

import React, { useState } from "react";
import { Search, Sparkles, Filter, ArrowRight, HelpCircle } from "lucide-react";
import { KnowledgeFilterState } from "./types";
import { cn } from "@/lib/utils";

export const SUGGESTED_INVESTIGATIONS = [
  "What happened at this depth before?",
  "Have nearby wells lost circulation here?",
  "Were there stuck-pipe events in this formation?",
  "What mud practices worked in offset wells?",
  "Which offset well is most similar?",
  "What drilling problems were reported around 3,000–3,200 m in nearby wells?",
];

interface KnowledgeSearchAreaProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit: (q: string) => void;
  isLoading: boolean;
  filterState: KnowledgeFilterState;
  onFilterChange: (filters: KnowledgeFilterState) => void;
}

export function KnowledgeSearchArea({
  query,
  onQueryChange,
  onSubmit,
  isLoading,
  filterState,
  onFilterChange,
}: KnowledgeSearchAreaProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
    }
  };

  const handleSelectSuggested = (q: string) => {
    onQueryChange(q);
    onSubmit(q);
  };

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl p-3 sm:p-4 shadow-2xs select-none space-y-3">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#D96B3B]" />
          <h2 className="text-xs sm:text-sm font-extrabold font-mono text-[#0D1B24] tracking-tight uppercase">
            WHAT DO YOU WANT TO KNOW?
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className={cn(
            "text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 transition-colors cursor-pointer",
            showFilters
              ? "bg-[#142B3A] text-white border-[#142B3A]"
              : "bg-white text-[#142B3A] border-[#DDD2C0] hover:bg-[#DDD2C0]/40"
          )}
        >
          <Filter className="h-2.5 w-2.5 text-[#D96B3B]" />
          <span>Filters</span>
        </button>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B877D]" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Ask about a drilling event, formation, depth, offset well, or historical problem..."
            className="w-full pl-9 pr-32 py-2.5 text-xs sm:text-sm font-sans bg-white border border-[#DDD2C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#245463]/30 focus:border-[#245463] text-[#0D1B24] placeholder:text-[#8B877D] shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md text-xs font-mono font-bold bg-[#142B3A] hover:bg-[#245463] disabled:opacity-50 text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{isLoading ? "SEARCHING..." : "ASK THE FIELD"}</span>
            {!isLoading && <ArrowRight className="h-3 w-3" />}
          </button>
        </div>

        {/* Optional Expandable Filters */}
        {showFilters && (
          <div className="p-3 bg-white border border-[#DDD2C0] rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono animate-in fade-in duration-100">
            <div>
              <label className="text-[9px] uppercase font-bold text-[#8B877D] block mb-0.5">
                Event Type
              </label>
              <select
                value={filterState.eventType}
                onChange={(e) => onFilterChange({ ...filterState, eventType: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded p-1 text-[11px] text-[#0D1B24] focus:outline-none"
              >
                <option>All Events</option>
                <option>Torque / Drag</option>
                <option>Lost Circulation</option>
                <option>Stuck Pipe</option>
                <option>Kick / Pressure</option>
                <option>ECD / Mud Weight</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold text-[#8B877D] block mb-0.5">
                Depth Window
              </label>
              <select
                value={filterState.depthRange}
                onChange={(e) => onFilterChange({ ...filterState, depthRange: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded p-1 text-[11px] text-[#0D1B24] focus:outline-none"
              >
                <option>Current ± 150m</option>
                <option>3,000–3,300m</option>
                <option>Entire Hole Section</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold text-[#8B877D] block mb-0.5">
                Formation
              </label>
              <select
                value={filterState.formationFilter}
                onChange={(e) => onFilterChange({ ...filterState, formationFilter: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded p-1 text-[11px] text-[#0D1B24] focus:outline-none"
              >
                <option>All Formations</option>
                <option>Jurassic T3 / T13</option>
                <option>Barail Sandstone</option>
                <option>Tipam Formation</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold text-[#8B877D] block mb-0.5">
                Source Document
              </label>
              <select
                value={filterState.sourceType}
                onChange={(e) => onFilterChange({ ...filterState, sourceType: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded p-1 text-[11px] text-[#0D1B24] focus:outline-none"
              >
                <option>All Sources</option>
                <option>Daily Drilling Reports</option>
                <option>Incident Reports</option>
                <option>Mud Engineer Recaps</option>
                <option>Lessons Learned</option>
              </select>
            </div>
          </div>
        )}

        {/* Suggested Investigations Chips */}
        <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] font-mono font-bold text-[#8B877D] uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="h-3 w-3 text-[#245463]" />
            <span>SUGGESTED INVESTIGATIONS:</span>
          </span>

          {SUGGESTED_INVESTIGATIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSuggested(sug)}
              className="text-[11px] font-sans px-2.5 py-1 rounded-md bg-white border border-[#DDD2C0] hover:border-[#245463] hover:text-[#245463] text-[#142B3A] transition-colors cursor-pointer shadow-2xs"
            >
              &ldquo;{sug}&rdquo;
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
