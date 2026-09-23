"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { AnimatePresence } from "framer-motion";
import {
  SYNTHETIC_WELLS,
  Well,
  getWellsByLocation,
} from "@/components/dashboard/data/wells";
import {
  INDIA_LOCATIONS,
  LocationNode,
  DEFAULT_LOCATION,
} from "@/components/dashboard/data/locations";
import {
  WellFilterType,
  RadiusKm,
  MapPerspectiveMode,
  BasemapStyleId,
  NearbyViewMode,
  MeasurePoint,
  ComparisonState,
  OffsetWellCalculated,
} from "./types";
import { LocationSelector } from "./LocationSelector";
import { WellSearch } from "./WellSearch";
import { WellFilters } from "./WellFilters";
import { RadiusControl } from "./RadiusControl";
import { SelectedWellPanel } from "./SelectedWellPanel";
import { WellMapControls } from "./WellMapControls";
import { WellMapLegend } from "./WellMapLegend";
import { OffsetWellsList } from "./OffsetWellsList";
import { WellComparisonModal } from "./WellComparisonModal";
import { WellDossierModal } from "./WellDossierModal";
import { OffsetReportExportModal } from "./OffsetReportExportModal";
import {
  calculateHaversineDistanceKm,
  calculateAzimuthBearing,
  formatBearingWithCardinal,
  createConcentricRingsGeoJSON,
  createGeodesicLineGeoJSON,
} from "@/lib/geo";
import {
  KeyRound,
  AlertCircle,
  Map as MapIcon,
  Columns,
  Table as TableIcon,
  FileSpreadsheet,
  GitCompare,
  Ruler,
  X,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER: [number, number] = [95.38042, 27.59626];
const DEFAULT_ZOOM = 10.0;

const MAPTILER_STYLE_MAP: Record<BasemapStyleId, string> = {
  streets: "streets-v4",
  satellite: "hybrid",
  dark: "dataviz-dark",
  topo: "topo-v2",
};

export function NearbyWellsMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);

  // Geographic & Well selection state
  const [selectedLocation, setSelectedLocation] = useState<LocationNode>(DEFAULT_LOCATION);
  const [activeTargetWellId, setActiveTargetWellId] = useState<string>("OIL-BGN-05");
  const [selectedWell, setSelectedWell] = useState<Well | null>(SYNTHETIC_WELLS[0]);

  // Filters & GIS state
  const [activeFilter, setActiveFilter] = useState<WellFilterType>("ALL");
  const [radiusKm, setRadiusKm] = useState<RadiusKm>(5);
  const [perspectiveMode, setPerspectiveMode] = useState<MapPerspectiveMode>("2D");
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyleId>("streets");
  const [viewMode, setViewMode] = useState<NearbyViewMode>("map");

  // Layers & Tool state
  const [rangeRingsVisible, setRangeRingsVisible] = useState<boolean>(true);
  const [labelsVisible, setLabelsVisible] = useState<boolean>(true);
  const [measuringActive, setMeasuringActive] = useState<boolean>(false);
  const [measureStart, setMeasureStart] = useState<MeasurePoint | null>(null);
  const [measureEnd, setMeasureEnd] = useState<MeasurePoint | null>(null);

  // Modals state
  const [comparisonState, setComparisonState] = useState<ComparisonState>({
    open: false,
    targetWellId: "OIL-BGN-05",
  });
  const [dossierWell, setDossierWell] = useState<Well | null>(null);
  const [showExportReport, setShowExportReport] = useState<boolean>(false);

  // Map & Error state
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_ZOOM);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Resolve Location Wells and Active Target Well
  const locationWells = useMemo(() => {
    return getWellsByLocation(selectedLocation.id);
  }, [selectedLocation.id]);

  const activeTargetWell = useMemo(() => {
    return (
      SYNTHETIC_WELLS.find((w) => w.id === activeTargetWellId) ||
      locationWells.find((w) => w.status === "active") ||
      locationWells[0] ||
      SYNTHETIC_WELLS[0]
    );
  }, [activeTargetWellId, locationWells]);

  // 2. Compute dynamic Haversine distances and bearings relative to Active Target Well
  const enrichedLocationWells: OffsetWellCalculated[] = useMemo(() => {
    return locationWells.map((w) => {
      const isTarget = w.id === activeTargetWell.id;
      const distKm = isTarget
        ? 0
        : calculateHaversineDistanceKm(
            activeTargetWell.latitude,
            activeTargetWell.longitude,
            w.latitude,
            w.longitude
          );
      const bearingDeg = isTarget
        ? 0
        : calculateAzimuthBearing(
            activeTargetWell.latitude,
            activeTargetWell.longitude,
            w.latitude,
            w.longitude
          );

      return {
        ...w,
        calculatedDistanceKm: distKm,
        calculatedBearingDeg: bearingDeg,
        bearingFormatted: isTarget ? "Origin" : formatBearingWithCardinal(bearingDeg),
      };
    });
  }, [locationWells, activeTargetWell]);

  // 3. Filtered Wells based on category tab & radius
  const filteredWells = useMemo(() => {
    return enrichedLocationWells.filter((w) => {
      if (activeFilter === "ACTIVE") return w.status === "active" || w.id === activeTargetWell.id;
      if (activeFilter === "NEARBY") return w.calculatedDistanceKm <= radiusKm;
      if (activeFilter === "HIGH_RISK")
        return w.status === "critical" || w.status === "warning" || (w.riskScore && w.riskScore >= 70);
      if (activeFilter === "HISTORICAL_MATCH")
        return w.status === "historical" || (w.historicalMatch && w.historicalMatch >= 85);
      return true; // ALL
    });
  }, [enrichedLocationWells, activeFilter, radiusKm, activeTargetWell.id]);

  // Offset wells specifically within radius buffer (excluding the target well itself if needed)
  const offsetWellsInRadius = useMemo(() => {
    return enrichedLocationWells.filter(
      (w) => w.id !== activeTargetWell.id && w.calculatedDistanceKm <= radiusKm
    );
  }, [enrichedLocationWells, activeTargetWell.id, radiusKm]);

  // Filter counts
  const filterCounts: Record<WellFilterType, number> = useMemo(() => {
    return {
      ALL: enrichedLocationWells.length,
      ACTIVE: enrichedLocationWells.filter((w) => w.status === "active" || w.id === activeTargetWell.id).length,
      NEARBY: enrichedLocationWells.filter((w) => w.calculatedDistanceKm <= radiusKm).length,
      HIGH_RISK: enrichedLocationWells.filter(
        (w) => w.status === "critical" || w.status === "warning" || (w.riskScore && w.riskScore >= 70)
      ).length,
      HISTORICAL_MATCH: enrichedLocationWells.filter(
        (w) => w.status === "historical" || (w.historicalMatch && w.historicalMatch >= 85)
      ).length,
    };
  }, [enrichedLocationWells, radiusKm, activeTargetWell.id]);

  // Helper to re-add custom GeoJSON layers when style loads
  const setupMapLayers = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map: any) => {
      if (!map) return;

      // 1. Concentric Range Rings Source (1km, 3km, 5km, 10km)
      const concentricGeoJSON = createConcentricRingsGeoJSON(
        activeTargetWell.longitude,
        activeTargetWell.latitude,
        [1, 3, 5, 10]
      );

      if (!map.getSource("concentric-rings-source")) {
        map.addSource("concentric-rings-source", {
          type: "geojson",
          data: concentricGeoJSON,
        });

        // Fill for active radius buffer zone
        map.addLayer({
          id: "radius-buffer-fill",
          type: "fill",
          source: "concentric-rings-source",
          paint: {
            "fill-color": "#D96B3B",
            "fill-opacity": 0.08,
          },
        });

        // Concentric range ring boundary lines
        map.addLayer({
          id: "concentric-rings-line",
          type: "line",
          source: "concentric-rings-source",
          paint: {
            "line-color": "#D96B3B",
            "line-width": 1.6,
            "line-dasharray": [4, 3],
            "line-opacity": 0.7,
          },
        });
      }

      // 2. Geodesic Measurement Line Source
      if (!map.getSource("measure-line-source")) {
        map.addSource("measure-line-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });

        map.addLayer({
          id: "measure-line-layer",
          type: "line",
          source: "measure-line-source",
          paint: {
            "line-color": "#245463",
            "line-width": 3,
            "line-dasharray": [2, 2],
          },
        });
      }
    },
    [activeTargetWell.latitude, activeTargetWell.longitude]
  );

  // Initialize MapLibre GL instance
  useEffect(() => {
    let isMounted = true;

    async function initializeMap() {
      const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY?.trim();

      if (!apiKey) {
        if (isMounted) {
          setErrorMessage(
            "MapTiler API key is missing. Please configure NEXT_PUBLIC_MAPTILER_API_KEY in apps/web/.env.local."
          );
        }
        return;
      }

      maplibregl.setWorkerUrl("/vendor/maplibre-gl/maplibre-gl-worker.mjs");

      try {
        if (!isMounted || !mapContainerRef.current) return;

        const styleId = MAPTILER_STYLE_MAP[basemapStyle] || "streets-v4";
        const mapStyle = `https://api.maptiler.com/maps/${styleId}/style.json?key=${apiKey}`;

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: mapStyle,
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          pitch: 0,
          bearing: 0,
          attributionControl: false,
        });

        map.on("error", (e) => {
          console.error("[WellWise MapLibre Workspace Error]:", e?.error || e);
          const msg = e?.error?.message || "";
          if (msg.includes("401") || msg.includes("403")) {
            if (isMounted) {
              setErrorMessage("MapTiler Authentication Failed (HTTP 401/403). Please verify your API key.");
            }
          }
        });

        map.on("zoom", () => {
          if (isMounted) {
            setCurrentZoom(map.getZoom());
          }
        });

        map.on("load", () => {
          if (!isMounted) return;
          setMapLoaded(true);
          setupMapLayers(map);
        });

        map.on("style.load", () => {
          if (!isMounted) return;
          setupMapLayers(map);
        });

        mapRef.current = map;
      } catch (err) {
        console.error("[WellWise MapLibre] Initialization failed:", err);
        if (isMounted) {
          setErrorMessage("Failed to initialize MapLibre GL WebGL canvas.");
        }
      }
    }

    initializeMap();

    return () => {
      isMounted = false;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Basemap Style Switch
  const handleSelectBasemap = (style: BasemapStyleId) => {
    setBasemapStyle(style);
    if (!mapRef.current) return;
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY?.trim();
    if (!apiKey) return;

    const styleId = MAPTILER_STYLE_MAP[style] || "streets-v4";
    const mapStyle = `https://api.maptiler.com/maps/${styleId}/style.json?key=${apiKey}`;
    try {
      mapRef.current.setStyle(mapStyle);
    } catch (err) {
      console.warn("Failed to switch basemap, falling back to streets:", err);
      mapRef.current.setStyle(`https://api.maptiler.com/maps/streets-v4/style.json?key=${apiKey}`);
    }
  };

  // Update Concentric Range Rings Source whenever activeTargetWell, radiusKm, or rangeRingsVisible changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    const source = map.getSource("concentric-rings-source");

    if (source && typeof source.setData === "function") {
      if (!rangeRingsVisible) {
        source.setData({ type: "FeatureCollection", features: [] });
      } else {
        const ringsData = createConcentricRingsGeoJSON(
          activeTargetWell.longitude,
          activeTargetWell.latitude,
          [1, 3, radiusKm, 10]
        );
        source.setData(ringsData);
      }
    }
  }, [activeTargetWell, radiusKm, rangeRingsVisible, mapLoaded]);

  // Update Measurement Line on Map
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    const source = map.getSource("measure-line-source");

    if (source && typeof source.setData === "function") {
      if (measureStart && measureEnd) {
        const lineGeoJSON = createGeodesicLineGeoJSON(measureStart, measureEnd);
        source.setData({
          type: "FeatureCollection",
          features: [lineGeoJSON],
        });
      } else {
        source.setData({ type: "FeatureCollection", features: [] });
      }
    }
  }, [measureStart, measureEnd, mapLoaded]);

  // Handle Map Click for Distance Measurement
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMapClick = (e: any) => {
      if (!measuringActive) return;

      const clickLng = e.lngLat.lng;
      const clickLat = e.lngLat.lat;

      // Check if click was near a known well (within 2km) to snap
      const closest = enrichedLocationWells.find(
        (w) => calculateHaversineDistanceKm(clickLat, clickLng, w.latitude, w.longitude) < 1.5
      );

      const pt: MeasurePoint = {
        lng: closest ? closest.longitude : clickLng,
        lat: closest ? closest.latitude : clickLat,
        wellId: closest ? closest.id : undefined,
        label: closest ? closest.id : `${clickLat.toFixed(3)}°, ${clickLng.toFixed(3)}°`,
      };

      if (!measureStart || (measureStart && measureEnd)) {
        setMeasureStart(pt);
        setMeasureEnd(null);
      } else if (measureStart && !measureEnd) {
        setMeasureEnd(pt);
      }
    };

    map.on("click", handleMapClick);
    return () => {
      map.off("click", handleMapClick);
    };
  }, [measuringActive, measureStart, measureEnd, enrichedLocationWells]);

  // Camera transition on location select
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

    const locWells = getWellsByLocation(loc.id);
    if (locWells.length > 0) {
      const activeInLoc = locWells.find((w) => w.status === "active") || locWells[0];
      setActiveTargetWellId(activeInLoc.id);
      setSelectedWell(activeInLoc);
    }
  };

  // Search selection
  const handleSearchSelectWell = (well: Well) => {
    setSelectedWell(well);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [well.longitude, well.latitude],
        zoom: 11.5,
        speed: 1.2,
        essential: true,
      });
    }
  };

  // Render Custom Derrick Well Markers & Regional Basin Beacons
  const renderMarkers = useCallback(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // LEVEL 1: National Overview
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
            <span class="absolute -inset-2 rounded-full bg-[#D96B3B]/30 animate-ping pointer-events-none"></span>
            <div class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#142B3A] text-white border border-[#D96B3B] shadow-lg group-hover:scale-110 group-hover:bg-[#245463] transition-all">
              <span class="h-2 w-2 rounded-full bg-[#D96B3B] animate-pulse"></span>
              <span class="text-xs font-mono font-bold tracking-tight whitespace-nowrap">${basin.name}</span>
              <span class="text-[10px] font-mono font-black px-1.5 py-0.2 rounded bg-[#D96B3B] text-white">${count}</span>
            </div>
            <span class="text-[9px] font-mono text-[#0D1B24] font-bold mt-1 bg-[#FAF8F5]/95 px-1.5 py-0.5 rounded border border-[#DDD2C0] shadow-2xs whitespace-nowrap">
              Explore Basin
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

    // LEVEL 2 & 3: Custom Derrick Well Markers for filtered wells
    filteredWells.forEach((well) => {
      const isSelected = selectedWell?.id === well.id;
      const isTarget = activeTargetWell.id === well.id;
      const isActive = well.status === "active";
      const isCritical = well.status === "critical";
      const isWarning = well.status === "warning";
      const isHistorical = well.status === "historical";

      const el = document.createElement("div");
      el.className = "well-custom-derrick-marker select-none cursor-pointer group";
      el.setAttribute("aria-label", `Well ${well.id} - ${well.status}`);

      // Semantic Color Scheme
      let pinTheme = "bg-[#2F8068] text-white border-[#2F8068]";
      let statusDot = "bg-white";

      if (isTarget) {
        pinTheme = "bg-[#142B3A] text-white border-[#D96B3B] ring-4 ring-[#D96B3B]/50 font-black";
        statusDot = "bg-[#D96B3B] animate-pulse";
      } else if (isActive) {
        pinTheme = "bg-[#2F8068] text-white border-[#2F8068] ring-3 ring-[#2F8068]/30";
        statusDot = "bg-white animate-pulse";
      } else if (isCritical) {
        pinTheme = "bg-[#843D35] text-white border-[#843D35] ring-3 ring-[#843D35]/30";
        statusDot = "bg-white animate-pulse";
      } else if (isWarning) {
        pinTheme = "bg-[#D96B3B] text-[#0D1B24] border-[#D96B3B]";
        statusDot = "bg-[#0D1B24]";
      } else if (isHistorical) {
        pinTheme = "bg-[#245463] text-white border-[#245463]";
        statusDot = "bg-[#DDD2C0]";
      }

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          ${
            isTarget || isCritical || isSelected
              ? `<span class="absolute -top-1 -inset-2 rounded-full animate-ping pointer-events-none ${
                  isTarget ? "bg-[#D96B3B]/30" : isCritical ? "bg-[#843D35]/30" : "bg-[#2F8068]/30"
                }"></span>`
              : ""
          }
          
          <!-- Derrick Tower Tag -->
          <div class="relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl shadow-lg border transition-all duration-200 ${pinTheme} ${
        isSelected
          ? "scale-115 ring-4 ring-[#D96B3B] bg-[#142B3A] text-white font-extrabold"
          : "hover:scale-105"
      }">
            <!-- Derrick Rig SVG Symbol -->
            <svg class="h-3.5 w-3.5 shrink-0 ${isTarget || isSelected ? "text-[#D96B3B]" : "text-current"}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="6 22 18 22 14 2 10 2 6 22" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="7" y1="17" x2="17" y2="17" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="12" y1="2" x2="12" y2="22" stroke-dasharray="2 2" stroke-width="1.5" />
            </svg>
            <span class="h-1.5 w-1.5 rounded-full ${statusDot}"></span>
            ${
              labelsVisible
                ? `<span class="text-[11px] font-mono font-bold tracking-tight whitespace-nowrap">${well.id}${
                    isTarget ? " (TARGET)" : ""
                  }</span>`
                : ""
            }
          </div>

          <!-- Anchor Pin -->
          <div class="w-1 h-1.5 bg-[#142B3A] opacity-60"></div>
          <div class="w-2.5 h-1 rounded-full bg-[#142B3A]/30"></div>
        </div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (measuringActive) {
          const pt: MeasurePoint = {
            lng: well.longitude,
            lat: well.latitude,
            wellId: well.id,
            label: well.id,
          };
          if (!measureStart || (measureStart && measureEnd)) {
            setMeasureStart(pt);
            setMeasureEnd(null);
          } else {
            setMeasureEnd(pt);
          }
          return;
        }

        setSelectedWell(well);
        map.flyTo({
          center: [well.longitude, well.latitude],
          zoom: Math.max(map.getZoom(), 11.0),
          speed: 1.1,
          essential: true,
        });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([well.longitude, well.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [
    currentZoom,
    filteredWells,
    mapLoaded,
    selectedLocation.id,
    selectedWell,
    activeTargetWell.id,
    labelsVisible,
    measuringActive,
    measureStart,
    measureEnd,
  ]);

  useEffect(() => {
    renderMarkers();
  }, [renderMarkers]);

  // 2D / 3D Perspective Controls
  const handleTogglePerspective = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (perspectiveMode === "2D") {
      setPerspectiveMode("3D");
      map.easeTo({
        pitch: 45,
        bearing: -15,
        duration: 800,
        essential: true,
      });
    } else {
      setPerspectiveMode("2D");
      map.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 800,
        essential: true,
      });
    }
  };

  const handleZoomIn = () => mapRef.current?.zoomIn({ duration: 300 });
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 300 });
  const handleResetNorth = () => {
    mapRef.current?.easeTo({
      bearing: 0,
      pitch: perspectiveMode === "3D" ? 45 : 0,
      duration: 500,
    });
  };

  const handleFitSelection = () => {
    if (!mapRef.current) return;
    const target = selectedWell || activeTargetWell;
    if (target) {
      mapRef.current.flyTo({
        center: [target.longitude, target.latitude],
        zoom: 11.5,
        speed: 1.2,
      });
    } else {
      mapRef.current.flyTo({
        center: selectedLocation.coordinates,
        zoom: selectedLocation.zoom,
        speed: 1.2,
      });
    }
  };

  const handleToggleFullscreen = () => {
    if (!workspaceRef.current) return;
    if (!document.fullscreenElement) {
      workspaceRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // Measured Distance result computation
  const measurementResult = useMemo(() => {
    if (!measureStart || !measureEnd) return null;
    const dist = calculateHaversineDistanceKm(
      measureStart.lat,
      measureStart.lng,
      measureEnd.lat,
      measureEnd.lng
    );
    const bearing = calculateAzimuthBearing(
      measureStart.lat,
      measureStart.lng,
      measureEnd.lat,
      measureEnd.lng
    );

    return {
      distanceKm: dist,
      bearingDeg: bearing,
      bearingFormatted: formatBearingWithCardinal(bearing),
      startLabel: measureStart.label || `${measureStart.lat.toFixed(3)}°N`,
      endLabel: measureEnd.label || `${measureEnd.lat.toFixed(3)}°N`,
    };
  }, [measureStart, measureEnd]);

  return (
    <div
      ref={workspaceRef}
      className="relative w-full h-[calc(100vh-65px)] bg-[#F5F0E6] overflow-hidden select-none font-sans flex flex-col"
    >
      {/* 1. TOP RESPONSIVE COMMAND BAR */}
      <header className="z-30 bg-[#FAF8F5]/98 backdrop-blur-md border-b border-[#DDD2C0] shadow-sm px-3 sm:px-4 py-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 shrink-0">
        {/* Left Section: Geographic Selector & Search */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <LocationSelector
            selectedLocation={selectedLocation}
            onSelectLocation={handleLocationSelect}
          />
          <WellSearch
            onSelectWell={handleSearchSelectWell}
            onSelectLocation={handleLocationSelect}
          />
        </div>

        {/* Center / Middle Section: Category Filters & Radius */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          <WellFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={filterCounts}
          />
          <RadiusControl radiusKm={radiusKm} onRadiusChange={setRadiusKm} />
        </div>

        {/* Right Section: View Mode Switcher & Export / Compare CTAs */}
        <div className="flex items-center gap-1.5 justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#DDD2C0]/35 border border-[#DDD2C0] font-mono text-xs">
            <button
              onClick={() => setViewMode("map")}
              className={cn(
                "px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1",
                viewMode === "map"
                  ? "bg-[#142B3A] text-white shadow-2xs"
                  : "text-[#142B3A]/70 hover:bg-[#DDD2C0]/50"
              )}
              title="Full Map View"
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Map</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={cn(
                "px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1",
                viewMode === "split"
                  ? "bg-[#142B3A] text-white shadow-2xs"
                  : "text-[#142B3A]/70 hover:bg-[#DDD2C0]/50"
              )}
              title="Split View (Map + Offset List)"
            >
              <Columns className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1",
                viewMode === "table"
                  ? "bg-[#142B3A] text-white shadow-2xs"
                  : "text-[#142B3A]/70 hover:bg-[#DDD2C0]/50"
              )}
              title="Engineering Offset Table"
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Table</span>
            </button>
          </div>

          {/* Compare Action Button */}
          <button
            onClick={() =>
              setComparisonState({
                open: true,
                targetWellId: activeTargetWell.id,
                compareWellId: selectedWell?.id !== activeTargetWell.id ? selectedWell?.id : undefined,
              })
            }
            className="px-2.5 py-1.5 rounded-2xl bg-[#FAF8F5] border border-[#DDD2C0] hover:border-[#142B3A] text-[#0D1B24] font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open Offset Correlation Engine"
          >
            <GitCompare className="h-3.5 w-3.5 text-[#D96B3B]" />
            <span className="hidden xl:inline">Compare</span>
          </button>

          {/* Export Report Action Button */}
          <button
            onClick={() => setShowExportReport(true)}
            className="px-3 py-1.5 rounded-2xl bg-[#D96B3B] hover:bg-[#c45a2c] text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Export Pre-Spud Offset Summary Dossier"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CANVAS (Map / Split / Table) */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex">
        {/* Table View takes over main canvas when selected */}
        {viewMode === "table" ? (
          <div className="w-full h-full z-10">
            <OffsetWellsList
              activeTargetWell={activeTargetWell}
              offsetWells={offsetWellsInRadius}
              selectedWell={selectedWell}
              radiusKm={radiusKm}
              viewMode="table"
              onSelectWell={(w) => setSelectedWell(w)}
              onLocateWell={(w) => {
                setSelectedWell(w);
                setViewMode("map");
                mapRef.current?.flyTo({
                  center: [w.longitude, w.latitude],
                  zoom: 12.0,
                  speed: 1.2,
                });
              }}
              onInspectDossier={(w) => setDossierWell(w)}
              onCompareWell={(w) =>
                setComparisonState({
                  open: true,
                  targetWellId: activeTargetWell.id,
                  compareWellId: w.id,
                })
              }
            />
          </div>
        ) : (
          <>
            {/* Map Canvas Container */}
            <div
              className={cn(
                "relative h-full transition-all duration-200",
                viewMode === "split" ? "w-full md:w-[62%] lg:w-[68%]" : "w-full"
              )}
            >
              {/* MapLibre WebGL Canvas */}
              <div
                ref={mapContainerRef}
                className={cn(
                  "absolute inset-0 w-full h-full",
                  measuringActive && "cursor-crosshair"
                )}
                style={{ width: "100%", height: "100%" }}
              />

              {/* MEASUREMENT ACTIVE HUD BANNER */}
              {measuringActive && (
                <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 z-25 p-3 rounded-2xl bg-[#142B3A]/95 text-white border border-[#D96B3B] shadow-2xl backdrop-blur-md font-mono text-xs flex items-center justify-between gap-3 max-w-md">
                  <div className="flex items-center gap-2 min-w-0">
                    <Ruler className="h-4 w-4 text-[#D96B3B] shrink-0 animate-pulse" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#D96B3B] font-bold block uppercase">
                        Geodesic Measurement Mode
                      </span>
                      {measurementResult ? (
                        <span className="font-extrabold block truncate">
                          {measurementResult.startLabel} &rarr; {measurementResult.endLabel}:{" "}
                          <strong className="text-[#D96B3B]">
                            {measurementResult.distanceKm.toFixed(2)} km
                          </strong>{" "}
                          ({measurementResult.bearingFormatted})
                        </span>
                      ) : measureStart ? (
                        <span className="text-white/80 text-[11px] block">
                          Point 1 set. Click second well or point to measure.
                        </span>
                      ) : (
                        <span className="text-white/80 text-[11px] block">
                          Click any two wells or points on the map.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {(measureStart || measureEnd) && (
                      <button
                        onClick={() => {
                          setMeasureStart(null);
                          setMeasureEnd(null);
                        }}
                        title="Reset points"
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setMeasuringActive(false);
                        setMeasureStart(null);
                        setMeasureEnd(null);
                      }}
                      title="Exit measurement mode"
                      className="p-1 rounded-lg bg-[#843D35] hover:bg-[#6e322a] text-white transition-colors cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* EMPTY STATE ALERT */}
              {filteredWells.length === 0 && (
                <div className="absolute top-4 left-4 z-20 p-3.5 rounded-2xl bg-[#FAF8F5]/95 backdrop-blur-md border border-[#DDD2C0] shadow-lg flex items-start gap-2.5 max-w-sm text-xs text-[#0D1B24] text-left">
                  <AlertCircle className="h-4 w-4 text-[#D96B3B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">No demo wells available for this location yet.</span>
                    <span className="text-[#142B3A]/75 text-[11px] mt-0.5 block">
                      Select Upper Assam Basin or Cambay Basin to view verified oil & gas wells.
                    </span>
                  </div>
                </div>
              )}

              {/* BOTTOM-LEFT: Status Legend */}
              <div className="absolute bottom-4 left-4 z-20">
                <WellMapLegend />
              </div>

              {/* BOTTOM-RIGHT: HUD Map Navigation Controls */}
              <div className="absolute bottom-4 right-4 sm:right-6 z-20">
                <WellMapControls
                  perspectiveMode={perspectiveMode}
                  onTogglePerspective={handleTogglePerspective}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onResetNorth={handleResetNorth}
                  onFitSelection={handleFitSelection}
                  onToggleFullscreen={handleToggleFullscreen}
                  basemapStyle={basemapStyle}
                  onSelectBasemap={handleSelectBasemap}
                  measuringActive={measuringActive}
                  onToggleMeasuring={() => {
                    setMeasuringActive(!measuringActive);
                    if (measuringActive) {
                      setMeasureStart(null);
                      setMeasureEnd(null);
                    }
                  }}
                  rangeRingsVisible={rangeRingsVisible}
                  onToggleRangeRings={() => setRangeRingsVisible(!rangeRingsVisible)}
                  labelsVisible={labelsVisible}
                  onToggleLabels={() => setLabelsVisible(!labelsVisible)}
                />
              </div>

              {/* RIGHT INSPECTOR: Selected Well Intelligence Panel (When in full map view) */}
              <AnimatePresence>
                {!errorMessage && selectedWell && viewMode === "map" && (
                  <SelectedWellPanel
                    well={selectedWell}
                    activeTargetWell={activeTargetWell}
                    onClose={() => setSelectedWell(null)}
                    onSetAsTargetWell={(w) => {
                      setActiveTargetWellId(w.id);
                      setSelectedWell(w);
                    }}
                    onCompareWithTarget={(w) =>
                      setComparisonState({
                        open: true,
                        targetWellId: activeTargetWell.id,
                        compareWellId: w.id,
                      })
                    }
                    onOpenDossier={(w) => setDossierWell(w)}
                    onSelectSimilarWell={(simId) => {
                      const target = SYNTHETIC_WELLS.find((w) => w.id === simId);
                      if (target) {
                        setSelectedWell(target);
                        mapRef.current?.flyTo({
                          center: [target.longitude, target.latitude],
                          zoom: 11.5,
                          speed: 1.2,
                        });
                      }
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* SPLIT VIEW RIGHT PANEL: Offset Wells List */}
            {viewMode === "split" && (
              <div className="hidden md:block w-[38%] lg:w-[32%] h-full z-20">
                <OffsetWellsList
                  activeTargetWell={activeTargetWell}
                  offsetWells={offsetWellsInRadius}
                  selectedWell={selectedWell}
                  radiusKm={radiusKm}
                  viewMode="split"
                  onSelectWell={(w) => {
                    setSelectedWell(w);
                    mapRef.current?.flyTo({
                      center: [w.longitude, w.latitude],
                      zoom: 11.5,
                      speed: 1.2,
                    });
                  }}
                  onLocateWell={(w) => {
                    setSelectedWell(w);
                    mapRef.current?.flyTo({
                      center: [w.longitude, w.latitude],
                      zoom: 12.0,
                      speed: 1.2,
                    });
                  }}
                  onInspectDossier={(w) => setDossierWell(w)}
                  onCompareWell={(w) =>
                    setComparisonState({
                      open: true,
                      targetWellId: activeTargetWell.id,
                      compareWellId: w.id,
                    })
                  }
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* 3. MODALS */}

      {/* A. Offset Well Comparison Modal */}
      {comparisonState.open && (
        <WellComparisonModal
          targetWell={activeTargetWell}
          offsetWell={
            SYNTHETIC_WELLS.find((w) => w.id === comparisonState.compareWellId) ||
            offsetWellsInRadius[0] ||
            SYNTHETIC_WELLS[1]
          }
          allWells={locationWells}
          onSelectOffsetWell={(w) =>
            setComparisonState((prev) => ({ ...prev, compareWellId: w.id }))
          }
          onClose={() => setComparisonState({ open: false, targetWellId: activeTargetWell.id })}
        />
      )}

      {/* B. Well Dossier Modal */}
      {dossierWell && (
        <WellDossierModal well={dossierWell} onClose={() => setDossierWell(null)} />
      )}

      {/* C. Pre-Spud Hazard Summary Report Export Modal */}
      {showExportReport && (
        <OffsetReportExportModal
          targetWell={activeTargetWell}
          offsetWells={offsetWellsInRadius}
          locationName={selectedLocation.name}
          radiusKm={radiusKm}
          onClose={() => setShowExportReport(false)}
        />
      )}

      {/* MAPTILER CONFIGURATION ERROR OVERLAY */}
      {errorMessage && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-[#F5F0E6]/90 backdrop-blur-md">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#FAF8F5] border border-[#DDD2C0] shadow-2xl text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#D96B3B]/20 text-[#A9533D] flex items-center justify-center mx-auto border border-[#D96B3B]/40">
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
          </div>
        </div>
      )}

      {/* LOADING OVERLAY */}
      {!mapLoaded && !errorMessage && (
        <div className="absolute inset-0 bg-[#F5F0E6]/90 backdrop-blur-sm z-35 flex flex-col items-center justify-center space-y-3 font-mono">
          <div className="h-8 w-8 rounded-full border-2 border-[#142B3A] border-t-[#D96B3B] animate-spin" />
          <span className="text-xs font-bold text-[#0D1B24] tracking-wider uppercase">
            Loading India MapTiler Vector Tiles...
          </span>
          <span className="text-[10px] text-[#142B3A]/60">
            Establishing Petroleum GIS Workspace
          </span>
        </div>
      )}
    </div>
  );
}
