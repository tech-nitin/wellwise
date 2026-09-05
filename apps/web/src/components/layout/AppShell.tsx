"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppLayout } from "./AppLayout";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname?.startsWith("/login");

  if (isAuthRoute) {
    return <main className="min-h-screen bg-background text-foreground">{children}</main>;
  }

  return <AppLayout>{children}</AppLayout>;
}
