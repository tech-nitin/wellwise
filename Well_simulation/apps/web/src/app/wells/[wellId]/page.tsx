import React from "react";
import { Metadata } from "next";
import { WellDossierClient } from "./WellDossierClient";

interface PageProps {
  params: Promise<{ wellId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { wellId } = await params;
  return {
    title: `Well Dossier & Engineering Profile — ${wellId}`,
    description: `Comprehensive petroleum engineering dossier for well ${wellId}. Casing programs, formation tops, incident logs, and offset proximity analysis for Oil India Limited (OIL).`,
  };
}

export default async function WellDetailPage({ params }: PageProps) {
  const { wellId } = await params;

  return <WellDossierClient wellId={wellId} />;
}
