import { create } from "zustand";
import type { DiagramTypeValue } from "../types/diagram";
import type { LayerValue } from "../types/layer";

/**
 * یک تب باز در ناحیه ویرایشگر (Editor Area).
 * هر تب نماینده یک دیاگرام باز است.
 */
export interface EditorTab {
  diagramId: string;
  modelId: string;
  name: string;
  type: DiagramTypeValue;
  layer: LayerValue;
}

/** پنل‌های قابل نمایش/مخفی در Workbench */
export interface PanelVisibility {
  explorer: boolean;
  properties: boolean;
  outline: boolean;
  semantic: boolean;
  validation: boolean;
}

interface WorkbenchState {
  projectId: string | null;
  projectName: string | null;

  tabs: EditorTab[];
  activeDiagramId: string | null;

  /**
   * المنت انتخاب‌شده از طریق درخت (Project Explorer).
   * انتخاب روی canvas از طریق useCanvasStore مدیریت می‌شود؛
   * این مقدار برای همگام‌سازی انتخاب درختی با پنل Properties / Semantic است.
   */
  selectedElementId: string | null;

  /** لایه فعلی برای نمایش در Layer Switcher */
  currentLayer: LayerValue;

  panels: PanelVisibility;

  setProject: (projectId: string, projectName: string) => void;
  openTab: (tab: EditorTab) => void;
  closeTab: (diagramId: string) => void;
  setActiveTab: (diagramId: string) => void;
  renameTab: (diagramId: string, name: string) => void;

  selectElement: (elementId: string | null) => void;

  setCurrentLayer: (layer: LayerValue) => void;

  togglePanel: (panel: keyof PanelVisibility) => void;
  setPanel: (panel: keyof PanelVisibility, open: boolean) => void;

  /** هنگام تعویض پروژه، کل وضعیت ویرایشگر ریست می‌شود. */
  resetForProject: (projectId: string, projectName: string) => void;
}

const DEFAULT_PANELS: PanelVisibility = {
  explorer: true,
  properties: true,
  outline: false,
  semantic: false,
  validation: false,
};

export const useWorkbenchStore = create<WorkbenchState>((set) => ({
  projectId: null,
  projectName: null,
  tabs: [],
  activeDiagramId: null,
  selectedElementId: null,
  currentLayer: "OA",
  panels: { ...DEFAULT_PANELS },

  setProject: (projectId, projectName) => set({ projectId, projectName }),

  openTab: (tab) =>
    set((s) => {
      const exists = s.tabs.some((t) => t.diagramId === tab.diagramId);
      return {
        tabs: exists ? s.tabs : [...s.tabs, tab],
        activeDiagramId: tab.diagramId,
        currentLayer: tab.layer,
      };
    }),

  closeTab: (diagramId) =>
    set((s) => {
      const index = s.tabs.findIndex((t) => t.diagramId === diagramId);
      if (index === -1) return {};

      const tabs = s.tabs.filter((t) => t.diagramId !== diagramId);

      let activeDiagramId = s.activeDiagramId;
      let currentLayer = s.currentLayer;
      if (s.activeDiagramId === diagramId) {
        const next = tabs[index] ?? tabs[index - 1] ?? null;
        activeDiagramId = next?.diagramId ?? null;
        if (next) currentLayer = next.layer;
      }

      return { tabs, activeDiagramId, currentLayer };
    }),

  setActiveTab: (diagramId) =>
    set((s) => {
      const tab = s.tabs.find((t) => t.diagramId === diagramId);
      return {
        activeDiagramId: diagramId,
        currentLayer: tab?.layer ?? s.currentLayer,
      };
    }),

  renameTab: (diagramId, name) =>
    set((s) => ({
      tabs: s.tabs.map((t) => (t.diagramId === diagramId ? { ...t, name } : t)),
    })),

  selectElement: (selectedElementId) => set({ selectedElementId }),

  setCurrentLayer: (currentLayer) => set({ currentLayer }),

  togglePanel: (panel) =>
    set((s) => ({ panels: { ...s.panels, [panel]: !s.panels[panel] } })),

  setPanel: (panel, open) =>
    set((s) => ({ panels: { ...s.panels, [panel]: open } })),

  resetForProject: (projectId, projectName) =>
    set({
      projectId,
      projectName,
      tabs: [],
      activeDiagramId: null,
      selectedElementId: null,
      currentLayer: "OA",
      panels: { ...DEFAULT_PANELS },
    }),
}));
