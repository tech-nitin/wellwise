import { SYNTHETIC_WELLS, Well } from "@/components/dashboard/data/wells";
import { getWellStratigraphy, getWellEvidenceItems } from "@/components/wells/wellEngineeringData";
import { calculateHaversineDistanceKm } from "@/lib/geo";
import {
  RiskSignalItem,
  RiskEvidenceRecord,
  OffsetWellComparisonItem,
  DepthRiskRailEvent,
  SignalHistoryEvent,
  MitigationPracticeItem,
  RiskMatrixRow,
  RiskCategory,
} from "./types";

/**
 * Get deterministic risk signals for any well in SYNTHETIC_WELLS
 */
export function getRiskSignals(well: Well): RiskSignalItem[] {
  const td = well.depthM || 3240;
  const currentDepth = Math.max(100, Math.round(td - 60)) + 0.4;
  const risk = well.riskScore || 68;
  const offsetId = well.similarWells?.[0]?.name || "NHK-119";

  const isHighRisk = risk > 70;
  const isMedRisk = risk > 50;

  const signals: RiskSignalItem[] = [
    {
      id: "sig-torque",
      rank: 1,
      name: "TORQUE ANOMALY",
      category: "TORQUE / DRAG",
      attentionLevel: isHighRisk ? "WATCH" : "ADVISORY",
      signalStrength: isHighRisk ? 72 : 54,
      currentValueFormatted: "18.6 kft-lb",
      baselineValueFormatted: "16.4 kft-lb",
      deviationFormatted: "+13.4%",
      deviationPercent: 13.4,
      depthM: currentDepth,
      unit: "kft-lb",
      whyFlagged: "Torque is increasing above the recent synthetic baseline (+13.4%) with cyclic stick-slip signatures.",
      historicalMatchLevel: "STRONG",
      historicalSummary: `3 nearby offset wells (${offsetId} corridor) reported similar torque behavior around 3,050–3,200 m in ${well.formation || "Jurassic T13"}.`,
      matchedOffsetCount: 3,
      evidenceRecordCount: 7,
      relevantParameters: ["Torque (18.6 kft-lb)", "RPM (118 rpm)", "WOB (22 klbf)"],
      patternDescription: "Torque escalation accompanied by slight rotary speed fluctuation during transition into target pay sand.",
      mitigationSummary: "Controlled wiper trips and reduced rotary aggressiveness historically resolved high torque in offset wells.",
    },
    {
      id: "sig-pressure",
      rank: 2,
      name: "PRESSURE BEHAVIOR",
      category: "PRESSURE",
      attentionLevel: isHighRisk ? "WATCH" : "NORMAL",
      signalStrength: isHighRisk ? 68 : 34,
      currentValueFormatted: "2,484 psi",
      baselineValueFormatted: "2,365 psi",
      deviationFormatted: "+5.0%",
      deviationPercent: 5.0,
      depthM: currentDepth,
      unit: "psi",
      whyFlagged: "Standpipe circulating pressure (SPP) is elevated (+119 psi) relative to the circulating baseline.",
      historicalMatchLevel: "MODERATE",
      historicalSummary: `Offset well ${offsetId} experienced annular loading and equivalent circulating density (ECD) ramp at equivalent stratigraphy.`,
      matchedOffsetCount: 2,
      evidenceRecordCount: 4,
      relevantParameters: ["SPP (2,484 psi)", "ECD (11.87 ppg)", "Flow Rate (422 gpm)"],
      patternDescription: "Annular cuttings accumulation causing moderate hydraulic head increase at standpipe manifold.",
      mitigationSummary: "Increase circulation bottoms-up duration and verify shaker screen mesh integrity.",
    },
    {
      id: "sig-mud-loss",
      rank: 3,
      name: "MUD LOSS PATTERN",
      category: "LOST CIRCULATION",
      attentionLevel: "NORMAL",
      signalStrength: 28,
      currentValueFormatted: "422 gpm",
      baselineValueFormatted: "420 gpm",
      deviationFormatted: "+0.5%",
      deviationPercent: 0.5,
      depthM: currentDepth,
      unit: "gpm",
      whyFlagged: "Mud pump circulation and active pit volume return flow remain stable with no major seepage detected.",
      historicalMatchLevel: "MODERATE",
      historicalSummary: `Offset well ${offsetId} logged 120 bbl lost-circulation at 3,120 m in depleted porous sand; active well currently stable.`,
      matchedOffsetCount: 2,
      evidenceRecordCount: 5,
      relevantParameters: ["Flow Rate (422 gpm)", "Mud Weight (11.2 ppg)", "Pit Level (42.5 bbl)"],
      patternDescription: "Hydraulic balance maintained; trip tank level consistent on connection sequences.",
      mitigationSummary: "Keep calcium carbonate (CaCO3) bridging LCM pill pre-mixed in reserve tank.",
    },
    {
      id: "sig-rop",
      rank: 4,
      name: "ROP DEVIATION",
      category: "DRILLING PERFORMANCE",
      attentionLevel: "NORMAL",
      signalStrength: 24,
      currentValueFormatted: "13.8 m/h",
      baselineValueFormatted: "14.5 m/h",
      deviationFormatted: "-4.8%",
      deviationPercent: -4.8,
      depthM: currentDepth,
      unit: "m/h",
      whyFlagged: "ROP remains within expected variation band for the current lithological formation package.",
      historicalMatchLevel: "LOW",
      historicalSummary: "Offset drilling rates demonstrated consistent penetration across this stratigraphic interval.",
      matchedOffsetCount: 1,
      evidenceRecordCount: 3,
      relevantParameters: ["ROP (13.8 m/h)", "WOB (22 klbf)", "MSE (Nominal)"],
      patternDescription: "Normal bit cutter response with steady drill rate progression.",
      mitigationSummary: "Continue routine mechanical specific energy (MSE) monitoring.",
    },
    {
      id: "sig-stuck-pipe",
      rank: 5,
      name: "STUCK PIPE PRECURSOR",
      category: "STUCK PIPE",
      attentionLevel: isHighRisk ? "WATCH" : "NORMAL",
      signalStrength: isHighRisk ? 58 : 22,
      currentValueFormatted: "1.8 kft-lb drag",
      baselineValueFormatted: "0.8 kft-lb",
      deviationFormatted: "+125%",
      deviationPercent: 125,
      depthM: currentDepth,
      unit: "drag index",
      whyFlagged: "Overpull on connections slightly elevated; stationary pipe time should be minimized across permeable sand.",
      historicalMatchLevel: "STRONG",
      historicalSummary: `Historical incident in ${offsetId} logged differential sticking risk during prolonged survey stop at 3,125 m.`,
      matchedOffsetCount: 2,
      evidenceRecordCount: 4,
      relevantParameters: ["Overpull (18 klbf)", "Connection Time (4.2 min)", "Mud Cake Thickness (2/32\")"],
      patternDescription: "Permeable sandstone overbalance creates potential differential sticking tendency if string left stationary.",
      mitigationSummary: "Rotate and reciprocate drillstring continuously during circulation breaks.",
    },
  ];

  return signals;
}

