import { Well } from "@/components/dashboard/data/wells";
import { getWellStratigraphy, getWellEvidenceItems } from "@/components/wells/wellEngineeringData";
import {
  LiveTelemetryPoint,
  EarlyWarningSignal,
  WhatChangedItem,
  DepthEvent,
  OperationalContextData,
  ActiveAlertItem,
  TelemetryParameterConfig,
  TelemetryParameterKey,
  DrillingState,
} from "./types";

export const PARAMETER_CONFIGS: Record<TelemetryParameterKey, TelemetryParameterConfig> = {
  rop: {
    key: "rop",
    label: "ROP",
    shortLabel: "ROP",
    fullName: "Rate of Penetration",
    unit: "m/h",
    decimals: 1,
    color: "#245463", // Petrol Blue
    baselineKey: "baselineRop",
    demoThresholdMin: 6.0,
    demoThresholdMax: 25.0,
    thresholdLabel: "Demo expected range: 6.0 – 25.0 m/h",
    description: "Speed at which the drill bit deepens the borehole.",
  },
  wob: {
    key: "wob",
    label: "WOB",
    shortLabel: "WOB",
    fullName: "Weight on Bit",
    unit: "klbf",
    decimals: 1,
    color: "#D96B3B", // Copper Flame
    baselineKey: "baselineWob",
    demoThresholdMin: 10.0,
    demoThresholdMax: 32.0,
    thresholdLabel: "Demo operating window: 10.0 – 32.0 klbf",
    description: "Downward force applied to the bit by drill collars.",
  },
  rpm: {
    key: "rpm",
    label: "RPM",
    shortLabel: "RPM",
    fullName: "Rotations per Minute",
    unit: "rpm",
    decimals: 0,
    color: "#142B3A", // Deep Petroleum
    baselineKey: "baselineRpm",
    demoThresholdMin: 60,
    demoThresholdMax: 160,
    thresholdLabel: "Demo rotary target: 60 – 160 rpm",
    description: "Rotational velocity of top drive / rotary table / downhole mud motor.",
  },
  torque: {
    key: "torque",
    label: "TORQUE",
    shortLabel: "Torque",
    fullName: "Surface Rotary Torque",
    unit: "kft-lb",
    decimals: 1,
    color: "#A9533D", // Burnt Earth / Warning
    baselineKey: "baselineTorque",
    demoThresholdMax: 22.0,
    thresholdLabel: "Demo advisory threshold: 22.0 kft-lb",
    description: "Rotational resistance encountered by the drill string and bit.",
  },
  flowRate: {
    key: "flowRate",
    label: "FLOW RATE",
    shortLabel: "Flow",
    fullName: "Mud Pump Flow Rate",
    unit: "gpm",
    decimals: 0,
    color: "#2F8068", // Success green
    baselineKey: "baselineFlowRate",
    demoThresholdMin: 350,
    demoThresholdMax: 650,
    thresholdLabel: "Demo hydraulics envelope: 350 – 650 gpm",
    description: "Total volumetric mud circulation flow from triplex mud pumps.",
  },
  spp: {
    key: "spp",
    label: "SPP",
    shortLabel: "SPP",
    fullName: "Standpipe Pressure",
    unit: "psi",
    decimals: 0,
    color: "#843D35", // Critical/Burnt
    baselineKey: "baselineSpp",
    demoThresholdMax: 3200,
    thresholdLabel: "Demo circulating limit: 3,200 psi",
    description: "Total circulating pressure loss across the hydraulic circuit.",
  },
  mudWeight: {
    key: "mudWeight",
    label: "MUD WEIGHT",
    shortLabel: "Mud Wt",
    fullName: "Active Mud Weight Density",
    unit: "ppg",
    decimals: 2,
    color: "#8B877D", // Soft Stone
    baselineKey: "baselineMudWeight",
    demoThresholdMin: 9.5,
    demoThresholdMax: 13.0,
    thresholdLabel: "Demo balance range: 9.5 – 13.0 ppg",
    description: "Density of drilling fluid maintaining borehole hydrostatic overbalance.",
  },
  ecd: {
    key: "ecd",
    label: "ECD",
    shortLabel: "ECD",
    fullName: "Equivalent Circulating Density",
    unit: "ppg",
    decimals: 2,
    color: "#245463",
    baselineKey: "baselineEcd",
    demoThresholdMax: 13.5,
    thresholdLabel: "Demo fracture gradient envelope: 13.5 ppg",
    description: "Effective downhole density including annular friction pressure loss.",
  },
  gas: {
    key: "gas",
    label: "TOTAL GAS",
    shortLabel: "Gas",
    fullName: "Mud Logging Total Gas",
    unit: "%",
    decimals: 2,
    color: "#D96B3B",
    baselineKey: "baselineGas",
    demoThresholdMax: 3.5,
    thresholdLabel: "Demo connection gas trigger: 3.5%",
    description: "Hydrocarbon gas concentration extracted from returned mud stream.",
  },
};

