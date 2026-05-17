import { getDiagramById } from "../../presentation/server-actions/get-diagram-by-id";
import { getElementsByModelId } from "../../presentation/server-actions/get-elements-by-model-id";
import { getRelationshipsByModelId } from "../../presentation/server-actions/get-relationships-by-model-id";

export type DiagramCanvasProps = {
  params: Promise<{ id: string; diagramId: string }>;
};
export async function DiagramCanvas({ params }: DiagramCanvasProps) {
  const { diagramId } = await params;

  const diagram = await getDiagramById(diagramId);

  const [elements, relationships] = await Promise.all([
    getElementsByModelId(diagram.data.modelId),
    getRelationshipsByModelId(diagram.data.modelId),
  ]);

  return <div className="flex-1 h-full">
    
  </div>;
}
