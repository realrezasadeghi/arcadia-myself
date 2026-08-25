"use client";

import { Spinner } from "@/modules/shared/ui/components/ui/spinner";
import { AlertTriangle } from "lucide-react";
import { useArchDiagramData } from "../hooks/use-arch-diagram-data";
import type { Element } from "../types/element";
import type { Relationship } from "../types/relationship";
import { ArchitectureCanvasInner } from "./architecture-canvas-inner";

type ArchDiagramCanvasProps = {
  diagramId: string;
  modelId: string;
};

export function ArchDiagramCanvas({
  diagramId,
  modelId,
}: ArchDiagramCanvasProps) {
  const { diagram, elements, relationships, isLoading, isError } =
    useArchDiagramData({ diagramId, modelId });

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

  const typedElements: Element[] = (elements ?? []).map((el) => ({
    id: el.id,
    name: el.name,
    type: el.type,
    modelId: el.modelId,
    updatedAt: el.updatedAt,
    createdAt: el.createdAt,
    description: el.description,
    parentId: el.parentId,
    status: el.properties.status,
  }));

  const typedRelationships: Relationship[] = (relationships ?? []).map(
    (rel) => ({
      id: rel.id,
      modelId: rel.modelId,
      type: rel.type,
      sourceElementId: rel.sourceElementId,
      targetElementId: rel.targetElementId,
      name: rel.name,
      description: rel.description,
      createdAt: rel.createdAt,
      updatedAt: rel.updatedAt,
    }),
  );

  return (
    <ArchitectureCanvasInner
      diagram={diagram}
      elements={typedElements}
      relationships={typedRelationships}
    />
  );
}
