"use client";

import React from "react";
import Link from "next/link";
import { Compass, Shield } from "lucide-react";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";

export function FooterSection() {
  return (
    <footer className="relative w-full bg-[#0D1B24] pt-16 pb-12 overflow-hidden border-t border-[#142B3A] select-none text-[#F5F0E6]">
      {/* Ambient Geological Background System - Deep Bedrock Variant */}
      <GeologicalBackground variant="footer" />

      {/* Subtle Geological Silhouette Contour Lines */}
      <div className="absolute inset-x-0 bottom-0 h-32 opacity-5 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full text-[#D96B3B] fill-current"
        >
          <path d="M0,40 C150,90 350,-20 500,60 C650,140 900,10 1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#142B3A] text-left">
          {/* Brand & Purpose */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#D96B3B] flex items-center justify-center text-white shadow-sm">
                <Compass className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-[#F5F0E6] tracking-tight leading-tight">
                  WellWise
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#D96B3B] font-bold">
                  Oil &amp; Gas Intelligence Platform
                </span>
              </div>
            </div>

            <p className="text-2xl sm:text-3xl font-extrabold text-[#F5F0E6] tracking-tight leading-tight pt-1">
              Smarter Drilling.<br />
              <span className="text-[#D96B3B]">Safer Tomorrow.</span>
            </p>

            <p className="text-sm text-[#F5F0E6]/70 max-w-sm leading-relaxed">
              Domain intelligence and early warning hazard detection platform engineered for Oil India Limited upstream operations.
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F5F0E6]/80 bg-[#142B3A] px-3.5 py-1.5 rounded-full border border-[#D96B3B]/20">
              <Shield className="h-3.5 w-3.5 text-[#D96B3B]" />
              <span>SIH26121 &bull; Oil India Limited (OIL)</span>
            </div>
          </div>

          {/* Navigation Columns: Product, Company, Resources */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-2">
            {/* Product Links */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#D96B3B]">
                Product
              </span>
              <ul className="space-y-2.5 text-xs text-[#F5F0E6]/70">
                <li>
                  <Link href="/nearby-wells" className="hover:text-[#D96B3B] transition-colors">
                    Well Map &amp; GIS
                  </Link>
                </li>
                <li>
                  <Link href="/live-monitoring" className="hover:text-[#D96B3B] transition-colors">
                    Live Telemetry
                  </Link>
                </li>
                <li>
                  <Link href="/risks" className="hover:text-[#D96B3B] transition-colors">
                    Risk Intelligence
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge" className="hover:text-[#D96B3B] transition-colors">
                    Domain AI RAG
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-[#D96B3B] transition-colors">
                    Offset Analytics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#D96B3B]">
                Company
              </span>
              <ul className="space-y-2.5 text-xs text-[#F5F0E6]/70">
                <li>
                  <span className="hover:text-[#D96B3B] transition-colors cursor-pointer">
                    About WellWise
                  </span>
                </li>
                <li>
                  <span className="hover:text-[#D96B3B] transition-colors cursor-pointer">
                    Oil India Limited
                  </span>
                </li>
                <li>
                  <span className="hover:text-[#D96B3B] transition-colors cursor-pointer">
                    Assam Basin R&amp;D
                  </span>
                </li>
                <li>
                  <span className="hover:text-[#D96B3B] transition-colors cursor-pointer">
                    Security &amp; Compliance
                  </span>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#D96B3B]">
                Resources
              </span>
              <ul className="space-y-2.5 text-xs text-[#F5F0E6]/70">
                <li>
                  <span className="hover:text-[#D96B3B] transition-colors cursor-pointer">
                    Engineering DDR Docs
                  </span>
                </li>
                <li>
                  <span className="hover:text-[#D96B3B] transition-colors cursor-pointer">
                    Lithology Taxonomies
                  </span>
                </li>
                <li>
                  <Link href="/audit" className="hover:text-[#D96B3B] transition-colors">
                    Audit Verification Trail
                  </Link>
                </li>
                <li>
                  <span className="flex items-center gap-1.5 text-[#2F8068] font-mono font-bold">
                    <span className="h-2 w-2 rounded-full bg-[#2F8068] animate-pulse" />
                    Operational Live
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#F5F0E6]/60">
          <span>
            &copy; 2026 WellWise &bull; Deployed for Oil India Limited (OIL) Operations.
          </span>
          <span className="font-bold text-[#F5F0E6]">
            Smarter Drilling. Safer Tomorrow.
          </span>
        </div>
      </div>
    </footer>
  );
}
