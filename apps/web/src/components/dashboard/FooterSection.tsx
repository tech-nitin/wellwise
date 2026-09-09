"use client";

import React from "react";
import Link from "next/link";
import { Compass, Shield, ArrowUpRight } from "lucide-react";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";

export function FooterSection() {
  return (
    <footer className="relative w-full bg-[#0D1B24] pt-14 pb-10 overflow-hidden border-t border-[#142B3A] select-none text-[#F5F0E6]">
      {/* Ambient Geological Background System - Deep Bedrock Variant */}
      <GeologicalBackground variant="footer" />

      {/* Subtle Geological Silhouette Contour Lines */}
      <div className="absolute inset-x-0 bottom-0 h-28 opacity-5 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full text-[#D96B3B] fill-current"
        >
          <path d="M0,40 C150,90 350,-20 500,60 C650,140 900,10 1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#142B3A] text-left">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-[#D96B3B] flex items-center justify-center text-white shadow-sm">
                <Compass className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-[#F5F0E6] tracking-tight leading-tight">
                  WellWise
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#D96B3B] font-bold">
                  Oil &amp; Gas Engineering Intelligence
                </span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#F5F0E6] tracking-tight leading-tight">
                Smarter Drilling.<br />
                <span className="text-[#D96B3B]">Safer Tomorrow.</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#F5F0E6]/70 max-w-sm leading-relaxed">
              Turn historical drilling knowledge, live telemetry and offset-well intelligence into evidence-backed decisions.
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F5F0E6]/80 bg-[#142B3A] px-3.5 py-1.5 rounded-full border border-[#D96B3B]/20">
              <Shield className="h-3.5 w-3.5 text-[#D96B3B]" />
              <span>SIH 2026 &bull; Synthetic Demo Environment</span>
            </div>
          </div>

          {/* Navigation Columns: Product, Engineering, Project */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-1">
            {/* Product Links */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#D96B3B] block">
                PRODUCT
              </span>
              <ul className="space-y-2 text-xs text-[#F5F0E6]/75">
                <li>
                  <Link href="/nearby-wells" className="hover:text-[#D96B3B] transition-colors flex items-center gap-1">
                    <span>Nearby Wells</span>
                  </Link>
                </li>
                <li>
                  <Link href="/wells/NHK-124" className="hover:text-[#D96B3B] transition-colors flex items-center gap-1">
                    <span>Well Intelligence</span>
                  </Link>
                </li>
                <li>
                  <Link href="/live-monitoring" className="hover:text-[#D96B3B] transition-colors flex items-center gap-1">
                    <span>Live Monitoring</span>
                  </Link>
                </li>
                <li>
                  <Link href="/risks" className="hover:text-[#D96B3B] transition-colors flex items-center gap-1">
                    <span>Risk Intelligence</span>
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge" className="hover:text-[#D96B3B] transition-colors flex items-center gap-1">
                    <span>Ask the Field</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Engineering Links */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#D96B3B] block">
                ENGINEERING
              </span>
              <ul className="space-y-2 text-xs text-[#F5F0E6]/75">
                <li>
                  <Link href="/nearby-wells" className="hover:text-[#D96B3B] transition-colors">
                    Offset Intelligence
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge" className="hover:text-[#D96B3B] transition-colors">
                    Historical Evidence
                  </Link>
                </li>
                <li>
                  <Link href="/risks" className="hover:text-[#D96B3B] transition-colors">
                    Early-Warning Signals
                  </Link>
                </li>
                <li>
                  <Link href="/live-monitoring" className="hover:text-[#D96B3B] transition-colors">
                    Telemetry (MWD)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Project Links */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#D96B3B] block">
                PROJECT
              </span>
              <ul className="space-y-2 text-xs text-[#F5F0E6]/75">
                <li>
                  <span className="hover:text-[#D96B3B] transition-colors cursor-pointer flex items-center gap-1">
                    <span>SIH 2026</span>
                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                  </span>
                </li>
                <li>
                  <span className="hover:text-[#D96B3B] transition-colors cursor-pointer">
                    Synthetic Demo
                  </span>
                </li>
                <li>
                  <span className="hover:text-[#D96B3B] transition-colors cursor-pointer">
                    Technology Stack
                  </span>
                </li>
                <li>
                  <span className="flex items-center gap-1.5 text-[#2F8068] font-mono font-bold mt-1">
                    <span className="h-2 w-2 rounded-full bg-[#2F8068] animate-pulse" />
                    Demo Operational
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#F5F0E6]/60">
          <span>
            WellWise &copy; 2026 &bull; Synthetic demonstration environment
          </span>
          <span className="font-bold text-[#F5F0E6]">
            Evidence first. Decisions smarter.
          </span>
        </div>
      </div>
    </footer>
  );
}
