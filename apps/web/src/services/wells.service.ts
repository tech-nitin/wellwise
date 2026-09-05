import { apiGet } from "./api";
import { Well, OffsetWellSummary } from "@/types/well";
import { ApiResponse } from "@/types/api";

export const wellsService = {
  async getAllWells(): Promise<Well[]> {
    const response = await apiGet<ApiResponse<Well[]>>("/wells");
    return response.data;
  },

  async getWellById(wellId: string): Promise<Well> {
    const response = await apiGet<ApiResponse<Well>>(`/wells/${wellId}`);
    return response.data;
  },

  async getNearbyWells(
    wellId: string,
    radiusMeters = 5000
  ): Promise<OffsetWellSummary[]> {
    const response = await apiGet<ApiResponse<OffsetWellSummary[]>>(
      `/wells/${wellId}/nearby`,
      { radius: radiusMeters }
    );
    return response.data;
  },
};
