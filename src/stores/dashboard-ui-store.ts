import { create } from "zustand";
import type { DashboardUiState } from "@/types/ui";

export const useDashboardUiStore = create<DashboardUiState>((set) => ({
  tableDensity: "comfortable",
  setTableDensity: (tableDensity) => set({ tableDensity }),
}));
