import { create } from "zustand";

interface MonitoringState {
  isStreaming: boolean;
  timeWindowSeconds: number; // 300 = 5 min, 900 = 15 min, 3600 = 1 hr
  autoScroll: boolean;
  setIsStreaming: (streaming: boolean) => void;
  setTimeWindowSeconds: (seconds: number) => void;
  setAutoScroll: (scroll: boolean) => void;
}

export const useMonitoringStore = create<MonitoringState>((set) => ({
  isStreaming: true,
  timeWindowSeconds: 900,
  autoScroll: true,
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  setTimeWindowSeconds: (seconds) => set({ timeWindowSeconds: seconds }),
  setAutoScroll: (scroll) => set({ autoScroll: scroll }),
}));
