import React from "react";
import { Metadata } from "next";
import { NearbyWellsMap } from "@/components/wells/NearbyWellsMap";

export const metadata: Metadata = {
  title: "Nearby Wells GIS & Spatial Intelligence",
  description:
    "Explore multi-basin offset wells, formation depth profiles, and spatial risk indicators across India on MapLibre vector tiles.",
};

export default function NearbyWellsPage() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <NearbyWellsMap />
    </div>
  );
}
