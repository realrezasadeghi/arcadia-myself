"use client";

import { Spinner } from "@/modules/shared/ui/components/ui/spinner";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { useGetDiagramById } from "../clients/get-diagram-by-id";
import { useGetElementsByModelId } from "../clients/get-elements-by-model-id";
import { useGetRelationshipsByModelId } from "../clients/get-relationships-by-model-id";
import type { Diagram } from "../types/diagram";
import type { Element } from "../types/element";
import type { Relationship } from "../types/relationship";
import { DiagramCanvasInner } from "./diagram-canvas-inner";

type DiagramCanvasClientProps = {
  diagramId: string;
  modelId: string;
};

/**
 * نسخه‌ی client از DiagramCanvas.
 *
 * در معماری مبتنی بر تب (Workbench) دیاگرام‌ها بدون navigation سرور باز می‌شوند،
 * بنابراین داده‌ها سمت client و از طریق React Query واکشی می‌شوند
 * (به‌جای server component اصلی `diagram-canvas.tsx`).
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
    relationshipsQuery.isLoading;

  const isError =
    diagramQuery.isError ||
    elementsQuery.isError ||
    relationshipsQuery.isError;

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
