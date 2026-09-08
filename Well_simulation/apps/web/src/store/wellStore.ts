import { create } from "zustand";
import { APP_CONFIG } from "@/lib/constants";

interface WellState {
  selectedWellId: string;
  selectedRigId: string;
  offsetRadiusMeters: number;
  setSelectedWellId: (wellId: string) => void;
  setSelectedRigId: (rigId: string) => void;
  setOffsetRadiusMeters: (radius: number) => void;
}

export const useWellStore = create<WellState>((set) => ({
  selectedWellId: APP_CONFIG.defaultWellId,
  selectedRigId: APP_CONFIG.defaultRigId,
  offsetRadiusMeters: 5000,
  setSelectedWellId: (wellId) => set({ selectedWellId: wellId }),
  setSelectedRigId: (rigId) => set({ selectedRigId: rigId }),
  setOffsetRadiusMeters: (radius) => set({ offsetRadiusMeters: radius }),
}));
