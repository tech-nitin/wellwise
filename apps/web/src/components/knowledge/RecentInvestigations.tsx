"use client";

import React from "react";
import { History, ArrowRight } from "lucide-react";
import { RecentInvestigationItem } from "./types";
import { DEFAULT_RECENT_INVESTIGATIONS } from "./knowledgeEngineData";

interface RecentInvestigationsProps {
  items?: RecentInvestigationItem[];
  onSelectQuery: (query: string) => void;
}

export const RecentInvestigations: React.FC<RecentInvestigationsProps> = ({
  items = DEFAULT_RECENT_INVESTIGATIONS,
  onSelectQuery,
}) => {
  return (
    <div className="bg-[#FAF7F2] border border-[#DDD2C0] rounded-xl px-3.5 py-2.5 shadow-2xs select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-[#245463]" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#142B3A]">
            RECENT INVESTIGATIONS:
          </span>
        </div>

        {/* Compact Clickable Queries Strip */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1 sm:justify-end">
          {items.slice(0, 3).map((item: RecentInvestigationItem) => (
            <button
              key={item.id}
              onClick={() => onSelectQuery(item.query)}
              className="text-[11px] font-sans px-2.5 py-1 rounded bg-white border border-[#DDD2C0] hover:border-[#245463] hover:text-[#245463] text-[#142B3A] transition-colors cursor-pointer truncate max-w-xs shadow-2xs"
            >
              &ldquo;{item.query}&rdquo;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