/**
 * Get detailed evidence records for the selected well and signal
 */
export function getRiskEvidenceRecords(well: Well, signalId?: string): RiskEvidenceRecord[] {
  const offsetId = well.similarWells?.[0]?.name || "NHK-119";
  const depth = well.depthM || 3240;
  const currentDepth = Math.round(depth - 60);

  return [
    {
      id: "ev-rec-1",
      sourceType: "Daily Drilling Report",
      documentTitle: `DDR_OIL_${offsetId}_20241112.pdf`,
      offsetWellId: offsetId,
      offsetWellName: `Offset Well ${offsetId}`,
      depthIntervalM: `${currentDepth - 60}–${currentDepth} m`,
      eventDescription: "Torque increase followed by restricted rotary response during interval penetration.",
      relevance: "HIGH",
      relevanceScore: 94,
      snippetExcerpt:
        "At 3,120 m MD, rotary torque escalated from 14.5 to 18.8 kft-lb with stick-slip vibrations. Drill string showed 25 klbf overpull on connection. Pumped 80 bbl lubricant sweep and resumed rotation.",
      dateLogged: "12-Nov-2024",
      mitigationReferenced: "2% liquid lubricant sweep, reduced rotary RPM from 120 to 85.",
    },
    {
      id: "ev-rec-2",
      sourceType: "Mud Engineer Recap",
      documentTitle: `MER_OIL_${offsetId}_SEC3.pdf`,
      offsetWellId: offsetId,
      offsetWellName: `Offset Well ${offsetId}`,
      depthIntervalM: `${currentDepth - 80}–${currentDepth - 20} m`,
      eventDescription: "Annular cuttings accumulation and ECD elevation in target sandstone package.",
      relevance: "HIGH",
      relevanceScore: 89,
      snippetExcerpt:
        "ECD elevated to 11.87 ppg due to rapid penetration cuttings loading. Standpipe pressure climbed +140 psi over clean hole baseline. Increased pump flow from 420 to 510 gpm to clean annulus.",
      dateLogged: "15-Nov-2024",
      mitigationReferenced: "High-viscosity sweep pill (30 bbl), extended circulation bottoms-up.",
    },
    {
      id: "ev-rec-3",
      sourceType: "End of Well Report",
      documentTitle: `EOWR_OIL_${well.regionId || "ASSAM"}_SYNTHESIS.pdf`,
      offsetWellId: "Regional Synthesis",
      offsetWellName: `${well.basin || "Regional"} Offset Synthesis`,
      depthIntervalM: `${Math.round(depth * 0.9)}–${depth} m`,
      eventDescription: "Stratigraphic Pay Zone Transition & Overpressure Boundary Characteristics.",
      relevance: "MEDIUM",
      relevanceScore: 82,
      snippetExcerpt:
        "The Jurassic T13 sandstone boundary marks a critical compaction transition. Historical offsets in this concession block consistently demonstrate torque escalation and micro-fracture loss risks.",
      dateLogged: "02-Jan-2025",
      mitigationReferenced: "Staged choke adjustment and dual-gradient monitoring protocol.",
    },
    {
      id: "ev-rec-4",
      sourceType: "Lessons Learned",
      documentTitle: `LESSONS_LEARNED_${well.id.slice(0, 3)}_04.pdf`,
      offsetWellId: well.similarWells?.[1]?.name || "NHK-121",
      offsetWellName: `Offset Well ${well.similarWells?.[1]?.name || "NHK-121"}`,
      depthIntervalM: `${currentDepth - 30}–${currentDepth + 20} m`,
      eventDescription: "Differential sticking mitigation and wiper trip frequency protocol.",
      relevance: "HIGH",
      relevanceScore: 91,
      snippetExcerpt:
        "Restricted connection times to under 3 minutes across the permeable sand unit. Conducted 5-stand wiper trip every 120 m of newly drilled hole to eliminate tight spots.",
      dateLogged: "18-Dec-2024",
      mitigationReferenced: "Wiper trip protocol and continuous string rotation during surveys.",
    },
  ];
}

