export const APP_CONFIG = {
  name: "WellWise",
  fullName: "WellWise — eRTMAC-NWIS",
  subtitle: "AI-Powered Offset Well Knowledge and Decision Support Platform",
  problemStatement: "SIH26121",
  organization: "Oil India Limited (OIL)",
  version: "1.0.0-foundation",
  defaultWellId: "NHK-124",
  defaultRigId: "RIG-OIL-04",
  defaultBasin: "Upper Assam Basin (Nahorkatiya)",
} as const;

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
  badgeVariant?: "default" | "warning" | "critical" | "telemetry";
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    iconName: "LayoutDashboard",
    description: "Operational overview, active rig status, and telemetry KPIs",
  },
  {
    title: "Nearby Wells GIS",
    href: "/nearby-wells",
    iconName: "Compass",
    description: "Geospatial offset well exploration and proximity analysis",
  },
  {
    title: "Active Well Dossier",
    href: "/wells/NHK-124",
    iconName: "Layers",
    description: "Target well profile, casing design, trajectory, and lithology",
  },
  {
    title: "Live Monitoring",
    href: "/live-monitoring",
    iconName: "Gauge",
    badge: "LIVE",
    badgeVariant: "telemetry",
    description: "Real-time drilling sensor streams and WITSML mud telemetry",
  },
  {
    title: "Risk & Alerts",
    href: "/risks",
    iconName: "AlertTriangle",
    badge: "2 HAZARDS",
    badgeVariant: "warning",
    description: "AI-driven hazard prediction and offset incident precedents",
  },
  {
    title: "AI Knowledge Assistant",
    href: "/knowledge",
    iconName: "Bot",
    description: "Offset well RAG assistant, DDR analysis, and lessons learned",
  },
  {
    title: "Documents & OCR",
    href: "/documents",
    iconName: "FileText",
    description: "Daily drilling reports, mud logs, and digitized historical dossiers",
  },
  {
    title: "Well Correlation",
    href: "/correlation",
    iconName: "GitCompare",
    description: "Stratigraphic cross-sections and multi-well log correlation",
  },
  {
    title: "Drilling Analytics",
    href: "/analytics",
    iconName: "BarChart3",
    description: "ROP optimization, hydraulics modeling, and drilling dynamics",
  },
  {
    title: "Audit Trail",
    href: "/audit",
    iconName: "ShieldCheck",
    description: "Immutable decision logs, supervisor sign-offs, and compliance",
  },
  {
    title: "Settings",
    href: "/settings",
    iconName: "Settings",
    description: "Telemetry feed sources, sensor thresholds, and system preferences",
  },
];

export const RISK_SEVERITY_LEVELS = {
  LOW: {
    key: "LOW",
    label: "Low Risk",
    token: "success",
    bgClass: "bg-success/15",
    textClass: "text-success",
    borderClass: "border-success/30",
  },
  MEDIUM: {
    key: "MEDIUM",
    label: "Medium Advisory",
    token: "warning",
    bgClass: "bg-warning/15",
    textClass: "text-warning",
    borderClass: "border-warning/30",
  },
  HIGH: {
    key: "HIGH",
    label: "High Warning",
    token: "risk-high",
    bgClass: "bg-risk-high/15",
    textClass: "text-risk-high",
    borderClass: "border-risk-high/30",
  },
  CRITICAL: {
    key: "CRITICAL",
    label: "Critical Hazard",
    token: "risk-critical",
    bgClass: "bg-risk-critical/15",
    textClass: "text-risk-critical",
    borderClass: "border-risk-critical/30",
  },
} as const;

export type RiskSeverity = keyof typeof RISK_SEVERITY_LEVELS;
