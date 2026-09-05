"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  ArrowRight,
  Compass,
  Layers,
  Activity,
  ShieldAlert,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<"wells" | "intelligence" | null>(null);
  const [mobileWellsOpen, setMobileWellsOpen] = useState(false);
  const [mobileIntelOpen, setMobileIntelOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Scroll detection for subtle elevation and compact height
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut listener for Search modal (Escape to close, Cmd+K / Ctrl+K to open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when search modal opens
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Dropdown hover delay helpers
  const handleMouseEnter = (menu: "wells" | "intelligence") => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Smooth scroll handler for "Explore Wells" or map links
  const handleScrollToMap = (e: React.MouseEvent) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (pathname === "/dashboard" || pathname === "/") {
      const el = document.getElementById("nearby-wells-map");
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Active route helpers
  const isOverviewActive = pathname === "/dashboard" || pathname === "/";
  const isWellsActive =
    pathname === "/nearby-wells" ||
    pathname.startsWith("/wells") ||
    pathname.includes("wells");
  const isMonitoringActive = pathname === "/live-monitoring";
  const isIntelligenceActive =
    pathname === "/risks" || pathname === "/knowledge";

  // Mock search suggestions
  const suggestedSearches = [
    { label: "Well NHK-124", desc: "Active drilling target (Assam Basin)", href: "/dashboard#nearby-wells-map" },
    { label: "Demo Well — Cambay", desc: "Ankleshwar formation benchmark (Gujarat)", href: "/dashboard#nearby-wells-map" },
    { label: "Demo Well — Bhopal", desc: "Central Vindhyan demo monitoring (MP)", href: "/dashboard#nearby-wells-map" },
    { label: "Demo Well — Indore", desc: "Deccan Trap basalt monitoring (MP)", href: "/dashboard#nearby-wells-map" },
    { label: "Differential Sticking", desc: "Early warning hazard mitigation", href: "/risks" },
    { label: "Live ROP Telemetry", desc: "Real-time surface & downhole MWD", href: "/live-monitoring" },
    { label: "Ask the Field", desc: "Natural-language DDR knowledge search", href: "/knowledge" },
  ];

  const filteredSuggestions = searchQuery.trim()
    ? suggestedSearches.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : suggestedSearches;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200 border-b select-none",
          scrolled
            ? "h-[66px] bg-[#F5F0E6]/92 backdrop-blur-md border-[#E9E4DA] shadow-[0_2px_12px_rgba(20,43,58,0.05)]"
            : "h-[74px] bg-[#F5F0E6]/85 backdrop-blur-sm border-[#E9E4DA]/80 shadow-none"
        )}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center justify-between">
          {/* 1. Left: WellWise Branding */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
            aria-label="WellWise Home"
          >
            <div className="h-9 w-9 rounded-[10px] bg-[#142B3A] flex items-center justify-center text-white shadow-2xs group-hover:bg-[#245463] transition-colors shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 3L12 13" stroke="#F5F0E6" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M7 8L12 13L17 8"
                  stroke="#F5F0E6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.8"
                />
                <path
                  d="M9 14L12 17L15 14"
                  stroke="#D96B3B"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="20" r="1.5" fill="#D96B3B" />
              </svg>
            </div>

            <span className="text-xl font-bold tracking-tight text-[#142B3A] group-hover:text-[#245463] transition-colors">
              WellWise
            </span>
          </Link>

          {/* 2. Center: Primary Clean Horizontal Navigation */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8" aria-label="Main Navigation">
            {/* Item 1: Overview */}
            <Link
              href="/dashboard"
              className={cn(
                "relative py-1 text-sm font-medium transition-colors cursor-pointer select-none",
                isOverviewActive
                  ? "text-[#142B3A] font-semibold"
                  : "text-[#142B3A]/75 hover:text-[#142B3A]"
              )}
            >
              <span>Overview</span>
              {isOverviewActive && (
                <div className="absolute -bottom-2 left-0 right-0 flex items-center justify-center">
                  <div className="h-[2px] w-full bg-[#142B3A] rounded-full" />
                  <span className="absolute -bottom-0.5 h-1.5 w-1.5 rounded-full bg-[#D96B3B]" />
                </div>
              )}
            </Link>

            {/* Item 2: Wells (Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("wells")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn(
                  "relative py-1 text-sm font-medium transition-colors cursor-pointer select-none flex items-center gap-1",
                  isWellsActive
                    ? "text-[#142B3A] font-semibold"
                    : "text-[#142B3A]/75 hover:text-[#142B3A]"
                )}
                aria-expanded={activeDropdown === "wells"}
              >
                <span>Wells</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200 text-[#142B3A]/60",
                    activeDropdown === "wells" && "rotate-180 text-[#D96B3B]"
                  )}
                />
                {isWellsActive && (
                  <div className="absolute -bottom-2 left-0 right-0 flex items-center justify-center">
                    <div className="h-[2px] w-full bg-[#142B3A] rounded-full" />
                    <span className="absolute -bottom-0.5 h-1.5 w-1.5 rounded-full bg-[#D96B3B]" />
                  </div>
                )}
              </button>

              <AnimatePresence>
                {activeDropdown === "wells" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl bg-[#F5F0E6] border border-[#DDD2C0] shadow-lg backdrop-blur-md z-50 text-left"
                  >
                    <Link
                      href="/dashboard#nearby-wells-map"
                      onClick={handleScrollToMap}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#DDD2C0]/40 transition-colors group cursor-pointer"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0 mt-0.5">
                        <Compass className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-[#0D1B24] group-hover:text-[#D96B3B] transition-colors block">
                          Nearby Wells
                        </span>
                        <span className="text-[11px] text-[#142B3A]/70 leading-snug block">
                          Interactive India GIS proximity map
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/wells/NHK-124"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#DDD2C0]/40 transition-colors group cursor-pointer mt-1"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#245463] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-[#0D1B24] group-hover:text-[#D96B3B] transition-colors block">
                          Well Intelligence
                        </span>
                        <span className="text-[11px] text-[#142B3A]/70 leading-snug block">
                          Deep geological &amp; log evaluation
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Item 3: Monitoring */}
            <Link
              href="/live-monitoring"
              className={cn(
                "relative py-1 text-sm font-medium transition-colors cursor-pointer select-none",
                isMonitoringActive
                  ? "text-[#142B3A] font-semibold"
                  : "text-[#142B3A]/75 hover:text-[#142B3A]"
              )}
            >
              <span>Monitoring</span>
              {isMonitoringActive && (
                <div className="absolute -bottom-2 left-0 right-0 flex items-center justify-center">
                  <div className="h-[2px] w-full bg-[#142B3A] rounded-full" />
                  <span className="absolute -bottom-0.5 h-1.5 w-1.5 rounded-full bg-[#D96B3B]" />
                </div>
              )}
            </Link>

            {/* Item 4: Intelligence (Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("intelligence")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn(
                  "relative py-1 text-sm font-medium transition-colors cursor-pointer select-none flex items-center gap-1",
                  isIntelligenceActive
                    ? "text-[#142B3A] font-semibold"
                    : "text-[#142B3A]/75 hover:text-[#142B3A]"
                )}
                aria-expanded={activeDropdown === "intelligence"}
              >
                <span>Intelligence</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200 text-[#142B3A]/60",
                    activeDropdown === "intelligence" && "rotate-180 text-[#D96B3B]"
                  )}
                />
                {isIntelligenceActive && (
                  <div className="absolute -bottom-2 left-0 right-0 flex items-center justify-center">
                    <div className="h-[2px] w-full bg-[#142B3A] rounded-full" />
                    <span className="absolute -bottom-0.5 h-1.5 w-1.5 rounded-full bg-[#D96B3B]" />
                  </div>
                )}
              </button>

              <AnimatePresence>
                {activeDropdown === "intelligence" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl bg-[#F5F0E6] border border-[#DDD2C0] shadow-lg backdrop-blur-md z-50 text-left"
                  >
                    <Link
                      href="/risks"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#DDD2C0]/40 transition-colors group cursor-pointer"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#A9533D]/20 text-[#A9533D] flex items-center justify-center shrink-0 mt-0.5 border border-[#A9533D]/30">
                        <ShieldAlert className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-[#0D1B24] group-hover:text-[#A9533D] transition-colors block">
                          Risk Intelligence
                        </span>
                        <span className="text-[11px] text-[#142B3A]/70 leading-snug block">
                          Precursor pattern hazard alerts
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/knowledge"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#DDD2C0]/40 transition-colors group cursor-pointer mt-1"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#245463] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-[#0D1B24] group-hover:text-[#D96B3B] transition-colors block">
                          Ask the Field
                        </span>
                        <span className="text-[11px] text-[#142B3A]/70 leading-snug block">
                          AI reasoning on DDR drilling archives
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* 3. Right: Search Button, Profile / User & Primary Copper CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Icon Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-[#245463] hover:text-[#142B3A] hover:bg-[#DDD2C0]/40 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Search Platform"
              title="Search (Press Esc or Ctrl+K)"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </button>

            {/* Profile / User Icon Button */}
            <Link
              href="/login"
              className="p-2 rounded-lg text-[#142B3A] hover:text-[#245463] hover:bg-[#DDD2C0]/40 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="User Account"
              title="User Profile & Access"
            >
              <User className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </Link>

            {/* Primary Copper CTA: "Explore Wells" */}
            <Link
              href="/dashboard#nearby-wells-map"
              onClick={handleScrollToMap}
              className="hidden sm:inline-flex items-center justify-center px-4.5 py-2.5 rounded-lg bg-[#D96B3B] hover:bg-[#c45a2c] active:bg-[#b54f24] text-white text-sm font-bold tracking-normal transition-all duration-200 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 cursor-pointer select-none border border-[#D96B3B]/30"
            >
              Explore Wells
            </Link>

            {/* Compact Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg text-[#245463] hover:text-[#142B3A] hover:bg-[#DDD2C0]/40 transition-colors cursor-pointer flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" strokeWidth={2.2} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={2.2} />
              )}
            </button>
          </div>
        </div>

        {/* 4. Clean Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="lg:hidden w-full border-b border-[#DDD2C0] bg-[#F5F0E6] shadow-md px-5 py-4 overflow-hidden text-left"
            >
              <div className="flex flex-col space-y-3">
                {/* Mobile Overview */}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                    isOverviewActive
                      ? "bg-[#DDD2C0]/50 text-[#142B3A]"
                      : "text-[#142B3A]/80 hover:bg-[#DDD2C0]/30"
                  )}
                >
                  Overview
                </Link>

                {/* Mobile Wells Accordion */}
                <div className="space-y-1">
                  <button
                    onClick={() => setMobileWellsOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-[#142B3A] hover:bg-[#DDD2C0]/30 transition-colors"
                  >
                    <span>Wells</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#142B3A]/60 transition-transform duration-200",
                        mobileWellsOpen && "rotate-180 text-[#D96B3B]"
                      )}
                    />
                  </button>
                  {mobileWellsOpen && (
                    <div className="pl-4 pr-2 py-1 space-y-1">
                      <Link
                        href="/dashboard#nearby-wells-map"
                        onClick={handleScrollToMap}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#142B3A] hover:bg-[#DDD2C0]/40"
                      >
                        <Compass className="h-3.5 w-3.5 text-[#D96B3B]" />
                        <span>Nearby Wells (India GIS)</span>
                      </Link>
                      <Link
                        href="/wells/NHK-124"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#142B3A] hover:bg-[#DDD2C0]/40"
                      >
                        <Layers className="h-3.5 w-3.5 text-[#245463]" />
                        <span>Well Intelligence</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Monitoring */}
                <Link
                  href="/live-monitoring"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                    isMonitoringActive
                      ? "bg-[#DDD2C0]/50 text-[#142B3A]"
                      : "text-[#142B3A]/80 hover:bg-[#DDD2C0]/30"
                  )}
                >
                  Monitoring
                </Link>

                {/* Mobile Intelligence Accordion */}
                <div className="space-y-1">
                  <button
                    onClick={() => setMobileIntelOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-[#142B3A] hover:bg-[#DDD2C0]/30 transition-colors"
                  >
                    <span>Intelligence</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#142B3A]/60 transition-transform duration-200",
                        mobileIntelOpen && "rotate-180 text-[#D96B3B]"
                      )}
                    />
                  </button>
                  {mobileIntelOpen && (
                    <div className="pl-4 pr-2 py-1 space-y-1">
                      <Link
                        href="/risks"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#142B3A] hover:bg-[#DDD2C0]/40"
                      >
                        <ShieldAlert className="h-3.5 w-3.5 text-[#A9533D]" />
                        <span>Risk Intelligence</span>
                      </Link>
                      <Link
                        href="/knowledge"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#142B3A] hover:bg-[#DDD2C0]/40"
                      >
                        <Bot className="h-3.5 w-3.5 text-[#245463]" />
                        <span>Ask the Field (AI RAG)</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Profile & CTA */}
                <div className="pt-3 border-t border-[#DDD2C0] flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#DDD2C0] text-sm font-semibold text-[#142B3A] hover:bg-[#DDD2C0]/30"
                  >
                    <User className="h-4 w-4 text-[#142B3A]" />
                    <span>Account Profile</span>
                  </Link>
                  <Link
                    href="/dashboard#nearby-wells-map"
                    onClick={handleScrollToMap}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#D96B3B] text-white text-sm font-bold"
                  >
                    <span>Explore Wells</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* 5. Spotlight Search Modal (Cmd+K / Ctrl+K / Search Icon) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-[#0D1B24]/40 backdrop-blur-xs flex items-start justify-center pt-20 sm:pt-28 px-4"
            onClick={handleCloseSearch}
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl bg-[#F5F0E6] border border-[#DDD2C0] rounded-2xl shadow-xl overflow-hidden text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input Bar */}
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-[#DDD2C0] bg-[#FAF8F5]">
                <Search className="h-5 w-5 text-[#245463] shrink-0" strokeWidth={2.2} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wells, basins, formations, offset incidents..."
                  className="w-full bg-transparent text-sm sm:text-base font-normal text-[#0D1B24] placeholder-[#245463]/60 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded text-[#245463] hover:text-[#0D1B24] text-xs font-mono"
                  >
                    Clear
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#DDD2C0]/40 text-[#0D1B24] border border-[#DDD2C0]">
                  ESC
                </kbd>
                <button
                  onClick={handleCloseSearch}
                  className="sm:hidden p-1 text-[#245463] hover:text-[#0D1B24]"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="p-4 max-h-[340px] overflow-y-auto space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#245463] font-bold px-2">
                  {searchQuery.trim() ? "Search Results" : "Quick Suggestions"}
                </div>

                <div className="space-y-1">
                  {filteredSuggestions.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={handleCloseSearch}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#DDD2C0]/30 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-[#142B3A] text-[#D96B3B] flex items-center justify-center shrink-0">
                          <Compass className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-[#0D1B24] group-hover:text-[#A9533D] transition-colors block leading-snug">
                            {item.label}
                          </span>
                          <span className="text-xs text-[#245463]/80 block leading-snug">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#245463] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}

                  {filteredSuggestions.length === 0 && (
                    <div className="py-8 text-center text-xs text-[#245463] font-mono">
                      No matching records found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>

                {/* Technical Quick Category Pills */}
                <div className="pt-3 border-t border-[#DDD2C0]/70 px-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#245463] mr-1">Modules:</span>
                  <Link
                    href="/dashboard#nearby-wells-map"
                    onClick={handleCloseSearch}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#DDD2C0] text-[11px] text-[#0D1B24] hover:border-[#142B3A] transition-colors font-medium"
                  >
                    <Compass className="h-3 w-3 text-[#245463]" />
                    <span>Well Map</span>
                  </Link>
                  <Link
                    href="/live-monitoring"
                    onClick={handleCloseSearch}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#DDD2C0] text-[11px] text-[#0D1B24] hover:border-[#142B3A] transition-colors font-medium"
                  >
                    <Activity className="h-3 w-3 text-[#D96B3B]" />
                    <span>Live Monitoring</span>
                  </Link>
                  <Link
                    href="/risks"
                    onClick={handleCloseSearch}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#DDD2C0] text-[11px] text-[#0D1B24] hover:border-[#A9533D] transition-colors font-medium"
                  >
                    <ShieldAlert className="h-3 w-3 text-[#A9533D]" />
                    <span>Risk Intelligence</span>
                  </Link>
                  <Link
                    href="/knowledge"
                    onClick={handleCloseSearch}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#DDD2C0] text-[11px] text-[#0D1B24] hover:border-[#142B3A] transition-colors font-medium"
                  >
                    <Bot className="h-3 w-3 text-[#245463]" />
                    <span>Knowledge</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
