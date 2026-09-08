"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { NAV_ITEMS, APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Compass,
  Layers,
  Gauge,
  AlertTriangle,
  Bot,
  FileText,
  GitCompare,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";

// Icon lookup dictionary to avoid dynamic require
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Compass,
  Layers,
  Gauge,
  AlertTriangle,
  Bot,
  FileText,
  GitCompare,
  BarChart3,
  ShieldCheck,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapse,
  } = useUIStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-200 ease-in-out lg:static lg:z-10",
          sidebarCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* App & Organization Brand Header */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-border bg-background-secondary/50">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden group"
          >
            <div className="h-8 w-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
              <Flame className="h-4 w-4 text-warning fill-warning/30" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground truncate">
                  {APP_CONFIG.name}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground truncate">
                  eRTMAC-NWIS
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleSidebarCollapse}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex h-6 w-6 rounded items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          <div className="px-2 py-1">
            {!sidebarCollapsed && (
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
                Operations Menu
              </span>
            )}
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                title={sidebarCollapsed ? item.title : undefined}
                className={cn(
                  "group flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors select-none",
                  isActive
                    ? "bg-muted text-foreground border-l-2 border-telemetry shadow-xs font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-telemetry"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />

                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "ml-2 px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold tracking-wider",
                          item.badgeVariant === "telemetry" &&
                            "bg-telemetry/15 text-telemetry border border-telemetry/30",
                          item.badgeVariant === "warning" &&
                            "bg-warning/15 text-warning border border-warning/30",
                          !item.badgeVariant &&
                            "bg-muted text-muted-foreground border border-border"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Control Room Rig Status Footer */}
        <div className="p-2.5 border-t border-border bg-background-secondary/30">
          {!sidebarCollapsed ? (
            <div className="flex flex-col space-y-1 text-[10px] font-mono">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>SYSTEM STATUS</span>
                <span className="text-success font-semibold">ONLINE</span>
              </div>
              <div className="text-[9px] text-muted-foreground/80 truncate">
                {APP_CONFIG.organization}
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="System Online">
              <div className="h-2 w-2 rounded-full bg-success" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