/** Simple deterministic pseudo-random generator seeded by string */
function createSeededRandom(seedStr: string) {
  let h = 0xdeadbeef;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 2654435761);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h >>> 0) / 4294967296);
  };
}

export interface WellBaselineParameters {
  baseDepth: number;
  targetTd: number;
  rop: number;
  wob: number;
  rpm: number;
  torque: number;
  flowRate: number;
  spp: number;
  mudWeight: number;
  ecd: number;
  gas: number;
  formation: string;
  hasTorqueAnomaly: boolean;
  hasMudLossRisk: boolean;
  hasPressureElevation: boolean;
}

/**
 * Get deterministic baseline parameters for any well in SYNTHETIC_WELLS
 */
export function getWellBaselineParameters(well: Well): WellBaselineParameters {
  const targetTd = well.depthM || 3240;
  // Current depth is near the end of hole (approx 96-98% TD)
  const baseDepth = Math.max(100, Math.round(targetTd - 60));
  const risk = well.riskScore || 65;

  const isHighRisk = risk > 70;
  const isMedRisk = risk > 50;

  // Tailored baseline per region/formation
  let rop = 14.5;
  let wob = 22.0;
  let rpm = 118;
  let torque = 16.4;
  let flowRate = 420;
  let spp = 2365;
  let mudWeight = 11.2;

  if (well.id.startsWith("CAM") || well.regionId === "cambay-basin") {
    rop = 18.2;
    wob = 19.5;
    rpm = 125;
    torque = 14.2;
    flowRate = 510;
    spp = 2650;
    mudWeight = 10.8;
  } else if (well.id.startsWith("BMR") || well.regionId === "barmer-basin") {
    rop = 16.0;
    wob = 24.0;
    rpm = 110;
    torque = 15.8;
    flowRate = 460;
    spp = 2520;
    mudWeight = 10.5;
  } else if (well.regionId === "kg-basin" || well.id.startsWith("KG")) {
    rop = 11.5;
    wob = 26.0;
    rpm = 95;
    torque = 19.0;
    flowRate = 580;
    spp = 3100;
    mudWeight = 12.4;
  }

  const hasTorqueAnomaly = isHighRisk || well.id === "NHK-124";
  const hasMudLossRisk = risk > 65 && well.events.some((e) => e.event.toLowerCase().includes("loss"));
  const hasPressureElevation = isHighRisk;

  return {
    baseDepth,
    targetTd,
    rop,
    wob,
    rpm,
    torque,
    flowRate,
    spp,
    mudWeight,
    ecd: +(mudWeight + 0.55).toFixed(2),
    gas: isHighRisk ? 1.45 : 0.85,
    formation: well.formation || "Jurassic T13",
    hasTorqueAnomaly,
    hasMudLossRisk,
    hasPressureElevation,
  };
}

/**
 * Generate 45 historical synthetic data points (last 45 minutes)
 * with deterministic engineering physics and correlated anomalies.
 */
