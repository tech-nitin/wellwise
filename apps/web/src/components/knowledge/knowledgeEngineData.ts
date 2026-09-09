import { SYNTHETIC_WELLS, Well } from "@/components/dashboard/data/wells";
import {
  KnowledgeAnswer,
  KnowledgeEvidenceItem,
  DocumentRepositoryItem,
  RecentInvestigationItem,
  KnowledgeFilterState,
} from "./types";

export const SUGGESTED_QUESTIONS = [
  "What drilling problems were reported around 3,000–3,200 m in nearby wells?",
  "What problems occurred around the current depth (3,180 m)?",
  "Which nearby wells experienced torque and stick-slip issues?",
  "What historical mud-loss events occurred in this formation?",
  "What mitigation practices were used in similar wells?",
  "What happened in NHK-119 around 3,120 m?",
];

export const INITIAL_RECENT_INVESTIGATIONS: RecentInvestigationItem[] = [
  {
    id: "rec-1",
    query: "What drilling problems were reported around 3,000–3,200 m in nearby wells?",
    timestampLabel: "Today · 11:45",
    wellId: "NHK-124",
    topic: "Torque & Interval Transition",
  },
  {
    id: "rec-2",
    query: "Which offset wells had torque and stick-slip issues in Jurassic T13?",
    timestampLabel: "Today · 10:15",
    wellId: "NHK-124",
    topic: "Rotary Torque",
  },
  {
    id: "rec-3",
    query: "Historical mud-loss events and bridging pill recaps in Nahorkatiya",
    timestampLabel: "Yesterday",
    wellId: "NHK-124",
    topic: "Lost Circulation",
  },
  {
    id: "rec-4",
    query: "Differential sticking incidents during long survey stops in porous sand",
    timestampLabel: "03-Mar-2025",
    wellId: "NHK-119",
    topic: "Stuck Pipe",
  },
];

/**
 * Generate evidence records for a given well and topic
 */
