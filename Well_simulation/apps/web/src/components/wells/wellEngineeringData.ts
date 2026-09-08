import { Well } from "@/components/dashboard/data/wells";
import {
  FormationStratum,
  CasingSection,
  MudWeightInterval,
  NPTEvent,
  OffsetWellCalculated,
  DailyDrillingRecord,
  EvidenceDocumentItem,
  EarlyWarningSignals,
} from "./types";
import { calculateHaversineDistanceKm, calculateAzimuthBearing, formatBearingWithCardinal } from "@/lib/geo";

/**
 * Deterministic Stratigraphic tops generator based on well region & depth.
 * Realistic lithological succession for Upper Assam, Cambay, Barmer, KG Basin, etc.
 */
export function getWellStratigraphy(well: Well): FormationStratum[] {
  const depth = well.depthM || 3200;

  if (well.regionId === "assam-basin" || well.id.startsWith("NHK")) {
    return [
      {
        name: "Alluvium / Dihing",
        topDepthM: 0,
        baseDepthM: Math.round(depth * 0.15),
        lithology: "Unconsolidated Sands, Clays & Gravel",
        isTargetZone: false,
        hazardRisk: "low",
        description: "Surface alluvial fill, potential fresh water aquifers.",
      },
      {
        name: "Barail Shale & Coal",
        topDepthM: Math.round(depth * 0.15),
        baseDepthM: Math.round(depth * 0.55),
        lithology: "Carbonaceous Shale with interbedded Coals",
        isTargetZone: false,
        hazardRisk: "medium",
        description: "Prone to sloughing shale and minor gas kicks from coal seams.",
      },
      {
        name: "Tipam Sandstone",
        topDepthM: Math.round(depth * 0.55),
        baseDepthM: Math.round(depth * 0.88),
        lithology: "Massive Medium-Grained Quartzose Sandstone",
        isTargetZone: false,
        hazardRisk: "high",
        description: "Highly permeable sand package; primary thief zone for mud losses.",
      },
      {
        name: well.formation || "JURASSIC T13 / Kopili",
        topDepthM: Math.round(depth * 0.88),
        baseDepthM: depth,
        lithology: "Glauconitic Sandstone with Basal Limestone",
        isTargetZone: true,
        hazardRisk: "high",
        description: "Primary hydrocarbon target pay interval with overpressure ramp.",
      },
    ];
  }

  if (well.regionId === "cambay-basin" || well.id.startsWith("CAM") || well.id.startsWith("ANK")) {
    return [
      {
        name: "Post-Eocene Alluvium",
        topDepthM: 0,
        baseDepthM: Math.round(depth * 0.25),
        lithology: "Sand, silt and variegating clay",
        isTargetZone: false,
        hazardRisk: "none",
      },
      {
        name: "Tarapur Shale",
        topDepthM: Math.round(depth * 0.25),
        baseDepthM: Math.round(depth * 0.6),
        lithology: "Fissile Marine Shale",
        isTargetZone: false,
        hazardRisk: "medium",
        description: "Reactive swelling clays requiring high-inhibition mud.",
      },
      {
        name: well.formation || "Ankleshwar Sand",
        topDepthM: Math.round(depth * 0.6),
        baseDepthM: Math.round(depth * 0.92),
        lithology: "Deltaic Sandstone Intercalated with Siltstone",
        isTargetZone: true,
        hazardRisk: "high",
      },
      {
        name: "Cambay Shale Base",
        topDepthM: Math.round(depth * 0.92),
        baseDepthM: depth,
        lithology: "Dark Grey Organic-Rich Source Rock",
        isTargetZone: false,
        hazardRisk: "medium",
      },
    ];
  }

  if (well.regionId === "barmer-basin" || well.id.startsWith("BMR") || well.id.startsWith("MGL")) {
    return [
      {
        name: "Surface Sand Dunes",
        topDepthM: 0,
        baseDepthM: Math.round(depth * 0.18),
        lithology: "Eolian Quartz Sand",
        isTargetZone: false,
        hazardRisk: "low",
      },
      {
        name: "Dharvi Dungar Shale",
        topDepthM: Math.round(depth * 0.18),
        baseDepthM: Math.round(depth * 0.65),
        lithology: "Lacustrine Shales",
        isTargetZone: false,
        hazardRisk: "medium",
      },
      {
        name: well.formation || "Fatehgarh Sandstone",
        topDepthM: Math.round(depth * 0.65),
        baseDepthM: depth,
        lithology: "Fluvial Coarse Sand with High Permeability",
        isTargetZone: true,
        hazardRisk: "high",
        description: "High wax crude reservoir. Severe mud loss risk in depleted zones.",
      },
    ];
  }

  // Default Stratigraphic succession
  return [
    {
      name: "Upper Strata / Alluvium",
      topDepthM: 0,
      baseDepthM: Math.round(depth * 0.3),
      lithology: "Unconsolidated Sands & Clays",
      isTargetZone: false,
      hazardRisk: "none",
    },
    {
      name: "Intermediate Regional Shale",
      topDepthM: Math.round(depth * 0.3),
      baseDepthM: Math.round(depth * 0.7),
      lithology: "Competent Silty Shale",
      isTargetZone: false,
      hazardRisk: "medium",
    },
    {
      name: well.formation || "Target Pay Formation",
      topDepthM: Math.round(depth * 0.7),
      baseDepthM: depth,
      lithology: "Porous Sandstone / Carbonate Reservoir",
      isTargetZone: true,
      hazardRisk: "high",
    },
  ];
}

