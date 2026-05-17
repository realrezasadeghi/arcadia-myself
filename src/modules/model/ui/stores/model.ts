import { create } from "zustand";

type SaveStatus = "saved" | "saving" | "dirty" | "error";

interface ModelState {
  saveStatus: SaveStatus;
  pendingChanges: number;
  setSaveStatus: (status: SaveStatus) => void;
  incrementPending: () => void;
  resetPending: () => void;

  selectedElementIds: string[];
  setSelectedElements: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useModelStore = create<ModelState>((set) => ({
  saveStatus: "saved",
  pendingChanges: 0,
  setSaveStatus: (saveStatus) => set({ saveStatus }),
  incrementPending: () =>
    set((s) => ({ pendingChanges: s.pendingChanges + 1, saveStatus: "dirty" })),
  resetPending: () => set({ pendingChanges: 0, saveStatus: "saved" }),

  selectedElementIds: [],
  setSelectedElements: (selectedElementIds) => set({ selectedElementIds }),
  clearSelection: () => set({ selectedElementIds: [] }),
}));