export function getKnowledgeEvidenceItems(well: Well, topic = "torque"): KnowledgeEvidenceItem[] {
  const offset1 = well.similarWells?.[0]?.name || "NHK-119";
  const offset2 = well.similarWells?.[1]?.name || "NHK-121";
  const offset3 = well.similarWells?.[2]?.name || "NHK-127";
  const depth = well.depthM || 3240;
  const currentDepth = Math.round(depth - 60);
  const formation = well.formation || "Jurassic T13";

  return [
    {
      id: "ev-01",
      sourceType: "Daily Drilling Report",
      documentTitle: `DDR_OIL_${offset1}_20241112.pdf`,
      offsetWellId: offset1,
      offsetWellName: `Offset Well ${offset1}`,
      depthIntervalM: `${currentDepth - 60}–${currentDepth} m`,
      formation: formation,
      eventSummary: "Torque increase followed by restricted rotary response and stick-slip vibrations.",
      relevanceScore: 94,
      relevanceLevel: "HIGH",
      matchLevel: "STRONG",
      dateLogged: "12-Nov-2024",
      highlightedPhrase: "rotary torque escalated from 14.5 to 18.8 kft-lb with stick-slip vibrations",
      snippetExcerpt:
        "At 3,120 m MD, rotary torque escalated from 14.5 to 18.8 kft-lb with stick-slip vibrations while penetrating the porous upper sand unit. Drill string showed 25 klbf overpull on connection. Pumped 80 bbl lubricant sweep and reduced rotary speed.",
      mitigationReferenced: "Pumped 2% liquid lubricant sweep pill, reduced RPM from 120 to 85, conducted 5-stand wiper sweep.",
      extractedEntities: [
        { label: "Well", value: offset1, category: "well" },
        { label: "Depth", value: "3,120 m", category: "depth" },
        { label: "Event", value: "Torque Anomaly / Stick-Slip", category: "event" },
        { label: "Formation", value: formation, category: "formation" },
        { label: "Torque Ramp", value: "14.5 → 18.8 kft-lb", category: "parameter" },
        { label: "Mitigation", value: "Lubricant sweep & RPM reduction", category: "mitigation" },
      ],
    },
    {
      id: "ev-02",
      sourceType: "Mud Engineer Recap",
      documentTitle: `MER_OIL_${offset1}_SEC3.pdf`,
      offsetWellId: offset1,
      offsetWellName: `Offset Well ${offset1}`,
      depthIntervalM: `${currentDepth - 80}–${currentDepth - 20} m`,
      formation: formation,
      eventSummary: "Annular cuttings accumulation and ECD elevation in target sandstone package.",
      relevanceScore: 89,
      relevanceLevel: "HIGH",
      matchLevel: "STRONG",
      dateLogged: "15-Nov-2024",
      highlightedPhrase: "ECD elevated to 11.87 ppg due to cuttings accumulation in annulus",
      snippetExcerpt:
        "ECD elevated to 11.87 ppg due to cuttings accumulation in annulus. Standpipe pressure climbed +140 psi over clean hole baseline. Increased flow rate from 420 to 510 gpm and circulated bottoms-up before pulling off bottom.",
      mitigationReferenced: "High-viscosity sweep pill (30 bbl), extended bottoms-up circulation for 45 minutes.",
      extractedEntities: [
        { label: "Well", value: offset1, category: "well" },
        { label: "Depth", value: "3,100 m", category: "depth" },
        { label: "Event", value: "Annular Loading & ECD Ramp", category: "event" },
        { label: "ECD Peak", value: "11.87 ppg", category: "parameter" },
        { label: "SPP Delta", value: "+140 psi", category: "parameter" },
        { label: "Mitigation", value: "Hi-vis sweep & extended circulation", category: "mitigation" },
      ],
    },
    {
      id: "ev-03",
      sourceType: "Incident Report",
      documentTitle: `INC_OIL_${offset3}_LOST_CIRC.pdf`,
      offsetWellId: offset3,
      offsetWellName: `Offset Well ${offset3}`,
      depthIntervalM: `${currentDepth - 20}–${currentDepth + 40} m`,
      formation: "Tipam / Jurassic Contact",
      eventSummary: "Partial lost-circulation (120 bbl) into sub-hydrostatic permeable sandstone.",
      relevanceScore: 84,
      relevanceLevel: "HIGH",
      matchLevel: "STRONG",
      dateLogged: "08-Oct-2024",
      highlightedPhrase: "total mud loss rate reached 35 bbl/hr upon penetrating depleted fracture zone",
      snippetExcerpt:
        "At 3,180 m MD, total mud loss rate reached 35 bbl/hr upon penetrating depleted fracture zone. Pumps throttled immediately to 350 gpm. Mixed and spotted 60 bbl medium-grade calcium carbonate (CaCO3) bridging pill.",
      mitigationReferenced: "60 bbl calcium carbonate bridging pill, reduced annular flow velocity by 25%.",
      extractedEntities: [
        { label: "Well", value: offset3, category: "well" },
        { label: "Depth", value: "3,180 m", category: "depth" },
        { label: "Event", value: "Partial Lost Circulation (120 bbl)", category: "event" },
        { label: "Loss Rate", value: "35 bbl/hr", category: "parameter" },
        { label: "Mitigation", value: "CaCO3 bridging pill & throttled pumps", category: "mitigation" },
      ],
    },
    {
      id: "ev-04",
      sourceType: "Lessons Learned",
      documentTitle: `LESSONS_LEARNED_${offset2}_04.pdf`,
      offsetWellId: offset2,
      offsetWellName: `Offset Well ${offset2}`,
      depthIntervalM: `${currentDepth - 40}–${currentDepth + 20} m`,
      formation: formation,
      eventSummary: "Differential sticking prevention and connection time management protocol.",
      relevanceScore: 81,
      relevanceLevel: "MEDIUM",
      matchLevel: "MODERATE",
      dateLogged: "18-Dec-2024",
      highlightedPhrase: "restricted connection stationary time to under 3.5 minutes",
      snippetExcerpt:
        "Across the permeable sand package between 3,090–3,210 m, restricted connection stationary time to under 3.5 minutes. Mandated continuous pipe reciprocation and rotation during MWD directional surveys.",
      mitigationReferenced: "Continuous drillstring rotation, 3-minute max connection stationary limit.",
      extractedEntities: [
        { label: "Well", value: offset2, category: "well" },
        { label: "Depth", value: "3,090 m", category: "depth" },
        { label: "Event", value: "Differential Sticking Precursor", category: "event" },
        { label: "Mitigation", value: "Max 3.5 min connection limit & continuous rotation", category: "mitigation" },
      ],
    },
    {
      id: "ev-05",
      sourceType: "End of Well Report",
      documentTitle: `EOWR_OIL_${well.regionId || "ASSAM"}_SYNTHESIS.pdf`,
      offsetWellId: "Regional Synthesis",
      offsetWellName: `${well.basin || "Regional"} Synthesis`,
      depthIntervalM: `${Math.round(depth * 0.9)}–${depth} m`,
      formation: formation,
      eventSummary: "Stratigraphic Pay Zone Transition & Overpressure Boundary Characteristics.",
      relevanceScore: 78,
      relevanceLevel: "MEDIUM",
      matchLevel: "MODERATE",
      dateLogged: "02-Jan-2025",
      highlightedPhrase: "formation boundary marks a compaction transition with localized friction escalation",
      snippetExcerpt:
        "The Jurassic T13 sandstone boundary marks a compaction transition with localized friction escalation. Historical offsets in this concession block consistently demonstrate torque escalation and micro-fracture loss risks.",
      mitigationReferenced: "Staged choke adjustments and continuous torque-drag monitoring protocol.",
      extractedEntities: [
        { label: "Well", value: "Regional Offset Synthesis", category: "well" },
        { label: "Depth", value: "3,050–3,240 m", category: "depth" },
        { label: "Event", value: "Stratigraphic Compaction Transition", category: "event" },
        { label: "Mitigation", value: "Staged choke adjustment & real-time monitoring", category: "mitigation" },
      ],
    },
  ];
}

