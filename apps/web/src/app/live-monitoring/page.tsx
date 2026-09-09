import React from "react";
import { Metadata } from "next";
import { LiveMonitoringView } from "@/components/monitoring/LiveMonitoringView";

export const metadata: Metadata = {
  title: "Live Monitoring & Drilling Intelligence",
  description:
    "Real-time drilling telemetry, early-warning signals, and offset evidence correlation for Oil India Limited (OIL) drilling operations.",
};

export default function LiveMonitoringPage() {
  return <LiveMonitoringView />;
}
