import type { Node, XYPosition } from "@xyflow/react";
import {
  getNodeTypeForClassElement,
  isContainerType,
} from "../helpers/class-diagram";
import type { ClassNodeData } from "../stores/class-canvas";
import type {
  ClassElementData,
  ClassElementTypeValue,
} from "../types/class-diagram";
import type { ElementLayout } from "../types/diagram";

export type ClassCanvasNode = Node<ClassNodeData>;

/**
 * Build React Flow nodes from class elements + layout data.
 * Handles parent-child relationships and relative positioning.
 */
export function buildClassNodes(
  elements: ClassElementData[],
  elementLayouts: ElementLayout[],
  modelId: string,
): ClassCanvasNode[] {
  const layoutMap = new Map(elementLayouts.map((l) => [l.elementId, l]));

  const nodes = elements
    .filter((el) => layoutMap.has(el.id))
    .map((el): ClassCanvasNode | null => {
      const layout = layoutMap.get(el.id);
      if (!layout) return null;
      const isContainer = isContainerType(el.elementType);
      const effectiveParentId =
        el.parentId && layoutMap.has(el.parentId) ? el.parentId : undefined;

      return {
        id: el.id,
        width: layout.size.width,
        type: getNodeTypeForClassElement(el.elementType),
        position: effectiveParentId ? { x: 0, y: 0 } : layout.position,
        parentId: effectiveParentId,
        extent: effectiveParentId ? ("parent" as const) : undefined,
        height: layout.size.height,
        zIndex: isContainer ? -1 : 0,
        data: {
          name: el.name,
          elementId: el.id,
          status: el.status,
          modelId,
          elementType: el.elementType,
          parentId: el.parentId,
          isAbstract: el.isAbstract,
          isStatic: el.isStatic,
        },
      };
    })
    .filter((n): n is ClassCanvasNode => n !== null);

  // Calculate relative positions for children
  const nodesById = new Map(nodes.map((n) => [n.id, n]));
  for (const node of nodes) {
    if (node.parentId) {
      const parent = nodesById.get(node.parentId);
      if (parent) {
        const parentAbs =
          layoutMap.get(parent.data.elementId)?.position ?? parent.position;
        const childAbs =
          layoutMap.get(node.data.elementId)?.position ?? node.position;
        node.position = {
          x: childAbs.x - parentAbs.x,
          y: childAbs.y - parentAbs.y,
        };
      }
    }
  }

  return nodes;
}

/**
 * Merge newly-built nodes with existing canvas nodes.
 * Preserves nodes that were just added but not yet in query data.
 */
export function mergeClassNodes(
  newNodes: ClassCanvasNode[],
  existingNodes: Array<{ id: string; data?: unknown }>,
): ClassCanvasNode[] {
  const syncedIds = new Set(newNodes.map((n) => n.id));
  const orphans = existingNodes.filter(
    (n) => !syncedIds.has(n.id),
  ) as ClassCanvasNode[];
  return [...newNodes, ...orphans];
}

/**
 * Build a minimal ClassNodeData from an explorer insert request.
 */
export function buildNodeDataFromInsertRequest(opts: {
  name: string;
  elementId: string;
  elementType: string;
  modelId: string;
  description?: string;
  status: string;
}): ClassNodeData {
  return {
    name: opts.name,
    elementId: opts.elementId,
    elementType: opts.elementType as ClassElementTypeValue,
    modelId: opts.modelId,
    description: opts.description ?? "",
    status: opts.status as ClassNodeData["status"],
  };
}

/**
 * Build a minimal ClassNodeData from a newly-created class element response.
 */
export function buildNodeDataFromCreatedElement(opts: {
  id: string;
  name: string;
  elementType: string;
  modelId: string;
  description: string;
  status: string;
  isAbstract: boolean;
  isStatic: boolean;
}): ClassNodeData {
  return {
    name: opts.name,
    elementId: opts.id,
    elementType: opts.elementType as ClassElementTypeValue,
    modelId: opts.modelId,
    description: opts.description,
    status: opts.status as ClassNodeData["status"],
    isAbstract: opts.isAbstract,
    isStatic: opts.isStatic,
  };
}

/**
 * Compute a cascade position for a new node based on existing node count.
 */
export function cascadePosition(nodeCount: number): XYPosition {
  return {
    x: 80 + (nodeCount % 6) * 40,
    y: 80 + (nodeCount % 6) * 40,
  };
}
