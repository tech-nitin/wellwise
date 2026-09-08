import React from "react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { Bot } from "lucide-react";

export default function KnowledgePage() {
  return (
    <ModulePlaceholder
      moduleName="AI Knowledge Assistant & Offset Well RAG"
      category="DRILLING INTELLIGENCE & RAG"
      description="Interactive technical knowledge assistant powered by Retrieval-Augmented Generation (RAG). Queries historical Daily Drilling Reports (DDRs), mud engineering logs, bit records, and end-of-well reports to deliver verified operational advice for Oil India Limited operations."
      icon={Bot}
      specs={[
        { label: "Vector Database", value: "PostgreSQL + pgvector" },
        { label: "Indexed Documents", value: "3,420 DDRs & Mud Reports" },
        { label: "Knowledge Scope", value: "Upper Assam Basin Wells" },
        { label: "Response Mode", value: "Deterministic with Citations" },
      ]}
      plannedCapabilities={[
        "Natural language Q&A: 'What mud weight was used when drilling Barail formation in NHK-118?'",
        "Direct verbatim citations and snippet links to original Oil India Limited DDR PDFs",
        "Lessons learned extraction: common fishing operations, sidetracking procedures, and loss zones",
        "Structured comparison synthesis across up to 5 offset wells simultaneously",
        "Exportable technical advisory briefs for morning operational briefings",
      ]}
    />
  );
}
