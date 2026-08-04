"use client";

import { useShallow } from "zustand/shallow";
import {
  isClassDiagramElement,
  isClassDiagramRelationship,
} from "../../helpers/class-diagram";
import { useCanvasStore } from "../../stores/canvas";
import {
  ClassEdgeProperties,
  ClassNodeProperties,
} from "../class-properties-panel";
import { DiagramPropertiesPanel } from "../diagram-properties-panel";

/**
 * PropertiesPanel
 *
 * بسته‌بندی پنل خصوصیات برای داک پایین Workbench.
 * بسته به نوع دیاگرام فعال، پنل مناسب را نمایش می‌دهد.
 */
export function PropertiesPanel({ projectId }: { projectId: string }) {
  const node = useCanvasStore(
    useShallow((state) =>
      state.nodes.find((node) => node.id === state.selectedNodeId),
    ),
  );

  const edge = useCanvasStore(
    useShallow((state) =>
      state.edges.find((edge) => edge.id === state.selectedEdgeId),
    ),
  );

  if (node && isClassDiagramElement(node.data.elementType)) {
    console.log({ node });
    return <ClassNodeProperties node={node} />;
  }

  if (
    edge &&
    isClassDiagramRelationship(edge.data?.relationshipType as string)
  ) {
    return <ClassEdgeProperties edge={edge} />;
  }

  return <DiagramPropertiesPanel projectId={projectId} />;
}
