"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Search, Check, Globe } from "lucide-react";
import {
  INDIA_LOCATIONS,
  LocationNode,
} from "@/components/dashboard/data/locations";
import { getLocationWellCount } from "@/components/dashboard/data/wells";

interface LocationSelectorProps {
  selectedLocation: LocationNode;
  onSelectLocation: (location: LocationNode) => void;
}

export function LocationSelector({
  selectedLocation,
  onSelectLocation,
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationNode) => {
    onSelectLocation(loc);
    setIsOpen(false);
    setSearchQuery("");
  };

  const filteredLocations = INDIA_LOCATIONS.filter((loc) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      loc.name.toLowerCase().includes(query) ||
      (loc.stateName && loc.stateName.toLowerCase().includes(query)) ||
      (loc.basinName && loc.basinName.toLowerCase().includes(query)) ||
      loc.description.toLowerCase().includes(query)
    );
  });

  const basins = filteredLocations.filter((l) => l.type === "basin");
  const states = filteredLocations.filter((l) => l.type === "state");
  const cities = filteredLocations.filter((l) => l.type === "city");
  const country = filteredLocations.filter((l) => l.type === "country");

  return (
    <div ref={dropdownRef} className="relative select-none font-sans">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FAF8F5]/95 backdrop-blur-md border border-[#DDD2C0] shadow-md hover:border-[#142B3A] text-left transition-all cursor-pointer group"
        aria-label="Select geographic location"
        aria-expanded={isOpen}
      >
        <div className="h-6 w-6 rounded-lg bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0">
          <MapPin className="h-3.5 w-3.5" />
        </div>
        <div className="flex flex-col min-w-0 pr-1">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#A9533D] font-extrabold leading-none">
            GEOGRAPHIC SCOPE
          </span>
          <span className="text-xs font-bold text-[#0D1B24] truncate mt-0.5 block max-w-[160px] sm:max-w-[190px]">
            {selectedLocation.name}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[#142B3A]/70 group-hover:text-[#0D1B24] transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[310px] sm:w-[350px] max-h-[440px] rounded-2xl bg-[#FAF8F5]/98 backdrop-blur-md border border-[#DDD2C0] shadow-2xl z-50 flex flex-col overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-[#DDD2C0] bg-[#DDD2C0]/20">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DDD2C0] focus-within:border-[#142B3A]">
              <Search className="h-3.5 w-3.5 text-[#142B3A]/60 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search basin, state, city..."
                className="w-full bg-transparent text-xs text-[#0D1B24] placeholder:text-[#142B3A]/50 focus:outline-none font-medium"
                autoFocus
              />
            </div>
          </div>

          {/* Scrollable Location Groups */}
          <div className="overflow-y-auto p-2 space-y-3 flex-1 scrollbar-none text-xs">
            {/* National Overview */}
            {country.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#142B3A]/60 font-bold px-2 block">
                  National Overview
                </span>
                {country.map((loc) => {
                  const isSelected = selectedLocation.id === loc.id;
                  const wellCount = getLocationWellCount(loc.id);
                  return (
                    <button
                      key={loc.id}
                      onClick={() => handleSelect(loc)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#142B3A] text-white font-bold"
                          : "hover:bg-[#DDD2C0]/30 text-[#0D1B24]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Globe className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-[#D96B3B]" : "text-[#142B3A]/60"}`} />
                        <span className="truncate">{loc.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            isSelected
                              ? "bg-[#D96B3B] text-white"
                              : "bg-[#DDD2C0]/60 text-[#142B3A]"
                          }`}
                        >
                          {wellCount} Wells
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#D96B3B]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Sedimentary Basins */}
            {basins.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#A9533D] font-extrabold px-2 block">
                  Sedimentary Basins (Oil &amp; Gas)
                </span>
                {basins.map((loc) => {
                  const isSelected = selectedLocation.id === loc.id;
                  const wellCount = getLocationWellCount(loc.id);
                  return (
                    <button
                      key={loc.id}
                      onClick={() => handleSelect(loc)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#142B3A] text-white font-bold"
                          : "hover:bg-[#DDD2C0]/30 text-[#0D1B24]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-[#D96B3B]" : "text-[#D96B3B]"}`} />
                        <div className="min-w-0">
                          <span className="truncate block font-bold">{loc.name}</span>
                          <span className={`text-[10px] truncate block ${isSelected ? "text-white/70" : "text-[#142B3A]/60"}`}>
                            {loc.stateName} &bull; {loc.description}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            isSelected
                              ? "bg-[#D96B3B] text-white"
                              : "bg-[#DDD2C0]/60 text-[#142B3A]"
                          }`}
                        >
                          {wellCount < 10 ? `0${wellCount}` : wellCount}
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#D96B3B]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}


            {/* States Overview */}
            {states.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#142B3A]/60 font-bold px-2 block">
                  Indian States
                </span>
                {states.map((loc) => {
                  const isSelected = selectedLocation.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => handleSelect(loc)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#142B3A] text-white font-bold"
                          : "hover:bg-[#DDD2C0]/30 text-[#0D1B24]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#142B3A]/40" />
                        <span className="truncate">{loc.name}</span>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#D96B3B]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
