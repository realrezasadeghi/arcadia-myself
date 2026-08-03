import type { Edge, Node, XYPosition } from "@xyflow/react";
import { create } from "zustand";
import type { ElementTypeValue } from "../types/element";
import type { RelationshipTypeValue } from "../types/relationship";
import type { ClassElementTypeValue, ClassRelationshipTypeValue } from "../types/class-diagram";

export type ElementNodeData = {
  name: string;
  modelId: string;
  elementId: string;
  description?: string;
  elementType: ElementTypeValue;
  status: "DRAFT" | "VALIDATED" | "DEPRECATED";
};

/** Class diagram node data — extends base with UML-specific fields. */
export type ClassNodeData = {
  name: string;
  modelId: string;
  elementId: string;
  description?: string;
  elementType: ClassElementTypeValue;
  status: "DRAFT" | "VALIDATED" | "DEPRECATED";
  isAbstract?: boolean;
  isStatic?: boolean;
  /** Class properties shown in the attributes compartment. */
  properties?: Array<{
    id: string;
    name: string;
    typeLiteral: string;
    visibility: "public" | "private" | "protected" | "package";
    isStatic: boolean;
    isReadOnly: boolean;
    isDerived: boolean;
    isID: boolean;
    multiplicityLower: number;
    multiplicityUpper: string;
    collectionKind: string;
    defaultValue: string;
  }>;
  /** Class operations shown in the operations compartment. */
  operations?: Array<{
    id: string;
    name: string;
    returnTypeLiteral: string;
    visibility: "public" | "private" | "protected" | "package";
    isStatic: boolean;
    isAbstract: boolean;
    isQuery: boolean;
    parameters?: Array<{
      name: string;
      typeLiteral: string;
      visibility: string;
      multiplicityLower: number;
      multiplicityUpper: string;
    }>;
  }>;
  /** Enumeration literals for ENUM elements. */
  enumerationLiterals?: Array<{
    id: string;
    name: string;
    value: string;
  }>;
};

export type RelationshipEdgeData = {
  name: string;
  modelId: string;
  relationshipId: string;
  description: string;
  relationshipType: RelationshipTypeValue;
};

/** Class diagram edge data — extends base with UML relationship fields. */
export type ClassEdgeData = {
  name: string;
  modelId: string;
  relationshipId: string;
  description: string;
  relationshipType: ClassRelationshipTypeValue;
  aggregationKind?: "NONE" | "SHARED" | "COMPOSITE";
  isDisjoint?: boolean;
  isComplete?: boolean;
  isDerived?: boolean;
  sourceMultiplicityLower?: number;
  sourceMultiplicityUpper?: string;
  targetMultiplicityLower?: number;
  targetMultiplicityUpper?: string;
  sourceRole?: string;
  targetRole?: string;
  isNavigableSource?: boolean;
  isNavigableTarget?: boolean;
};

export type CanvasNode = Node<ElementNodeData | ClassNodeData>;
export type CanvasEdge = Edge<RelationshipEdgeData | ClassEdgeData>;

export interface PendingConnection {
  sourceNodeId: string;
  targetNodeId: string;
  allowedTypes: RelationshipTypeValue[];
}

/**
 * درخواست افزودن یک المنت *موجود* (مثلاً از Project Explorer) به دیاگرام فعال.
 * این کار فقط نمای گرافیکی را اضافه می‌کند (مانند ابزار Insert در Capella) و
 * المنت جدیدی نمی‌سازد. canvas فعال این درخواست را مصرف می‌کند.
 */
export interface ElementInsertRequest {
  elementId: string;
  elementType: ElementTypeValue;
  name: string;
  description?: string;
  status: "DRAFT" | "VALIDATED" | "DEPRECATED";
  /** نشانه‌ی یکتا برای جلوگیری از مصرف دوباره‌ی همان درخواست. */
  token: number;
}

/** یک snapshot از وضعیت canvas برای undo/redo */
interface CanvasSnapshot {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

const MAX_HISTORY = 50;

interface CanvasState {
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
  updateNodeData: (id: string, data: Partial<ElementNodeData | ClassNodeData>) => void;
  updateEdgeData: (id: string, data: Partial<RelationshipEdgeData | ClassEdgeData>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: CanvasEdge) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setPendingConnection: (conn: PendingConnection | null) => void;
  /** درخواست افزودن یک المنت موجود به دیاگرام فعال را ثبت می‌کند. */
  requestElementInsert: (req: Omit<ElementInsertRequest, "token">) => void;
  /** پس از مصرف درخواست توسط canvas، آن را پاک می‌کند. */
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

  /**
   * snapshot وضعیت فعلی را در past ذخیره می‌کند.
   * future را پاک می‌کند (چون مسیر جدید شروع می‌شود).
   */
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
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, position } : n)),
    })),

  updateNodeData: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, ...data } as ElementNodeData | ClassNodeData }
          : n,
      ),
    })),

  updateEdgeData: (id, data) =>
    set((s) => ({
      edges: s.edges.map((e) =>
        e.id === id
          ? { ...e, data: { ...e.data, ...data } as RelationshipEdgeData | ClassEdgeData }
          : e,
      ),
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