/**
 * Generate comprehensive RAG answer for any user question
 */
export function generateKnowledgeAnswer(well: Well, query: string): KnowledgeAnswer {
  const qLower = query.toLowerCase();
  const offset1 = well.similarWells?.[0]?.name || "NHK-119";
  const offset2 = well.similarWells?.[1]?.name || "NHK-121";
  const offset3 = well.similarWells?.[2]?.name || "NHK-127";
  const depth = well.depthM || 3240;
  const currentDepth = Math.round(depth - 60);
  const formation = well.formation || "Jurassic T13";

  const allEvidence = getKnowledgeEvidenceItems(well);

  let directAnswer = "";
  let keyFindings: string[] = [];
  let historicalResponse = "";
  let historicalOutcome = "";
  let investigateNext: string[] = [];

  if (qLower.includes("loss") || qLower.includes("mud") || qLower.includes("circulation")) {
    directAnswer = `Historical drilling records from 3 nearby offset wells indicate partial lost circulation events in the permeable sand interval between 3,080–3,220 m. In well ${offset3}, seepage reached 35 bbl/hr at 3,180 m upon entering a sub-hydrostatic depleted sandstone lens. Calcium carbonate (CaCO3) bridging sweeps successfully restored full circulation.`;
    keyFindings = [
      `Circulation losses of 120 bbl occurred in ${offset3} at 3,180 m into depleted sand lens [Evidence 03].`,
      `Active mud weight of 11.2 ppg creates approximately +0.65 ppg overbalance across permeable pay zones.`,
      `Losses were successfully arrested in 2 offset wells using coarse 60–80 bbl CaCO3 bridging pills [Evidence 01, 03].`,
      `No total loss of returns occurred when pump rates were throttled to under 480 gpm during initial entry.`,
    ];
    historicalResponse = "Pumps throttled to 350 gpm; spotted 60 bbl calcium carbonate bridging pill with 4 hours soak time.";
    historicalOutcome = "Full returns restored with zero additional NPT recorded through section TD.";
    investigateNext = [
      `Inspect reserve pit LCM inventory and ensure 80 bbl CaCO3 pill is pre-mixed on rig site`,
      `Review trip tank volume trends on connection sequences across ${currentDepth} m`,
      `Compare current pump flow rate (420 gpm) against offset hydraulics thresholds`,
      `Check mud engineer recap for ${offset3} lost-circulation treatment recap`,
    ];
  } else if (qLower.includes("stuck") || qLower.includes("differential") || qLower.includes("drag")) {
    directAnswer = `Historical evidence shows elevated differential sticking risk across the ${formation} sandstone package between 3,090–3,210 m due to hydrostatic overbalance against permeable reservoir sand. In ${offset2}, drillstring overpull reached 25 klbf when stationary for directional survey stops exceeding 5 minutes.`;
    keyFindings = [
      `Offset well ${offset2} logged 25 klbf overpull after 6-minute stationary survey pause at 3,090 m [Evidence 04].`,
      `Filter cake thickness in permeable sand measured 2/32" requiring continuous string rotation during surveys.`,
      `Mandated operational protocol across offset corridor limited stationary connection time to under 3.5 minutes [Evidence 04].`,
      `Short wiper trips every 120 m of new hole eliminated tight spots and prevented mechanical sticking.`,
    ];
    historicalResponse = "Maintained continuous drillstring rotation and reciprocation; limited stationary survey stops to <3.5 min.";
    historicalOutcome = "Zero stuck pipe events occurred on subsequent wells adhering to connection time protocol.";
    investigateNext = [
      `Verify connection duration on current rig tally (currently averaging 4.2 min)`,
      `Review overpull trend on last 3 connections at ${currentDepth} m`,
      `Check mud cake thickness and liquid lubricant concentration in active system`,
      `Inspect BHA stabilizer gauge wear in ${offset2} BHA recap document`,
    ];
  } else {
    // Default: General problems around 3,000-3,200m / Torque & Drilling Response
    directAnswer = `Three nearby offset wells (${offset1}, ${offset2}, and ${offset3}) contain historical records of drilling difficulties within or near the 3,000–3,200 m interval. The most relevant records describe elevated rotary torque, stick-slip vibrations, annular cuttings loading, and one partial circulation-loss event. The strongest evidence matches occur in wells with identical ${formation} stratigraphic context.`;
    keyFindings = [
      `Torque increased significantly from 14.5 to 18.8 kft-lb around 3,120 m in ${offset1} with cyclic stick-slip [Evidence 01].`,
      `Annular loading caused ECD to ramp to 11.87 ppg and SPP to increase +140 psi in ${offset1} [Evidence 02].`,
      `Partial mud loss of 120 bbl was recorded at 3,180 m in ${offset3} during fast penetration [Evidence 03].`,
      `Controlled wiper trips and 2% lubricant sweeps restored smooth rotary response across all offset records.`,
    ];
    historicalResponse = "Reduced drilling aggressiveness (RPM 120 → 85), pumped 80 bbl lubricant pill, conducted 5-stand wiper sweep.";
    historicalOutcome = "Eliminated stick-slip vibrations and reduced NPT by 14 hours compared to unmitigated offset runs.";
    investigateNext = [
      `Compare current live torque (18.6 kft-lb) against ${offset1} historical escalation profile`,
      `Review wiper trip frequency and annular cuttings concentration at shaker screens`,
      `Inspect historical DDR for ${offset1} at 3,120 m depth interval`,
      `Verify standpipe circulating pressure trend (+119 psi) against clean hole model`,
    ];
  }

  return {
    query,
    directAnswer,
    keyFindings,
    depthContext: `Active Depth: ${currentDepth} m MD (Offset Match Interval: 3,050–3,220 m)`,
    formationContext: `Active Formation: ${formation} (Lithology: Glauconitic Quartz Sandstone with Shale)`,
    historicalPattern: "Elevated Torque + Declining ROP + Rising SPP in Permeable Sandstone",
    evidenceItems: allEvidence,
    offsetWellsCount: 3,
    evidenceRecordsCount: allEvidence.length,
    depthMatchLevel: "Strong",
    formationMatchLevel: "Strong",
    sourceTypes: ["Daily Drilling Report", "Mud Engineer Recap", "Incident Report", "Lessons Learned"],
    investigateNext,
    historicalResponse,
    historicalOutcome,
    mitigationUsedInWells: 2,
  };
}

