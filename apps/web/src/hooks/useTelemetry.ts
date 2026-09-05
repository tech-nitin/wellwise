import { useQuery } from "@tanstack/react-query";
import { telemetryService } from "@/services/telemetry.service";
import { TelemetryPoint, TelemetryStreamStatus } from "@/types/telemetry";

export function useTelemetry(wellId: string) {
  return useQuery<TelemetryPoint>({
    queryKey: ["telemetry", "latest", wellId],
    queryFn: () => telemetryService.getLatestTelemetry(wellId),
    enabled: false,
    refetchInterval: false,
  });
}

export function useTelemetryStreamStatus(wellId: string) {
  return useQuery<TelemetryStreamStatus>({
    queryKey: ["telemetry", "status", wellId],
    queryFn: () => telemetryService.getStreamStatus(wellId),
    enabled: false,
  });
}
