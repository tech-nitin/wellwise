"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Compass, MapPin } from "lucide-react";
import { SYNTHETIC_WELLS, Well } from "@/components/dashboard/data/wells";
import {
  INDIA_LOCATIONS,
  LocationNode,
} from "@/components/dashboard/data/locations";

interface WellSearchProps {
  onSelectWell: (well: Well) => void;
  onSelectLocation: (location: LocationNode) => void;
}

export function WellSearch({ onSelectWell, onSelectLocation }: WellSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const matchingWells = trimmed
    ? SYNTHETIC_WELLS.filter(
        (w) =>
          w.id.toLowerCase().includes(trimmed) ||
          w.name.toLowerCase().includes(trimmed) ||
          w.formation.toLowerCase().includes(trimmed) ||
          w.field.toLowerCase().includes(trimmed) ||
          w.state.toLowerCase().includes(trimmed) ||
          (w.basin && w.basin.toLowerCase().includes(trimmed))
      ).slice(0, 5)
    : [];

  const matchingLocations = trimmed
    ? INDIA_LOCATIONS.filter(
        (l) =>
          l.name.toLowerCase().includes(trimmed) ||
          (l.stateName && l.stateName.toLowerCase().includes(trimmed)) ||
          (l.basinName && l.basinName.toLowerCase().includes(trimmed)) ||
          l.description.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const hasResults = matchingWells.length > 0 || matchingLocations.length > 0;

  const handleSelectWell = (well: Well) => {
    onSelectWell(well);
    setQuery("");
    setIsOpen(false);
  };

  const handleSelectLocation = (loc: LocationNode) => {
    onSelectLocation(loc);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative select-none font-sans w-full max-w-[280px] sm:max-w-[320px]">
      {/* Search Input Bar */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#FAF8F5]/95 backdrop-blur-md border border-[#DDD2C0] shadow-md focus-within:border-[#142B3A] transition-all">
        <Search className="h-4 w-4 text-[#142B3A]/60 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search wells, basin, state..."
          className="w-full bg-transparent text-xs text-[#0D1B24] placeholder:text-[#142B3A]/50 focus:outline-none font-medium"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="h-4 w-4 text-[#142B3A]/50 hover:text-[#0D1B24] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Results Dropdown */}
      {isOpen && trimmed && (
        <div className="absolute top-full left-0 mt-2 w-full max-h-[360px] rounded-2xl bg-[#FAF8F5]/98 backdrop-blur-md border border-[#DDD2C0] shadow-2xl z-50 overflow-y-auto scrollbar-none text-left p-2 space-y-2 animate-in fade-in zoom-in-95 duration-150">
          {!hasResults ? (
            <div className="p-4 text-center text-xs text-[#142B3A]/60 font-mono">
              No matching wells or locations found
            </div>
          ) : (
            <>
              {/* Wells Group */}
              {matchingWells.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#A9533D] font-extrabold px-2 block">
                    Matching Wells
                  </span>
                  {matchingWells.map((well) => (
                    <button
                      key={well.id}
                      onClick={() => handleSelectWell(well)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#DDD2C0]/40 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Compass className="h-3.5 w-3.5 text-[#D96B3B] shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-[#0D1B24] block truncate font-mono">
                            {well.id}
                          </span>
                          <span className="text-[10px] text-[#142B3A]/60 block truncate">
                            {well.field} &bull; {well.formation}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#2F8068] bg-[#2F8068]/15 px-2 py-0.5 rounded shrink-0">
                        {well.depthM} m
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Locations Group */}
              {matchingLocations.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-[#DDD2C0]">
                  <span className="text-[10px] font-mono uppercase text-[#245463] font-extrabold px-2 block">
                    Matching Basins &amp; Regions
                  </span>
                  {matchingLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#DDD2C0]/40 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="h-3.5 w-3.5 text-[#245463] shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-[#0D1B24] block truncate">
                            {loc.name}
                          </span>
                          <span className="text-[10px] text-[#142B3A]/60 block truncate">
                            {loc.description}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#142B3A]/60 shrink-0">
                        {loc.type.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
