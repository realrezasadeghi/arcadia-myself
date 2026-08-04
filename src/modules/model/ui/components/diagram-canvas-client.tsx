"use client";

import { Spinner } from "@/modules/shared/ui/components/ui/spinner";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { useArchDiagramData } from "../hooks/use-arch-diagram-data";
import { useClassDiagramData } from "../hooks/use-class-diagram-data";
import type { Diagram, DiagramTypeValue } from "../types/diagram";
import type { Element } from "../types/element";
import type { Relationship } from "../types/relationship";
import { DiagramHost } from "./diagram-host";

type DiagramCanvasClientProps = {
  diagramId: string;
  modelId: string;
  diagramType: DiagramTypeValue;
};

export function DiagramCanvasClient({
  diagramId,
  modelId,
  diagramType,
}: DiagramCanvasClientProps) {
  const isClassDiagram = diagramType === "CDB";

  const archData = useArchDiagramData({ diagramId, modelId });
  const classData = useClassDiagramData({ diagramId, modelId });

  const data = isClassDiagram ? classData : archData;

  const diagram = useMemo<Diagram | null>(() => {
    if (!data.diagram) return null;
    if (isClassDiagram) {
      return { ...data.diagram, type: "CDB" as DiagramTypeValue } as Diagram;
    }
    return data.diagram as Diagram;
  }, [isClassDiagram, data.diagram]);

  const elements = useMemo<Element[]>(() => {
    if (isClassDiagram) {
      return (classData.elements ?? []).map((el) => ({
        id: el.id,
        name: el.name,
        type: el.elementType as any,
        modelId: el.modelId,
        updatedAt: el.updatedAt,
        createdAt: el.createdAt,
        description: (el as any).description ?? undefined,
        parentId: el.parentId,
        status: el.status as "DRAFT" | "VALIDATED" | "DEPRECATED",
        isAbstract: (el as any).isAbstract ?? false,
        isStatic: (el as any).isStatic ?? false,
        properties: (el as any).properties ?? [],
        operations: (el as any).operations ?? [],
        enumerationLiterals: (el as any).enumerationLiterals ?? [],
      }));
    }
    return (archData.elements ?? []).map((element) => ({
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
  }, [isClassDiagram, classData.elements, archData.elements]);

  const relationships = useMemo<Relationship[]>(() => {
    if (isClassDiagram) {
      return (classData.relationships ?? []).map((rel) => ({
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
    return (archData.relationships ?? []) as Relationship[];
  }, [isClassDiagram, classData.relationships, archData.relationships]);

  if (data.isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (data.isError || !diagram) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <AlertTriangle className="size-8 opacity-40" />
        <p className="text-sm">Failed to load diagram</p>
      </div>
    );
  }

  return (
    <DiagramHost
      diagram={diagram}
      elements={elements}
      relationships={relationships}
    />
  );
}
