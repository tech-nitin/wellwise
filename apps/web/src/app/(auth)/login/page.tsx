"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flame, Shield, Lock, UserCheck, AlertCircle } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("nitin.rathore@oilindia.in");
  const [password, setPassword] = useState("••••••••••••");
  const [rig, setRig] = useState("RIG-OIL-04");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-md">
            <Flame className="h-6 w-6 text-warning fill-warning/30" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-foreground font-mono">
            {APP_CONFIG.name}
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            {APP_CONFIG.organization} &bull; eRTMAC-NWIS
          </p>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-telemetry border border-border">
            <Shield className="h-3 w-3" />
            <span>Problem Statement: {APP_CONFIG.problemStatement}</span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border/80 shadow-lg">
          <CardHeader className="space-y-1 pb-3">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Drilling Control Room Authentication
            </CardTitle>
            <CardDescription className="text-xs">
              Enter authorized Oil India Limited engineer credentials to access real-time telemetry and decision support.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <UserCheck className="h-3 w-3 text-telemetry" />
                  Engineer Email / ID
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@oilindia.in"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-telemetry" />
                  Security Passkey
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security passkey"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Rig Operation Station
                </label>
                <select
                  value={rig}
                  onChange={(e) => setRig(e.target.value)}
                  className="flex h-8 w-full rounded border border-border bg-card px-2.5 py-1 text-xs text-foreground font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-telemetry"
                >
                  <option value="RIG-OIL-04">RIG-OIL-04 (Nahorkatiya active drilling)</option>
                  <option value="RIG-OIL-09">RIG-OIL-09 (Moran development)</option>
                  <option value="RTMAC-CENTRAL">RTMAC Central Control Room (Duliajan)</option>
                </select>
              </div>

              <div className="p-2.5 rounded bg-muted/40 border border-border/50 text-[10px] font-mono text-muted-foreground flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                <span>
                  FOUNDATION PROTOTYPE: Click below to sign in as Lead Drilling Engineer. Full OAuth / LDAP will integrate with backend.
                </span>
              </div>

              <Button
                type="submit"
                className="w-full font-mono text-xs uppercase tracking-wider gap-2 h-9"
              >
                Access Control Room
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] font-mono text-muted-foreground">
          &copy; 2026 {APP_CONFIG.organization}. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
