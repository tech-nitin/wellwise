"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { AnimatePresence } from "framer-motion";
import {
  SYNTHETIC_WELLS,
  Well,
  createRadiusCircle,
  getWellsByLocation,
} from "./data/wells";
import {
  INDIA_LOCATIONS,
  LocationNode,
  DEFAULT_LOCATION,
} from "./data/locations";
import { WellMapLocationSelector } from "./WellMapLocationSelector";
import { WellMapControls, WellFilterType } from "./WellMapControls";
import { WellMapLegend } from "./WellMapLegend";
import { WellIntelligencePanel } from "./WellIntelligencePanel";
import { LiquidButton } from "@/components/ui/liquid-button";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";
import { Radio, KeyRound, ArrowRight, AlertCircle } from "lucide-react";

// Initial center point: Indian Subcontinent overview (2D MapLibre map)
const DEFAULT_CENTER: [number, number] = [78.9629, 22.0000];
const DEFAULT_ZOOM = 4.6;

export function InteractiveWellMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<LocationNode>(DEFAULT_LOCATION);
  const [selectedWell, setSelectedWell] = useState<Well | null>(SYNTHETIC_WELLS[0]);
  const [activeFilter, setActiveFilter] = useState<WellFilterType>("ALL");
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_ZOOM);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get wells in the currently selected geographic scope
  const locationWells = getWellsByLocation(selectedLocation.id);

  // Determine the active reference well in this location for radius buffering
  const activeWell =
    locationWells.find((w) => w.status === "active") ||
    locationWells[0] ||
    SYNTHETIC_WELLS[0];

  // Filter wells based on current active category tab
  const filteredWells = locationWells.filter((w) => {
    if (activeFilter === "ACTIVE") return w.status === "active";
    if (activeFilter === "NEARBY") return w.distanceKm <= radiusKm;
    if (activeFilter === "HIGH_RISK") return w.status === "critical" || w.status === "warning";
    if (activeFilter === "HISTORICAL_MATCH") return w.status === "historical" || w.historicalMatch >= 88;
    return true; // ALL
  });

  // 1. Initialize MapLibre GL instance with MapTiler Streets-v4 Style
  useEffect(() => {
    let isMounted = true;

    async function initializeMap() {
      const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY?.trim();

      if (!apiKey) {
        console.warn(
          "[WellWise MapLibre] Missing API Key: NEXT_PUBLIC_MAPTILER_API_KEY is not configured in apps/web/.env.local."
        );
        if (isMounted) {
          setErrorMessage(
            "MapTiler API key is missing. Please configure NEXT_PUBLIC_MAPTILER_API_KEY in apps/web/.env.local to load MapTiler vector tiles."
          );
        }
        return;
      }

      // Explicit worker URL for MapLibre GL v6 in Next.js bundler
      maplibregl.setWorkerUrl("/vendor/maplibre-gl/maplibre-gl-worker.mjs");

      try {
        if (!isMounted || !mapContainerRef.current) return;

        const mapStyle = `https://api.maptiler.com/maps/streets-v4/style.json?key=${apiKey}`;

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: mapStyle,
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          pitch: 0, // Clean 2D view
          bearing: 0,
          attributionControl: false,
        });

        map.on("error", (e) => {
          console.error("[WellWise MapLibre] Runtime / Style Loading Error:", e?.error || e);
          const errorMsg = e?.error?.message || "";
          if (errorMsg.includes("401") || errorMsg.includes("403")) {
            if (isMounted) {
              setErrorMessage(
                "MapTiler Authentication Failed (HTTP 401/403). Please verify your NEXT_PUBLIC_MAPTILER_API_KEY."
              );
            }
          }
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

        map.on("zoom", () => {
          if (isMounted) {
            setCurrentZoom(map.getZoom());
          }
        });

        map.on("load", () => {
          if (!isMounted) return;
          setMapLoaded(true);

          // Add circular GIS radius buffer GeoJSON source
          const radiusData = createRadiusCircle(
            activeWell.longitude,
            activeWell.latitude,
            radiusKm
          );

          map.addSource("radius-buffer-source", {
            type: "geojson",
            data: radiusData,
          });

          // Copper Flame semi-transparent fill
          map.addLayer({
            id: "radius-buffer-fill",
            type: "fill",
            source: "radius-buffer-source",
            paint: {
              "fill-color": "#D96B3B",
              "fill-opacity": 0.12,
            },
          });

          // Copper Flame dashed boundary outline
          map.addLayer({
            id: "radius-buffer-line",
            type: "line",
            source: "radius-buffer-source",
            paint: {
              "line-color": "#D96B3B",
              "line-width": 2,
              "line-dasharray": [4, 2],
              "line-opacity": 0.75,
            },
          });
        });

        mapRef.current = map;
      } catch (err) {
        console.error("[WellWise MapLibre] Initialization Error:", err);
        if (isMounted) {
          setErrorMessage(
            "Failed to initialize MapLibre GL WebGL engine. Please ensure your browser supports WebGL."
          );
        }
      }
    }

    initializeMap();

    return () => {
      isMounted = false;
      markersRef.current.forEach((m) => m.remove());
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Update Radius Buffer GeoJSON when radiusKm, activeWell, or location changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !activeWell) return;
    const map = mapRef.current;
    const source = map.getSource("radius-buffer-source");
    if (source && typeof source.setData === "function") {
      const radiusData = createRadiusCircle(
        activeWell.longitude,
        activeWell.latitude,
        radiusKm
      );
      source.setData(radiusData);
    }
  }, [radiusKm, mapLoaded, activeWell]);

  // Handle location selection with smooth flyTo animation
  const handleLocationSelect = (loc: LocationNode) => {
    setSelectedLocation(loc);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: loc.coordinates,
        zoom: loc.zoom,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }

    // Select the primary demo well in that location
    const locWells = getWellsByLocation(loc.id);
    if (locWells.length > 0) {
      const activeInLoc = locWells.find((w) => w.status === "active") || locWells[0];
      setSelectedWell(activeInLoc);
    } else {
      setSelectedWell(null);
    }
  };

  // 3. Render Custom Well Markers & Regional Basin Beacons
  const renderMarkers = useCallback(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // LEVEL 1: When zoomed out at the national level (zoom < 6.5) AND "india" selected,
    // render regional basin beacons across India so the map is informative without clutter.
    if (selectedLocation.id === "india" && currentZoom < 6.5) {
      const regionalBasins = INDIA_LOCATIONS.filter(
        (l) => l.type === "basin" || l.type === "city"
      );

      regionalBasins.forEach((basin) => {
        const count = getWellsByLocation(basin.id).length;
        if (count === 0) return;

        const el = document.createElement("div");
        el.className = "basin-beacon-marker select-none cursor-pointer group";
        el.setAttribute("aria-label", `${basin.name} - ${count} Demo Wells`);

        el.innerHTML = `
          <div class="relative flex flex-col items-center">
            <span class="absolute -inset-2 rounded-full bg-[#D96B3B]/25 animate-ping pointer-events-none"></span>
            <div class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#142B3A] text-white border border-[#D96B3B] shadow-md group-hover:scale-110 group-hover:bg-[#245463] transition-all">
              <span class="h-2 w-2 rounded-full bg-[#D96B3B] animate-pulse"></span>
              <span class="text-xs font-mono font-bold tracking-tight whitespace-nowrap">${basin.name}</span>
              <span class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#D96B3B] text-white">${count}</span>
            </div>
            <span class="text-[9px] font-mono text-[#0D1B24] font-bold mt-1 bg-[#F5F0E6]/95 px-1.5 py-0.5 rounded border border-[#DDD2C0] shadow-2xs whitespace-nowrap">
              Click to Explore
            </span>
          </div>
        `;

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          handleLocationSelect(basin);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(basin.coordinates)
          .addTo(map);

        markersRef.current.push(marker);
      });

      return;
    }

    // LEVEL 2 & 3: Individual Well Markers
    filteredWells.forEach((well) => {
      const isSelected = selectedWell?.id === well.id;
      const isActive = well.status === "active";
      const isCritical = well.status === "critical";
      const isWarning = well.status === "warning";
      const isHistorical = well.status === "historical";

      const el = document.createElement("div");
      el.className = "well-custom-marker select-none cursor-pointer group";
      el.setAttribute("aria-label", `Well ${well.id} - ${well.status}`);

      // Semantic Color scheme
      let pinColor = "bg-[#2F8068] text-white border-[#2F8068]";
      let dotColor = "bg-white";

      if (isActive) {
        pinColor = "bg-[#2F8068] text-white border-[#2F8068] ring-4 ring-[#2F8068]/30";
        dotColor = "bg-[#D96B3B] animate-pulse";
      } else if (isCritical) {
        pinColor = "bg-[#843D35] text-white border-[#843D35] ring-2 ring-[#843D35]/30";
        dotColor = "bg-white";
      } else if (isWarning) {
        pinColor = "bg-[#D96B3B] text-[#0D1B24] border-[#D96B3B] ring-2 ring-[#D96B3B]/35";
        dotColor = "bg-[#0D1B24]";
      } else if (isHistorical) {
        pinColor = "bg-[#245463] text-white border-[#245463]";
        dotColor = "bg-[#DDD2C0]";
      }

      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          ${
            isActive || isSelected
              ? `<span class="absolute -inset-3 rounded-full animate-ping pointer-events-none ${
                  isActive ? "bg-[#2F8068]/30" : "bg-[#843D35]/30"
                }"></span>`
              : ""
          }
          <div class="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md transition-transform duration-200 border ${pinColor} ${
        isSelected ? "scale-115 ring-4 ring-[#D96B3B] bg-[#142B3A] text-white" : "hover:scale-105"
      }">
            <span class="h-2 w-2 rounded-full ${dotColor}"></span>
            <span class="text-[11px] font-mono font-bold tracking-tight whitespace-nowrap">${well.id}</span>
          </div>
          ${
            !isActive && well.distanceKm > 0
              ? `<span class="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[9px] font-mono text-[#0D1B24] bg-[#F5F0E6]/95 px-1.5 py-0.5 rounded-md border border-[#DDD2C0] whitespace-nowrap opacity-90 pointer-events-none shadow-2xs">${well.distanceKm} km</span>`
              : ""
          }
        </div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedWell(well);
        map.flyTo({
          center: [well.longitude, well.latitude],
          zoom: Math.max(map.getZoom(), 10.8),
          speed: 1.2,
          curve: 1.4,
          essential: true,
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([well.longitude, well.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [filteredWells, selectedWell, mapLoaded, selectedLocation, currentZoom]);

  useEffect(() => {
    renderMarkers();
  }, [renderMarkers]);

  // Handle selecting a similar well from the panel
  const handleSelectSimilarWell = (wellId: string) => {
    const target = SYNTHETIC_WELLS.find((w) => w.id === wellId);
    if (target && mapRef.current) {
      setSelectedWell(target);
      mapRef.current.flyTo({
        center: [target.longitude, target.latitude],
        zoom: 11.2,
        speed: 1.2,
        essential: true,
      });
    }
  };

  return (
    <section id="nearby-wells-map" className="relative w-full py-16 lg:py-20 overflow-hidden border-b border-[#DDD2C0] select-none">
      {/* Ambient Geological Background System - Cartographic Map Variant */}
      <GeologicalBackground variant="map" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* LEFT: "EXPLORE WELLS ACROSS INDIA" + Filters + Open Full Map */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#142B3A] text-[#D96B3B] text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Radio className="h-3 w-3 animate-pulse text-[#D96B3B]" />
                  <span>INDIA GIS INTELLIGENCE</span>
                </span>
                <span className="text-[11px] font-mono text-[#0D1B24] font-bold bg-[#DDD2C0]/40 px-2.5 py-0.5 rounded-md border border-[#DDD2C0]">
                  ACTIVE WELL: {activeWell ? activeWell.id : "NHK-124"}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#A9533D] font-extrabold block">
                  EXPLORE WELLS ACROSS INDIA
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B24] leading-[1.08]">
                  See what happened around the well.
                </h2>
              </div>

              <p className="text-sm sm:text-base text-[#142B3A]/80 leading-relaxed">
                Explore nearby and offset wells, historical drilling events, formation intelligence and operational risks across Indian oil &amp; gas regions.
              </p>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <WellMapControls
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                radiusKm={radiusKm}
                onRadiusChange={setRadiusKm}
                wellCount={filteredWells.length}
              />

              <Link href="/nearby-wells" className="block">
                <LiquidButton className="w-full justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold">Open Full Map</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </LiquidButton>
              </Link>
            </div>

            {/* Quick Regional Indicator */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#DDD2C0]">
              <div className="p-3 rounded-xl bg-[#DDD2C0]/25 border border-[#DDD2C0]">
                <span className="text-[10px] font-mono uppercase text-[#142B3A]/70 font-semibold block">CURRENT LOCATION</span>
                <span className="text-sm font-bold font-mono text-[#0D1B24] truncate block" title={selectedLocation.name}>
                  {selectedLocation.name}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#DDD2C0]/25 border border-[#DDD2C0]">
                <span className="text-[10px] font-mono uppercase text-[#142B3A]/70 font-semibold block">STATE / SECTOR</span>
                <span className="text-sm font-bold font-mono text-[#0D1B24]">
                  {selectedLocation.stateName || "National Overview"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Large interactive map with Location Selector overlay */}
          <div className="lg:col-span-7 xl:col-span-8 relative min-h-[580px] h-[640px] sm:h-[700px] rounded-3xl bg-[#DDD2C0]/25 border border-[#DDD2C0] overflow-hidden shadow-lg">
            {/* Real MapLibre WebGL Canvas */}
            <div
              ref={mapContainerRef}
              className="absolute inset-0 w-full h-full"
              style={{ minHeight: "580px", height: "100%", width: "100%" }}
            />

            {/* Top Left Floating Location / Basin Selector */}
            <div className="absolute top-4 left-4 z-20">
              <WellMapLocationSelector
                selectedLocation={selectedLocation}
                onSelectLocation={handleLocationSelect}
              />
            </div>

            {/* Empty State Notice when a location has 0 demo wells */}
            {filteredWells.length === 0 && (
              <div className="absolute top-18 left-4 right-4 sm:right-auto sm:max-w-sm z-20 p-3 rounded-xl bg-[#F5F0E6]/95 backdrop-blur-md border border-[#DDD2C0] shadow-md flex items-start gap-2.5 text-xs text-[#0D1B24]">
                <AlertCircle className="h-4 w-4 text-[#D96B3B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">No indexed demo wells available for this location yet.</span>
                  <span className="text-[#142B3A]/75 text-[11px]">
                    Select a demonstration basin such as Assam Basin, Cambay Basin, Bhopal, or Indore to view synthetic wells.
                  </span>
                </div>
              </div>
            )}

            {/* Explicit Error State UI */}
            {errorMessage && (
              <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-[#F5F0E6]/90 backdrop-blur-md">
                <div className="max-w-md w-full p-6 rounded-2xl bg-[#F5F0E6] border border-[#DDD2C0] shadow-lg text-center space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#D96B3B]/20 text-[#A9533D] flex items-center justify-center mx-auto border border-[#D96B3B]/50">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0D1B24] font-mono">
                      MapTiler Configuration Required
                    </h3>
                    <p className="text-xs text-[#142B3A]/80 mt-2 leading-relaxed">
                      {errorMessage}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#DDD2C0]/30 border border-[#DDD2C0] font-mono text-[11px] text-[#0D1B24] text-left space-y-1">
                    <span className="font-bold text-[#0D1B24] block">Setup Instructions:</span>
                    <div>1. Open <code className="text-[#2F8068] font-bold">apps/web/.env.local</code></div>
                    <div>2. Set <code className="text-[#A9533D] font-bold">NEXT_PUBLIC_MAPTILER_API_KEY=&lt;key&gt;</code></div>
                    <div>3. Restart the Next.js development server</div>
                  </div>
                </div>
              </div>
            )}

            {/* Floating Interactive Well Intelligence Panel */}
            <AnimatePresence>
              {!errorMessage && selectedWell && (
                <WellIntelligencePanel
                  well={selectedWell}
                  onClose={() => setSelectedWell(null)}
                  onSelectSimilarWell={handleSelectSimilarWell}
                />
              )}
            </AnimatePresence>

            {/* Bottom Left Floating Legend */}
            <div className="absolute bottom-4 left-4 z-20">
              <WellMapLegend />
            </div>

            {/* Loading Indicator */}
            {!mapLoaded && !errorMessage && (
              <div className="absolute inset-0 bg-[#F5F0E6]/90 backdrop-blur-sm z-25 flex flex-col items-center justify-center space-y-3 font-mono">
                <div className="h-8 w-8 rounded-full border-2 border-[#142B3A] border-t-transparent animate-spin" />
                <span className="text-xs font-bold text-[#0D1B24] tracking-wider uppercase">
                  Loading India MapTiler Vector Tiles...
                </span>
                <span className="text-[10px] text-[#142B3A]/60">
                  Connecting to api.maptiler.com
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveWellMap;
