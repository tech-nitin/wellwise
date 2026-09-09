import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "WellWise Engineering Intelligence Dashboard — AI-Powered Offset Well Knowledge, Live Drilling Telemetry, and Predictive Decision Support.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