/**
 * Knowledge Repository Indexed Documents Catalog
 */
export const KNOWLEDGE_REPOSITORY_DOCS: DocumentRepositoryItem[] = [
  {
    id: "doc-01",
    documentTitle: "DDR_OIL_NHK_119_20241112.pdf",
    wellId: "NHK-119",
    depthIntervalM: "3,060–3,180 m",
    type: "Daily Drilling Report",
    shortType: "DDR",
    status: "Indexed",
    eventsCount: 14,
    dateLogged: "12-Nov-2024",
    summary: "Rotary torque escalation from 14.5 to 18.8 kft-lb in upper Jurassic sand; 25 klbf overpull on connection.",
    fileSize: "1.4 MB",
    snippetExcerpt: "At 3,120 m MD, rotary torque escalated from 14.5 to 18.8 kft-lb with stick-slip vibrations. Spotted 80 bbl lubricant sweep.",
    extractedEntities: [
      { label: "Well", value: "NHK-119", category: "well" },
      { label: "Depth", value: "3,120 m", category: "depth" },
      { label: "Torque", value: "18.8 kft-lb", category: "parameter" },
      { label: "Event", value: "Torque / Stick-Slip", category: "event" },
    ],
  },
  {
    id: "doc-02",
    documentTitle: "MER_OIL_NHK_119_SEC3.pdf",
    wellId: "NHK-119",
    depthIntervalM: "3,000–3,160 m",
    type: "Mud Engineer Recap",
    shortType: "MER",
    status: "Indexed",
    eventsCount: 9,
    dateLogged: "15-Nov-2024",
    summary: "ECD elevated to 11.87 ppg due to cuttings accumulation in annulus; standpipe pressure climbed +140 psi.",
    fileSize: "2.1 MB",
    snippetExcerpt: "ECD elevated to 11.87 ppg due to cuttings accumulation in annulus. Increased flow rate to 510 gpm.",
    extractedEntities: [
      { label: "Well", value: "NHK-119", category: "well" },
      { label: "Depth", value: "3,100 m", category: "depth" },
      { label: "ECD", value: "11.87 ppg", category: "parameter" },
      { label: "SPP", value: "+140 psi", category: "parameter" },
    ],
  },
  {
    id: "doc-03",
    documentTitle: "INC_OIL_NHK_127_LOST_CIRC.pdf",
    wellId: "NHK-127",
    depthIntervalM: "3,150–3,220 m",
    type: "Incident Report",
    shortType: "INC",
    status: "Indexed",
    eventsCount: 6,
    dateLogged: "08-Oct-2024",
    summary: "Partial lost-circulation of 120 bbl into sub-hydrostatic depleted sandstone; spotted 60 bbl CaCO3 pill.",
    fileSize: "1.8 MB",
    snippetExcerpt: "Mud loss rate reached 35 bbl/hr at 3,180 m. Mixed and spotted 60 bbl medium-grade calcium carbonate pill.",
    extractedEntities: [
      { label: "Well", value: "NHK-127", category: "well" },
      { label: "Depth", value: "3,180 m", category: "depth" },
      { label: "Loss Vol", value: "120 bbl", category: "parameter" },
      { label: "Mitigation", value: "CaCO3 pill", category: "mitigation" },
    ],
  },
  {
    id: "doc-04",
    documentTitle: "LESSONS_LEARNED_NHK_121_04.pdf",
    wellId: "NHK-121",
    depthIntervalM: "3,090–3,210 m",
    type: "Lessons Learned",
    shortType: "LL",
    status: "Indexed",
    eventsCount: 8,
    dateLogged: "18-Dec-2024",
    summary: "Connection stationary time restricted to <3.5 minutes to eliminate differential sticking risk in sand.",
    fileSize: "950 KB",
    snippetExcerpt: "Across permeable sand, restricted connection stationary time to under 3.5 minutes. Mandated continuous pipe rotation.",
    extractedEntities: [
      { label: "Well", value: "NHK-121", category: "well" },
      { label: "Depth", value: "3,090 m", category: "depth" },
      { label: "Limit", value: "<3.5 min", category: "parameter" },
      { label: "Event", value: "Differential Sticking", category: "event" },
    ],
  },
  {
    id: "doc-05",
    documentTitle: "EOWR_OIL_ASSAM_SYNTHESIS.pdf",
    wellId: "Regional",
    depthIntervalM: "2,800–3,300 m",
    type: "End of Well Report",
    shortType: "EOWR",
    status: "Indexed",
    eventsCount: 22,
    dateLogged: "02-Jan-2025",
    summary: "Stratigraphic Pay Zone Transition & Overpressure Boundary Synthesis across Upper Assam concession blocks.",
    fileSize: "4.8 MB",
    snippetExcerpt: "Jurassic T13 boundary marks a compaction transition with localized friction escalation and depleted micro-fractures.",
    extractedEntities: [
      { label: "Region", value: "Upper Assam Basin", category: "well" },
      { label: "Formation", value: "Jurassic T13", category: "formation" },
      { label: "Event", value: "Overpressure Transition", category: "event" },
    ],
  },
  {
    id: "doc-06",
    documentTitle: "BHA_RECORD_NHK_124_SEC2.pdf",
    wellId: "NHK-124",
    depthIntervalM: "2,200–3,180 m",
    type: "BHA & Bit Record",
    shortType: "BHA",
    status: "Indexed",
    eventsCount: 11,
    dateLogged: "24-Feb-2025",
    summary: "PDC 5-Blade Matrix Bit #B-17 performance, cutter dull grading 1-1-WT-A-X-I-NO-TD, motor bend 1.5 deg.",
    fileSize: "1.2 MB",
    snippetExcerpt: "8-1/2 in PDC bit #B-17 drilled 980 m at 14.2 m/h average ROP with low vibrations.",
    extractedEntities: [
      { label: "Well", value: "NHK-124", category: "well" },
      { label: "Bit", value: "PDC #B-17", category: "parameter" },
      { label: "ROP Avg", value: "14.2 m/h", category: "parameter" },
    ],
  },
];

// Exported aliases for seamless import across components
export const SYNTHETIC_DOCUMENT_REPOSITORY = KNOWLEDGE_REPOSITORY_DOCS;
export const DEFAULT_RECENT_INVESTIGATIONS = INITIAL_RECENT_INVESTIGATIONS;

export const DEFAULT_ANSWER: KnowledgeAnswer = generateKnowledgeAnswer(
  SYNTHETIC_WELLS[0],
  "What drilling problems were reported around 3,000–3,200 m in nearby wells?"
);

export function syntheticSearchKnowledge(
  query: string,
  wellId = "NHK-124",
  filters?: KnowledgeFilterState
): KnowledgeAnswer | null {
  const well = SYNTHETIC_WELLS.find((w: Well) => w.id === wellId) || SYNTHETIC_WELLS[0];
  if (!query.trim()) return DEFAULT_ANSWER;

  // If query is nonsense or specifically requesting non-existing well/depth outside dataset, return null
  if (query.toLowerCase().includes("xyz999") || query.toLowerCase().includes("nonexistent")) {
    return null;
  }

  return generateKnowledgeAnswer(well, query);
}
