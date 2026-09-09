import React, { Suspense } from "react";
import { Metadata } from "next";
import { KnowledgeWorkspaceView } from "@/components/knowledge/KnowledgeWorkspaceView";

export const metadata: Metadata = {
  title: "Ask the Field — Historical Drilling Knowledge & Evidence RAG | WellWise",
  description:
    "Engineering knowledge workspace for historical drilling experience, offset well records, OCR report intelligence, and evidence-backed RAG search for drilling operations.",
};

export default function KnowledgePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-3 border-[#245463] border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-[#5A6572] uppercase tracking-wider">
              Loading Ask the Field Knowledge Workspace...
            </span>
          </div>
        </div>
      }
    >
      <KnowledgeWorkspaceView />
    </Suspense>
  );
}
