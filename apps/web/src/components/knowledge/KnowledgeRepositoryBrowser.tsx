"use client";

import React, { useState } from "react";
import { FileText, Search, ChevronRight, CheckCircle2, ArrowUpRight } from "lucide-react";
import { DocumentRepositoryItem, KnowledgeEvidenceItem } from "./types";
import { SYNTHETIC_DOCUMENT_REPOSITORY } from "./knowledgeEngineData";

interface KnowledgeRepositoryBrowserProps {
  onViewDocument: (item: KnowledgeEvidenceItem) => void;
}

const CATEGORIES = [
  "All Documents",
  "Daily Drilling Reports",
  "Incident Reports",
  "End of Well Reports",
  "Lessons Learned",
  "Mud Recaps",
];

export const KnowledgeRepositoryBrowser: React.FC<KnowledgeRepositoryBrowserProps> = ({
  onViewDocument,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All Documents");
  const [searchFilter, setSearchFilter] = useState("");

  const filteredDocs = SYNTHETIC_DOCUMENT_REPOSITORY.filter((doc: DocumentRepositoryItem) => {
    // category filter
    if (selectedCategory !== "All Documents") {
      if (selectedCategory === "Daily Drilling Reports" && doc.type !== "Daily Drilling Report") return false;
      if (selectedCategory === "Incident Reports" && doc.type !== "Incident Report") return false;
      if (selectedCategory === "End of Well Reports" && doc.type !== "End of Well Report") return false;
      if (selectedCategory === "Lessons Learned" && doc.type !== "Lessons Learned") return false;
      if (selectedCategory === "Mud Recaps" && doc.type !== "Mud Engineer Recap") return false;
    }
    // search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchDoc = doc.documentTitle.toLowerCase().includes(q);
      const matchWell = doc.wellId.toLowerCase().includes(q);
      const matchSummary = doc.summary.toLowerCase().includes(q);
      if (!matchDoc && !matchWell && !matchSummary) return false;
    }
    return true;
  });

  const handleRowClick = (doc: DocumentRepositoryItem) => {
    const evidenceItem: KnowledgeEvidenceItem = {
      id: doc.id,
      sourceType: doc.type,
      documentTitle: doc.documentTitle,
      offsetWellId: doc.wellId,
      offsetWellName: doc.wellId,
      depthIntervalM: doc.depthIntervalM,
      formation: "Jurassic T3",
      eventSummary: doc.summary,
      relevanceScore: 0.94,
      relevanceLevel: "HIGH",
      matchLevel: "STRONG",
      dateLogged: doc.dateLogged,
      snippetExcerpt: doc.snippetExcerpt,
      highlightedPhrase: doc.summary,
      mitigationReferenced: "Recorded in verified repository schema.",
      extractedEntities: doc.extractedEntities,
    };
    onViewDocument(evidenceItem);
  };

  return (
    <div className="bg-[#FAF7F2] border-2 border-[#DDD2C0] rounded-xl p-4 sm:p-5 shadow-sm space-y-3.5 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD2C0]/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#142B3A]" />
          <h3 className="text-sm font-bold tracking-wider uppercase text-[#142B3A]">
            KNOWLEDGE REPOSITORY
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E4DDD0] text-[#142B3A] border border-[#DDD2C0]">
            {filteredDocs.length} DOCUMENTS
          </span>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search reports, events, formations..."
            className="w-full bg-white border border-[#DDD2C0] rounded-md pl-8 pr-3 py-1 text-xs text-[#142B3A] placeholder-[#6B7280] focus:outline-none focus:border-[#245463]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 pb-0.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#142B3A] text-white shadow-2xs"
                : "bg-white text-[#5A6572] hover:text-[#142B3A] border border-[#DDD2C0]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto border border-[#DDD2C0] rounded-lg bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2] text-[#5A6572] font-mono uppercase border-b border-[#DDD2C0]">
            <tr>
              <th className="py-2.5 px-3">DOCUMENT</th>
              <th className="py-2.5 px-3">WELL</th>
              <th className="py-2.5 px-3">DEPTH</th>
              <th className="py-2.5 px-3">TYPE</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3">EVENTS</th>
              <th className="py-2.5 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD2C0]/70 text-[#142B3A]">
            {filteredDocs.slice(0, 6).map((doc: DocumentRepositoryItem) => (
              <tr
                key={doc.id}
                onClick={() => handleRowClick(doc)}
                className="hover:bg-[#FAF7F2]/80 transition-colors cursor-pointer group"
              >
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#245463] shrink-0" />
                    <div>
                      <p className="font-mono font-bold text-[#142B3A] group-hover:text-[#245463] transition-colors">
                        {doc.documentTitle}
                      </p>
                      <p className="text-[10px] text-[#6B7280] truncate max-w-xs">{doc.summary}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold whitespace-nowrap text-[#245463]">
                  {doc.wellId}
                </td>
                <td className="py-2.5 px-3 font-mono text-[#5A6572] whitespace-nowrap">
                  {doc.depthIntervalM}
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#DDD2C0] text-[10px] font-mono font-medium text-[#142B3A]">
                    {doc.shortType}
                  </span>
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-[#2F8068]">
                    <CheckCircle2 className="w-3 h-3" />
                    {doc.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                  <span className="bg-[#E4DDD0]/80 px-2 py-0.5 rounded font-bold text-[#142B3A] text-[10px]">
                    {doc.eventsCount} events
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  <button className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#245463] group-hover:text-[#142B3A] transition-colors">
                    <span>VIEW SOURCE</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
