"use client";

import { Spinner } from "@/modules/shared/ui/components/ui/spinner";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { useGetDiagramById } from "../clients/get-diagram-by-id";
import { useGetElementsByModelId } from "../clients/get-elements-by-model-id";
import { useGetRelationshipsByModelId } from "../clients/get-relationships-by-model-id";
import { useGetClassDiagramData } from "../clients/get-class-diagram-data";
import type { Diagram } from "../types/diagram";
import type { Element } from "../types/element";
import type { Relationship } from "../types/relationship";
import { DiagramCanvasInner } from "./diagram-canvas-inner";

type DiagramCanvasClientProps = {
  diagramId: string;
  modelId: string;
};

/**
 * Client-side diagram data fetcher.
 *
 * Fetches diagram, elements, relationships via React Query.
 * For CLASS diagrams, also fetches class-specific data (attributes, operations, associations).
 */
export function DiagramCanvasClient({
  diagramId,
  modelId,
}: DiagramCanvasClientProps) {
  const diagramQuery = useGetDiagramById(diagramId);
  const elementsQuery = useGetElementsByModelId(modelId);
  const relationshipsQuery = useGetRelationshipsByModelId(modelId);

  const diagram = useMemo<Diagram | null>(() => {
    if (!diagramQuery.data) return null;
    return diagramQuery.data as Diagram;
  }, [diagramQuery.data]);

  const isClassDiagram = diagram?.type === "CLASS";

  const classDataQuery = useGetClassDiagramData(
    isClassDiagram ? modelId : undefined,
  );

  const elements = useMemo<Element[]>(() => {
    return (elementsQuery.data ?? []).map((element) => ({
      id: element.id,
      name: element.name,
      type: element.type,
      modelId: element.modelId,
      updatedAt: element.updatedAt,
      createdAt: element.createdAt,
      description: element.description,
      parentId: element.parentId,
      status: element.properties.status,
    }));
  }, [elementsQuery.data]);

  const relationships = useMemo<Relationship[]>(
    () => (relationshipsQuery.data ?? []) as Relationship[],
    [relationshipsQuery.data],
  );

  const isLoading =
    diagramQuery.isLoading ||
    elementsQuery.isLoading ||
    relationshipsQuery.isLoading ||
    (isClassDiagram && classDataQuery.isLoading);

  const isError =
    diagramQuery.isError ||
    elementsQuery.isError ||
    relationshipsQuery.isError ||
    (isClassDiagram && classDataQuery.isError);

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

  return (
    <DiagramCanvasInner
      diagram={diagram}
      elements={elements}
      relationships={relationships}
      classData={classDataQuery.data}
    />
  );
}