/**
 * Deterministic Casing Program tallies based on well depth
 */
export function getWellCasingProgram(well: Well): CasingSection[] {
  const depth = well.depthM || 3200;

  return [
    {
      type: "Conductor",
      outerDiameterInch: '20"',
      settingDepthMD: 80,
      settingDepthTVD: 80,
      weightLbPerFt: 94,
      grade: "K-55",
      cementTopM: 0,
      testPressurePsi: 500,
    },
    {
      type: "Surface",
      outerDiameterInch: '13-3/8"',
      settingDepthMD: Math.round(depth * 0.28),
      settingDepthTVD: Math.round(depth * 0.28),
      weightLbPerFt: 68,
      grade: "L-80",
      cementTopM: 0,
      testPressurePsi: 2500,
    },
    {
      type: "Intermediate",
      outerDiameterInch: '9-5/8"',
      settingDepthMD: Math.round(depth * 0.78),
      settingDepthTVD: Math.round(depth * 0.78),
      weightLbPerFt: 47,
      grade: "P-110",
      cementTopM: Math.round(depth * 0.15),
      testPressurePsi: 4500,
    },
    {
      type: "Production",
      outerDiameterInch: '7"',
      settingDepthMD: depth,
      settingDepthTVD: depth,
      weightLbPerFt: 29,
      grade: "Q-125",
      cementTopM: Math.round(depth * 0.65),
      testPressurePsi: 6500,
    },
  ];
}

/**
 * Deterministic Mud Weight (density) profile across depth
 */
export function getWellMudWeightProfile(well: Well): MudWeightInterval[] {
  const depth = well.depthM || 3200;
  const baseMw = well.status === "critical" ? 11.8 : well.status === "warning" ? 11.2 : 10.5;

  return [
    {
      fromDepthM: 0,
      toDepthM: Math.round(depth * 0.28),
      mudWeightPpg: 9.2,
      mudType: "Bentonite Spud Mud",
      ecdEstimatedPpg: 9.5,
      porePressureEquivalentPpg: 8.6,
    },
    {
      fromDepthM: Math.round(depth * 0.28),
      toDepthM: Math.round(depth * 0.78),
      mudWeightPpg: 10.2,
      mudType: "Inhibited PHPA Polymer Mud",
      ecdEstimatedPpg: 10.6,
      porePressureEquivalentPpg: 9.4,
    },
    {
      fromDepthM: Math.round(depth * 0.78),
      toDepthM: depth,
      mudWeightPpg: baseMw,
      mudType: "Low Solids Non-Dispersed (LSND) / Barite Weighted",
      ecdEstimatedPpg: baseMw + 0.5,
      porePressureEquivalentPpg: baseMw - 0.7,
    },
  ];
}

