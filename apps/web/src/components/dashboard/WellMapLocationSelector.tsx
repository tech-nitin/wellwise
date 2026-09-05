"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  Search,
  Building2,
  Layers,
  Globe2,
} from "lucide-react";
import {
  LocationNode,
  INDIA_LOCATIONS,
} from "./data/locations";
import { getLocationWellCount } from "./data/wells";
import { cn } from "@/lib/utils";

interface WellMapLocationSelectorProps {
  selectedLocation: LocationNode;
  onSelectLocation: (location: LocationNode) => void;
  className?: string;
}

export function WellMapLocationSelector({
  selectedLocation,
  onSelectLocation,
  className = "",
}: WellMapLocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Filter locations by search query
  const filteredLocations = INDIA_LOCATIONS.filter((loc) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.type.toLowerCase().includes(q) ||
      (loc.stateName && loc.stateName.toLowerCase().includes(q)) ||
      (loc.basinName && loc.basinName.toLowerCase().includes(q)) ||
      (loc.cityName && loc.cityName.toLowerCase().includes(q)) ||
      loc.description.toLowerCase().includes(q)
    );
  });

  // Group locations for organized display
  const nationalNode = filteredLocations.find((l) => l.type === "country");
  const basinNodes = filteredLocations.filter((l) => l.type === "basin");
  const cityNodes = filteredLocations.filter((l) => l.type === "city");
  const stateNodes = filteredLocations.filter((l) => l.type === "state");

  const handleSelect = (loc: LocationNode) => {
    onSelectLocation(loc);
    setIsOpen(false);
  };

  const getBadgeTypeIcon = (type: LocationNode["type"]) => {
    switch (type) {
      case "country":
        return <Globe2 className="h-3 w-3 text-[#D96B3B]" />;
      case "basin":
        return <Layers className="h-3 w-3 text-[#245463]" />;
      case "city":
        return <Building2 className="h-3 w-3 text-[#A9533D]" />;
      case "state":
      default:
        return <MapPin className="h-3 w-3 text-[#142B3A]" />;
    }
  };

  return (
    <div ref={dropdownRef} className={cn("relative inline-block select-none", className)}>
      {/* Compact Location Selector Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#F5F0E6]/95 hover:bg-[#F5F0E6] text-[#0D1B24] border border-[#DDD2C0] shadow-xs backdrop-blur-md transition-all cursor-pointer group"
        aria-expanded={isOpen}
        aria-label="Select geographic location or basin"
      >
        <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-[#142B3A] text-[#D96B3B] group-hover:scale-105 transition-transform shrink-0">
          <MapPin className="h-3.5 w-3.5" />
        </span>

        <div className="flex flex-col text-left">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#245463] font-bold">
            Region / Basin
          </span>
          <span className="text-xs font-mono font-bold tracking-tight text-[#0D1B24] max-w-[140px] sm:max-w-[180px] truncate">
            {selectedLocation.name}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-[#142B3A]/60 transition-transform duration-200 ml-0.5",
            isOpen && "rotate-180 text-[#D96B3B]"
          )}
        />
      </button>

      {/* Popover / Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 mt-2 w-[310px] sm:w-[360px] p-3 rounded-2xl bg-[#F5F0E6] border border-[#DDD2C0] shadow-xl backdrop-blur-md z-50 text-left font-sans"
          >
            {/* Search Input Box */}
            <div className="relative mb-2.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#245463]/70" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search basin, state, city (e.g. Assam, Bhopal, Cambay)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DDD2C0] text-xs font-mono text-[#0D1B24] placeholder:text-[#142B3A]/40 focus:outline-none focus:border-[#142B3A]"
              />
            </div>

            {/* Scrollable Location List */}
            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
              {/* 1. National Overview */}
              {nationalNode && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#245463] font-bold px-2 mb-1">
                    National
                  </div>
                  <button
                    onClick={() => handleSelect(nationalNode)}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer border",
                      selectedLocation.id === nationalNode.id
                        ? "bg-[#142B3A] text-white border-[#142B3A]"
                        : "bg-[#FAF8F5] hover:bg-[#DDD2C0]/40 text-[#0D1B24] border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-lg flex items-center justify-center shrink-0",
                          selectedLocation.id === nationalNode.id
                            ? "bg-[#245463] text-white"
                            : "bg-[#DDD2C0]/50"
                        )}
                      >
                        {getBadgeTypeIcon(nationalNode.type)}
                      </div>
                      <div>
                        <span className="text-xs font-bold font-mono block leading-tight">
                          {nationalNode.name}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] block leading-tight",
                            selectedLocation.id === nationalNode.id
                              ? "text-white/70"
                              : "text-[#142B3A]/60"
                          )}
                        >
                          All India basins &amp; offset network
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-mono font-bold px-2 py-0.5 rounded-md",
                        selectedLocation.id === nationalNode.id
                          ? "bg-[#D96B3B] text-white"
                          : "bg-[#DDD2C0]/40 text-[#0D1B24]"
                      )}
                    >
                      {getLocationWellCount("india")} Wells
                    </span>
                  </button>
                </div>
              )}

              {/* 2. Basins */}
              {basinNodes.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#245463] font-bold px-2 mb-1">
                    Sedimentary Basins
                  </div>
                  <div className="space-y-1">
                    {basinNodes.map((loc) => {
                      const isSelected = selectedLocation.id === loc.id;
                      const wellCount = getLocationWellCount(loc.id);

                      return (
                        <button
                          key={loc.id}
                          onClick={() => handleSelect(loc)}
                          className={cn(
                            "w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer border",
                            isSelected
                              ? "bg-[#142B3A] text-white border-[#142B3A]"
                              : "bg-[#FAF8F5] hover:bg-[#DDD2C0]/40 text-[#0D1B24] border-transparent"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "h-6 w-6 rounded-lg flex items-center justify-center shrink-0",
                                isSelected ? "bg-[#245463] text-white" : "bg-[#DDD2C0]/50"
                              )}
                            >
                              {getBadgeTypeIcon(loc.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold font-mono block leading-tight">
                                  {loc.name}
                                </span>
                                {loc.stateName && (
                                  <span
                                    className={cn(
                                      "text-[9px] font-mono px-1 rounded",
                                      isSelected
                                        ? "bg-white/20 text-white"
                                        : "bg-[#DDD2C0]/50 text-[#142B3A]"
                                    )}
                                  >
                                    {loc.stateName}
                                  </span>
                                )}
                              </div>
                              <span
                                className={cn(
                                  "text-[10px] block leading-tight truncate max-w-[190px]",
                                  isSelected ? "text-white/70" : "text-[#142B3A]/60"
                                )}
                              >
                                {loc.description}
                              </span>
                            </div>
                          </div>

                          <span
                            className={cn(
                              "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0",
                              isSelected
                                ? "bg-[#D96B3B] text-white"
                                : "bg-[#DDD2C0]/40 text-[#0D1B24]"
                            )}
                          >
                            {wellCount} {wellCount === 1 ? "Well" : "Wells"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Cities / Sectors (Madhya Pradesh: Bhopal, Indore) */}
              {cityNodes.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#A9533D] font-bold px-2 mb-1">
                    Madhya Pradesh Demo Sectors
                  </div>
                  <div className="space-y-1">
                    {cityNodes.map((loc) => {
                      const isSelected = selectedLocation.id === loc.id;
                      const wellCount = getLocationWellCount(loc.id);

                      return (
                        <button
                          key={loc.id}
                          onClick={() => handleSelect(loc)}
                          className={cn(
                            "w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer border",
                            isSelected
                              ? "bg-[#142B3A] text-white border-[#142B3A]"
                              : "bg-[#FAF8F5] hover:bg-[#DDD2C0]/40 text-[#0D1B24] border-transparent"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "h-6 w-6 rounded-lg flex items-center justify-center shrink-0",
                                isSelected ? "bg-[#A9533D] text-white" : "bg-[#DDD2C0]/50"
                              )}
                            >
                              {getBadgeTypeIcon(loc.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold font-mono block leading-tight">
                                  {loc.name}
                                </span>
                                <span
                                  className={cn(
                                    "text-[9px] font-mono px-1 rounded",
                                    isSelected
                                      ? "bg-white/20 text-white"
                                      : "bg-[#A9533D]/15 text-[#A9533D] font-bold"
                                  )}
                                >
                                  MP Demo
                                </span>
                              </div>
                              <span
                                className={cn(
                                  "text-[10px] block leading-tight truncate max-w-[190px]",
                                  isSelected ? "text-white/70" : "text-[#142B3A]/60"
                                )}
                              >
                                {loc.description}
                              </span>
                            </div>
                          </div>

                          <span
                            className={cn(
                              "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0",
                              isSelected
                                ? "bg-[#D96B3B] text-white"
                                : "bg-[#DDD2C0]/40 text-[#0D1B24]"
                            )}
                          >
                            {wellCount} {wellCount === 1 ? "Well" : "Wells"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. States Overview */}
              {stateNodes.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold px-2 mb-1">
                    State Context
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {stateNodes.map((loc) => {
                      const isSelected = selectedLocation.id === loc.id;
                      return (
                        <button
                          key={loc.id}
                          onClick={() => handleSelect(loc)}
                          className={cn(
                            "flex items-center gap-1.5 p-1.5 rounded-lg text-left text-xs font-mono font-medium transition-colors cursor-pointer border",
                            isSelected
                              ? "bg-[#142B3A] text-white border-[#142B3A]"
                              : "bg-[#FAF8F5] hover:bg-[#DDD2C0]/40 text-[#0D1B24] border-[#DDD2C0]/40"
                          )}
                        >
                          <MapPin className="h-3 w-3 text-[#245463] shrink-0" />
                          <span className="truncate">{loc.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty Search State */}
              {filteredLocations.length === 0 && (
                <div className="py-6 text-center text-xs font-mono text-[#142B3A]/70">
                  No matching Indian basins or demonstration regions found for &quot;{searchQuery}&quot;.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
