/**
 * Industrial formatting utilities for drilling engineering parameters.
 */

export function formatDepth(meters: number, precision = 1): string {
  if (isNaN(meters)) return "--";
  return `${meters.toFixed(precision)} m`;
}

export function formatROP(metersPerHour: number, precision = 1): string {
  if (isNaN(metersPerHour)) return "--";
  return `${metersPerHour.toFixed(precision)} m/h`;
}

export function formatWOB(kiloPounds: number, precision = 1): string {
  if (isNaN(kiloPounds)) return "--";
  return `${kiloPounds.toFixed(precision)} klbf`;
}

export function formatRPM(rpm: number): string {
  if (isNaN(rpm)) return "--";
  return `${Math.round(rpm)} RPM`;
}

export function formatTorque(kNm: number, precision = 1): string {
  if (isNaN(kNm)) return "--";
  return `${kNm.toFixed(precision)} kNm`;
}

export function formatPressure(psi: number): string {
  if (isNaN(psi)) return "--";
  return `${Math.round(psi)} psi`;
}

export function formatFlowRate(gpm: number): string {
  if (isNaN(gpm)) return "--";
  return `${Math.round(gpm)} gpm`;
}

export function formatMudWeight(ppg: number, precision = 2): string {
  if (isNaN(ppg)) return "--";
  return `${ppg.toFixed(precision)} ppg`;
}

export function formatGas(units: number, precision = 1): string {
  if (isNaN(units)) return "--";
  return `${units.toFixed(precision)} %`;
}

export function formatTimestampIST(isoStringOrDate?: string | Date): string {
  const d = isoStringOrDate ? new Date(isoStringOrDate) : new Date();
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d) + " IST";
}

export function formatTimestampUTC(isoStringOrDate?: string | Date): string {
  const d = isoStringOrDate ? new Date(isoStringOrDate) : new Date();
  return d.toISOString().replace("T", " ").substring(0, 19) + " UTC";
}