/**
 * Chronological NPT (Non-Productive Time) and historical event logs
 */
export function getWellNPTEvents(well: Well): NPTEvent[] {
  const events = well.events || [];
  if (events.length === 0) {
    return [
      {
        id: `${well.id}-npt-1`,
        date: "14-Feb-2025",
        depthM: Math.round(well.depthM * 0.7),
        event: "Routine Bit Trip & Wiper Trip",
        category: "Operations",
        durationHours: 12.5,
        description: "Scheduled trip out to replace 8-1/2 inch PDC bit after 120 rotating hours.",
        mitigation: "Borehole in gauge; no tight pull noted on connections.",
      },
    ];
  }

  return events.map((e, idx) => {
    let dur = 8.5;
    let desc = `${e.event} recorded during operational run.`;
    let mit = well.recommendedAction || "Circulate bottoms-up and adjust drilling parameters.";

    if (e.severity === "critical") {
      dur = 42.0;
      desc = `Critical operational halt: ${e.event}. Jarring fired 350 cycles before string freed.`;
      mit = "Spotted oil-based lubricant pill; increased hydrostatic overbalance.";
    } else if (e.severity === "high") {
      dur = 18.0;
      desc = `High risk incident: ${e.event}. Drilling paused for remediation.`;
      mit = "Pumped 80 bbl coarse LCM pill and allowed 4 hours soak time.";
    } else if (e.severity === "medium") {
      dur = 6.0;
      desc = `Moderate event: ${e.event}. Parameters throttled to prevent escalation.`;
      mit = "Reduced RPM from 120 to 80; increased flow rate to clear annulus.";
    }

    return {
      id: `${well.id}-npt-${idx + 1}`,
      date: `0${idx + 4}-Mar-2025`,
      depthM: e.depthM,
      event: e.event,
      category: e.event.includes("Loss") ? "Lost Circulation" : e.event.includes("Kick") || e.event.includes("Gas") ? "Kick" : e.event.includes("Stuck") ? "Stuck Pipe" : "Torque/Drag",
      durationHours: dur,
      description: desc,
      mitigation: mit,
    };
  });
}

/**
 * Returns an enriched OffsetWellCalculated object relative to an active target well
 */
export function enrichWellWithCalculations(
  well: Well,
  targetWell: Well
): OffsetWellCalculated {
  const distKm = calculateHaversineDistanceKm(
    targetWell.latitude,
    targetWell.longitude,
    well.latitude,
    well.longitude
  );

  const bearingDeg = calculateAzimuthBearing(
    targetWell.latitude,
    targetWell.longitude,
    well.latitude,
    well.longitude
  );

  return {
    ...well,
    calculatedDistanceKm: distKm,
    calculatedBearingDeg: bearingDeg,
    bearingFormatted: formatBearingWithCardinal(bearingDeg),
    stratigraphy: getWellStratigraphy(well),
    casingProgram: getWellCasingProgram(well),
    mudWeightProfile: getWellMudWeightProfile(well),
    nptHistory: getWellNPTEvents(well),
    spudDate: "14-Jan-2025",
    rigId: `RIG-OIL-${well.id.slice(-3) || "08"}`,
    elevationM: 112,
    operator: "Oil India Limited (OIL)",
  };
}

/**
 * Deterministic Daily Drilling Report (DDR) parameter telemetry
 */
