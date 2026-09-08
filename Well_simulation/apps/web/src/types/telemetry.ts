/**
 * Domain types for Real-Time Drilling Telemetry (WITS0 / WITSML feeds).
 */

export interface TelemetryPoint {
  timestamp: string;
  wellId: string;
  measuredDepth: number; // m
  trueVerticalDepth: number; // m
  rateOfPenetration: number; // m/h
  weightOnBit: number; // klbf
  rotaryRPM: number; // rpm
  torque: number; // kNm
  standpipePressure: number; // psi
  flowInRate: number; // gpm
  flowOutPercentage: number; // %
  mudWeightIn: number; // ppg
  mudWeightOut: number; // ppg
  totalGas: number; // %
  differentialPressure?: number; // psi
  hookLoad?: number; // klbf
}

export interface TelemetryStreamStatus {
  connected: boolean;
  rigId: string;
  activeWellId: string;
  lastPacketReceivedAt: string;
  samplingIntervalMs: number;
  dataQuality: "EXCELLENT" | "DEGRADED" | "DISCONNECTED";
  activeSensorsCount: number;
}