export function generateInitialTelemetry(well: Well, count = 45): LiveTelemetryPoint[] {
  const base = getWellBaselineParameters(well);
  const prng = createSeededRandom(`${well.id}-${well.depthM}`);
  const now = Date.now();
  const stepMs = 60 * 1000; // 1 min steps

  const points: LiveTelemetryPoint[] = [];

  // Anomaly starts around minute 30 out of 45 (15 mins ago)
  const anomalyStartIndex = Math.floor(count * 0.65);

  let currentDepth = base.baseDepth - (count * 0.25); // slowly drilled down to baseDepth

  for (let i = 0; i < count; i++) {
    const timeMs = now - (count - 1 - i) * stepMs;
    const date = new Date(timeMs);
    const timeLabel = date.toTimeString().split(" ")[0]; // HH:mm:ss
    const minuteLabel = timeLabel.slice(0, 5); // HH:mm

    const isAnomaly = base.hasTorqueAnomaly && i >= anomalyStartIndex;
    const anomalyFactor = isAnomaly ? (i - anomalyStartIndex) / (count - anomalyStartIndex) : 0;

    // Small measurement noise (-0.5 to +0.5)
    const n1 = (prng() - 0.5);
    const n2 = (prng() - 0.5);
    const n3 = (prng() - 0.5);
    const n4 = (prng() - 0.5);

    // Drilling physics correlations:
    // Torque ramp (+12% to +20%)
    const torqueVal = +(
      base.torque +
      (isAnomaly ? anomalyFactor * 2.4 : Math.sin(i / 5) * 0.4) +
      n1 * 0.3
    ).toFixed(1);

    // ROP reduction when torque escalates (formation transition / friction)
    const ropVal = +(
      base.rop -
      (isAnomaly ? anomalyFactor * 1.8 : Math.cos(i / 6) * 0.5) +
      n2 * 0.4
    ).toFixed(1);

    // SPP increases slightly due to annular cuttings / slight choke
    const sppVal = Math.round(
      base.spp +
      (isAnomaly ? anomalyFactor * 125 : Math.sin(i / 4) * 20) +
      n3 * 15
    );

    // WOB slight variation
    const wobVal = +(base.wob + Math.cos(i / 8) * 0.6 + n4 * 0.3).toFixed(1);

    // RPM
    const rpmVal = Math.round(base.rpm + (isAnomaly ? -anomalyFactor * 4 : 0) + n1 * 2);

    // Flow rate
    const flowVal = Math.round(base.flowRate + (isAnomaly && base.hasMudLossRisk ? -anomalyFactor * 15 : 0) + n2 * 4);

    // Mud Weight
    const mwVal = +(base.mudWeight + (isAnomaly ? 0.05 : 0)).toFixed(2);
    const ecdVal = +(mwVal + 0.55 + (isAnomaly ? 0.15 : 0)).toFixed(2);
    const gasVal = +(base.gas + (isAnomaly ? anomalyFactor * 0.5 : 0) + n3 * 0.05).toFixed(2);

    // Depth progresses slightly (approx 0.23m per minute at 14 m/h)
    currentDepth += (ropVal / 60);

    const drillingState: DrillingState = i === count - 12 ? "CONNECTION" : "DRILLING";

    points.push({
      timestamp: timeMs,
      timeLabel,
      minuteLabel,
      depthM: +currentDepth.toFixed(1),
      ropMh: Math.max(1, ropVal),
      wobKlbf: Math.max(5, wobVal),
      rpm: Math.max(20, rpmVal),
      torqueKftLb: Math.max(2, torqueVal),
      flowRateGpm: Math.max(100, flowVal),
      sppPsi: Math.max(500, sppVal),
      mudWeightPpg: mwVal,
      ecdPpg: ecdVal,
      gasPct: Math.max(0.1, gasVal),
      drillingState,
      isAnomalyPoint: isAnomaly,
    });
  }

  // Ensure last point depth strictly aligns with target baseline depth
  if (points.length > 0) {
    points[points.length - 1].depthM = base.baseDepth;
  }

  return points;
}

/**
 * Generate the next single live telemetry point for continuous ticking stream
 */
