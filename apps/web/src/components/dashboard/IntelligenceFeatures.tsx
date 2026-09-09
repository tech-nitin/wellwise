"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Compass,
  AlertTriangle,
  Bot,
  ArrowRight,
  Activity,
  Search,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GeologicalBackground } from "@/components/ui/GeologicalBackground";
import { cn } from "@/lib/utils";

interface CapabilityCardData {
  id: string;
  num: string;
  tag: string;
  title: string;
  description: string;
  href: string;
  ctaText: string;
  ctaCategory: string;
  iconBg: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
  borderAccent?: boolean;
  widget: React.ReactNode;
}

const CARDS: CapabilityCardData[] = [
  {
    id: "nearby-wells",
    num: "01",
    tag: "SPATIAL + HISTORICAL OFFSET",
    title: "Nearby Well Intelligence",
    description:
      "Benchmark current drilling against nearby wells, formation depths, incidents and mitigation history within your operational basin radius.",
    href: "/nearby-wells",
    ctaText: "Explore Well Network",
    ctaCategory: "SPATIAL BENCHMARK",
    iconBg: "bg-[#142B3A]",
    iconColor: "text-[#D96B3B]",
    icon: Compass,
    widget: (
      <div className="p-3.5 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] font-mono text-xs space-y-2 mb-6">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#142B3A]/70 flex items-center gap-1.5 font-medium">
            <MapPin className="h-3.5 w-3.5 text-[#D96B3B]" />
            <span>Upper Assam &bull; Nahorkatiya</span>
          </span>
          <span className="text-[10px] text-[#2F8068] font-bold bg-[#2F8068]/15 px-2 py-0.5 rounded border border-[#2F8068]/30">
            Offset Sync
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-[#DDD2C0]/60 text-[11px]">
          <span className="text-[#0D1B24] font-bold">24 Offset Wells</span>
          <span className="text-[#142B3A]/70 font-semibold">5.0 km Radius</span>
        </div>
      </div>
    ),
  },
  {
    id: "risk-detection",
    num: "02",
    tag: "LIVE SIGNALS + PATTERN MATCH",
    title: "Early-Warning Risk Detection",
    description:
      "Detect abnormal drilling patterns before they become operational events by matching sensor trends with precedent incident signatures.",
    href: "/risks",
    ctaText: "Inspect Risk Engine",
    ctaCategory: "PRECURSOR SURFACED",
    iconBg: "bg-[#D96B3B]/15",
    iconColor: "text-[#843D35]",
    icon: AlertTriangle,
    borderAccent: true,
    widget: (
      <div className="p-3.5 rounded-2xl bg-[#D96B3B]/10 border border-[#D96B3B]/30 font-mono text-xs space-y-1.5 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#843D35] flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-[#D96B3B] animate-pulse" />
            DIFFERENTIAL STICKING HAZARD
          </span>
          <span className="text-[11px] font-extrabold text-[#843D35] bg-[#843D35]/15 px-2 py-0.5 rounded border border-[#843D35]/30">
            78 / 100
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#142B3A]/75 pt-1 border-t border-[#D96B3B]/20">
          <span>Precursor: Torque Drag +34%</span>
          <span className="font-semibold text-[#0D1B24]">Lead Precedent: NHK-119</span>
        </div>
      </div>
    ),
  },
  {
    id: "ai-knowledge",
    num: "03",
    tag: "DRILLING ARCHIVES + RAG",
    title: "AI Knowledge Search",
    description:
      "Ask natural-language questions across historical drilling reports, incidents, mud logs and lessons learned for instant engineering precedent.",
    href: "/knowledge",
    ctaText: "Ask the Field",
    ctaCategory: "HISTORICAL RAG",
    iconBg: "bg-[#245463]",
    iconColor: "text-[#F5F0E6]",
    icon: Bot,
    widget: (
      <div className="p-3.5 rounded-2xl bg-[#DDD2C0]/25 border border-[#DDD2C0] font-mono text-xs space-y-1.5 mb-6">
        <div className="flex items-center gap-2 text-[11px] text-[#0D1B24]">
          <Search className="h-3.5 w-3.5 text-[#245463] shrink-0" />
          <span className="truncate font-semibold">&ldquo;NHK-187 stuck pipe resolution&rdquo;</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-[#DDD2C0]/60 text-[10px] text-[#142B3A]/70">
          <span className="text-[#2F8068] font-bold flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#2F8068]" />
            4 Sources Retrieved
          </span>
          <span>Citation: DDR #84</span>
        </div>
      </div>
    ),
  },
];

export function IntelligenceFeatures() {
  const [activeIndex, setActiveIndex] = useState(1); // Default to center/strongest card (02 Early-Warning)
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? CARDS.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === CARDS.length - 1 ? 0 : prev + 1));
  }, []);

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Auto-play timer (Advances every 5.5s, pauses when hovered or tab invisible)
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5500);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPaused, prefersReducedMotion, handleNext]);

  // Touch Swipe Handlers (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) > 45) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    setTouchStartX(null);
  };

  // Mouse Drag Handlers (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || mouseStartX === null) return;
    const deltaX = e.clientX - mouseStartX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    setIsDragging(false);
    setMouseStartX(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      id="engineering-capabilities"
      className="relative w-full py-12 lg:py-16 overflow-hidden border-b border-[#DDD2C0] select-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Engineering Capabilities Carousel"
    >
      {/* Ambient Geological Background System - Historical Formations Variant */}
      <GeologicalBackground variant="intelligence" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header & Top Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 text-left">
          {/* Left: Heading & Flow Eyebrow */}
          <div className="max-w-2xl space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D96B3B] bg-[#D96B3B]/10 px-2.5 py-0.5 rounded-full border border-[#D96B3B]/30">
                02 &bull; UNDERSTAND DRILLING INTELLIGENCE CAPABILITIES
              </span>
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-[#A9533D] font-extrabold block">
              ENGINEERING CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B24] leading-[1.08]">
              Turn Historical Data<br />
              <span className="text-[#D96B3B]">Into Intelligence.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#142B3A]/80 leading-relaxed max-w-xl pt-0.5">
              An engineering framework purpose-built to convert decades of legacy well files, mud logs, and high-frequency sensor streams into defensible downhole decisions.
            </p>
          </div>

          {/* Right: Elegant Navigation Controls [←] [→] + 01 / 03 Counter */}
          <div className="flex items-center gap-4 self-start md:self-end font-mono">
            {/* Slide Index Counter */}
            <div className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DDD2C0] shadow-2xs text-xs font-bold text-[#0D1B24]">
              <span className="text-[#D96B3B]">0{activeIndex + 1}</span>
              <span className="text-[#142B3A]/40 mx-1">/</span>
              <span className="text-[#142B3A]/70">03</span>
            </div>

            {/* Previous & Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous capability slide"
                className="h-10 w-10 rounded-full bg-[#FAF8F5] hover:bg-[#142B3A] text-[#142B3A] hover:text-[#F5F0E6] border border-[#DDD2C0] hover:border-[#142B3A] shadow-2xs hover:shadow-sm flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 group"
              >
                <ChevronLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next capability slide"
                className="h-10 w-10 rounded-full bg-[#FAF8F5] hover:bg-[#142B3A] text-[#142B3A] hover:text-[#F5F0E6] border border-[#DDD2C0] hover:border-[#142B3A] shadow-2xs hover:shadow-sm flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 group"
              >
                <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setIsDragging(false);
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="relative w-full py-4 overflow-hidden"
        >
          {/* Desktop 3-Card Interactive Arrangement (lg:grid) */}
          <div className="hidden lg:grid grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {CARDS.map((card, idx) => {
              const isActive = idx === activeIndex;
              const IconComponent = card.icon;

              return (
                <div
                  key={card.id}
                  onClick={() => handleSelect(idx)}
                  className={cn(
                    "h-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer transform-gpu",
                    isActive
                      ? "scale-[1.02] -translate-y-1.5 z-20 opacity-100"
                      : "scale-[0.97] translate-y-0 z-10 opacity-80 hover:opacity-95"
                  )}
                >
                  <Link
                    href={card.href}
                    onClick={(e) => {
                      // If user clicked an inactive card, select it first rather than immediate navigation
                      if (!isActive) {
                        e.preventDefault();
                        handleSelect(idx);
                      }
                    }}
                    className={cn(
                      "group block h-full p-7 sm:p-8 rounded-3xl bg-[#FAF8F5] transition-all duration-300 shadow-sm text-left flex flex-col justify-between relative overflow-hidden",
                      isActive
                        ? card.borderAccent
                          ? "border-2 border-[#D96B3B] shadow-xl ring-4 ring-[#D96B3B]/10"
                          : "border-2 border-[#142B3A] shadow-xl ring-4 ring-[#142B3A]/10"
                        : "border border-[#DDD2C0] hover:border-[#142B3A]/40"
                    )}
                  >
                    {/* Active Accent Top Line */}
                    {isActive && (
                      <div
                        className={cn(
                          "absolute top-0 left-0 right-0 h-1.5 transition-all duration-300",
                          card.borderAccent
                            ? "bg-gradient-to-r from-[#D96B3B] via-[#E28555] to-[#843D35]"
                            : "bg-gradient-to-r from-[#142B3A] to-[#245463]"
                        )}
                      />
                    )}

                    <div>
                      {/* Header: Icon, Category & Number */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3.5">
                          <div
                            className={cn(
                              "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform duration-300 shadow-2xs",
                              card.iconBg,
                              card.iconColor,
                              isActive ? "scale-105" : "group-hover:scale-105",
                              card.borderAccent && "border border-[#D96B3B]/40"
                            )}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A9533D] font-extrabold block">
                              {card.tag}
                            </span>
                            <h3 className="text-xl font-extrabold text-[#0D1B24] tracking-tight">
                              {card.title}
                            </h3>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "text-3xl font-mono font-black transition-colors",
                            isActive
                              ? card.borderAccent
                                ? "text-[#D96B3B]"
                                : "text-[#142B3A]"
                              : "text-[#DDD2C0] group-hover:text-[#142B3A]/50"
                          )}
                        >
                          {card.num}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[#142B3A]/85 leading-relaxed mb-6">
                        {card.description}
                      </p>

                      {/* Specialized Interactive Widget */}
                      {card.widget}
                    </div>

                    {/* Bottom CTA Strip */}
                    <div className="pt-4 border-t border-[#DDD2C0]/60 flex items-center justify-between text-xs font-mono">
                      <span
                        className={cn(
                          "font-bold flex items-center gap-1.5",
                          card.borderAccent ? "text-[#843D35]" : "text-[#142B3A]/70"
                        )}
                      >
                        {card.borderAccent && (
                          <span className="h-2 w-2 rounded-full bg-[#843D35] animate-pulse" />
                        )}
                        {card.ctaCategory}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 font-bold transition-all duration-200",
                          isActive
                            ? "text-[#0D1B24] translate-x-1 text-[#D96B3B]"
                            : "text-[#0D1B24] group-hover:text-[#D96B3B] group-hover:translate-x-1"
                        )}
                      >
                        <span>{card.ctaText}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#D96B3B]" />
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Mobile & Tablet Slider Track (< 1024px) */}
          <div className="lg:hidden relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {CARDS.map((card) => {
                const IconComponent = card.icon;

                return (
                  <div key={card.id} className="w-full shrink-0 px-1">
                    <Link
                      href={card.href}
                      className={cn(
                        "group block h-full p-6 sm:p-7 rounded-3xl bg-[#FAF8F5] border-2 transition-all shadow-md text-left flex flex-col justify-between relative overflow-hidden",
                        card.borderAccent
                          ? "border-[#D96B3B] shadow-lg"
                          : "border-[#142B3A] shadow-lg"
                      )}
                    >
                      {/* Active Top Line */}
                      <div
                        className={cn(
                          "absolute top-0 left-0 right-0 h-1.5",
                          card.borderAccent
                            ? "bg-gradient-to-r from-[#D96B3B] to-[#843D35]"
                            : "bg-gradient-to-r from-[#142B3A] to-[#245463]"
                        )}
                      />

                      <div>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-11 w-11 rounded-2xl flex items-center justify-center shadow-2xs shrink-0",
                                card.iconBg,
                                card.iconColor,
                                card.borderAccent && "border border-[#D96B3B]/40"
                              )}
                            >
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A9533D] font-extrabold block">
                                {card.tag}
                              </span>
                              <h3 className="text-lg font-extrabold text-[#0D1B24] tracking-tight">
                                {card.title}
                              </h3>
                            </div>
                          </div>
                          <span
                            className={cn(
                              "text-2xl font-mono font-black",
                              card.borderAccent ? "text-[#D96B3B]" : "text-[#142B3A]"
                            )}
                          >
                            {card.num}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[#142B3A]/85 leading-relaxed mb-5">
                          {card.description}
                        </p>

                        {/* Widget */}
                        {card.widget}
                      </div>

                      {/* Bottom CTA */}
                      <div className="pt-4 border-t border-[#DDD2C0]/60 flex items-center justify-between text-xs font-mono">
                        <span
                          className={cn(
                            "font-bold flex items-center gap-1.5",
                            card.borderAccent ? "text-[#843D35]" : "text-[#142B3A]/70"
                          )}
                        >
                          {card.borderAccent && (
                            <span className="h-2 w-2 rounded-full bg-[#843D35] animate-pulse" />
                          )}
                          {card.ctaCategory}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-bold text-[#0D1B24] group-hover:text-[#D96B3B]">
                          <span>{card.ctaText}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#D96B3B]" />
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar Indicator: ● ━━━ ○ ━━━ ○ */}
        <div className="flex items-center justify-center gap-3 pt-6 font-mono text-xs">
          {CARDS.map((card, idx) => {
            const isActive = idx === activeIndex;

            return (
              <button
                key={card.id}
                onClick={() => handleSelect(idx)}
                aria-label={`Go to slide ${card.num}: ${card.title}`}
                className="group flex items-center gap-2 p-1.5 cursor-pointer"
              >
                {/* Bullet Dot */}
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-all duration-300",
                    isActive
                      ? "bg-[#D96B3B] ring-4 ring-[#D96B3B]/20 scale-125"
                      : "bg-[#DDD2C0] group-hover:bg-[#142B3A]/60"
                  )}
                />

                {/* Connecting Line Segment (except for last item) */}
                {idx < CARDS.length - 1 && (
                  <span
                    className={cn(
                      "w-8 sm:w-12 h-[2px] rounded-full transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-[#D96B3B] to-[#DDD2C0]"
                        : "bg-[#DDD2C0]/60"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
