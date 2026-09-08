"use client";

import React from "react";
import { Header } from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-[#E86A1A]/20 selection:text-[#141A29]">
      {/* Full-width sticky navigation header */}
      <Header />

      {/* Main dashboard & views scrollable canvas */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