export function generateNextTickPoint(
  prevPoints: LiveTelemetryPoint[],
  well: Well,
  tickIndex: number
): LiveTelemetryPoint {
  const base = getWellBaselineParameters(well);
  const lastPoint = prevPoints[prevPoints.length - 1] || generateInitialTelemetry(well, 1)[0];
  const now = Date.now();
  const date = new Date(now);
  const timeLabel = date.toTimeString().split(" ")[0];
  const minuteLabel = timeLabel.slice(0, 5);

  // Deterministic oscillation with subtle pseudo-random noise
  const noiseSeed = Math.sin(tickIndex * 1.7) * 0.5;
  const slowWave = Math.sin(tickIndex * 0.2);

  const isAnomaly = base.hasTorqueAnomaly;

  // Torque stays in current elevated anomaly band with minor realistic jitter
  const targetTorque = isAnomaly ? base.torque + 2.0 + slowWave * 0.3 : base.torque + slowWave * 0.4;
  const torqueKftLb = +(lastPoint.torqueKftLb * 0.85 + targetTorque * 0.15 + noiseSeed * 0.15).toFixed(1);

  // ROP slightly responsive to torque
  const targetRop = isAnomaly ? base.rop - 1.4 + slowWave * 0.3 : base.rop + slowWave * 0.5;
  const ropMh = +(lastPoint.ropMh * 0.85 + targetRop * 0.15 + noiseSeed * 0.2).toFixed(1);

  // SPP slightly responsive
  const targetSpp = isAnomaly ? base.spp + 115 + slowWave * 15 : base.spp + slowWave * 20;
  const sppPsi = Math.round(lastPoint.sppPsi * 0.85 + targetSpp * 0.15 + noiseSeed * 8);

  // WOB & RPM
  const wobKlbf = +(base.wob + slowWave * 0.4 + noiseSeed * 0.2).toFixed(1);
  const rpm = Math.round(base.rpm + slowWave * 2 + noiseSeed * 2);
  const flowRateGpm = Math.round(base.flowRate + slowWave * 3);
  const mudWeightPpg = base.mudWeight;
  const ecdPpg = +(mudWeightPpg + 0.55 + (isAnomaly ? 0.12 : 0)).toFixed(2);
  const gasPct = +(base.gas + (isAnomaly ? 0.4 : 0) + noiseSeed * 0.04).toFixed(2);

  // Depth progresses smoothly
  const depthM = +(lastPoint.depthM + 0.05).toFixed(1);

  return {
    timestamp: now,
    timeLabel,
    minuteLabel,
    depthM,
    ropMh: Math.max(1, ropMh),
    wobKlbf: Math.max(5, wobKlbf),
    rpm: Math.max(20, rpm),
    torqueKftLb: Math.max(2, torqueKftLb),
    flowRateGpm: Math.max(100, flowRateGpm),
    sppPsi: Math.max(500, sppPsi),
    mudWeightPpg,
    ecdPpg,
    gasPct: Math.max(0.1, gasPct),
    drillingState: "DRILLING",
    isAnomalyPoint: isAnomaly,
  };
}

/**
 * Get explainable early warning signals for the selected well
 */
