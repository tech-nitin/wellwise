import React from "react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { FileText } from "lucide-react";

export default function DocumentsPage() {
  return (
    <ModulePlaceholder
      moduleName="Documents & OCR Repository"
      category="DIGITIZED WELL ARCHIVES"
      description="Centralized document management repository for legacy scanned drilling reports, Daily Drilling Reports (DDRs), casing tallies, and mud recaps. Features automated OCR pipeline, text extraction, and metadata tagging for fast search."
      icon={FileText}
      specs={[
        { label: "Document Types", value: "DDR, Mud Log, Well Plan, Bit Record" },
        { label: "OCR Pipeline", value: "FastAPI + Layout-aware OCR" },
        { label: "Search Index", value: "Full-text + Semantic Embeddings" },
        { label: "Supported Formats", value: "PDF, TIFF, LAS, CSV" },
      ]}
      plannedCapabilities={[
        "Drag-and-drop ingestion of legacy scanned Oil India Limited DDRs and lithology charts",
        "Automated extraction of tabular operational metrics (depth, footage drilled, mud parameters, BHA)",
        "Side-by-side verification viewer showing OCR bounding boxes on original scanned pages",
        "Filter by well ID, rig, date interval, formation name, and operational activity code",
        "Batch export to structured JSON/CSV for downstream reservoir and drilling analysis",
      ]}
    />
  );
}