/**
 * Get 3-5 similar offset wells for comparative risk benchmarking
 */
export function getOffsetWellRiskComparisons(well: Well): OffsetWellComparisonItem[] {
  // Find other wells from SYNTHETIC_WELLS
  const candidates = SYNTHETIC_WELLS.filter((w) => w.id !== well.id);

  return candidates.slice(0, 4).map((offset, idx) => {
    const dist = calculateHaversineDistanceKm(
      well.latitude,
      well.longitude,
      offset.latitude,
      offset.longitude
    );

    const matchPct = Math.max(65, 95 - idx * 7);
    const riskLevel: "Strong" | "Moderate" | "Low" = idx === 0 ? "Strong" : idx === 1 ? "Moderate" : "Moderate";

    const events = [
      "Torque anomaly & stick-slip (3,120 m)",
      "Annular pressure elevation (3,050 m)",
      "Minor lost-circulation seepage (120 bbl)",
      "Differential drag on connection (3,180 m)",
    ];

    return {
      wellId: offset.id,
      wellName: offset.name,
      distanceKm: dist,
      formationMatchPct: matchPct,
      riskMatchLevel: riskLevel,
      historicalEvent: events[idx % events.length],
      evidenceRecordCount: 7 - idx,
      formation: offset.formation || "Jurassic / Kopili",
    };
  });
}

/**
 * Get Depth-Based Risk Map rail events from Surface (0 m) to Target TD
 */
export function getDepthRiskRailEvents(well: Well): DepthRiskRailEvent[] {
  const td = well.depthM || 3240;
  const currentDepth = Math.max(100, Math.round(td - 60)) + 0.4;
  const strat = getWellStratigraphy(well);
  const offsetId = well.similarWells?.[0]?.name || "NHK-119";

  const events: DepthRiskRailEvent[] = [
    {
      depthM: 0,
      label: "Surface (RKB)",
      type: "surface",
      description: "Datum elevation 112 m MSL",
    },
  ];

  // Stratigraphy Tops
  strat.forEach((s) => {
    if (s.topDepthM > 0) {
      events.push({
        depthM: s.topDepthM,
        label: `${s.name} Top`,
        type: "formation",
        description: `${s.lithology} · Hazard Risk: ${s.hazardRisk || "low"}`,
        source: "Stratigraphic Prognosis",
      });
    }
  });

  // Historical Incidents
  events.push({
    depthM: 3050,
    label: "Historical Torque Pattern",
    type: "incident",
    severity: "medium",
    description: `Offset ${offsetId} experienced elevated rotary torque & stick-slip`,
    source: `Offset ${offsetId} DDR`,
  });

  events.push({
    depthM: 3120,
    label: "Historical Lost Circulation (120 bbl)",
    type: "incident",
    severity: "high",
    description: `Offset ${offsetId} logged 120 bbl mud loss into permeable sand`,
    source: `Offset ${offsetId} Mud Recap`,
  });

  // Current Bit Depth
  events.push({
    depthM: currentDepth,
    label: "CURRENT DEPTH (3,180.4 m)",
    type: "current",
    isCurrentDepth: true,
    description: `Active drill bit position in ${well.formation || "Jurassic T13"} · Early-Warning Signal Active`,
  });

  // Target TD
  events.push({
    depthM: td,
    label: `TARGET TD (${td} m)`,
    type: "target",
    description: `Section Total Depth Target`,
  });

  return events.sort((a, b) => a.depthM - b.depthM);
}

