import type { Edge, Node, XYPosition } from "@xyflow/react";
import { create } from "zustand";
import type { ElementTypeValue } from "../types/element";
import type { RelationshipTypeValue } from "../types/relationship";

// Re-export types from typed stores for backward compatibility.
// New code should import from arch-canvas.ts or class-canvas.ts directly.
export type {
  ElementNodeData,
  RelationshipEdgeData,
} from "./arch-canvas";
export type {
  ClassEdgeData,
  ClassNodeData,
} from "./class-canvas";

import type { ElementNodeData, RelationshipEdgeData } from "./arch-canvas";
import type { ClassEdgeData, ClassNodeData } from "./class-canvas";

/** @deprecated Import from arch-canvas.ts or class-canvas.ts instead. */
export type CanvasNode = Node<ElementNodeData | ClassNodeData>;
/** @deprecated Import from arch-canvas.ts or class-canvas.ts instead. */
export type CanvasEdge = Edge<RelationshipEdgeData | ClassEdgeData>;

export interface PendingConnection {
  sourceNodeId: string;
  targetNodeId: string;
  allowedTypes: RelationshipTypeValue[];
}

export interface ElementInsertRequest {
  elementId: string;
  elementType: ElementTypeValue;
  name: string;
  description?: string;
  status: "DRAFT" | "VALIDATED" | "DEPRECATED";
  token: number;
}

interface CanvasSnapshot {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

const MAX_HISTORY = 50;

export interface CanvasState {
  diagramId: string | null;
  modelId: string | null;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  pendingConnection: PendingConnection | null;
  insertRequest: ElementInsertRequest | null;

  past: CanvasSnapshot[];
  future: CanvasSnapshot[];
  canUndo: boolean;
  canRedo: boolean;

  initCanvas: (
    diagramId: string,
    modelId: string,
    nodes: CanvasNode[],
    edges: CanvasEdge[],
  ) => void;
  setNodes: (nodes: CanvasNode[]) => void;
  setEdges: (edges: CanvasEdge[]) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  addNode: (node: CanvasNode) => void;
  updateNodePosition: (id: string, position: XYPosition) => void;
  updateNode: (id: string, partial: Partial<CanvasNode>) => void;
  updateNodeData: (
    id: string,
    data: Partial<ElementNodeData | ClassNodeData>,
  ) => void;
  updateEdgeData: (
    id: string,
    data: Partial<RelationshipEdgeData | ClassEdgeData>,
  ) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: CanvasEdge) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setPendingConnection: (conn: PendingConnection | null) => void;
  requestElementInsert: (req: Omit<ElementInsertRequest, "token">) => void;
  clearInsertRequest: () => void;
  reset: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  diagramId: null,
  modelId: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  pendingConnection: null,
  insertRequest: null,
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  initCanvas: (diagramId, modelId, nodes, edges) =>
    set({
      diagramId,
      modelId,
      nodes,
      edges,
      selectedNodeId: null,
      selectedEdgeId: null,
      insertRequest: null,
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    }),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  pushHistory: () =>
    set((s) => {
      const snapshot: CanvasSnapshot = { nodes: s.nodes, edges: s.edges };
      const newPast = [...s.past, snapshot].slice(-MAX_HISTORY);
      return { past: newPast, future: [], canUndo: true, canRedo: false };
    }),

  undo: () =>
    set((s) => {
      if (s.past.length === 0) return {};
      const newPast = [...s.past];
      const prev = newPast.pop();
      const newFuture = [...s.future, { nodes: s.nodes, edges: s.edges }];
      return {
        nodes: prev?.nodes,
        edges: prev?.edges,
        past: newPast,
        future: newFuture,
        canUndo: newPast.length > 0,
        canRedo: true,
        selectedNodeId: null,
        selectedEdgeId: null,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return {};
      const newFuture = [...s.future];
      const next = newFuture.pop();
      const newPast = [...s.past, { nodes: s.nodes, edges: s.edges }];
      return {
        nodes: next?.nodes,
        edges: next?.edges,
        past: newPast,
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
        selectedNodeId: null,
        selectedEdgeId: null,
      };
    }),

  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),

  updateNodePosition: (id, position) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, position } : n,
      ) as CanvasNode[],
    })),

  updateNode: (id, partial) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, ...partial } : n,
      ) as CanvasNode[],
    })),

  updateNodeData: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
      ) as CanvasNode[],
    })),

  updateEdgeData: (id, data) =>
    set((s) => ({
      edges: s.edges.map((e) =>
        e.id === id ? { ...e, data: { ...e.data, ...data } } : e,
      ) as CanvasEdge[],
    })),

  removeNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),

  addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),

  removeEdge: (id) =>
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
      selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
    })),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  setPendingConnection: (conn) => set({ pendingConnection: conn }),

  requestElementInsert: (req) =>
    set({ insertRequest: { ...req, token: Date.now() } }),
  clearInsertRequest: () => set({ insertRequest: null }),

  reset: () =>
    set({
      diagramId: null,
      modelId: null,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      pendingConnection: null,
      insertRequest: null,
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    }),
}));
