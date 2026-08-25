"use client";

import { AlertTriangle } from "lucide-react";
import { Spinner } from "@/modules/shared/ui/components/ui/spinner";
import { useClassDiagramData } from "../hooks/use-class-diagram-data";
import type {
  ClassElementData,
  ClassElementTypeValue,
  ClassRelationshipData,
} from "../types/class-diagram";
import type { Diagram, DiagramTypeValue } from "../types/diagram";
import { ClassCanvasInner } from "./class-canvas-inner";

type ClassDiagramCanvasProps = {
  diagramId: string;
  modelId: string;
};

export function ClassDiagramCanvas({
  diagramId,
  modelId,
}: ClassDiagramCanvasProps) {
  const { diagram, elements, relationships, isLoading, isError } =
    useClassDiagramData({ diagramId, modelId });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !diagram) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <AlertTriangle className="size-8 opacity-40" />
        <p className="text-sm">Failed to load diagram</p>
      </div>
    );
  }

  const mappedDiagram: Diagram = {
    id: diagram.id,
    modelId: diagram.modelId,
    type: "CDB" as DiagramTypeValue,
    name: diagram.name,
    description: diagram.description,
    viewport: diagram.viewport,
    elementLayouts: [],
    createdAt: diagram.createdAt,
    updatedAt: diagram.updatedAt,
  };

  const classElements: ClassElementData[] = (elements ?? []).map((el) => ({
    id: el.id,
    modelId: el.modelId,
    layer: el.layer,
    name: el.name,
    elementType: el.elementType as ClassElementTypeValue,
    isAbstract: el.isAbstract,
    isStatic: el.isStatic,
    parentId: el.parentId,
    ordering: el.ordering,
    status: el.status as ClassElementData["status"],
    extensionProperties: el.extensionProperties,
    createdAt: el.createdAt,
    updatedAt: el.updatedAt,
  }));

  const classRelationships: ClassRelationshipData[] = (relationships ?? []).map(
    (rel) => ({
      id: rel.id,
      modelId: rel.modelId,
      layer: rel.layer,
      sourceElementId: rel.sourceElementId,
      targetElementId: rel.targetElementId,
      name: rel.name,
      relationshipType:
        rel.relationshipType as ClassRelationshipData["relationshipType"],
      aggregationKind:
        rel.aggregationKind as ClassRelationshipData["aggregationKind"],
      isDisjoint: false,
      isComplete: false,
      isDerived: false,
      sourceMultiplicityLower: rel.sourceMultiplicityLower,
      sourceMultiplicityUpper: rel.sourceMultiplicityUpper,
      targetMultiplicityLower: rel.targetMultiplicityLower,
      targetMultiplicityUpper: rel.targetMultiplicityUpper,
      sourceRole: rel.sourceRole,
      targetRole: rel.targetRole,
      isNavigableSource: rel.isNavigableSource,
      isNavigableTarget: rel.isNavigableTarget,
      status: rel.status as ClassRelationshipData["status"],
      extensionProperties: rel.extensionProperties,
      createdAt: rel.createdAt,
      updatedAt: rel.updatedAt,
    }),
  );

  return (
    <ClassCanvasInner
      diagram={mappedDiagram}
      elements={classElements}
      relationships={classRelationships}
    />
  );
}