export function getWellDailyDrillingRecords(well: Well): DailyDrillingRecord[] {
  const depth = well.depthM || 3200;
  const currentDepth = Math.round(depth - 60);

  return [
    {
      date: "04-Mar",
      depthM: currentDepth,
      ropMh: 14.8,
      wobKlbf: 23.5,
      rpm: 105,
      torqueKftLbf: 8.9,
      mudWeightPpg: 11.2,
      flowRateGpm: 580,
      sppPsi: 2850,
      nptHours: 0,
      activitySummary: "Drilling 8-1/2 inch hole in target sand formation with low vibrations.",
    },
    {
      date: "03-Mar",
      depthM: currentDepth - 55,
      ropMh: 12.4,
      wobKlbf: 25.0,
      rpm: 95,
      torqueKftLbf: 11.2,
      mudWeightPpg: 11.1,
      flowRateGpm: 560,
      sppPsi: 2900,
      nptHours: 1.5,
      activitySummary: "Cyclic torque spike observed; wiper trip conducted to clear annulus.",
    },
    {
      date: "02-Mar",
      depthM: currentDepth - 120,
      ropMh: 16.5,
      wobKlbf: 22.0,
      rpm: 115,
      torqueKftLbf: 7.8,
      mudWeightPpg: 10.8,
      flowRateGpm: 600,
      sppPsi: 2750,
      nptHours: 0,
      activitySummary: "Smooth drilling through upper Tipam transition sandstone.",
    },
    {
      date: "01-Mar",
      depthM: currentDepth - 195,
      ropMh: 15.0,
      wobKlbf: 21.5,
      rpm: 120,
      torqueKftLbf: 7.2,
      mudWeightPpg: 10.6,
      flowRateGpm: 620,
      sppPsi: 2700,
      nptHours: 0,
      activitySummary: "Drilling ahead; routine survey and MWD telemetry check passed.",
    },
    {
      date: "28-Feb",
      depthM: currentDepth - 270,
      ropMh: 9.8,
      wobKlbf: 26.0,
      rpm: 90,
      torqueKftLbf: 9.5,
      mudWeightPpg: 10.5,
      flowRateGpm: 580,
      sppPsi: 2800,
      nptHours: 3.5,
      activitySummary: "Trip for bit change; replaced worn PDC bit with hybrid cutter assembly.",
    },
    {
      date: "27-Feb",
      depthM: currentDepth - 330,
      ropMh: 18.2,
      wobKlbf: 20.0,
      rpm: 130,
      torqueKftLbf: 6.8,
      mudWeightPpg: 10.4,
      flowRateGpm: 640,
      sppPsi: 2650,
      nptHours: 0,
      activitySummary: "Drilling 8-1/2 inch hole with consistent penetration rate.",
    },
  ];
}

/**
 * Deterministic NPT metrics summary
 */
export function getWellNPTSummary(well: Well) {
  const events = getWellNPTEvents(well);
  const totalNptHours = events.reduce((acc, ev) => acc + (ev.durationHours || 0), 0);
  const longestEvent = events.reduce(
    (max, ev) => (ev.durationHours > max.durationHours ? ev : max),
    events[0] || { durationHours: 0, event: "None" }
  );

  const categoryCounts: Record<string, number> = {};
  events.forEach((ev) => {
    categoryCounts[ev.category] = (categoryCounts[ev.category] || 0) + 1;
  });

  let primaryCategory = "Routine Operations";
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      primaryCategory = cat;
    }
  });

  return {
    totalNptHours: Math.round(totalNptHours * 10) / 10,
    eventsCount: events.length,
    longestEventHours: longestEvent.durationHours,
    longestEventName: longestEvent.event,
    primaryCategory,
  };
}

/**
 * Deterministic Early-Warning signals breakdown
 */
