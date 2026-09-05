import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AppShell } from "@/components/layout/AppShell";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} | Oil India Limited Control Room`,
    template: `%s | ${APP_CONFIG.name} — eRTMAC-NWIS`,
  },
  description:
    "AI-Powered Offset Well Knowledge and Decision Support Platform for Drilling Operations — Oil India Limited (OIL) SIH26121",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="bg-background text-foreground antialiased min-h-screen">
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
