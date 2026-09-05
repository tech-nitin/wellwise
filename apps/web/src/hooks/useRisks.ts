import { useQuery } from "@tanstack/react-query";
import { risksService } from "@/services/risks.service";
import { RiskAlert, RiskMatrixSummary } from "@/types/risk";

export function useActiveRisks(wellId: string) {
  return useQuery<RiskAlert[]>({
    queryKey: ["risks", "active", wellId],
    queryFn: () => risksService.getActiveRisks(wellId),
    enabled: false,
  });
}

export function useRiskSummary(wellId: string) {
  return useQuery<RiskMatrixSummary>({
    queryKey: ["risks", "summary", wellId],
    queryFn: () => risksService.getRiskSummary(wellId),
    enabled: false,
  });
}