/**
 * Get Signal History timeline progression
 */
export function getSignalHistoryEvents(well: Well): SignalHistoryEvent[] {
  return [
    {
      timeLabel: "11:12",
      signalName: "TORQUE ANOMALY",
      status: "NORMAL",
      summary: "Torque signal within baseline envelope (16.4 kft-lb)",
      valueFormatted: "16.4 kft-lb",
    },
    {
      timeLabel: "11:25",
      signalName: "TORQUE ANOMALY",
      status: "ADVISORY",
      summary: "Torque began increasing above baseline (+5%)",
      valueFormatted: "17.2 kft-lb",
    },
    {
      timeLabel: "11:31",
      signalName: "ROP DEVIATION",
      status: "NORMAL",
      summary: "ROP decreased (-14%) during lithology boundary entry",
      valueFormatted: "12.8 m/h",
    },
    {
      timeLabel: "11:37",
      signalName: "PRESSURE BEHAVIOR",
      status: "ADVISORY",
      summary: "SPP increased (+5%) with annular cuttings loading",
      valueFormatted: "2,484 psi",
    },
    {
      timeLabel: "11:42",
      signalName: "TORQUE ANOMALY",
      status: "WATCH",
      summary: "Torque signal transitioned to WATCH (+13.4% above baseline)",
      valueFormatted: "18.6 kft-lb",
    },
  ];
}

/**
 * Get Historical Mitigation Practices from evidence
 */
export function getMitigationPractices(well: Well, signalId?: string): MitigationPracticeItem[] {
  const offsetId = well.similarWells?.[0]?.name || "NHK-119";

  return [
    {
      id: "mit-1",
      practiceTitle: "Reduced Drilling Aggressiveness & Annular Wiper Sweep",
      description: "Throttled rotary RPM from 120 to 85 and performed 5-stand wiper trip to clear cuttings bed.",
      usedInOffsetCount: 3,
      evidenceRecordCount: 5,
      outcomeSummary: "Resolved torque stick-slip vibrations; prevented mechanical sticking in offset record.",
      primaryOffsetWellId: offsetId,
    },
    {
      id: "mit-2",
      practiceTitle: "Liquid Lubricant & Calcium Carbonate Bridging Pill",
      description: "Spotted 80 bbl coarse CaCO3 bridging pill with 2% lubricant before resuming rotation in sand.",
      usedInOffsetCount: 2,
      evidenceRecordCount: 4,
      outcomeSummary: "Eliminated seepage losses and restored nominal rotary torque response.",
      primaryOffsetWellId: offsetId,
    },
  ];
}

/**
 * Get compact 5x3 Risk Matrix rows
 */
export function getRiskMatrixRows(well: Well): RiskMatrixRow[] {
  const risk = well.riskScore || 68;

  return [
    {
      hazardName: "Torque / Drag",
      level: risk > 65 ? "MEDIUM" : "LOW",
      attentionLevel: "WATCH",
      signalStrength: 72,
    },
    {
      hazardName: "Pressure Behavior",
      level: "MEDIUM",
      attentionLevel: "WATCH",
      signalStrength: 68,
    },
    {
      hazardName: "Lost Circulation",
      level: "LOW",
      attentionLevel: "NORMAL",
      signalStrength: 28,
    },
    {
      hazardName: "Stuck Pipe Precursor",
      level: "MEDIUM",
      attentionLevel: "WATCH",
      signalStrength: 58,
    },
    {
      hazardName: "ROP Deviation",
      level: "LOW",
      attentionLevel: "NORMAL",
      signalStrength: 24,
    },
  ];
}

/**
 * Get Summary metrics counts
 */
export function getRiskSummaryMetrics(signals: RiskSignalItem[]) {
  const highAttention = signals.filter((s) => s.attentionLevel === "CRITICAL").length;
  const watch = signals.filter((s) => s.attentionLevel === "WATCH").length;
  const normal = signals.filter((s) => s.attentionLevel === "NORMAL").length;

  return {
    activeSignals: signals.length,
    highAttention: highAttention > 0 ? highAttention : 1, // at least 1 high-priority active
    watch,
    normal,
    historicalMatches: 3,
    evidenceRecords: 7,
  };
}
