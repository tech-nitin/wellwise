import { useQuery } from "@tanstack/react-query";
import { wellsService } from "@/services/wells.service";
import { Well, OffsetWellSummary } from "@/types/well";

export function useWells() {
  return useQuery<Well[]>({
    queryKey: ["wells"],
    queryFn: () => wellsService.getAllWells(),
    enabled: false, // Set to false by default until backend is connected
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useWell(wellId: string) {
  return useQuery<Well>({
    queryKey: ["well", wellId],
    queryFn: () => wellsService.getWellById(wellId),
    enabled: false,
  });
}

export function useNearbyWells(wellId: string, radiusMeters: number) {
  return useQuery<OffsetWellSummary[]>({
    queryKey: ["nearby-wells", wellId, radiusMeters],
    queryFn: () => wellsService.getNearbyWells(wellId, radiusMeters),
    enabled: false,
  });
}
