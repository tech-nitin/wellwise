"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidButton } from "@/components/ui/liquid-button";
import { DrillingVisualization } from "./DrillingVisualization";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";
import { ArrowRight, Compass, Gauge, Radio, ShieldCheck } from "lucide-react";

export function HeroSection() {
  const tickerItems = [
    { label: "BIT DEPTH", value: "3,240.0 m", status: "NORMAL" },
    { label: "FORMATION", value: "JURASSIC T13", status: "PAY ZONE" },
    { label: "STANDPIPE PRESSURE", value: "18.5 MPa", status: "HYDROSTATIC BALANCED" },
    { label: "OFFSET MATCH", value: "92% PRECEDENT", status: "VERIFIED" },
    { label: "EARLY WARNING", value: "DIFF. STICKING (78/100)", status: "ADVISORY" },
    { label: "DOWNHOLE TEMP", value: "85°C", status: "GRADIENT STABLE" },
    { label: "ROTARY SPEED", value: "820 rpm", status: "OPTIMAL DYNAMICS" },
  ];

  const [currentTickerIdx, setCurrentTickerIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTickerIdx((prev) => (prev + 1) % tickerItems.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  return (
    <section className="relative w-full pt-6 pb-12 lg:pt-10 lg:pb-16 border-b border-[#DDD2C0] overflow-hidden select-none">
      {/* Ambient Geological Multi-Layered Background System */}
      <GeologicalBackground variant="hero" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-6 space-y-5 text-left"
          >
            {/* Technical Eyebrows & Synthetic Disclaimer */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF8F5] border border-[#DDD2C0] shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D96B3B] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#245463] font-bold">
                  AI FOR SAFER WELLS
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#142B3A] text-[#F5F0E6] text-[10px] font-mono font-bold tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D96B3B]" />
                <span>ACTIVE FOCUS: UPPER ASSAM BASIN</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DDD2C0]/30 border border-[#DDD2C0] text-[9px] font-mono text-[#142B3A]/70">
                <span>SYNTHETIC DEMO DATA &bull; NOT VERIFIED OIL ASSET DATA</span>
              </div>
            </div>

            {/* Large Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[66px] font-extrabold tracking-tight text-[#0D1B24] leading-[1.05]">
              Know the Well.
              <br />
              <span className="bg-gradient-to-r from-[#D96B3B] via-[#E28555] to-[#A9533D] bg-clip-text text-transparent">
                Before the Risk.
              </span>
            </h1>

            {/* Supporting Description - National Scope */}
            <p className="text-base sm:text-lg text-[#142B3A]/85 leading-relaxed max-w-xl font-normal">
              Turn multi-well history, live drilling signals and AI-assisted evidence into faster, safer drilling decisions across India&apos;s oil &amp; gas operations.
            </p>

            {/* CTAs: Primary Copper Flame + Secondary Petroleum Navy */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/nearby-wells">
                <LiquidButton variant="primary">
                  <Compass className="h-4 w-4 text-[#0D1B24]" />
                  <span>Explore Wells</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                </LiquidButton>
              </Link>

              <LiquidButton
                variant="secondary"
                type="button"
                onClick={() => {
                  window.open(
                    "https://well-drilling-simulation.vercel.app/",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                <Gauge className="h-4 w-4 text-[#142B3A]" />
                <span>See How It Works</span>
              </LiquidButton>
            </div>

            {/* Technical Telemetry Ticker */}
            <div className="pt-1">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD2C0] flex items-center gap-3 shadow-2xs overflow-hidden">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#142B3A] text-[#D96B3B] text-[10px] font-mono font-bold uppercase shrink-0">
                  <Radio className="h-3 w-3 animate-pulse" />
                  <span>LIVE TELEMETRY</span>
                </div>

                <div className="relative h-6 flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTickerIdx}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[#245463]/75 uppercase text-[10px] font-bold">
                          {tickerItems[currentTickerIdx].label}:
                        </span>
                        <span className="font-bold text-[#0D1B24]">
                          {tickerItems[currentTickerIdx].value}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#2F8068] font-bold px-2 py-0.5 rounded bg-[#2F8068]/15 border border-[#2F8068]/30 shrink-0 hidden sm:inline">
                        {tickerItems[currentTickerIdx].status}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Hero Micro Stats Row with Clear Scope Bounds */}
            <div className="pt-3 border-t border-[#DDD2C0]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 text-left">
                <div className="flex flex-col sm:border-r border-[#DDD2C0] sm:pr-4 group">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0D1B24] tracking-tight group-hover:text-[#A9533D] transition-colors">
                    24
                  </span>
                  <span className="text-xs font-bold text-[#0D1B24] mt-0.5">
                    Nearby Offset Wells
                  </span>
                  <span className="text-[10px] font-mono text-[#245463]/80">
                    Within 5 km
                  </span>
                </div>

                <div className="flex flex-col sm:border-r border-[#DDD2C0] sm:pr-4 sm:pl-3 group">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0D1B24] tracking-tight group-hover:text-[#A9533D] transition-colors">
                    17
                  </span>
                  <span className="text-xs font-bold text-[#0D1B24] mt-0.5">
                    Historical Matches
                  </span>
                  <span className="text-[10px] font-mono text-[#245463]/80">
                    Current well
                  </span>
                </div>

                <div className="flex flex-col sm:border-r border-[#DDD2C0] sm:pr-4 sm:pl-3 group">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0D1B24] tracking-tight group-hover:text-[#D96B3B] transition-colors">
                    08
                  </span>
                  <span className="text-xs font-bold text-[#0D1B24] mt-0.5">
                    Precedent Events
                  </span>
                  <span className="text-[10px] font-mono text-[#245463]/80">
                    Recorded intervals
                  </span>
                </div>

                <div className="flex flex-col sm:pl-3 group">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0D1B24] tracking-tight group-hover:text-[#A9533D] transition-colors">
                    92%
                  </span>
                  <span className="text-xs font-bold text-[#0D1B24] mt-0.5">
                    Evidence Match
                  </span>
                  <span className="text-[10px] font-mono text-[#245463]/80">
                    Retrieved evidence
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: ~50% on desktop (Large 3D Subsurface Visualization) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-6 flex justify-center items-center relative"
          >
            <DrillingVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