export function getEarlyWarningSignals(
  well: Well,
  currentPoint: LiveTelemetryPoint
): EarlyWarningSignal[] {
  const base = getWellBaselineParameters(well);
  const risk = well.riskScore || 65;

  const torqueElevated = currentPoint.torqueKftLb > base.torque * 1.08;
  const sppElevated = currentPoint.sppPsi > base.spp + 80;
  const flowDrop = currentPoint.flowRateGpm < base.flowRate - 25;
  const ropAnomaly = currentPoint.ropMh < base.rop * 0.85;

  const offsetWell = well.similarWells?.[0]?.name || "NHK-119";

  return [
    {
      id: "signal-torque",
      name: "TORQUE ANOMALY",
      status: torqueElevated ? "WATCH" : "NORMAL",
      signalStrengthPct: torqueElevated ? (risk > 70 ? 76 : 64) : 24,
      parameterKey: "torque",
      currentValue: currentPoint.torqueKftLb,
      baselineValue: base.torque,
      unit: "kft-lb",
      detectedTimeAgo: "11 min ago",
      reason: torqueElevated
        ? `Torque is elevated ~${Math.round(((currentPoint.torqueKftLb - base.torque) / base.torque) * 100)}% relative to the recent baseline (${base.torque} kft-lb).`
        : "Torque variations remain within normal operational envelope.",
      historicalOffsetWellId: offsetWell,
      explanation: `Historical offset well ${offsetWell} recorded elevated torque and stick-slip patterns between ${Math.round(currentPoint.depthM - 80)}–${Math.round(currentPoint.depthM + 40)} m in ${base.formation}.`,
    },
    {
      id: "signal-mud-loss",
      name: "MUD LOSS PATTERN",
      status: flowDrop || (base.hasMudLossRisk && risk > 70) ? "WATCH" : "NORMAL",
      signalStrengthPct: flowDrop ? 68 : (base.hasMudLossRisk ? 48 : 18),
      parameterKey: "flowRate",
      currentValue: currentPoint.flowRateGpm,
      baselineValue: base.flowRate,
      unit: "gpm",
      detectedTimeAgo: "18 min ago",
      reason: flowDrop
        ? "Active return flow differential detected (-18 gpm vs surface pump strokes)."
        : `Mud return flow rate stable at ${currentPoint.flowRateGpm} gpm across the current formation interval.`,
      historicalOffsetWellId: offsetWell,
      explanation: `Nearby offsets encountered moderate seepage losses in permeable sand packages at similar measured depth.`,
    },
    {
      id: "signal-pressure",
      name: "PRESSURE BEHAVIOR",
      status: sppElevated ? "WATCH" : "NORMAL",
      signalStrengthPct: sppElevated ? 58 : 22,
      parameterKey: "spp",
      currentValue: currentPoint.sppPsi,
      baselineValue: base.spp,
      unit: "psi",
      detectedTimeAgo: "8 min ago",
      reason: sppElevated
        ? `SPP is elevated (+${currentPoint.sppPsi - base.spp} psi) relative to the circulating baseline.`
        : "Standpipe pressure is stable and consistent with drill string hydraulic model.",
      historicalOffsetWellId: offsetWell,
      explanation: "Annular loading and cuttings concentration may contribute to minor pressure rise; monitor shaker returns.",
    },
    {
      id: "signal-rop",
      name: "ROP DEVIATION",
      status: ropAnomaly ? "ADVISORY" : "NORMAL",
      signalStrengthPct: ropAnomaly ? 52 : 19,
      parameterKey: "rop",
      currentValue: currentPoint.ropMh,
      baselineValue: base.rop,
      unit: "m/h",
      detectedTimeAgo: "14 min ago",
      reason: ropAnomaly
        ? `ROP decreased by ~${Math.round(((base.rop - currentPoint.ropMh) / base.rop) * 100)}% during lithology transition.`
        : `Drilling rate steady at ${currentPoint.ropMh} m/h; good cutter efficiency maintained.`,
      historicalOffsetWellId: offsetWell,
      explanation: "Formation firmness increase or bit cutter wear progression historically noted in this interval.",
    },
  ];
}

/**
 * Generate "What changed in the last 30 minutes?" timeline
 */
