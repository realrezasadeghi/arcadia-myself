"use client";

import { Spinner } from "@/modules/shared/ui/components/ui/spinner";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { useGetDiagramById } from "../clients/get-diagram-by-id";
import { useGetElementsByModelId } from "../clients/get-elements-by-model-id";
import { useGetRelationshipsByModelId } from "../clients/get-relationships-by-model-id";
import { useClassElementsByModelId } from "../clients/get-class-elements-by-model-id";
import { useClassRelationshipsByModelId } from "../clients/get-class-relationships-by-model-id";
import { useGetClassDiagramById } from "../clients/get-class-diagram-by-id";
import type { Diagram } from "../types/diagram";
import type { DiagramTypeValue } from "../types/diagram";
import type { Element } from "../types/element";
import type { Relationship } from "../types/relationship";
import { DiagramCanvasInner } from "./diagram-canvas-inner";

type DiagramCanvasClientProps = {
  diagramId: string;
  modelId: string;
  diagramType: DiagramTypeValue;
};

/**
 * نسخه‌ی client از DiagramCanvas.
 *
 * در معماری مبتنی بر تب (Workbench) دیاگرام‌ها بدون navigation سرور باز می‌شوند،
 * بنابراین داده‌ها سمت client و از طریق React Query واکشی می‌شوند
 * (به‌جای server component اصلی `diagram-canvas.tsx`).
 *
 * For CDB (Class Diagram) diagrams, class elements and relationships are fetched
 * instead of architecture elements.
 */
export function DiagramCanvasClient({
  diagramId,
  modelId,
  diagramType,
}: DiagramCanvasClientProps) {
  const isClassDiagram = diagramType === "CDB";

  // Fetch diagram metadata from the appropriate source
  const archDiagramQuery = useGetDiagramById(isClassDiagram ? "" : diagramId);
  const classDiagramQuery = useGetClassDiagramById(isClassDiagram ? diagramId : "");

  // Fetch architecture elements/relationships for non-CDB diagrams
  const archElementsQuery = useGetElementsByModelId(isClassDiagram ? "" : modelId);
  const archRelationshipsQuery = useGetRelationshipsByModelId(isClassDiagram ? "" : modelId);

  // Fetch class elements/relationships for CDB diagrams
  const classElementsQuery = useClassElementsByModelId(isClassDiagram ? modelId : "");
  const classRelationshipsQuery = useClassRelationshipsByModelId(isClassDiagram ? modelId : "");

  const diagram = useMemo<Diagram | null>(() => {
    if (isClassDiagram) {
      if (!classDiagramQuery.data) return null;
      const d = classDiagramQuery.data;
      return { ...d, type: "CDB" as DiagramTypeValue } as Diagram;
    }
    if (!archDiagramQuery.data) return null;
    return archDiagramQuery.data as Diagram;
  }, [isClassDiagram, classDiagramQuery.data, archDiagramQuery.data]);

  const elements = useMemo<Element[]>(() => {
    if (isClassDiagram) {
      // Map class elements to the Element type
      return (classElementsQuery.data ?? []).map((el) => ({
        id: el.id,
        name: el.name,
        type: el.elementType as any,
        modelId: el.modelId,
        updatedAt: el.updatedAt,
        createdAt: el.createdAt,
        description: undefined,
        parentId: el.parentId,
        status: el.status as "DRAFT" | "VALIDATED" | "DEPRECATED",
      }));
    }

    // Map architecture elements
    return (archElementsQuery.data ?? []).map((element) => ({
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
  }, [isClassDiagram, classElementsQuery.data, archElementsQuery.data]);

  const relationships = useMemo<Relationship[]>(() => {
    if (isClassDiagram) {
      // Map class relationships to the Relationship type
      // Class relationships use 'relationshipType' instead of 'type'
      return (classRelationshipsQuery.data ?? []).map((rel) => ({
        id: rel.id,
        modelId: rel.modelId,
        type: rel.relationshipType as any,
        sourceElementId: rel.sourceElementId,
        targetElementId: rel.targetElementId,
        name: rel.name,
        description: undefined,
        createdAt: rel.createdAt,
        updatedAt: rel.updatedAt,
      }));
    }
    return (archRelationshipsQuery.data ?? []) as Relationship[];
  }, [isClassDiagram, classRelationshipsQuery.data, archRelationshipsQuery.data]);

  const diagramQuery = isClassDiagram ? classDiagramQuery : archDiagramQuery;

  const isLoading =
    diagramQuery.isLoading ||
    (isClassDiagram
      ? classElementsQuery.isLoading || classRelationshipsQuery.isLoading
      : archElementsQuery.isLoading || archRelationshipsQuery.isLoading);

  const isError =
    diagramQuery.isError ||
    (isClassDiagram
      ? classElementsQuery.isError || classRelationshipsQuery.isError
      : archElementsQuery.isError || archRelationshipsQuery.isError);

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
    />
  );
}
