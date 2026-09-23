import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load catalog safely with fallback mechanisms
function getWellsCatalog() {
  try {
    const primaryPath = path.join(process.cwd(), 'data', 'real_india_wells.json');
    if (fs.existsSync(primaryPath)) {
      return JSON.parse(fs.readFileSync(primaryPath, 'utf8'));
    }
    const secondaryPath = path.join(process.cwd(), 'src', 'data', 'real_india_wells.json');
    if (fs.existsSync(secondaryPath)) {
      return JSON.parse(fs.readFileSync(secondaryPath, 'utf8'));
    }
  } catch (err) {
    console.error('Failed reading real_india_wells.json from disk:', err);
  }
  // Embedded fallback in case disk read encounters serverless packaging limits
  return [
    {
      well_id: "OIL-BGN-05",
      name: "Baghjan-5 (Blowout Precedent)",
      basin: "Assam-Arakan",
      field: "Baghjan",
      well_type: "Vertical",
      latitude: 27.59626,
      longitude: 95.38042,
      tvd_m: 3871.0,
      tops: { Tipam: 2144, Barail: 2401, Kopili: 3178, Prang: 3541, Narpuh: 3632, Lakadong_Therria: 3720, Langpar: 3847, Basement: 3898 },
      incidents: [
        {
          type: "KICK",
          depth: 3870,
          severity: "CRITICAL",
          narrative: "B-Annulus pressure surged to 4400 psi during Langpar workover, causing uncontrolled blowout.",
          mitigation: "Dynamic kill modeling, heavy brine weighting (11.6 ppg+), and relief well intercept planning."
        }
      ]
    },
    {
      well_id: "OIL-BGN-01",
      name: "Baghjan-1",
      basin: "Assam-Arakan",
      field: "Baghjan",
      well_type: "Vertical",
      latitude: 27.58910,
      longitude: 95.37280,
      tvd_m: 3844.0,
      tops: { Tipam: 2050, Barail: 2357, Kopili: 3099, Prang: 3413, Narpuh: 3466, Lakadong_Therria: 3576, Langpar: 3736, Basement: 3844 },
      incidents: [
        {
          type: "MUD_LOSS",
          depth: 2050,
          severity: "HIGH",
          narrative: "Complete mud circulation loss in coarse Tipam sandstone. Fluid level dropped below flowline.",
          mitigation: "Pumped 45 bbl medium-coarse Calcium Carbonate and mica LCM pill; reduced pump rate to 350 gpm."
        }
      ]
    },
    {
      well_id: "OIL-BLM-01",
      name: "Balimara-1",
      basin: "Assam-Arakan",
      field: "Balimara",
      well_type: "Vertical",
      latitude: 27.35500,
      longitude: 95.40500,
      tvd_m: 4571.0,
      tops: { Girujan: 1747, Tipam: 2862, Barail_Argillaceous: 3706, Barail_Arenaceous: 4032, Kopili: 4571 },
      incidents: [
        {
          type: "STUCK_PIPE",
          depth: 4032,
          severity: "HIGH",
          narrative: "Differential sticking in depleted Barail Arenaceous sandstone while making connection.",
          mitigation: "Spotted 40 bbl low-density organic surfactant freeing pill; worked string with 75 klbs jar overpull."
        }
      ]
    },
    {
      well_id: "OIL-LKW-01",
      name: "Lakwagaon-1",
      basin: "Assam-Arakan",
      field: "Lakwagaon (Moran)",
      well_type: "Directional",
      latitude: 27.32000,
      longitude: 94.95000,
      tvd_m: 4426.0,
      tops: { Namsang: 1637, Girujan: 2360, Tipam: 2568, Barail: 3238, Kopili: 3713, Prang: 4197, Narpuh: 4257, Lakadong_Therria: 4304, Langpar: 4373, Basement: 4426 },
      incidents: [
        {
          type: "WELLBORE_INSTABILITY",
          depth: 3713,
          severity: "HIGH",
          narrative: "Severe splintery shale breakout and hole pack-off at Kopili boundary. Torque spiked to 32 kNm.",
          mitigation: "Dosed active mud pits with 4% Cloud Point Glycol and 2% Polyamine shale inhibitor; back-reamed hole."
        }
      ]
    },
    {
      well_id: "OIL-NDBN-301",
      name: "NDBN Location 301",
      basin: "Assam-Arakan",
      field: "Dumduma / Hugrijan",
      well_type: "Exploratory",
      latitude: 27.449117,
      longitude: 95.506053,
      tvd_m: 3950.0,
      tops: { Tipam: 2100, Barail: 2650, Kopili: 3320, Basement: 3950 },
      incidents: []
    },
    {
      well_id: "OIL-NDBN-308",
      name: "NDBN Location 308",
      basin: "Assam-Arakan",
      field: "Naharkatiya",
      well_type: "Development",
      latitude: 27.421167,
      longitude: 95.237844,
      tvd_m: 3750.0,
      tops: { Tipam: 1950, Barail: 2550, Kopili: 3200, Basement: 3750 },
      incidents: []
    },
    {
      well_id: "ONGC-ANK-14",
      name: "ONGC Ankleshwar-14",
      basin: "Cambay",
      field: "Ankleshwar",
      well_type: "Vertical",
      latitude: 21.6250,
      longitude: 73.0120,
      tvd_m: 2200.0,
      tops: { Ankleshwar_Sand: 1150, Cambay_Shale: 1650 },
      incidents: [
        {
          type: "WELLBORE_INSTABILITY",
          depth: 1720,
          severity: "HIGH",
          narrative: "Severe shale sloughing and pack-off in Cambay Shale.",
          mitigation: "Increased mud weight to 1.40 SG; optimized hole cleaning with high-viscosity polymer sweeps."
        }
      ]
    }
  ];
}

