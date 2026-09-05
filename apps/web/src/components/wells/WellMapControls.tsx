"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Minus,
  Compass,
  Maximize2,
  LocateFixed,
  Box,
  Map as MapIcon,
  Ruler,
  Layers,
  Check,
} from "lucide-react";
import { MapPerspectiveMode, BasemapStyleId } from "./types";
import { cn } from "@/lib/utils";

interface WellMapControlsProps {
  perspectiveMode: MapPerspectiveMode;
  onTogglePerspective: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetNorth: () => void;
  onFitSelection: () => void;
  onToggleFullscreen: () => void;
  // Basemap switcher
  basemapStyle: BasemapStyleId;
  onSelectBasemap: (style: BasemapStyleId) => void;
  // Measurement tool
  measuringActive: boolean;
  onToggleMeasuring: () => void;
  // Layer toggles
  rangeRingsVisible: boolean;
  onToggleRangeRings: () => void;
  labelsVisible: boolean;
  onToggleLabels: () => void;
}

export function WellMapControls({
  perspectiveMode,
  onTogglePerspective,
  onZoomIn,
  onZoomOut,
  onResetNorth,
  onFitSelection,
  onToggleFullscreen,
  basemapStyle,
  onSelectBasemap,
  measuringActive,
  onToggleMeasuring,
  rangeRingsVisible,
  onToggleRangeRings,
  labelsVisible,
  onToggleLabels,
}: WellMapControlsProps) {
  const [basemapOpen, setBasemapOpen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const basemapRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (basemapRef.current && !basemapRef.current.contains(e.target as Node)) {
        setBasemapOpen(false);
      }
      if (layersRef.current && !layersRef.current.contains(e.target as Node)) {
        setLayersOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const basemapOptions: { id: BasemapStyleId; label: string; desc: string }[] = [
    { id: "streets", label: "Streets GIS", desc: "Clean vector streets & topography" },
    { id: "satellite", label: "Satellite Hybrid", desc: "High-res aerial imagery + road tags" },
    { id: "dark", label: "Dark Tactical GIS", desc: "High-contrast dark petroleum mode" },
    { id: "topo", label: "Topographic Relief", desc: "Elevation contours & hillshading" },
  ];

  return (
    <div className="flex flex-col gap-2 select-none font-sans items-end">
      {/* 1. Distance Measurement Tool Button */}
      <button
        onClick={onToggleMeasuring}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-2xl border shadow-lg font-mono text-xs font-bold transition-all cursor-pointer",
          measuringActive
            ? "bg-[#D96B3B] text-white border-[#D96B3B] ring-2 ring-[#D96B3B]/40 animate-pulse"
            : "bg-[#FAF8F5]/95 backdrop-blur-md text-[#0D1B24] border-[#DDD2C0] hover:border-[#142B3A]"
        )}
        title={measuringActive ? "Measuring Mode Active — Click 2 points" : "Measure Geodesic Distance"}
        aria-label="Toggle Measurement Mode"
      >
        <Ruler className="h-4 w-4" />
        <span>{measuringActive ? "MEASURE ACTIVE" : "MEASURE"}</span>
      </button>

      {/* 2. 2D / 3D Perspective Toggle Button */}
      <button
        onClick={onTogglePerspective}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-2xl border shadow-lg font-mono text-xs font-bold transition-all cursor-pointer",
          perspectiveMode === "3D"
            ? "bg-[#142B3A] text-[#D96B3B] border-[#D96B3B] ring-2 ring-[#D96B3B]/30"
            : "bg-[#FAF8F5]/95 backdrop-blur-md text-[#0D1B24] border-[#DDD2C0] hover:border-[#142B3A]"
        )}
        title={perspectiveMode === "3D" ? "Switch to 2D Top-Down View" : "Switch to 3D Perspective Pitch"}
        aria-label="Toggle 2D or 3D Map View"
      >
        <Box className="h-4 w-4 text-[#D96B3B]" />
        <span>{perspectiveMode === "3D" ? "3D ACTIVE" : "2D VIEW"}</span>
      </button>

      {/* 3. Navigation & Layer HUD Box */}
      <div className="flex flex-col rounded-2xl bg-[#FAF8F5]/95 backdrop-blur-md border border-[#DDD2C0] shadow-lg overflow-visible p-1 gap-0.5 relative">
        {/* Basemap Switcher Button */}
        <div ref={basemapRef} className="relative">
          <button
            onClick={() => {
              setBasemapOpen(!basemapOpen);
              setLayersOpen(false);
            }}
            className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center text-[#0D1B24] hover:bg-[#DDD2C0]/40 transition-colors cursor-pointer",
              basemapOpen && "bg-[#DDD2C0]/60 text-[#D96B3B]"
            )}
            title="Switch Basemap Style"
            aria-label="Switch Basemap"
          >
            <MapIcon className="h-4 w-4" />
          </button>

          {/* Basemap Options Popover */}
          {basemapOpen && (
            <div className="absolute right-full bottom-0 mr-2 w-52 p-2 rounded-2xl bg-[#FAF8F5]/98 backdrop-blur-md border border-[#DDD2C0] shadow-2xl z-50 text-left font-mono text-xs space-y-1">
              <span className="text-[10px] text-[#142B3A]/60 font-bold px-2 uppercase block">
                Basemap Layer
              </span>
              {basemapOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelectBasemap(opt.id);
                    setBasemapOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer",
                    basemapStyle === opt.id
                      ? "bg-[#142B3A] text-white font-bold"
                      : "text-[#0D1B24] hover:bg-[#DDD2C0]/40"
                  )}
                >
                  <div>
                    <span className="block">{opt.label}</span>
                    <span
                      className={cn(
                        "text-[9px] block font-sans",
                        basemapStyle === opt.id ? "text-white/70" : "text-[#142B3A]/60"
                      )}
                    >
                      {opt.desc}
                    </span>
                  </div>
                  {basemapStyle === opt.id && <Check className="h-3.5 w-3.5 text-[#D96B3B] shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layer Toggles Button */}
        <div ref={layersRef} className="relative">
          <button
            onClick={() => {
              setLayersOpen(!layersOpen);
              setBasemapOpen(false);
            }}
            className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center text-[#0D1B24] hover:bg-[#DDD2C0]/40 transition-colors cursor-pointer",
              layersOpen && "bg-[#DDD2C0]/60 text-[#D96B3B]"
            )}
            title="Toggle Map Layers"
            aria-label="Toggle Layers"
          >
            <Layers className="h-4 w-4" />
          </button>

          {/* Layer Toggles Popover */}
          {layersOpen && (
            <div className="absolute right-full bottom-0 mr-2 w-52 p-2.5 rounded-2xl bg-[#FAF8F5]/98 backdrop-blur-md border border-[#DDD2C0] shadow-2xl z-50 text-left font-mono text-xs space-y-2">
              <span className="text-[10px] text-[#142B3A]/60 font-bold px-1 uppercase block">
                Map Feature Overlays
              </span>
              <button
                onClick={onToggleRangeRings}
                className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-[#DDD2C0]/30 transition-colors cursor-pointer"
              >
                <span>Range Rings</span>
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded font-bold",
                    rangeRingsVisible
                      ? "bg-[#2F8068] text-white"
                      : "bg-[#DDD2C0]/50 text-[#142B3A]/60"
                  )}
                >
                  {rangeRingsVisible ? "ON" : "OFF"}
                </span>
              </button>

              <button
                onClick={onToggleLabels}
                className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-[#DDD2C0]/30 transition-colors cursor-pointer"
              >
                <span>Well Labels</span>
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded font-bold",
                    labelsVisible
                      ? "bg-[#2F8068] text-white"
                      : "bg-[#DDD2C0]/50 text-[#142B3A]/60"
                  )}
                >
                  {labelsVisible ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="h-px bg-[#DDD2C0] my-0.5" />

        {/* Zoom In */}
        <button
          onClick={onZoomIn}
          className="h-8 w-8 rounded-xl flex items-center justify-center text-[#0D1B24] hover:bg-[#DDD2C0]/40 transition-colors cursor-pointer"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus className="h-4 w-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={onZoomOut}
          className="h-8 w-8 rounded-xl flex items-center justify-center text-[#0D1B24] hover:bg-[#DDD2C0]/40 transition-colors cursor-pointer"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="h-px bg-[#DDD2C0] my-0.5" />

        {/* Reset North / Compass */}
        <button
          onClick={onResetNorth}
          className="h-8 w-8 rounded-xl flex items-center justify-center text-[#0D1B24] hover:bg-[#DDD2C0]/40 hover:text-[#D96B3B] transition-colors cursor-pointer"
          title="Reset North Bearing"
          aria-label="Reset North"
        >
          <Compass className="h-4 w-4" />
        </button>

        {/* Fit / Locate Current Selection */}
        <button
          onClick={onFitSelection}
          className="h-8 w-8 rounded-xl flex items-center justify-center text-[#0D1B24] hover:bg-[#DDD2C0]/40 hover:text-[#2F8068] transition-colors cursor-pointer"
          title="Fit & Center Selection"
          aria-label="Fit Selection"
        >
          <LocateFixed className="h-4 w-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="h-8 w-8 rounded-xl flex items-center justify-center text-[#0D1B24] hover:bg-[#DDD2C0]/40 transition-colors cursor-pointer"
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
