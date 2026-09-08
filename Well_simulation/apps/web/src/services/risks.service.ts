import { apiGet, apiPost } from "./api";
import { RiskAlert, RiskMatrixSummary } from "@/types/risk";
import { ApiResponse } from "@/types/api";

export const risksService = {
  async getActiveRisks(wellId: string): Promise<RiskAlert[]> {
    const response = await apiGet<ApiResponse<RiskAlert[]>>(
      `/risks/${wellId}/active`
    );
    return response.data;
  },

  async getRiskSummary(wellId: string): Promise<RiskMatrixSummary> {
    const response = await apiGet<ApiResponse<RiskMatrixSummary>>(
      `/risks/${wellId}/summary`
    );
    return response.data;
  },

  async acknowledgeRisk(riskId: string): Promise<RiskAlert> {
    const response = await apiPost<ApiResponse<RiskAlert>>(
      `/risks/${riskId}/acknowledge`
    );
    return response.data;
  },
};
