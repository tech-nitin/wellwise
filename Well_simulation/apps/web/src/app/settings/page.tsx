import React from "react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      moduleName="System Configuration & Rig Telemetry Feeds"
      category="CONTROL ROOM SETTINGS"
      description="Administrative and technical configuration for WellWise control room stations. Configure WITS0/WITSML endpoint URLs, telemetry channel calibration factors, hazard threshold triggers, and engineering unit preferences."
      icon={Settings}
      specs={[
        { label: "Unit System", value: "Metric (Oilfield Modified: m, klbf, psi)" },
        { label: "WITSML Endpoint", value: "wss://rtmac.oilindia.in/witsml" },
        { label: "Audio Alarms", value: "Enabled (Critical & High Tiers)" },
        { label: "Timezone", value: "Asia/Kolkata (IST) & UTC" },
      ]}
      plannedCapabilities={[
        "Configuration of real-time WITS0 serial / TCP-IP feeds and WITSML 1.4 / 2.0 servers",
        "Sensor calibration offsets (hookload zeroing, standpipe pressure transducer calibration)",
        "Risk sensitivity threshold sliders for kick volume, differential sticking, and ROP drops",
        "Role-based access control (RBAC): Drilling Engineer, Mud Engineer, Geologist, Rig Superintendent",
        "Offline caching and local telemetry sync options for remote rig-site connectivity",
      ]}
    />
  );
}