export function getWellEarlyWarningSignals(well: Well): EarlyWarningSignals {
  const risk = well.riskScore ?? 68;
  const isHighRisk = risk > 70;
  const isMedRisk = risk > 50;

  let category: EarlyWarningSignals["category"] = "NORMAL";
  if (risk > 75) category = "CRITICAL";
  else if (risk > 65) category = "WATCH";
  else if (risk > 45) category = "ADVISORY";

  return {
    riskScore: risk,
    category,
    mudLossSignalPercent: isHighRisk ? 88 : isMedRisk ? 64 : 32,
    torqueAnomalySignalPercent: isHighRisk ? 72 : isMedRisk ? 58 : 28,
    incidentSimilarityPercent: well.historicalMatch ?? 88,
    porePressureRampPercent: isHighRisk ? 68 : isMedRisk ? 45 : 20,
    explanation:
      `Historical offset records within 5 km indicate lost-circulation and cyclic torque anomalies in the permeable sand interval approaching ${Math.round(
        (well.depthM || 3200) * 0.95
      )} m. The current drilling well is entering this transition.`,
    supportingEvidenceSummary: [
      `${well.similarWells?.[0]?.name || "Offset Well"} — Lost circulation (120 bbl) @ 3,120 m`,
      `Offset Daily Drilling Report — Severe cyclic torque spike in porous sand package`,
      `Mud Engineer Recap — Depleted pore pressure interval requiring CaCO3 bridging treatment`,
    ],
    operationalConsideration:
      "Review historical lost-circulation mitigation practices and maintain LCM pill inventory on rig site before entering the target interval.",
  };
}

/**
 * Deterministic historical document citations for RAG / Evidence traceability
 */
export function getWellEvidenceItems(well: Well): EvidenceDocumentItem[] {
  const offsetId = well.similarWells?.[0]?.name || "NHK-119";
  const depth = well.depthM || 3200;

  return [
    {
      id: `${well.id}-doc-01`,
      sourceType: "Daily Drilling Report",
      documentTitle: `DDR-OIL-${offsetId}-20241112.pdf`,
      wellId: offsetId,
      eventSummary: "Lost Circulation in Depleted Target Sand Package",
      depthIntervalM: `${Math.round(depth * 0.94)}–${Math.round(depth * 0.97)} m`,
      relevanceScore: 94,
      snippetExcerpt:
        "At 3,120 m MD, total mud losses of 120 bbl occurred into porous depleted sandstone. Pumps throttled immediately. Spotted 80 bbl coarse calcium carbonate pill with 4 hours soak time before circulation restored.",
      dateLogged: "12-Nov-2024",
      mitigationReferenced: "80 bbl coarse CaCO3 pill, reduced pump rate from 620 to 480 gpm.",
    },
    {
      id: `${well.id}-doc-02`,
      sourceType: "Mud Engineer Recap",
      documentTitle: `MER-OIL-${offsetId}-SECTION-3.pdf`,
      wellId: offsetId,
      eventSummary: "Hydraulic Window Narrowing & Torque Spike",
      depthIntervalM: `${Math.round(depth * 0.92)}–${Math.round(depth * 0.96)} m`,
      relevanceScore: 89,
      snippetExcerpt:
        "ECD elevated to 11.8 ppg due to cuttings accumulation in annulus. Rotary torque escalated from 7.5 to 11.2 kft-lbf with stick-slip vibrations. Added 2% liquid lubricant to system to suppress drag.",
      dateLogged: "15-Nov-2024",
      mitigationReferenced: "2% liquid lubricant sweep, increased flow rate to improve hole cleaning.",
    },
    {
      id: `${well.id}-doc-03`,
      sourceType: "Geological End-of-Well Report",
      documentTitle: `EOWR-OIL-${well.regionId || "ASSAM"}-SYNTHESIS.pdf`,
      wellId: "Regional Synthesis",
      eventSummary: "Stratigraphic Pay Zone Transition & Overpressure Boundary",
      depthIntervalM: `${Math.round(depth * 0.88)}–${depth} m`,
      relevanceScore: 82,
      snippetExcerpt:
        "The Barail to Tipam and Jurassic boundary marks a significant pore pressure shift. Historical offsets in this concession block demonstrate fault-bounded compartment depletion alongside local overpressure lenses.",
      dateLogged: "02-Jan-2025",
      mitigationReferenced: "Staged choke adjustments and dual-gradient monitoring protocol.",
    },
  ];
}