export function getWhatChangedTimeline(
  well: Well,
  points: LiveTelemetryPoint[]
): WhatChangedItem[] {
  if (points.length < 5) return [];

  const now = points[points.length - 1];
  const p30 = points[Math.max(0, points.length - 30)] || points[0];
  const p20 = points[Math.max(0, points.length - 20)] || points[0];
  const p12 = points[Math.max(0, points.length - 12)] || points[0];
  const p5 = points[Math.max(0, points.length - 5)] || points[0];

  const torqueDelta = +(((now.torqueKftLb - p30.torqueKftLb) / (p30.torqueKftLb || 1)) * 100).toFixed(1);
  const ropDelta = +(((now.ropMh - p30.ropMh) / (p30.ropMh || 1)) * 100).toFixed(1);
  const sppDelta = +(((now.sppPsi - p30.sppPsi) / (p30.sppPsi || 1)) * 100).toFixed(1);

  return [
    {
      id: "ev-torque-up",
      timestampMs: p20.timestamp,
      timestampLabel: p20.minuteLabel,
      relativeTime: "20 min ago",
      parameter: "torque",
      parameterName: "Torque",
      changeSummary: "Torque increased",
      deltaValue: `+${Math.abs(torqueDelta > 0 ? torqueDelta : 9.2)}%`,
      deltaPercent: Math.abs(torqueDelta > 0 ? torqueDelta : 9.2),
      direction: "up",
      severity: "medium",
      currentValueFormatted: `${now.torqueKftLb} kft-lb`,
      baselineValueFormatted: `${p30.torqueKftLb} kft-lb`,
    },
    {
      id: "ev-rop-down",
      timestampMs: p12.timestamp,
      timestampLabel: p12.minuteLabel,
      relativeTime: "12 min ago",
      parameter: "rop",
      parameterName: "ROP",
      changeSummary: "ROP decreased",
      deltaValue: `-${Math.abs(ropDelta < 0 ? Math.abs(ropDelta) : 13.8)}%`,
      deltaPercent: Math.abs(ropDelta < 0 ? Math.abs(ropDelta) : 13.8),
      direction: "down",
      severity: "medium",
      currentValueFormatted: `${now.ropMh} m/h`,
      baselineValueFormatted: `${p30.ropMh} m/h`,
    },
    {
      id: "ev-spp-up",
      timestampMs: p5.timestamp,
      timestampLabel: p5.minuteLabel,
      relativeTime: "5 min ago",
      parameter: "spp",
      parameterName: "SPP",
      changeSummary: "SPP increased",
      deltaValue: `+${Math.abs(sppDelta > 0 ? sppDelta : 4.8)}%`,
      deltaPercent: Math.abs(sppDelta > 0 ? sppDelta : 4.8),
      direction: "up",
      severity: "low",
      currentValueFormatted: `${now.sppPsi} psi`,
      baselineValueFormatted: `${p30.sppPsi} psi`,
    },
    {
      id: "ev-flow-stable",
      timestampMs: now.timestamp,
      timestampLabel: now.minuteLabel,
      relativeTime: "Just now",
      parameter: "flowRate",
      parameterName: "Flow Rate",
      changeSummary: "Mud flow stabilized",
      deltaValue: "±0.5%",
      deltaPercent: 0.5,
      direction: "neutral",
      severity: "low",
      currentValueFormatted: `${now.flowRateGpm} gpm`,
      baselineValueFormatted: `${p30.flowRateGpm} gpm`,
    },
  ];
}

/**
 * Get Depth-Aware Event Track items from 0m to Target TD
 */
export function getDepthEvents(well: Well, currentDepthM: number): DepthEvent[] {
  const strat = getWellStratigraphy(well);
  const td = well.depthM || 3240;
  const events: DepthEvent[] = [];

  // Surface
  events.push({
    depthM: 0,
    title: "SURFACE",
    type: "surface",
    description: "Rotary Kelly Bushing (RKB) elevation 112 m MSL",
  });

  // Stratigraphy Tops
  strat.forEach((s) => {
    if (s.topDepthM > 0) {
      events.push({
        depthM: s.topDepthM,
        title: `${s.name} Top`,
        type: "formation",
        description: s.lithology,
        source: "Stratigraphic Prognosis",
      });
    }
  });

  // Historical Offset Incidents (from well.events & similar offset wells)
  if (well.events && well.events.length > 0) {
    well.events.forEach((ev) => {
      events.push({
        depthM: ev.depthM,
        title: ev.event,
        type: "hazard",
        severity: ev.severity,
        description: `Historically recorded in offset offset corridor: ${ev.event}`,
        source: `Offset Well ${well.similarWells?.[0]?.name || "NHK-119"}`,
        isOffsetIncident: true,
        offsetWellName: well.similarWells?.[0]?.name || "NHK-119",
      });
    });
  } else {
    // Default realistic offset events
    events.push({
      depthM: Math.round(td * 0.94),
      title: "Historical Torque Anomaly",
      type: "hazard",
      severity: "medium",
      description: "Stick-slip and elevated rotary torque reported in offset NHK-119",
      source: "Offset NHK-119 DDR",
      isOffsetIncident: true,
      offsetWellName: "NHK-119",
    });
    events.push({
      depthM: Math.round(td * 0.96),
      title: "Lost Circulation History (120 bbl)",
      type: "hazard",
      severity: "high",
      description: "Severe seepage into permeable sandstone package in offset NHK-119",
      source: "Offset NHK-119 Mud Recap",
      isOffsetIncident: true,
      offsetWellName: "NHK-119",
    });
  }

  // Casing Shoe
  const casingShoeDepth = Math.round(td * 0.78);
  events.push({
    depthM: casingShoeDepth,
    title: `9-5/8" Intermediate Casing Shoe`,
    type: "casing",
    description: "Cemented to 450 m; LOT FIT test 14.8 ppg EMW",
    source: "Casing Tally Record",
  });

  // Current Bit Depth
  events.push({
    depthM: currentDepthM,
    title: "CURRENT BIT DEPTH",
    type: "current",
    description: `Active drilling at ${currentDepthM} m in ${well.formation || "Jurassic T13"}`,
  });

  // Target TD
  events.push({
    depthM: td,
    title: "TARGET TOTAL DEPTH (TD)",
    type: "target",
    description: `Planned Section TD ${td} m MD`,
  });

  // Sort ascending by depth
  return events.sort((a, b) => a.depthM - b.depthM);
}

