import React from "react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { Gauge } from "lucide-react";

export default function LiveMonitoringPage() {
  return (
    <ModulePlaceholder
      moduleName="Live Drilling Monitoring & WITSML Feed"
      category="REAL-TIME TELEMETRY"
      description="High-frequency real-time mud logging and surface drilling telemetry visualization. Streams surface parameters, downhole MWD/LWD tools, and hydraulics channels via WITS0/WITSML protocol with sub-second latency."
      icon={Gauge}
      badgeText="LIVE STREAM READY"
      badgeVariant="telemetry"
      specs={[
        { label: "Active Rig Stream", value: "RIG-OIL-04 (WITSML 1.4)" },
        { label: "Sampling Rate", value: "1.0 Hz (Sub-second)" },
        { label: "Active Channels", value: "24 Monitored Sensors" },
        { label: "Connection Protocol", value: "Secure WebSocket / WITS0" },
      ]}
      plannedCapabilities={[
        "Multi-track real-time strip chart logs (ROP, WOB, RPM, Torque, SPP, Flow, Mud Weight, Total Gas)",
        "Real-time drilling hydraulics and equivalent circulating density (ECD) tracking",
        "Threshold breach alarms with configurable audio and visual warnings for kick/loss detection",
        "Drilling state machine detection (Rotary Drilling, Slide Drilling, Connection, Tripping In/Out)",
        "Playback mode to scrub through historical drilling runs and connection sequences",
      ]}
    />
  );
}
