import { create } from "zustand";
import type { ScenarioCanvasNode, ScenarioCanvasEdge } from "@/modules/model/ui/types/scenario";

export type { ScenarioCanvasNode, ScenarioCanvasEdge };

interface ScenarioCanvasState {
  nodes: ScenarioCanvasNode[];
  edges: ScenarioCanvasEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  diagramId: string | null;
  modelId: string | null;
  history: {
    past: Array<{ nodes: ScenarioCanvasNode[]; edges: ScenarioCanvasEdge[] }>;
    future: Array<{ nodes: ScenarioCanvasNode[]; edges: ScenarioCanvasEdge[] }>;
  };

  initCanvas: (
    diagramId: string,
    modelId: string,
    nodes: ScenarioCanvasNode[],
    edges: ScenarioCanvasEdge[],
  ) => void;
  reset: () => void;
  setNodes: (nodes: ScenarioCanvasNode[]) => void;
  setEdges: (edges: ScenarioCanvasEdge[]) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  addNode: (node: ScenarioCanvasNode) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: ScenarioCanvasEdge) => void;
  removeEdge: (id: string) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export const useScenarioCanvasStore = create<ScenarioCanvasState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  diagramId: null,
  modelId: null,
  history: { past: [], future: [] },

  initCanvas: (diagramId, modelId, nodes, edges) =>
    set({
      diagramId,
      modelId,
      nodes,
      edges,
      selectedNodeId: null,
      selectedEdgeId: null,
      history: { past: [], future: [] },
    }),

  reset: () =>
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      diagramId: null,
      modelId: null,
      history: { past: [], future: [] },
    }),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    })),

  addEdge: (edge) =>
    set((state) => ({ edges: [...state.edges, edge] })),

  removeEdge: (id) =>
    set((state) => ({ edges: state.edges.filter((e) => e.id !== id) })),

  updateNodePosition: (id, position) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, position } : n,
      ),
    })),

  pushHistory: () =>
    set((state) => ({
      history: {
        past: [
          ...state.history.past,
          { nodes: state.nodes, edges: state.edges },
        ],
        future: [],
      },
    })),

  undo: () =>
    set((state) => {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      return {
        nodes: previous.nodes,
        edges: previous.edges,
        history: {
          past: state.history.past.slice(0, -1),
          future: [{ nodes: state.nodes, edges: state.edges }, ...state.history.future],
        },
      };
    }),

  redo: () =>
    set((state) => {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      return {
        nodes: next.nodes,
        edges: next.edges,
        history: {
          past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
          future: state.history.future.slice(1),
        },
      };
    }),
}));