/**
 * Get operational context data
 */
export function getOperationalContext(
  well: Well,
  currentPoint: LiveTelemetryPoint
): OperationalContextData {
  const targetTd = well.depthM || 3240;
  const bitDepthM = currentPoint.depthM;
  const remainingM = Math.max(0, +(targetTd - bitDepthM).toFixed(1));
  const progressPercent = Math.min(100, +((bitDepthM / targetTd) * 100).toFixed(1));

  return {
    activity: "DRILLING AHEAD",
    drillingState: currentPoint.drillingState,
    holeSection: '8½"',
    formation: well.formation || "Jurassic T13",
    bitDepthM,
    targetTdM: targetTd,
    remainingM,
    progressPercent,
    bitModel: "Synthetic Bit #B-17 (PDC 5-Blade Matrix)",
    bitNo: "B-17",
    elapsedDrilling: "6h 24m",
    pumpStatus: "ACTIVE (2 Triplex Pumps)",
    circulationStatus: "STABLE",
    pumpStrokesSpm: 114,
    rotaryTableRpm: currentPoint.rpm,
    tripTankLevelBbl: 42.5,
  };
}

/**
 * Get chronological active alerts list
 */
export function getActiveAlerts(
  well: Well,
  currentPoint: LiveTelemetryPoint
): ActiveAlertItem[] {
  const offsetId = well.similarWells?.[0]?.name || "NHK-119";
  const base = getWellBaselineParameters(well);

  return [
    {
      id: "alt-1",
      severity: "WATCH",
      title: "Torque Anomaly Detected",
      timestampAgo: "11 min ago",
      explanation: `Torque is approximately ${Math.round(((currentPoint.torqueKftLb - base.torque) / base.torque) * 100)}% above recent baseline (${base.torque} kft-lb).`,
      context: `Active Bit Depth: ${currentPoint.depthM} m · Sandstone Lithology Transition`,
      parameterKey: "torque",
    },
    {
      id: "alt-2",
      severity: "INFO",
      title: "Depth Milestone Passed",
      timestampAgo: "24 min ago",
      explanation: `Current depth crossed ${Math.round(currentPoint.depthM - 30)} m mark with steady penetration.`,
      context: `Section Progress: ${Math.round((currentPoint.depthM / (well.depthM || 3240)) * 100)}% of TD`,
    },
    {
      id: "alt-3",
      severity: "HISTORICAL",
      title: "Offset Evidence Proximity Match",
      timestampAgo: "32 min ago",
      explanation: `Current depth overlaps historical torque anomaly interval reported in offset ${offsetId} between 3,050–3,200 m.`,
      context: `Offset Proximity: ${well.similarWells?.[0]?.matchPercent || 92}% geological correlation match`,
      parameterKey: "torque",
    },
  ];
}