const HAZARD_METADATA = {
  KICK: {
    label: "Gas / Kick & Blowout Risk",
    description: "Abnormal formation pressure influx causing well control incident",
    color: "#ef4444"
  },
  MUD_LOSS: {
    label: "Circulation & Mud Loss",
    description: "Partial or complete mud loss in depleted sandstones or fractured intervals",
    color: "#f59e0b"
  },
  STUCK_PIPE: {
    label: "Differential Stuck Pipe",
    description: "Overbalanced drilling differential sticking or mechanical key-seating",
    color: "#f97316"
  },
  WELLBORE_INSTABILITY: {
    label: "Shale Swelling & Pack-Off",
    description: "Reactive splintery shale sloughing, tight hole, and borehole collapse",
    color: "#a855f7"
  }
};

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371.0;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// GET: Returns the full real wells catalog with basin statistics
export async function GET() {
  try {
    const catalog = getWellsCatalog();
    const totalWells = catalog.length;
    const incidents = catalog.flatMap((w) =>
      (w.incidents || []).map((inc) => ({
        ...inc,
        well_id: w.well_id,
        well_name: w.name || w.well_id,
        field: w.field,
        basin: w.basin
      }))
    );

    const hazardsByType = {
      KICK: incidents.filter((i) => i.type === "KICK").length,
      MUD_LOSS: incidents.filter((i) => i.type === "MUD_LOSS").length,
      STUCK_PIPE: incidents.filter((i) => i.type === "STUCK_PIPE").length,
      WELLBORE_INSTABILITY: incidents.filter((i) => i.type === "WELLBORE_INSTABILITY").length
    };

    return NextResponse.json({
      status: 'success',
      total_wells: totalWells,
      total_incidents: incidents.length,
      hazards_summary: hazardsByType,
      wells: catalog
    });
  } catch (err) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// POST: ML-based look-ahead hazard analysis & offset well similarity (OWSS)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      latitude,
      longitude,
      target_tvd = 3870,
      target_formation = 'Langpar',
      well_type = 'Directional',
      search_radius_km = 80.0
    } = body;

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { status: 'error', message: 'latitude and longitude are required' },
        { status: 400 }
      );
    }

    const wellsCatalog = getWellsCatalog();

    let candidates = [];
    let rawRisks = {
      KICK: 0.05,
      MUD_LOSS: 0.05,
      STUCK_PIPE: 0.05,
      WELLBORE_INSTABILITY: 0.05
    };
    let activeIncidents = [];

    // Find closest distance first to calibrate search radius
    let minDistance = Infinity;
    wellsCatalog.forEach((well) => {
      const dist = haversine(latitude, longitude, well.latitude, well.longitude);
      if (dist < minDistance) minDistance = dist;
    });

    // Expand search radius if user clicked in a basin with wells further out
    const effectiveRadius = Math.max(search_radius_km, minDistance <= 300 ? minDistance + 25 : search_radius_km);

    wellsCatalog.forEach((well) => {
      const dist = haversine(latitude, longitude, well.latitude, well.longitude);
      if (dist > effectiveRadius) return;

      // Multi-factor OWSS formula (Normalized 0.0 to 1.0)
      const s_geo = Math.exp(-dist / 22.0);
      const s_depth = Math.max(0.0, 1.0 - Math.abs(target_tvd - well.tvd_m) / 1200.0);
      const wellTops = Object.keys(well.tops || {}).map((k) => k.toLowerCase());
      const s_strat = wellTops.some((t) => t.includes(target_formation.toLowerCase()))
        ? 1.0
        : 0.45;
      const s_traj = well.well_type.toLowerCase().includes(well_type.toLowerCase()) ? 1.0 : 0.65;

      const owss = 0.40 * s_geo + 0.30 * s_strat + 0.20 * s_depth + 0.10 * s_traj;

      // 350m Look-ahead hazard scan with proximity & depth decay
      (well.incidents || []).forEach((inc) => {
        const depthDelta = Math.abs(target_tvd - inc.depth);
        const severityMultiplier =
          inc.severity === 'CRITICAL' ? 1.0 : inc.severity === 'HIGH' ? 0.85 : 0.60;

        // Direct look-ahead hazard within 350m
        if (depthDelta <= 350.0) {
          const depthWeight = 1.0 - depthDelta / 350.0;
          const proximityWeight = Math.max(0.1, 1.0 - dist / effectiveRadius);
          const riskIncrement = severityMultiplier * (0.50 * proximityWeight + 0.50 * depthWeight) * 0.90;

          if (rawRisks[inc.type] !== undefined) {
            rawRisks[inc.type] = Math.min(0.98, rawRisks[inc.type] + riskIncrement);
          }

          activeIncidents.push({
            offset_well: well.well_id,
            name: well.name || well.well_id,
            field: well.field,
            basin: well.basin,
            hazard: inc.type,
            severity: inc.severity,
            depth_m: inc.depth,
            depth_delta_m: Math.round(depthDelta),
            distance_km: parseFloat(dist.toFixed(2)),
            narrative: inc.narrative,
            mitigation: inc.mitigation
          });
        } else if (dist <= 30.0) {
          // Basin background precedent factor
          const basinFactor = 0.12 * (1.0 - dist / 30.0) * severityMultiplier;
          if (rawRisks[inc.type] !== undefined) {
            rawRisks[inc.type] = Math.min(0.95, rawRisks[inc.type] + basinFactor);
          }
        }
      });

      candidates.push({
        well_id: well.well_id,
        name: well.name || well.well_id,
        field: well.field,
        basin: well.basin,
        well_type: well.well_type,
        latitude: well.latitude,
        longitude: well.longitude,
        distance_km: parseFloat(dist.toFixed(2)),
        relevance_score: parseFloat(owss.toFixed(3)),
        tvd_m: well.tvd_m,
        tops: well.tops,
        incidents: well.incidents || []
      });
    });

    candidates.sort((a, b) => b.relevance_score - a.relevance_score);
    activeIncidents.sort((a, b) => {
      const sevOrder = { CRITICAL: 0, HIGH: 1, MODERATE: 2, LOW: 3 };
      const sevA = sevOrder[a.severity] ?? 9;
      const sevB = sevOrder[b.severity] ?? 9;
      if (sevA !== sevB) return sevA - sevB;
      return a.depth_delta_m - b.depth_delta_m;
    });

    // Determine primary hazard
    const primary_hazard = Object.keys(rawRisks).reduce((a, b) => (rawRisks[a] > rawRisks[b] ? a : b));
    const hazard_score = parseFloat(rawRisks[primary_hazard].toFixed(2));
    const hazard_level =
      hazard_score > 0.65 ? 'CRITICAL' : hazard_score > 0.40 ? 'HIGH' : hazard_score > 0.20 ? 'MODERATE' : 'LOW';

    // Detailed multi-hazard risk breakdown
    const all_risks = {};
    Object.keys(rawRisks).forEach((hKey) => {
      const score = parseFloat(rawRisks[hKey].toFixed(2));
      const level =
        score > 0.65 ? 'CRITICAL' : score > 0.40 ? 'HIGH' : score > 0.20 ? 'MODERATE' : 'LOW';
      all_risks[hKey] = {
        score,
        percentage: Math.round(score * 100),
        level,
        label: HAZARD_METADATA[hKey]?.label || hKey,
        description: HAZARD_METADATA[hKey]?.description || '',
        color: HAZARD_METADATA[hKey]?.color || '#38bdf8',
        incidents_count: activeIncidents.filter((i) => i.hazard === hKey).length
      };
    });

    return NextResponse.json({
      status: 'success',
      target: {
        latitude,
        longitude,
        target_tvd,
        target_formation,
        well_type
      },
      primary_hazard,
      hazard_score,
      hazard_percentage: Math.round(hazard_score * 100),
      hazard_level,
      hazard_metadata: HAZARD_METADATA[primary_hazard],
      all_risks,
      candidate_offsets: candidates.slice(0, 5),
      surfaced_incidents: activeIncidents,
      all_catalog_wells: wellsCatalog.map((w) => ({
        well_id: w.well_id,
        name: w.name || w.well_id,
        field: w.field,
        basin: w.basin,
        latitude: w.latitude,
        longitude: w.longitude,
        tvd_m: w.tvd_m,
        well_type: w.well_type,
        primary_incident: (w.incidents && w.incidents[0]) || null,
        total_incidents: (w.incidents || []).length
      }))
    });
  } catch (err) {
    console.error('API Error in /api/predict-well-risk:', err);
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
