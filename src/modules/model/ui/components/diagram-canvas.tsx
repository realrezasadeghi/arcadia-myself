import { notFound } from "next/navigation";
import { getDiagramById } from "../../presentation/server-actions/get-diagram-by-id";
import { getElementsByModelId } from "../../presentation/server-actions/get-elements-by-model-id";
import { getRelationshipsByModelId } from "../../presentation/server-actions/get-relationships-by-model-id";
import { DiagramCanvasInner } from "./diagram-canvas-inner";

export type DiagramCanvasProps = {
  params: Promise<{ id: string; diagramId: string }>;
};
export async function DiagramCanvas({ params }: DiagramCanvasProps) {
  const { diagramId } = await params;

  if (!diagramId) {
    notFound();
  }

  const diagram = await getDiagramById(diagramId);

  if (!diagram.data.modelId) {
    notFound();
  }

  const [elements, relationships] = await Promise.all([
    getElementsByModelId(diagram.data.modelId),
    getRelationshipsByModelId(diagram.data.modelId),
  ]);

  const mappedElements = elements?.data?.map((element) => ({
    id: element.id,
    name: element.name,
    type: element.type,
    modelId: element.modelId,
    updatedAt: element.updatedAt,
    createdAt: element.createdAt,
    description: element?.description,
    status: element.properties.status,
  }));

  return (
    <DiagramCanvasInner
      diagram={diagram?.data}
      elements={mappedElements || []}
      relationships={relationships?.data || []}
    />
  );
}
