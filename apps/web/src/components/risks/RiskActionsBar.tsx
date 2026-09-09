"use client";

import React from "react";
import Link from "next/link";
import { Compass, Layers, Activity, Bot, ArrowRight } from "lucide-react";

interface RiskActionsBarProps {
  wellId: string;
}

export function RiskActionsBar({ wellId }: RiskActionsBarProps) {
  const actions = [
    {
      title: "VIEW WELL INTELLIGENCE →",
      href: `/wells/${wellId}`,
      primary: true,
    },
    {
      title: "VIEW OFFSET WELLS →",
      href: "/nearby-wells",
      primary: false,
    },
    {
      title: "VIEW LIVE MONITORING →",
      href: "/live-monitoring",
      primary: false,
    },
    {
      title: "ASK THE FIELD (RAG) →",
      href: "/knowledge",
      primary: false,
    },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#DDD2C0] rounded-xl px-3.5 py-2.5 shadow-2xs select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <span className="text-[10px] font-mono font-bold text-[#8B877D] uppercase shrink-0">
          ENGINEER ACTIONS &amp; INVESTIGATION
        </span>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-start sm:justify-end">
          {actions.map((act) => (
            <Link
              key={act.title}
              href={act.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer text-center ${
                act.primary
                  ? "bg-[#142B3A] text-white hover:bg-[#245463]"
                  : "bg-white text-[#142B3A] border border-[#DDD2C0] hover:bg-[#DDD2C0]/40"
              }`}
            >
              {act.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
