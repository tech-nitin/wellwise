import { apiGet } from "./api";
import { TelemetryPoint, TelemetryStreamStatus } from "@/types/telemetry";
import { ApiResponse } from "@/types/api";

export const telemetryService = {
  async getLatestTelemetry(wellId: string): Promise<TelemetryPoint> {
    const response = await apiGet<ApiResponse<TelemetryPoint>>(
      `/telemetry/${wellId}/latest`
    );
    return response.data;
  },

  async getTelemetryHistory(
    wellId: string,
    limit = 100
  ): Promise<TelemetryPoint[]> {
    const response = await apiGet<ApiResponse<TelemetryPoint[]>>(
      `/telemetry/${wellId}/history`,
      { limit }
    );
    return response.data;
  },

  async getStreamStatus(wellId: string): Promise<TelemetryStreamStatus> {
    const response = await apiGet<ApiResponse<TelemetryStreamStatus>>(
      `/telemetry/${wellId}/status`
    );
    return response.data;
  },
};
